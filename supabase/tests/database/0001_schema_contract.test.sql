begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(39);

select has_schema('cashless', 'existe el esquema interno cashless');
select has_schema('api', 'existe el esquema expuesto api');

select has_table('cashless', 'demo_batches', 'existe cashless.demo_batches');
select has_table('cashless', 'businesses', 'existe cashless.businesses');
select has_table('cashless', 'staff_profiles', 'existe cashless.staff_profiles');
select has_table('cashless', 'clients', 'existe cashless.clients');
select has_table('cashless', 'client_accounts', 'existe cashless.client_accounts');
select has_table('cashless', 'client_access_sessions', 'existe cashless.client_access_sessions');
select has_table('cashless', 'events', 'existe cashless.events');
select has_table('cashless', 'event_businesses', 'existe cashless.event_businesses');
select has_table('cashless', 'charge_requests', 'existe cashless.charge_requests');
select has_table('cashless', 'financial_transactions', 'existe cashless.financial_transactions');
select has_table('cashless', 'financial_entries', 'existe cashless.financial_entries');
select has_table('cashless', 'top_ups', 'existe cashless.top_ups');
select has_table('cashless', 'sales', 'existe cashless.sales');
select has_table('cashless', 'reversals', 'existe cashless.reversals');
select has_table('cashless', 'withdrawals', 'existe cashless.withdrawals');
select has_table('cashless', 'settlements', 'existe cashless.settlements');

select ok((select relrowsecurity from pg_class where oid = 'cashless.demo_batches'::regclass), 'RLS activo en demo_batches');
select ok((select relrowsecurity from pg_class where oid = 'cashless.businesses'::regclass), 'RLS activo en businesses');
select ok((select relrowsecurity from pg_class where oid = 'cashless.staff_profiles'::regclass), 'RLS activo en staff_profiles');
select ok((select relrowsecurity from pg_class where oid = 'cashless.clients'::regclass), 'RLS activo en clients');
select ok((select relrowsecurity from pg_class where oid = 'cashless.client_accounts'::regclass), 'RLS activo en client_accounts');
select ok((select relrowsecurity from pg_class where oid = 'cashless.client_access_sessions'::regclass), 'RLS activo en client_access_sessions');
select ok((select relrowsecurity from pg_class where oid = 'cashless.events'::regclass), 'RLS activo en events');
select ok((select relrowsecurity from pg_class where oid = 'cashless.event_businesses'::regclass), 'RLS activo en event_businesses');
select ok((select relrowsecurity from pg_class where oid = 'cashless.charge_requests'::regclass), 'RLS activo en charge_requests');
select ok((select relrowsecurity from pg_class where oid = 'cashless.financial_transactions'::regclass), 'RLS activo en financial_transactions');
select ok((select relrowsecurity from pg_class where oid = 'cashless.financial_entries'::regclass), 'RLS activo en financial_entries');
select ok((select relrowsecurity from pg_class where oid = 'cashless.top_ups'::regclass), 'RLS activo en top_ups');
select ok((select relrowsecurity from pg_class where oid = 'cashless.sales'::regclass), 'RLS activo en sales');
select ok((select relrowsecurity from pg_class where oid = 'cashless.reversals'::regclass), 'RLS activo en reversals');
select ok((select relrowsecurity from pg_class where oid = 'cashless.withdrawals'::regclass), 'RLS activo en withdrawals');
select ok((select relrowsecurity from pg_class where oid = 'cashless.settlements'::regclass), 'RLS activo en settlements');

select ok(to_regprocedure('cashless.is_admin()') is not null, 'existe el helper RLS is_admin');
select ok(to_regprocedure('cashless.current_business_id()') is not null, 'existe el helper RLS current_business_id');
select ok(to_regprocedure('cashless.current_client_id()') is not null, 'existe el helper RLS current_client_id');

select ok(
  not exists (
    select 1
    from information_schema.table_privileges
    where table_schema = 'cashless'
      and grantee = 'anon'
  ),
  'anon no tiene privilegios sobre tablas cashless'
);

select ok(
  not exists (
    select 1
    from information_schema.table_privileges
    where table_schema = 'cashless'
      and grantee = 'authenticated'
      and privilege_type in ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'TRIGGER')
  ),
  'authenticated no puede escribir directamente en tablas cashless'
);

select * from finish();
rollback;
