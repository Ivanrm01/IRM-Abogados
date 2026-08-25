import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const COOKIE = 'irm_sesion'
export const DURACION = 60 * 60 * 8   // la sesión dura 8 horas

// Cliente de Supabase para tareas de servidor. Prefiere la service_role, que
// atraviesa el RLS; si no está configurada, cae en la anon.
export function sbAuth() {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  return createClient(process.env.SUPABASE_URL, clave, { auth: { persistSession: false } })
}

// Clave con la que se firman las sesiones. Si no defines SESSION_SECRET se usa
// otra credencial que ya es secreta y estable, para no obligarte a configurar nada.
function secreto() {
  const s = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.ADMIN_KEY
  if (!s) throw new Error('No hay ninguna clave para firmar la sesión: define SESSION_SECRET')
  return s
}

/* ---------------------------------------------------------------- */
/* Contraseñas                                                       */
/* ---------------------------------------------------------------- */

// scrypt con sal aleatoria. Nunca se guarda la contraseña, solo este resultado.
export function cifrarPassword(pw) {
  const sal = crypto.randomBytes(16)
  const hash = crypto.scryptSync(String(pw).normalize('NFKC'), sal, 64, { N: 16384, r: 8, p: 1 })
  return `scrypt$16384$8$1$${sal.toString('hex')}$${hash.toString('hex')}`
}

export function comprobarPassword(pw, guardado) {
  try {
    const [alg, N, r, p, sal, hash] = String(guardado).split('$')
    if (alg !== 'scrypt') return false
    const calculado = crypto.scryptSync(String(pw).normalize('NFKC'), Buffer.from(sal, 'hex'), 64,
      { N: Number(N), r: Number(r), p: Number(p) })
    const original = Buffer.from(hash, 'hex')
    return calculado.length === original.length && crypto.timingSafeEqual(calculado, original)
  } catch { return false }
}

// Requisitos mínimos. Devuelve null si la contraseña vale, o el motivo si no.
export function passwordDebil(pw) {
  const v = String(pw || '')
  if (v.length < 10) return 'La contraseña debe tener al menos 10 caracteres'
  if (!/[a-zA-Z]/.test(v) || !/[0-9]/.test(v)) return 'Combina letras y números'
  return null
}

/* ---------------------------------------------------------------- */
/* Sesión                                                            */
/* ---------------------------------------------------------------- */

const b64u = (v) => Buffer.from(v).toString('base64url')

export function firmarSesion(usuario) {
  const datos = {
    sub: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol || 'admin',
    exp: Math.floor(Date.now() / 1000) + DURACION,
  }
  const cuerpo = b64u(JSON.stringify(datos))
  const firma = crypto.createHmac('sha256', secreto()).update(cuerpo).digest('base64url')
  return `${cuerpo}.${firma}`
}

export function leerToken(token) {
  if (!token) return null
  const [cuerpo, firma] = String(token).split('.')
  if (!cuerpo || !firma) return null
  const esperada = crypto.createHmac('sha256', secreto()).update(cuerpo).digest('base64url')
  const a = Buffer.from(firma), b = Buffer.from(esperada)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const datos = JSON.parse(Buffer.from(cuerpo, 'base64url').toString())
    if (!datos.exp || datos.exp < Date.now() / 1000) return null
    return datos
  } catch { return null }
}

export function sesionDe(req) {
  return leerToken(req.cookies?.get(COOKIE)?.value)
}

// Guardián para las rutas del panel: devuelve una respuesta 401 o null si hay sesión.
export function noAutorizado(req) {
  if (!sesionDe(req)) return NextResponse.json({ error: 'Sesión no válida o caducada' }, { status: 401 })
  return null
}

export function ponerCookie(res, token) {
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DURACION,
  })
  return res
}

export function borrarCookie(res) {
  res.cookies.set(COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 })
  return res
}

export const publico = (u) => u && ({ id: u.id, email: u.email, nombre: u.nombre, rol: u.rol, activo: u.activo, ultimo_acceso: u.ultimo_acceso, created_at: u.created_at })
