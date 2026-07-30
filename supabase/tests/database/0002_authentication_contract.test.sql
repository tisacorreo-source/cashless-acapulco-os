begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(9);

select has_table(
  'cashless',
  'client_access_attempts',
  'existe el control de intentos de acceso'
);
select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'cashless.client_access_attempts'::regclass
  ),
  'RLS activo en client_access_attempts'
);
select has_column(
  'cashless',
  'client_access_sessions',
  'authenticated_at',
  'las sesiones registran su autenticación explícita'
);

select ok(
  to_regprocedure('cashless.is_anonymous_user()') is not null,
  'existe el helper de identidad anónima'
);
select ok(
  to_regprocedure('api.get_current_access()') is not null,
  'existe el RPC de acceso actual'
);
select ok(
  to_regprocedure('api.claim_client_access(text,text)') is not null,
  'existe el RPC de acceso limitado del cliente'
);
select ok(
  to_regprocedure('api.revoke_client_access()') is not null,
  'existe el RPC de revocación del cliente'
);

select ok(
  not has_function_privilege(
    'anon',
    'api.claim_client_access(text,text)',
    'EXECUTE'
  ),
  'anon no puede reclamar acceso sin usuario Auth'
);
select ok(
  has_function_privilege(
    'authenticated',
    'api.claim_client_access(text,text)',
    'EXECUTE'
  ),
  'authenticated puede invocar el RPC que valida su identidad'
);

select * from finish();
rollback;
