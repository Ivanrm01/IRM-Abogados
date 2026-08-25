-- =====================================================================
--  Cerrar el acceso directo a las tablas privadas
--  Ejecutar SOLO cuando la variable SUPABASE_SERVICE_ROLE_KEY ya esté
--  configurada en Vercel y desplegada. Si lo ejecutas antes, el panel
--  dejará de leer datos (y no podrás ni entrar) hasta que lo esté.
-- =====================================================================

-- Activa Row Level Security sin crear ninguna política.
-- Efecto: la clave anon (la que puede acabar siendo pública) deja de poder
-- leer o escribir en estas tablas. La clave service_role, que solo vive en
-- el servidor, ignora el RLS y sigue funcionando con normalidad.
alter table admin_usuarios  enable row level security;
alter table crm_clientes    enable row level security;
alter table crm_expedientes enable row level security;
alter table crm_actuaciones enable row level security;

-- Comprobación: las cuatro deben aparecer con rowsecurity = true
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and (tablename like 'crm_%' or tablename = 'admin_usuarios');


-- ---------------------------------------------------------------------
--  MARCHA ATRÁS
--  Si algo va mal y necesitas que el panel vuelva a funcionar con la clave
--  anon mientras lo revisas, ejecuta estas líneas:
-- ---------------------------------------------------------------------
-- alter table admin_usuarios  disable row level security;
-- alter table crm_clientes    disable row level security;
-- alter table crm_expedientes disable row level security;
-- alter table crm_actuaciones disable row level security;
