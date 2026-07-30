-- Cashless Acapulco — base schema and authorization boundary.
-- Financial mutation RPCs are intentionally implemented in Tasks 2.2–2.10.

create schema if not exists cashless;
create schema if not exists api;

comment on schema cashless is 'Internal tables and authorization helpers; not exposed through the Data API.';
comment on schema api is 'Explicit Data API surface for reviewed views and RPC functions.';

revoke all on schema cashless from public, anon, authenticated, service_role;
revoke all on schema api from public, anon, authenticated, service_role;
grant usage on schema cashless to authenticated;
grant usage on schema api to anon, authenticated;

alter default privileges for role postgres in schema cashless revoke all on tables from public, anon, authenticated, service_role;
alter default privileges for role postgres in schema cashless revoke all on sequences from public, anon, authenticated, service_role;
alter default privileges for role postgres in schema cashless revoke execute on functions from public, anon, authenticated, service_role;
alter default privileges for role postgres in schema api revoke all on tables from public, anon, authenticated, service_role;
alter default privileges for role postgres in schema api revoke all on sequences from public, anon, authenticated, service_role;
alter default privileges for role postgres in schema api revoke execute on functions from public, anon, authenticated, service_role;

create table cashless.demo_batches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'active',
  created_at timestamptz not null default transaction_timestamp(),
  archived_at timestamptz,
  constraint demo_batches_slug_check check (
    slug = lower(btrim(slug))
    and slug ~ '^[a-z0-9]+(?:[a-z0-9_-]*[a-z0-9])?$'
    and char_length(slug) between 2 and 80
  ),
  constraint demo_batches_status_check check (status in ('active', 'archived')),
  constraint demo_batches_archived_at_check check (
    (status = 'active' and archived_at is null)
    or (status = 'archived' and archived_at is not null and archived_at >= created_at)
  )
);

create table cashless.businesses (
  id bigint generated always as identity primary key,
  public_id uuid not null default gen_random_uuid() unique,
  name text not null,
  email text not null unique,
  is_active boolean not null default true,
  demo_batch_id uuid references cashless.demo_batches (id) on delete restrict,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default transaction_timestamp(),
  constraint businesses_name_check check (
    name = btrim(name)
    and char_length(name) between 2 and 120
  ),
  constraint businesses_email_check check (
    email = lower(btrim(email))
    and char_length(email) between 3 and 320
  )
);

create table cashless.staff_profiles (
  auth_user_id uuid primary key references auth.users (id) on delete restrict,
  role text not null,
  business_id bigint references cashless.businesses (id) on delete restrict,
  display_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default transaction_timestamp(),
  constraint staff_profiles_role_check check (role in ('admin', 'seller')),
  constraint staff_profiles_business_role_check check (
    (role = 'admin' and business_id is null)
    or (role = 'seller' and business_id is not null)
  ),
  constraint staff_profiles_display_name_check check (
    display_name = btrim(display_name)
    and char_length(display_name) between 2 and 120
  )
);

create unique index staff_profiles_one_admin_uq
  on cashless.staff_profiles ((role))
  where role = 'admin';

create unique index staff_profiles_one_seller_per_business_uq
  on cashless.staff_profiles (business_id)
  where role = 'seller';

create table cashless.clients (
  id bigint generated always as identity primary key,
  public_id uuid not null default gen_random_uuid() unique,
  full_name text not null,
  access_name text not null,
  phone_e164 text not null unique,
  email text,
  is_active boolean not null default true,
  demo_batch_id uuid references cashless.demo_batches (id) on delete restrict,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default transaction_timestamp(),
  constraint clients_full_name_check check (
    full_name = btrim(full_name)
    and char_length(full_name) between 2 and 120
  ),
  constraint clients_access_name_check check (
    access_name = lower(regexp_replace(btrim(access_name), '[[:space:]]+', ' ', 'g'))
    and char_length(access_name) between 2 and 120
  ),
  constraint clients_phone_e164_check check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  constraint clients_email_check check (
    email is null
    or (
      email = lower(btrim(email))
      and char_length(email) between 3 and 320
    )
  )
);

create unique index clients_email_uq
  on cashless.clients (email)
  where email is not null;

create table cashless.client_accounts (
  client_id bigint primary key references cashless.clients (id) on delete restrict,
  balance_cents bigint not null default 0,
  balance_version bigint not null default 0,
  updated_at timestamptz not null default transaction_timestamp(),
  constraint client_accounts_balance_check check (balance_cents >= 0),
  constraint client_accounts_version_check check (balance_version >= 0)
);

create table cashless.client_access_sessions (
  auth_user_id uuid primary key references auth.users (id) on delete restrict,
  client_id bigint not null references cashless.clients (id) on delete restrict,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default transaction_timestamp(),
  constraint client_access_sessions_expiry_check check (expires_at > created_at),
  constraint client_access_sessions_revoked_at_check check (
    revoked_at is null or revoked_at >= created_at
  )
);

create table cashless.events (
  id bigint generated always as identity primary key,
  public_id uuid not null default gen_random_uuid() unique,
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone_name text not null default 'America/Mexico_City',
  status text not null default 'active',
  demo_batch_id uuid references cashless.demo_batches (id) on delete restrict,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default transaction_timestamp(),
  constraint events_name_check check (
    name = btrim(name)
    and char_length(name) between 2 and 160
  ),
  constraint events_dates_check check (ends_at > starts_at),
  constraint events_timezone_check check (timezone_name = 'America/Mexico_City'),
  constraint events_status_check check (status in ('active', 'closed'))
);

create table cashless.event_businesses (
  id bigint generated always as identity primary key,
  public_id uuid not null default gen_random_uuid() unique,
  event_id bigint not null references cashless.events (id) on delete restrict,
  business_id bigint not null references cashless.businesses (id) on delete restrict,
  balance_cents bigint not null default 0,
  balance_version bigint not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default transaction_timestamp(),
  constraint event_businesses_event_business_uq unique (event_id, business_id),
  constraint event_businesses_version_check check (balance_version >= 0)
);

create table cashless.charge_requests (
  id bigint generated always as identity primary key,
  public_token uuid not null default gen_random_uuid() unique,
  event_business_id bigint not null references cashless.event_businesses (id) on delete restrict,
  amount_cents bigint not null,
  description text not null,
  status text not null default 'pending',
  created_by uuid not null references auth.users (id) on delete restrict,
  idempotency_key uuid not null,
  created_at timestamptz not null default transaction_timestamp(),
  expires_at timestamptz not null,
  paid_at timestamptz,
  cancelled_at timestamptz,
  constraint charge_requests_actor_idempotency_uq unique (created_by, idempotency_key),
  constraint charge_requests_amount_check check (
    amount_cents between 5000 and 100000
  ),
  constraint charge_requests_description_check check (
    description = btrim(description)
    and char_length(description) between 1 and 200
  ),
  constraint charge_requests_status_check check (
    status in ('pending', 'paid', 'expired', 'cancelled')
  ),
  constraint charge_requests_expiry_check check (
    expires_at = created_at + interval '5 minutes'
  ),
  constraint charge_requests_status_timestamps_check check (
    (status = 'pending' and paid_at is null and cancelled_at is null)
    or (status = 'paid' and paid_at is not null and cancelled_at is null)
    or (status = 'expired' and paid_at is null and cancelled_at is null)
    or (status = 'cancelled' and paid_at is null and cancelled_at is not null)
  )
);

create table cashless.financial_transactions (
  id bigint generated always as identity primary key,
  public_id uuid not null default gen_random_uuid() unique,
  transaction_type text not null,
  amount_cents bigint not null,
  event_id bigint references cashless.events (id) on delete restrict,
  actor_user_id uuid not null references auth.users (id) on delete restrict,
  idempotency_key uuid not null unique,
  request_payload jsonb not null default '{}'::jsonb,
  demo_batch_id uuid references cashless.demo_batches (id) on delete restrict,
  created_at timestamptz not null default transaction_timestamp(),
  constraint financial_transactions_type_check check (
    transaction_type in (
      'top_up',
      'purchase',
      'sale_reversal',
      'withdrawal',
      'settlement'
    )
  ),
  constraint financial_transactions_amount_check check (
    amount_cents between 5000 and 100000
  ),
  constraint financial_transactions_event_check check (
    transaction_type = 'withdrawal' or event_id is not null
  )
);

create table cashless.financial_entries (
  id bigint generated always as identity primary key,
  transaction_id bigint not null references cashless.financial_transactions (id) on delete restrict,
  entry_no smallint not null,
  client_id bigint references cashless.clients (id) on delete restrict,
  event_business_id bigint references cashless.event_businesses (id) on delete restrict,
  delta_cents bigint not null,
  balance_before_cents bigint not null,
  balance_after_cents bigint not null,
  created_at timestamptz not null default transaction_timestamp(),
  constraint financial_entries_transaction_entry_uq unique (transaction_id, entry_no),
  constraint financial_entries_entry_no_check check (entry_no > 0),
  constraint financial_entries_one_account_check check (
    num_nonnulls(client_id, event_business_id) = 1
  ),
  constraint financial_entries_delta_check check (delta_cents <> 0),
  constraint financial_entries_arithmetic_check check (
    balance_after_cents = balance_before_cents + delta_cents
  ),
  constraint financial_entries_client_balance_check check (
    client_id is null or balance_after_cents >= 0
  )
);

create unique index financial_entries_transaction_client_uq
  on cashless.financial_entries (transaction_id, client_id)
  where client_id is not null;

create unique index financial_entries_transaction_event_business_uq
  on cashless.financial_entries (transaction_id, event_business_id)
  where event_business_id is not null;

create table cashless.top_ups (
  id bigint generated always as identity primary key,
  public_id uuid not null default gen_random_uuid() unique,
  transaction_id bigint not null unique references cashless.financial_transactions (id) on delete restrict,
  client_id bigint not null references cashless.clients (id) on delete restrict,
  event_id bigint not null references cashless.events (id) on delete restrict,
  admin_user_id uuid not null references auth.users (id) on delete restrict
);

create table cashless.sales (
  id bigint generated always as identity primary key,
  public_id uuid not null default gen_random_uuid() unique,
  transaction_id bigint not null unique references cashless.financial_transactions (id) on delete restrict,
  charge_request_id bigint not null unique references cashless.charge_requests (id) on delete restrict,
  client_id bigint not null references cashless.clients (id) on delete restrict,
  event_business_id bigint not null references cashless.event_businesses (id) on delete restrict,
  confirmed_by uuid not null references auth.users (id) on delete restrict
);

create table cashless.reversals (
  id bigint generated always as identity primary key,
  public_id uuid not null default gen_random_uuid() unique,
  transaction_id bigint not null unique references cashless.financial_transactions (id) on delete restrict,
  sale_id bigint not null unique references cashless.sales (id) on delete restrict,
  reason text not null,
  admin_user_id uuid not null references auth.users (id) on delete restrict,
  constraint reversals_reason_check check (
    reason = btrim(reason)
    and char_length(reason) between 3 and 500
  )
);

create table cashless.withdrawals (
  id bigint generated always as identity primary key,
  public_id uuid not null default gen_random_uuid() unique,
  transaction_id bigint not null unique references cashless.financial_transactions (id) on delete restrict,
  client_id bigint not null references cashless.clients (id) on delete restrict,
  admin_user_id uuid not null references auth.users (id) on delete restrict
);

create table cashless.settlements (
  id bigint generated always as identity primary key,
  public_id uuid not null default gen_random_uuid() unique,
  transaction_id bigint not null unique references cashless.financial_transactions (id) on delete restrict,
  event_business_id bigint not null references cashless.event_businesses (id) on delete restrict,
  admin_user_id uuid not null references auth.users (id) on delete restrict
);

-- Every foreign key used for joins, authorization, or restricted deletion is indexed.
create index businesses_demo_batch_id_idx on cashless.businesses (demo_batch_id);
create index businesses_created_by_idx on cashless.businesses (created_by);
create index clients_demo_batch_id_idx on cashless.clients (demo_batch_id);
create index clients_created_by_idx on cashless.clients (created_by);
create index client_access_sessions_client_expires_idx on cashless.client_access_sessions (client_id, expires_at);
create index events_status_starts_at_idx on cashless.events (status, starts_at);
create index events_demo_batch_id_idx on cashless.events (demo_batch_id);
create index events_created_by_idx on cashless.events (created_by);
create index event_businesses_business_event_idx on cashless.event_businesses (business_id, event_id);
create index event_businesses_event_active_idx on cashless.event_businesses (event_id, is_active);
create index charge_requests_event_status_created_idx on cashless.charge_requests (event_business_id, status, created_at desc);
create index charge_requests_pending_expires_idx on cashless.charge_requests (expires_at) where status = 'pending';
create index financial_transactions_event_created_idx on cashless.financial_transactions (event_id, created_at desc, id desc);
create index financial_transactions_type_created_idx on cashless.financial_transactions (transaction_type, created_at desc);
create index financial_transactions_actor_user_id_idx on cashless.financial_transactions (actor_user_id);
create index financial_transactions_demo_batch_id_idx on cashless.financial_transactions (demo_batch_id);
create index financial_entries_client_transaction_idx on cashless.financial_entries (client_id, transaction_id desc) where client_id is not null;
create index financial_entries_event_business_transaction_idx on cashless.financial_entries (event_business_id, transaction_id desc) where event_business_id is not null;
create index top_ups_client_id_idx on cashless.top_ups (client_id);
create index top_ups_event_id_idx on cashless.top_ups (event_id);
create index top_ups_admin_user_id_idx on cashless.top_ups (admin_user_id);
create index sales_client_id_idx on cashless.sales (client_id);
create index sales_event_business_id_idx on cashless.sales (event_business_id);
create index sales_confirmed_by_idx on cashless.sales (confirmed_by);
create index reversals_admin_user_id_idx on cashless.reversals (admin_user_id);
create index withdrawals_client_id_idx on cashless.withdrawals (client_id);
create index withdrawals_admin_user_id_idx on cashless.withdrawals (admin_user_id);
create index settlements_event_business_id_idx on cashless.settlements (event_business_id);
create index settlements_admin_user_id_idx on cashless.settlements (admin_user_id);

create function cashless.prevent_financial_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception using
    errcode = '55000',
    message = format('%I.%I is append-only', tg_table_schema, tg_table_name);
end;
$$;

revoke execute on function cashless.prevent_financial_mutation() from public, anon, authenticated, service_role;

create trigger financial_transactions_immutable
before update or delete on cashless.financial_transactions
for each row execute function cashless.prevent_financial_mutation();

create trigger financial_entries_immutable
before update or delete on cashless.financial_entries
for each row execute function cashless.prevent_financial_mutation();

create trigger top_ups_immutable
before update or delete on cashless.top_ups
for each row execute function cashless.prevent_financial_mutation();

create trigger sales_immutable
before update or delete on cashless.sales
for each row execute function cashless.prevent_financial_mutation();

create trigger reversals_immutable
before update or delete on cashless.reversals
for each row execute function cashless.prevent_financial_mutation();

create trigger withdrawals_immutable
before update or delete on cashless.withdrawals
for each row execute function cashless.prevent_financial_mutation();

create trigger settlements_immutable
before update or delete on cashless.settlements
for each row execute function cashless.prevent_financial_mutation();

create function cashless.assert_financial_transaction_shape()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  transaction_row cashless.financial_transactions%rowtype;
  operation_count integer;
  entry_count integer;
  valid_entry_count integer;
begin
  select *
  into strict transaction_row
  from cashless.financial_transactions
  where id = new.id;

  select
    (select count(*) from cashless.top_ups where transaction_id = transaction_row.id)
    + (select count(*) from cashless.sales where transaction_id = transaction_row.id)
    + (select count(*) from cashless.reversals where transaction_id = transaction_row.id)
    + (select count(*) from cashless.withdrawals where transaction_id = transaction_row.id)
    + (select count(*) from cashless.settlements where transaction_id = transaction_row.id)
  into operation_count;

  if operation_count <> 1 then
    raise exception 'financial transaction % must have exactly one operation row', transaction_row.id
      using errcode = '23514';
  end if;

  select count(*)
  into entry_count
  from cashless.financial_entries
  where transaction_id = transaction_row.id;

  case transaction_row.transaction_type
    when 'top_up' then
      select count(*)
      into valid_entry_count
      from cashless.top_ups operation
      join cashless.financial_entries entry
        on entry.transaction_id = operation.transaction_id
      where operation.transaction_id = transaction_row.id
        and operation.event_id = transaction_row.event_id
        and entry.client_id = operation.client_id
        and entry.event_business_id is null
        and entry.delta_cents = transaction_row.amount_cents;

      if entry_count <> 1 or valid_entry_count <> 1 then
        raise exception 'invalid top_up entry shape for transaction %', transaction_row.id
          using errcode = '23514';
      end if;

    when 'purchase' then
      select count(*)
      into valid_entry_count
      from cashless.sales operation
      join cashless.event_businesses participation
        on participation.id = operation.event_business_id
      join cashless.financial_entries entry
        on entry.transaction_id = operation.transaction_id
      where operation.transaction_id = transaction_row.id
        and participation.event_id = transaction_row.event_id
        and (
          (
            entry.client_id = operation.client_id
            and entry.event_business_id is null
            and entry.delta_cents = -transaction_row.amount_cents
          )
          or (
            entry.client_id is null
            and entry.event_business_id = operation.event_business_id
            and entry.delta_cents = transaction_row.amount_cents
          )
        );

      if entry_count <> 2 or valid_entry_count <> 2 then
        raise exception 'invalid purchase entry shape for transaction %', transaction_row.id
          using errcode = '23514';
      end if;

    when 'sale_reversal' then
      select count(*)
      into valid_entry_count
      from cashless.reversals operation
      join cashless.sales sale on sale.id = operation.sale_id
      join cashless.event_businesses participation
        on participation.id = sale.event_business_id
      join cashless.financial_transactions sale_transaction
        on sale_transaction.id = sale.transaction_id
      join cashless.financial_entries entry
        on entry.transaction_id = operation.transaction_id
      where operation.transaction_id = transaction_row.id
        and participation.event_id = transaction_row.event_id
        and transaction_row.amount_cents = sale_transaction.amount_cents
        and (
          (
            entry.client_id = sale.client_id
            and entry.event_business_id is null
            and entry.delta_cents = transaction_row.amount_cents
          )
          or (
            entry.client_id is null
            and entry.event_business_id = sale.event_business_id
            and entry.delta_cents = -transaction_row.amount_cents
          )
        );

      if entry_count <> 2 or valid_entry_count <> 2 then
        raise exception 'invalid sale_reversal entry shape for transaction %', transaction_row.id
          using errcode = '23514';
      end if;

    when 'withdrawal' then
      select count(*)
      into valid_entry_count
      from cashless.withdrawals operation
      join cashless.financial_entries entry
        on entry.transaction_id = operation.transaction_id
      where operation.transaction_id = transaction_row.id
        and transaction_row.event_id is null
        and entry.client_id = operation.client_id
        and entry.event_business_id is null
        and entry.delta_cents = -transaction_row.amount_cents
        and entry.balance_after_cents >= 0;

      if entry_count <> 1 or valid_entry_count <> 1 then
        raise exception 'invalid withdrawal entry shape for transaction %', transaction_row.id
          using errcode = '23514';
      end if;

    when 'settlement' then
      select count(*)
      into valid_entry_count
      from cashless.settlements operation
      join cashless.event_businesses participation
        on participation.id = operation.event_business_id
      join cashless.financial_entries entry
        on entry.transaction_id = operation.transaction_id
      where operation.transaction_id = transaction_row.id
        and participation.event_id = transaction_row.event_id
        and entry.client_id is null
        and entry.event_business_id = operation.event_business_id
        and entry.delta_cents = -transaction_row.amount_cents
        and entry.balance_after_cents >= 0;

      if entry_count <> 1 or valid_entry_count <> 1 then
        raise exception 'invalid settlement entry shape for transaction %', transaction_row.id
          using errcode = '23514';
      end if;
  end case;

  return null;
end;
$$;

revoke execute on function cashless.assert_financial_transaction_shape() from public, anon, authenticated, service_role;

create constraint trigger financial_transaction_shape
after insert on cashless.financial_transactions
deferrable initially deferred
for each row execute function cashless.assert_financial_transaction_shape();

create function cashless.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1
      from cashless.staff_profiles profile
      where profile.auth_user_id = (select auth.uid())
        and profile.role = 'admin'
        and profile.is_active
    );
$$;

create function cashless.current_business_id()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select profile.business_id
  from cashless.staff_profiles profile
  where profile.auth_user_id = (select auth.uid())
    and profile.role = 'seller'
    and profile.is_active;
$$;

create function cashless.current_client_id()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select session.client_id
  from cashless.client_access_sessions session
  where session.auth_user_id = (select auth.uid())
    and session.revoked_at is null
    and session.expires_at > statement_timestamp();
$$;

revoke execute on function cashless.is_admin() from public, anon, service_role;
revoke execute on function cashless.current_business_id() from public, anon, service_role;
revoke execute on function cashless.current_client_id() from public, anon, service_role;
grant execute on function cashless.is_admin() to authenticated;
grant execute on function cashless.current_business_id() to authenticated;
grant execute on function cashless.current_client_id() to authenticated;

alter table cashless.demo_batches enable row level security;
alter table cashless.businesses enable row level security;
alter table cashless.staff_profiles enable row level security;
alter table cashless.clients enable row level security;
alter table cashless.client_accounts enable row level security;
alter table cashless.client_access_sessions enable row level security;
alter table cashless.events enable row level security;
alter table cashless.event_businesses enable row level security;
alter table cashless.charge_requests enable row level security;
alter table cashless.financial_transactions enable row level security;
alter table cashless.financial_entries enable row level security;
alter table cashless.top_ups enable row level security;
alter table cashless.sales enable row level security;
alter table cashless.reversals enable row level security;
alter table cashless.withdrawals enable row level security;
alter table cashless.settlements enable row level security;

create policy demo_batches_select_admin
on cashless.demo_batches for select to authenticated
using ((select cashless.is_admin()));

create policy businesses_select_authorized
on cashless.businesses for select to authenticated
using (
  (select cashless.is_admin())
  or id = (select cashless.current_business_id())
);

create policy staff_profiles_select_authorized
on cashless.staff_profiles for select to authenticated
using (
  (select cashless.is_admin())
  or auth_user_id = (select auth.uid())
);

create policy clients_select_authorized
on cashless.clients for select to authenticated
using (
  (select cashless.is_admin())
  or id = (select cashless.current_client_id())
);

create policy client_accounts_select_authorized
on cashless.client_accounts for select to authenticated
using (
  (select cashless.is_admin())
  or client_id = (select cashless.current_client_id())
);

create policy client_access_sessions_select_authorized
on cashless.client_access_sessions for select to authenticated
using (
  (select cashless.is_admin())
  or auth_user_id = (select auth.uid())
);

create policy events_select_staff
on cashless.events for select to authenticated
using (
  (select cashless.is_admin())
  or exists (
    select 1
    from cashless.event_businesses participation
    where participation.event_id = events.id
      and participation.business_id = (select cashless.current_business_id())
  )
);

create policy event_businesses_select_staff
on cashless.event_businesses for select to authenticated
using (
  (select cashless.is_admin())
  or business_id = (select cashless.current_business_id())
);

create policy charge_requests_select_staff
on cashless.charge_requests for select to authenticated
using (
  (select cashless.is_admin())
  or exists (
    select 1
    from cashless.event_businesses participation
    where participation.id = charge_requests.event_business_id
      and participation.business_id = (select cashless.current_business_id())
  )
);

create policy financial_transactions_select_authorized
on cashless.financial_transactions for select to authenticated
using (
  (select cashless.is_admin())
  or exists (
    select 1
    from cashless.financial_entries entry
    where entry.transaction_id = financial_transactions.id
      and (
        entry.client_id = (select cashless.current_client_id())
        or exists (
          select 1
          from cashless.event_businesses participation
          where participation.id = entry.event_business_id
            and participation.business_id = (select cashless.current_business_id())
        )
      )
  )
);

create policy financial_entries_select_authorized
on cashless.financial_entries for select to authenticated
using (
  (select cashless.is_admin())
  or client_id = (select cashless.current_client_id())
  or exists (
    select 1
    from cashless.event_businesses participation
    where participation.id = financial_entries.event_business_id
      and participation.business_id = (select cashless.current_business_id())
  )
);

create policy top_ups_select_authorized
on cashless.top_ups for select to authenticated
using (
  (select cashless.is_admin())
  or client_id = (select cashless.current_client_id())
);

create policy sales_select_authorized
on cashless.sales for select to authenticated
using (
  (select cashless.is_admin())
  or client_id = (select cashless.current_client_id())
  or exists (
    select 1
    from cashless.event_businesses participation
    where participation.id = sales.event_business_id
      and participation.business_id = (select cashless.current_business_id())
  )
);

create policy reversals_select_authorized
on cashless.reversals for select to authenticated
using (
  (select cashless.is_admin())
  or exists (
    select 1
    from cashless.sales sale
    where sale.id = reversals.sale_id
      and (
        sale.client_id = (select cashless.current_client_id())
        or exists (
          select 1
          from cashless.event_businesses participation
          where participation.id = sale.event_business_id
            and participation.business_id = (select cashless.current_business_id())
        )
      )
  )
);

create policy withdrawals_select_authorized
on cashless.withdrawals for select to authenticated
using (
  (select cashless.is_admin())
  or client_id = (select cashless.current_client_id())
);

create policy settlements_select_authorized
on cashless.settlements for select to authenticated
using (
  (select cashless.is_admin())
  or exists (
    select 1
    from cashless.event_businesses participation
    where participation.id = settlements.event_business_id
      and participation.business_id = (select cashless.current_business_id())
  )
);

grant select on table
  cashless.demo_batches,
  cashless.businesses,
  cashless.staff_profiles,
  cashless.clients,
  cashless.client_accounts,
  cashless.client_access_sessions,
  cashless.events,
  cashless.event_businesses,
  cashless.charge_requests,
  cashless.financial_transactions,
  cashless.financial_entries,
  cashless.top_ups,
  cashless.sales,
  cashless.reversals,
  cashless.withdrawals,
  cashless.settlements
to authenticated;
