-- =====================================================================
--  HONORARIOS · IRM Abogados
--  Ejecutar una sola vez en Supabase → SQL Editor → New query → Run
--  (después de crm-schema.sql)
-- =====================================================================
--
--  Cada fila es un concepto de honorarios de un expediente:
--    · fijo      → importe cerrado (p. ej. escrito de alegaciones, 100 €)
--    · variable  → % sobre una base (normalmente la cuantía), que solo se
--                  cobra si se devenga (p. ej. 12 % del importe derivado)
--
--  Estados:
--    previsto   → pactado, aún no devengado (en los variables: «en expectativa»)
--    devengado  → ya exigible: PENDIENTE DE FACTURAR
--    facturado  → factura emitida, pendiente de cobro
--    cobrado    → cobrado
--    anulado    → no llegó a devengarse (p. ej. variable de un asunto perdido)
-- ---------------------------------------------------------------------

create table if not exists crm_honorarios (
  id              uuid primary key,
  expediente_id   uuid references crm_expedientes(id) on delete cascade,
  cliente_id      uuid references crm_clientes(id) on delete set null,
  cliente_nombre  text default '',            -- desnormalizado, como en los expedientes
  concepto        text not null,
  tipo            text default 'fijo',        -- fijo | variable
  porcentaje      numeric,                    -- variables: % pactado
  base            numeric,                    -- variables: cuantía sobre la que se aplica
  base_desc       text default '',            -- «del importe derivado», «del ahorro obtenido»…
  importe         numeric default 0,          -- fijo: importe · variable: base × % (o importe pactado)
  condicion       text default '',            -- hito que lo devenga
  estado          text default 'previsto',    -- previsto | devengado | facturado | cobrado | anulado
  fecha_devengo   date,
  factura         text default '',            -- nº de factura
  fecha_factura   date,
  fecha_cobro     date,
  notas           text default '',
  created_at      timestamptz default now()
);

create index if not exists crm_honorarios_cliente_idx    on crm_honorarios (cliente_id);
create index if not exists crm_honorarios_expediente_idx on crm_honorarios (expediente_id);
create index if not exists crm_honorarios_estado_idx     on crm_honorarios (estado);

-- ---------------------------------------------------------------------
-- Seguridad: si ya cerraste el resto de tablas del CRM con crm-rls.sql
-- (RLS activado y SUPABASE_SERVICE_ROLE_KEY en Vercel), esta tabla se
-- cierra igual. Si todavía no lo has hecho, se deja como las demás.
-- ---------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from pg_tables
    where schemaname = 'public' and tablename = 'crm_expedientes' and rowsecurity
  ) then
    execute 'alter table crm_honorarios enable row level security';
  end if;
end $$;
