-- =====================================================================
--  SEGURIDAD DEL PANEL Y REGISTRO DE CONSENTIMIENTOS · IRM Abogados
--  Ejecutar una sola vez en Supabase → SQL Editor → New query → Run
--  (después de auth-schema.sql)
--
--  Ejecútalo ANTES de subir el código nuevo a GitHub. Solo añade columnas
--  y tablas, así que la versión que tienes publicada sigue funcionando
--  igual mientras tanto. Se puede ejecutar varias veces sin romper nada.
-- =====================================================================


-- ---------------------------------------------------------------------
--  1. Verificación en dos pasos (una por cuenta)
-- ---------------------------------------------------------------------
--  totp_secreto  clave que comparte la cuenta con su app del móvil
--  totp_desde    cuándo se activó
--  totp_ultimo   último código aceptado: impide reutilizar un código
--  totp_rec_sal / totp_rec
--                códigos de recuperación. Solo se guarda su huella: aquí
--                no se pueden leer los códigos. Cada uno sirve una vez.
alter table admin_usuarios add column if not exists totp_secreto text;
alter table admin_usuarios add column if not exists totp_desde   timestamptz;
alter table admin_usuarios add column if not exists totp_ultimo  bigint not null default -1;
alter table admin_usuarios add column if not exists totp_rec_sal text;
alter table admin_usuarios add column if not exists totp_rec     text[];


-- ---------------------------------------------------------------------
--  2. Sesiones abiertas
-- ---------------------------------------------------------------------
--  El navegador guarda un token aleatorio; aquí solo su huella SHA-256.
--  Quien leyera esta tabla no podría entrar con ella.
--  Se cierra tras 30 minutos sin actividad y, como máximo, a las 12 horas.
create table if not exists admin_sesiones (
  token_hash            text primary key,
  usuario_id            uuid not null references admin_usuarios(id) on delete cascade,
  creada                timestamptz not null default now(),
  actividad             timestamptz not null default now(),
  nav_huella            text not null default '',
  ip                    text not null default '',
  totp_pendiente        text,          -- clave del QR mientras se activa la verificación
  totp_pendiente_caduca timestamptz
);
create index if not exists admin_sesiones_usuario_idx on admin_sesiones (usuario_id);


-- ---------------------------------------------------------------------
--  3. Paso intermedio del login con verificación en dos pasos
-- ---------------------------------------------------------------------
--  Contraseña correcta, falta el código. Dura 5 minutos y admite 5 intentos.
create table if not exists admin_retos (
  reto_hash   text primary key,
  usuario_id  uuid not null references admin_usuarios(id) on delete cascade,
  intentos    int not null default 0,
  caduca      timestamptz not null
);


-- ---------------------------------------------------------------------
--  4. Registro de accesos al panel (correctos y fallidos)
-- ---------------------------------------------------------------------
--  También sirve para el límite de intentos: 8 fallos desde la misma
--  conexión en 15 minutos, o 20 contra la misma cuenta en una hora,
--  bloquean temporalmente la entrada.
--  tipo: entrada | fallo | bloqueo | evento
--  Se conserva 12 meses.
create table if not exists admin_accesos (
  id          bigint generated always as identity primary key,
  fecha       timestamptz not null default now(),
  tipo        text not null default 'evento',
  ok          boolean not null default false,
  motivo      text not null default '',
  email       text not null default '',   -- el email que se escribió
  usuario_id  uuid,                        -- sin referencia: se conserva aunque se borre la cuenta
  ip          text not null default '',
  navegador   text not null default ''
);
create index if not exists admin_accesos_fecha_idx on admin_accesos (fecha desc);
create index if not exists admin_accesos_ip_idx    on admin_accesos (ip, fecha desc);
create index if not exists admin_accesos_email_idx on admin_accesos (email, fecha desc);


-- ---------------------------------------------------------------------
--  5. Registro de consentimientos de cookies (art. 7.1 RGPD)
-- ---------------------------------------------------------------------
--  Cada decisión del banner: identificador aleatorio del navegador, fecha,
--  versión, texto literal mostrado, finalidades aceptadas y huellas
--  irreversibles de la IP y del navegador. Nunca la IP en claro.
--  Se conserva 4 años (12 meses de vigencia + 3 de prescripción).
create table if not exists cookies_consentimientos (
  id                bigint generated always as identity primary key,
  visitante         text not null,
  fecha             timestamptz not null default now(),
  version           int not null default 0,
  analitica         boolean not null default false,
  marketing         boolean not null default false,
  via               text not null default '',
  texto_mostrado    text not null default '',
  pagina            text not null default '',
  ip_huella         text not null default '',
  navegador_huella  text not null default ''
);
create index if not exists cookies_consentimientos_fecha_idx     on cookies_consentimientos (fecha desc);
create index if not exists cookies_consentimientos_visitante_idx on cookies_consentimientos (visitante);


-- ---------------------------------------------------------------------
--  Cierre de las tablas nuevas
--  Si ya cerraste admin_usuarios con crm-rls.sql (RLS activado y
--  SUPABASE_SERVICE_ROLE_KEY en Vercel), las tablas nuevas se cierran
--  igual. Si todavía no lo has hecho, se dejan como las demás y se
--  cerrarán cuando ejecutes crm-rls.sql.
-- ---------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from pg_tables
    where schemaname = 'public' and tablename = 'admin_usuarios' and rowsecurity
  ) then
    execute 'alter table admin_sesiones          enable row level security';
    execute 'alter table admin_retos             enable row level security';
    execute 'alter table admin_accesos           enable row level security';
    execute 'alter table cookies_consentimientos enable row level security';
  end if;
end $$;

-- Comprobación: deben salir las cuatro tablas
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('admin_sesiones', 'admin_retos', 'admin_accesos', 'cookies_consentimientos');


-- ---------------------------------------------------------------------
--  SI ALGUIEN PIERDE EL MÓVIL Y LOS CÓDIGOS DE RECUPERACIÓN
--  Lo normal es que otra persona del despacho le quite la verificación
--  desde el panel (Accesos → Quitar 2 pasos). Si eres la única cuenta,
--  ejecuta esto cambiando el email y vuelve a activarla al entrar:
-- ---------------------------------------------------------------------
-- update admin_usuarios
--    set totp_secreto = null, totp_desde = null, totp_ultimo = -1,
--        totp_rec_sal = null, totp_rec = null
--  where email = 'tu@email.es';
