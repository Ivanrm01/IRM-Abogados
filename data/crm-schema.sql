-- =====================================================================
--  CRM LEGAL · IRM Abogados
--  Ejecutar una sola vez en Supabase → SQL Editor → New query → Run
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. CLIENTES
-- ---------------------------------------------------------------------
create table if not exists crm_clientes (
  id            uuid primary key,
  nombre        text not null,
  tipo          text default 'fisica',        -- fisica | juridica
  nif           text default '',
  email         text default '',
  telefono      text default '',
  direccion     text default '',
  ciudad        text default '',
  origen        text default 'otros',         -- web | referido | linkedin | llamada | colegio | otros
  estado        text default 'lead',          -- lead | activo | inactivo
  responsable   text default '',
  contacto      text default '',              -- persona de contacto (si es empresa)
  notas         text default '',
  created_at    timestamptz default now()
);

create index if not exists crm_clientes_nombre_idx on crm_clientes (nombre);
create index if not exists crm_clientes_estado_idx on crm_clientes (estado);

-- ---------------------------------------------------------------------
-- 2. EXPEDIENTES
-- ---------------------------------------------------------------------
create table if not exists crm_expedientes (
  id              uuid primary key,
  cliente_id      uuid references crm_clientes(id) on delete set null,
  cliente_nombre  text default '',            -- desnormalizado: sobrevive al borrado del cliente
  referencia      text default '',            -- p. ej. 2026/014
  titulo          text not null,
  materia         text default 'Fiscal',
  fase            text default 'contacto',    -- contacto | propuesta | contratado | en_curso | cerrado | perdido
  via             text default 'extrajudicial',
  organo          text default '',            -- AEAT, TEAR Madrid, JCA nº 3...
  procedimiento   text default '',            -- nº de autos / reclamación
  responsable     text default '',
  prioridad       text default 'media',       -- alta | media | baja
  honorarios      numeric default 0,          -- honorarios fijos presupuestados
  variable        text default '',            -- honorarios variables (texto libre)
  provision       numeric default 0,          -- provisión de fondos recibida
  facturado       numeric default 0,
  cuantia         numeric default 0,          -- cuantía del asunto / deuda discutida
  fecha_alta      date,
  fecha_cierre    date,
  notas           text default '',
  created_at      timestamptz default now()
);

create index if not exists crm_expedientes_cliente_idx on crm_expedientes (cliente_id);
create index if not exists crm_expedientes_fase_idx on crm_expedientes (fase);

-- ---------------------------------------------------------------------
-- 3. ACTUACIONES (histórico / timeline de cada expediente)
-- ---------------------------------------------------------------------
create table if not exists crm_actuaciones (
  id             uuid primary key,
  expediente_id  uuid references crm_expedientes(id) on delete cascade,
  cliente_id     uuid,
  tipo           text default 'nota',         -- nota | llamada | email | reunion | escrito | vista | pago
  fecha          date,
  titulo         text not null,
  detalle        text default '',
  created_at     timestamptz default now()
);

create index if not exists crm_actuaciones_exp_idx on crm_actuaciones (expediente_id);

-- ---------------------------------------------------------------------
-- 4. SEGURIDAD
--    El acceso se hace siempre desde el servidor (rutas /api/crm/*) con la
--    SUPABASE_ANON_KEY, que nunca se expone al navegador, y protegido por
--    la cabecera x-admin-key. Mismo modelo que las tablas posts y plazos.
--    Si tienes RLS activado en el proyecto, habilita estas políticas:
-- ---------------------------------------------------------------------
-- alter table crm_clientes    enable row level security;
-- alter table crm_expedientes enable row level security;
-- alter table crm_actuaciones enable row level security;
--
-- create policy "crm_clientes_anon"    on crm_clientes    for all using (true) with check (true);
-- create policy "crm_expedientes_anon" on crm_expedientes for all using (true) with check (true);
-- create policy "crm_actuaciones_anon" on crm_actuaciones for all using (true) with check (true);
