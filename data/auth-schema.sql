-- =====================================================================
--  ACCESOS AL PANEL · IRM Abogados
--  Ejecutar una sola vez en Supabase → SQL Editor → New query → Run
-- =====================================================================

create table if not exists admin_usuarios (
  id             uuid primary key,
  email          text not null unique,
  nombre         text not null default '',
  password_hash  text not null,
  rol            text not null default 'admin',
  activo         boolean not null default true,
  debe_cambiar   boolean not null default false,  -- contraseña puesta por otra persona
  ultimo_acceso  timestamptz,
  created_at     timestamptz default now()
);

create index if not exists admin_usuarios_email_idx on admin_usuarios (lower(email));

-- ---------------------------------------------------------------------
--  No hay que insertar ningún usuario a mano.
--  Al entrar en /admin con la tabla vacía, el panel muestra el formulario
--  "Crea tu acceso". La primera cuenta que crees será la tuya, y desde
--  Accesos podrás dar de alta al resto del equipo.
--
--  Las contraseñas se guardan cifradas con scrypt y sal aleatoria: la
--  columna password_hash no permite recuperar la contraseña original.
-- ---------------------------------------------------------------------

-- Si más adelante te quedas fuera y necesitas volver a empezar, vacía la
-- tabla y el formulario de alta inicial reaparecerá:
-- delete from admin_usuarios;
