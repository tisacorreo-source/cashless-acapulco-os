-- Cashless Acapulco — role-aware authentication and limited client access.

alter table cashless.client_access_sessions
  add column authenticated_at timestamptz;

update cashless.client_access_sessions
set authenticated_at = created_at
where authenticated_at is null;

alter table cashless.client_access_sessions
  alter column authenticated_at set default transaction_timestamp(),
  alter column authenticated_at set not null,
  drop constraint client_access_sessions_expiry_check,
  drop constraint client_access_sessions_revoked_at_check,
  add constraint client_access_sessions_expiry_check check (
    expires_at = authenticated_at + interval '8 hours'
  ),
  add constraint client_access_sessions_revoked_at_check check (
    revoked_at is null or revoked_at >= authenticated_at
  );

create table cashless.client_access_attempts (
  auth_user_id uuid primary key references auth.users (id) on delete cascade,
  window_started_at timestamptz not null default transaction_timestamp(),
  attempt_count smallint not null default 0,
  last_attempt_at timestamptz not null default transaction_timestamp(),
  blocked_until timestamptz,
  constraint client_access_attempts_count_check check (
    attempt_count between 0 and 5
  ),
  constraint client_access_attempts_window_check check (
    last_attempt_at >= window_started_at
  ),
  constraint client_access_attempts_block_check check (
    blocked_until is null or blocked_until >= last_attempt_at
  )
);

alter table cashless.client_access_attempts enable row level security;
revoke all on table cashless.client_access_attempts
from public, anon, authenticated, service_role;

create function cashless.is_anonymous_user()
returns boolean
language sql
stable
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and coalesce(
      (select (auth.jwt() ->> 'is_anonymous')::boolean),
      false
    );
$$;

revoke execute on function cashless.is_anonymous_user()
from public, anon, authenticated, service_role;
grant execute on function cashless.is_anonymous_user() to authenticated;

create or replace function cashless.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and not (select cashless.is_anonymous_user())
    and exists (
      select 1
      from cashless.staff_profiles profile
      where profile.auth_user_id = (select auth.uid())
        and profile.role = 'admin'
        and profile.is_active
    );
$$;

create or replace function cashless.current_business_id()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select profile.business_id
  from cashless.staff_profiles profile
  where not (select cashless.is_anonymous_user())
    and profile.auth_user_id = (select auth.uid())
    and profile.role = 'seller'
    and profile.is_active;
$$;

create or replace function cashless.current_client_id()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select session.client_id
  from cashless.client_access_sessions session
  join cashless.clients client on client.id = session.client_id
  where (select cashless.is_anonymous_user())
    and session.auth_user_id = (select auth.uid())
    and session.revoked_at is null
    and session.expires_at > statement_timestamp()
    and client.is_active;
$$;

drop policy staff_profiles_select_authorized on cashless.staff_profiles;
create policy staff_profiles_select_authorized
on cashless.staff_profiles for select to authenticated
using (
  (select cashless.is_admin())
  or (
    not (select cashless.is_anonymous_user())
    and auth_user_id = (select auth.uid())
  )
);

drop policy client_access_sessions_select_authorized
on cashless.client_access_sessions;
create policy client_access_sessions_select_authorized
on cashless.client_access_sessions for select to authenticated
using (
  (select cashless.is_admin())
  or (
    auth_user_id = (select auth.uid())
    and client_id = (select cashless.current_client_id())
  )
);

create function cashless.bootstrap_admin_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not coalesce(new.is_anonymous, false)
    and lower(new.email) = 'tisacorreo@gmail.com'
  then
    insert into cashless.staff_profiles (
      auth_user_id,
      role,
      business_id,
      display_name
    )
    values (
      new.id,
      'admin',
      null,
      'Administrador TISA'
    )
    on conflict (auth_user_id) do nothing;
  end if;

  return new;
end;
$$;

revoke execute on function cashless.bootstrap_admin_profile()
from public, anon, authenticated, service_role;

create trigger cashless_bootstrap_admin_after_auth_user_insert
after insert on auth.users
for each row execute function cashless.bootstrap_admin_profile();

insert into cashless.staff_profiles (
  auth_user_id,
  role,
  business_id,
  display_name
)
select
  auth_user.id,
  'admin',
  null,
  'Administrador TISA'
from auth.users auth_user
where not coalesce(auth_user.is_anonymous, false)
  and lower(auth_user.email) = 'tisacorreo@gmail.com'
on conflict (auth_user_id) do nothing;

create function api.get_current_access()
returns table (
  access_role text,
  display_name text,
  business_public_id uuid,
  client_public_id uuid,
  session_expires_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
begin
  if caller_id is null then
    return;
  end if;

  if (select cashless.is_anonymous_user()) then
    return query
    select
      'client'::text,
      client.full_name,
      null::uuid,
      client.public_id,
      session.expires_at
    from cashless.client_access_sessions session
    join cashless.clients client on client.id = session.client_id
    where session.auth_user_id = caller_id
      and session.revoked_at is null
      and session.expires_at > statement_timestamp()
      and client.is_active;
  else
    return query
    select
      profile.role,
      profile.display_name,
      business.public_id,
      null::uuid,
      null::timestamptz
    from cashless.staff_profiles profile
    left join cashless.businesses business on business.id = profile.business_id
    where profile.auth_user_id = caller_id
      and profile.is_active
      and profile.role in ('admin', 'seller')
      and (profile.role = 'admin' or business.is_active);
  end if;
end;
$$;

create function api.claim_client_access(
  p_access_name text,
  p_phone_e164 text
)
returns table (
  authenticated boolean,
  access_role text,
  display_name text,
  client_public_id uuid,
  session_expires_at timestamptz,
  retry_after_seconds integer
)
language plpgsql
security definer
set search_path = ''
set statement_timeout = '5s'
as $$
declare
  caller_id uuid := auth.uid();
  checked_at timestamptz := statement_timestamp();
  normalized_name text := lower(
    regexp_replace(btrim(coalesce(p_access_name, '')), '[[:space:]]+', ' ', 'g')
  );
  normalized_phone text := btrim(coalesce(p_phone_e164, ''));
  attempt cashless.client_access_attempts%rowtype;
  matched_client cashless.clients%rowtype;
  existing_client_id bigint;
  current_expiry timestamptz;
  retry_seconds integer;
begin
  if caller_id is null or not (select cashless.is_anonymous_user()) then
    raise exception 'anonymous authentication required'
      using errcode = '42501';
  end if;

  select
    session.expires_at,
    client.id,
    client.public_id,
    client.full_name
  into
    current_expiry,
    existing_client_id,
    matched_client.public_id,
    matched_client.full_name
  from cashless.client_access_sessions session
  join cashless.clients client on client.id = session.client_id
  where session.auth_user_id = caller_id
    and session.revoked_at is null
    and session.expires_at > checked_at
    and client.is_active;

  if found then
    return query select
      true,
      'client'::text,
      matched_client.full_name,
      matched_client.public_id,
      current_expiry,
      null::integer;
    return;
  end if;

  insert into cashless.client_access_attempts (
    auth_user_id,
    window_started_at,
    attempt_count,
    last_attempt_at,
    blocked_until
  )
  values (caller_id, checked_at, 0, checked_at, null)
  on conflict (auth_user_id) do nothing;

  select *
  into strict attempt
  from cashless.client_access_attempts
  where auth_user_id = caller_id
  for update;

  if attempt.window_started_at <= checked_at - interval '15 minutes' then
    update cashless.client_access_attempts
    set
      window_started_at = checked_at,
      attempt_count = 0,
      last_attempt_at = checked_at,
      blocked_until = null
    where auth_user_id = caller_id
    returning * into strict attempt;
  end if;

  if attempt.blocked_until is not null
    and attempt.blocked_until > checked_at
  then
    retry_seconds := ceil(
      extract(epoch from attempt.blocked_until - checked_at)
    )::integer;

    return query select
      false,
      null::text,
      null::text,
      null::uuid,
      null::timestamptz,
      retry_seconds;
    return;
  end if;

  if attempt.attempt_count >= 5 then
    update cashless.client_access_attempts
    set blocked_until = checked_at + interval '15 minutes'
    where auth_user_id = caller_id;

    return query select
      false,
      null::text,
      null::text,
      null::uuid,
      null::timestamptz,
      900;
    return;
  end if;

  update cashless.client_access_attempts
  set
    attempt_count = attempt_count + 1,
    last_attempt_at = checked_at
  where auth_user_id = caller_id
  returning * into strict attempt;

  if normalized_name ~ '^.{2,120}$'
    and normalized_phone ~ '^\+[1-9][0-9]{7,14}$'
  then
    select *
    into matched_client
    from cashless.clients client
    where client.access_name = normalized_name
      and client.phone_e164 = normalized_phone
      and client.is_active;
  end if;

  if matched_client.id is null then
    if attempt.attempt_count >= 5 then
      update cashless.client_access_attempts
      set blocked_until = checked_at + interval '15 minutes'
      where auth_user_id = caller_id;
      retry_seconds := 900;
    end if;

    return query select
      false,
      null::text,
      null::text,
      null::uuid,
      null::timestamptz,
      retry_seconds;
    return;
  end if;

  select session.client_id
  into existing_client_id
  from cashless.client_access_sessions session
  where session.auth_user_id = caller_id
  for update;

  if found and existing_client_id <> matched_client.id then
    return query select
      false,
      null::text,
      null::text,
      null::uuid,
      null::timestamptz,
      null::integer;
    return;
  end if;

  insert into cashless.client_access_sessions (
    auth_user_id,
    client_id,
    authenticated_at,
    expires_at,
    revoked_at
  )
  values (
    caller_id,
    matched_client.id,
    checked_at,
    checked_at + interval '8 hours',
    null
  )
  on conflict (auth_user_id) do update
  set
    authenticated_at = excluded.authenticated_at,
    expires_at = excluded.expires_at,
    revoked_at = null
  where cashless.client_access_sessions.client_id = excluded.client_id
  returning expires_at into current_expiry;

  if current_expiry is null then
    return query select
      false,
      null::text,
      null::text,
      null::uuid,
      null::timestamptz,
      null::integer;
    return;
  end if;

  delete from cashless.client_access_attempts
  where auth_user_id = caller_id;

  return query select
    true,
    'client'::text,
    matched_client.full_name,
    matched_client.public_id,
    current_expiry,
    null::integer;
end;
$$;

create function api.revoke_client_access()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  revoked boolean;
begin
  if caller_id is null or not (select cashless.is_anonymous_user()) then
    raise exception 'anonymous authentication required'
      using errcode = '42501';
  end if;

  update cashless.client_access_sessions
  set revoked_at = greatest(statement_timestamp(), authenticated_at)
  where auth_user_id = caller_id
    and revoked_at is null;

  revoked := found;
  return revoked;
end;
$$;

revoke execute on function api.get_current_access()
from public, anon, authenticated, service_role;
revoke execute on function api.claim_client_access(text, text)
from public, anon, authenticated, service_role;
revoke execute on function api.revoke_client_access()
from public, anon, authenticated, service_role;

grant execute on function api.get_current_access() to authenticated;
grant execute on function api.claim_client_access(text, text) to authenticated;
grant execute on function api.revoke_client_access() to authenticated;

comment on function api.get_current_access() is
  'Returns the active admin, seller, or limited client identity for the caller.';
comment on function api.claim_client_access(text, text) is
  'Validates client name and E.164 phone with a generic result and creates an eight-hour session.';
comment on function api.revoke_client_access() is
  'Revokes the limited client database session before local Auth sign-out.';
