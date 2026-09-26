// ============================================================================
//  SEGURIDAD DEL PANEL /admin  ·  IRM Abogados
//  ---------------------------------------------------------------------------
//  Todo el acceso al panel pasa por aquí:
//   · Cada persona entra con su email y su contraseña (tabla admin_usuarios).
//   · Sesión en una cookie HttpOnly + Secure + SameSite=Strict: el navegador
//     la envía solo, pero ningún script de la página puede leerla ni robarla.
//   · La sesión caduca tras 30 min sin actividad y, como máximo, a las 12 h.
//   · Límite de intentos por conexión y por cuenta, con bloqueo temporal.
//   · Verificación en dos pasos opcional para cada cuenta (Google
//     Authenticator, Microsoft Authenticator…), con códigos de recuperación
//     de un solo uso.
//   · Registro de los últimos accesos (correctos y fallidos).
//
//  En la base de datos nunca se guarda un token de sesión en claro: solo su
//  huella SHA-256. Quien leyera la base de datos no podría entrar con ellas.
//  Las tablas se crean con data/seguridad-schema.sql.
// ============================================================================
import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PRODUCCION = process.env.NODE_ENV === 'production'

// El prefijo __Host- obliga al navegador a aceptarla solo por HTTPS, sin
// dominio y para toda la web: nadie puede colarla desde un subdominio.
export const COOKIE = PRODUCCION ? '__Host-irm_sesion' : 'irm_sesion'
const COOKIE_ANTIGUA = 'irm_sesion'   // la de la versión anterior (firmada, 8 horas)

export const INACTIVIDAD_SEG = 30 * 60        // 30 minutos sin actividad → fuera
export const DURACION_MAX_SEG = 12 * 60 * 60  // nunca más de 12 horas seguidas

// Límites de intentos fallidos
const LIM_IP = { max: 8, ventana: 15 * 60 }        // por conexión: 8 fallos en 15 min
const LIM_CUENTA = { max: 20, ventana: 60 * 60 }   // por cuenta, desde cualquier sitio
const MAX_INTENTOS_CODIGO = 5                       // códigos 2FA por inicio de sesión
const RETO_SEG = 5 * 60                             // tiempo para escribir el código
const DIAS_ACCESOS = 365                            // el registro de accesos se guarda 12 meses

// Next.js guarda por defecto las respuestas de fetch en su caché de datos (y en
// Vercel esa caché sobrevive entre peticiones y despliegues). Para sesiones,
// intentos y códigos eso sería un agujero: una sesión cerrada seguiría
// «existiendo». Todas las consultas de seguridad van siempre a la base de datos.
export const fetchSinCache = (url, opciones = {}) => fetch(url, { ...opciones, cache: 'no-store' })

// Cliente de Supabase para tareas de servidor. Prefiere la service_role, que
// atraviesa el RLS; si no está configurada, cae en la anon.
export function sbAuth() {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  return createClient(process.env.SUPABASE_URL, clave, {
    auth: { persistSession: false },
    global: { fetch: fetchSinCache },
  })
}

// Sal para las huellas irreversibles (registro de consentimientos).
export function salHuellas() {
  return process.env.CONSENT_SALT || process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'irm-abogados'
}

// ¿El error es porque falta ejecutar data/seguridad-schema.sql?
export const faltaEsquema = (error) =>
  !!error && /does not exist|schema cache|relation|column/i.test(String(error.message || error))

export const AVISO_ESQUEMA =
  'Falta actualizar la base de datos: abre Supabase → SQL Editor y ejecuta data/seguridad-schema.sql.'

/* ===========================================================================
   AYUDAS
   =========================================================================== */
export const sha256 = (v) => crypto.createHash('sha256').update(String(v)).digest('hex')
const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
export const tokenAleatorio = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

// Comparación en tiempo constante para textos de cualquier longitud
export function igualSeguro(a, b) {
  const clave = crypto.randomBytes(32)
  const ha = crypto.createHmac('sha256', clave).update(String(a)).digest()
  const hb = crypto.createHmac('sha256', clave).update(String(b)).digest()
  return crypto.timingSafeEqual(ha, hb)
}

export function ipDe(req) {
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim().slice(0, 60)
  const cadena = req.headers.get('x-forwarded-for') || ''
  return (cadena.split(',')[0].trim() || 'local').slice(0, 60)
}

export const navegadorDe = (req) => String(req.headers.get('user-agent') || '').slice(0, 300)
const huellaNavegador = (req) => sha256(navegadorDe(req)).slice(0, 24)

export function json(datos, status = 200) {
  return NextResponse.json(datos, { status, headers: { 'Cache-Control': 'no-store' } })
}

/* ---------------------------------------------------------------------------
   Protección contra peticiones desde otras webs (CSRF).
   Además de la cookie SameSite=Strict, las peticiones deben venir de esta
   misma web.
   --------------------------------------------------------------------------- */
export function peticionPropia(req) {
  const sitio = req.headers.get('sec-fetch-site')
  if (sitio && sitio !== 'same-origin' && sitio !== 'none') return false

  const origen = req.headers.get('origin')
  if (origen) {
    const hosts = [req.headers.get('host'), req.headers.get('x-forwarded-host')].filter(Boolean)
    try {
      const o = new URL(origen)
      if (!hosts.includes(o.host)) return false
      return o.protocol === 'https:' || /^(localhost|127\.0\.0\.1)$/.test(o.hostname)
    } catch { return false }
  }
  // Sin cabecera Origin: se acepta solo en lecturas
  const m = req.method || 'GET'
  return m === 'GET' || m === 'HEAD'
}

/* ===========================================================================
   CONTRASEÑAS
   =========================================================================== */
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

// Cuando el email no existe se calcula igual un scrypt, para que el tiempo de
// respuesta no revele qué direcciones tienen cuenta.
const HASH_FALSO = cifrarPassword(crypto.randomBytes(16).toString('hex'))
export const gastarTiempo = (pw) => { comprobarPassword(pw, HASH_FALSO) }

// Requisitos mínimos. Devuelve null si la contraseña vale, o el motivo si no.
export function passwordDebil(pw) {
  const v = String(pw || '')
  if (v.length < 10) return 'La contraseña debe tener al menos 10 caracteres'
  if (!/[a-zA-Z]/.test(v) || !/[0-9]/.test(v)) return 'Combina letras y números'
  return null
}

/* ===========================================================================
   LÍMITE DE INTENTOS
   Se calcula con el propio registro de accesos: cuenta los fallos seguidos
   (desde la última entrada correcta) dentro de la ventana de tiempo.
   Si la tabla no está disponible, se usa un contador en memoria.
   =========================================================================== */
const memoria = new Map()

function memoriaBloqueo(clave, lim) {
  const r = memoria.get(clave)
  if (!r || Date.now() - r.desde > lim.ventana * 1000) return 0
  if (r.n < lim.max) return 0
  return Math.max(1, Math.ceil((r.desde + lim.ventana * 1000 - Date.now()) / 60000))
}
function memoriaSumar(clave, lim) {
  const r = memoria.get(clave)
  if (!r || Date.now() - r.desde > lim.ventana * 1000) memoria.set(clave, { n: 1, desde: Date.now() })
  else r.n++
  if (memoria.size > 5000) memoria.clear()
}

async function minutosBloqueo(campo, valor, lim) {
  const desde = new Date(Date.now() - lim.ventana * 1000).toISOString()
  const { data, error } = await sbAuth().from('admin_accesos')
    .select('fecha,tipo').eq(campo, valor).in('tipo', ['entrada', 'fallo'])
    .gte('fecha', desde).order('fecha', { ascending: false }).limit(lim.max + 5)
  if (error) return null
  const fallos = []
  for (const f of data || []) {
    if (f.tipo === 'entrada') break
    fallos.push(f)
  }
  if (fallos.length < lim.max) return 0
  // Se desbloquea cuando el fallo número «max» sale de la ventana
  const falta = Date.parse(fallos[lim.max - 1].fecha) + lim.ventana * 1000 - Date.now()
  return Math.max(1, Math.ceil(falta / 60000))
}

const normalizarEmail = (e) => String(e || '').trim().toLowerCase().slice(0, 120)

// Devuelve los minutos que faltan si está bloqueado, o 0 si puede intentarlo
export async function bloqueoActivo(ip, email) {
  const correo = normalizarEmail(email)
  const [porIP, porCuenta] = await Promise.all([
    minutosBloqueo('ip', ip, LIM_IP),
    correo ? minutosBloqueo('email', correo, LIM_CUENTA) : 0,
  ])
  const enMemoria = Math.max(
    porIP === null ? memoriaBloqueo('ip:' + ip, LIM_IP) : 0,
    porCuenta === null ? memoriaBloqueo('u:' + correo, LIM_CUENTA) : 0,
  )
  return Math.max(porIP || 0, porCuenta || 0, enMemoria)
}

/* ===========================================================================
   REGISTRO DE ACCESOS
   tipo: entrada (correcta) · fallo (cuenta para el bloqueo) · bloqueo · evento
   =========================================================================== */
export async function anotarAcceso(req, { tipo = 'evento', motivo, email, usuarioId }) {
  const fila = {
    fecha: new Date().toISOString(),
    tipo,
    ok: tipo === 'entrada' || tipo === 'evento',
    motivo: String(motivo || '').slice(0, 120),
    email: normalizarEmail(email),
    usuario_id: usuarioId || null,
    ip: ipDe(req),
    navegador: navegadorDe(req).slice(0, 250),
  }
  try {
    const { error } = await sbAuth().from('admin_accesos').insert(fila)
    if (error) throw error
    if (Math.random() < 0.02) await limpiezaPeriodica()
  } catch {
    // El registro nunca debe impedir entrar; el bloqueo sigue funcionando en memoria
    if (tipo === 'fallo') {
      memoriaSumar('ip:' + fila.ip, LIM_IP)
      if (fila.email) memoriaSumar('u:' + fila.email, LIM_CUENTA)
    }
  }
}

// Fallo que cuenta para el bloqueo. La pequeña espera aleatoria frena los
// ataques automáticos y no molesta a una persona.
export async function anotarFallo(req, datos) {
  await anotarAcceso(req, { ...datos, tipo: 'fallo' })
  await dormir(400 + Math.floor(Math.random() * 500))
}

export async function ultimosAccesos(n = 40) {
  const { data, error } = await sbAuth().from('admin_accesos')
    .select('fecha,tipo,ok,motivo,email,usuario_id,ip,navegador')
    .order('fecha', { ascending: false }).limit(n)
  if (error) throw error
  return data || []
}

// Borra lo caducado: sesiones, retos y accesos de hace más de 12 meses
async function limpiezaPeriodica() {
  const sb = sbAuth()
  const ahora = Date.now()
  await Promise.all([
    sb.from('admin_sesiones').delete().lt('actividad', new Date(ahora - INACTIVIDAD_SEG * 1000).toISOString()),
    sb.from('admin_sesiones').delete().lt('creada', new Date(ahora - DURACION_MAX_SEG * 1000).toISOString()),
    sb.from('admin_retos').delete().lt('caduca', new Date(ahora).toISOString()),
    sb.from('admin_accesos').delete().lt('fecha', new Date(ahora - DIAS_ACCESOS * 864e5).toISOString()),
  ]).catch(() => {})
}

/* ===========================================================================
   SESIONES
   =========================================================================== */
function ponerCookie(res, token) {
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: PRODUCCION,
    path: '/',
    // Sin fecha: cookie de sesión. El servidor la corta a los 30 min sin
    // actividad o a las 12 horas, aunque el navegador la conserve.
  })
  if (COOKIE !== COOKIE_ANTIGUA) {
    res.cookies.set(COOKIE_ANTIGUA, '', { path: '/', maxAge: 0 })
  }
  return res
}

export function borrarCookie(res) {
  res.cookies.set(COOKIE, '', { httpOnly: true, sameSite: 'strict', secure: PRODUCCION, path: '/', maxAge: 0 })
  if (COOKIE !== COOKIE_ANTIGUA) res.cookies.set(COOKIE_ANTIGUA, '', { path: '/', maxAge: 0 })
  return res
}

// Abre una sesión y pone la cookie en la respuesta
export async function crearSesion(req, res, usuario) {
  const token = tokenAleatorio(32)
  const ahora = new Date().toISOString()
  const { error } = await sbAuth().from('admin_sesiones').insert({
    token_hash: sha256(token),
    usuario_id: usuario.id,
    creada: ahora,
    actividad: ahora,
    nav_huella: huellaNavegador(req),
    ip: ipDe(req),
  })
  if (error) throw new Error(faltaEsquema(error) ? AVISO_ESQUEMA : error.message)
  await sbAuth().from('admin_usuarios').update({ ultimo_acceso: ahora }).eq('id', usuario.id)
  return ponerCookie(res, token)
}

// Devuelve la sesión si es válida (y renueva los 30 minutos), o null
export async function sesionAdmin(req) {
  const token = req.cookies?.get(COOKIE)?.value || ''
  if (!/^[a-f0-9]{64}$/.test(token)) return null
  const hash = sha256(token)

  const sb = sbAuth()
  const { data, error } = await sb.from('admin_sesiones')
    .select('*, usuario:admin_usuarios(*)').eq('token_hash', hash).maybeSingle()
  if (error || !data) return null

  const ahora = Date.now()
  const creada = Date.parse(data.creada)
  const actividad = Date.parse(data.actividad)
  const u = data.usuario
  const valida =
    u && u.activo &&
    ahora - creada < DURACION_MAX_SEG * 1000 &&
    ahora - actividad < INACTIVIDAD_SEG * 1000 &&
    data.nav_huella === huellaNavegador(req)

  if (!valida) {
    await sb.from('admin_sesiones').delete().eq('token_hash', hash)
    return null
  }
  // La actividad renueva los 30 minutos (como mucho, una escritura por minuto)
  if (ahora - actividad > 60 * 1000) {
    await sb.from('admin_sesiones').update({ actividad: new Date(ahora).toISOString() }).eq('token_hash', hash)
  }
  return {
    sub: u.id, email: u.email, nombre: u.nombre, rol: u.rol || 'admin',
    usuario: u, sesion: data, tokenHash: hash,
    caduca: creada + DURACION_MAX_SEG * 1000,
  }
}

// Para usar al principio de cada ruta del panel:
//   const { s, res } = await exigirSesion(req); if (res) return res
export async function exigirSesion(req) {
  if (!peticionPropia(req)) return { res: json({ error: 'Petición no permitida' }, 403) }
  const s = await sesionAdmin(req)
  if (!s) return { res: json({ error: 'Sesión no válida o caducada', sesion: false }, 401) }
  return { s }
}

// Guardián para las rutas del panel: devuelve una respuesta 401/403, o null si hay sesión.
export async function noAutorizado(req) {
  const { res } = await exigirSesion(req)
  return res || null
}

export const sesionDe = sesionAdmin

export async function cerrarSesion(req, res) {
  const token = req.cookies?.get(COOKIE)?.value || ''
  if (/^[a-f0-9]{64}$/.test(token)) {
    await sbAuth().from('admin_sesiones').delete().eq('token_hash', sha256(token))
  }
  return borrarCookie(res)
}

// Cierra las sesiones de una cuenta en todos los dispositivos.
// Con «excepto» se conserva la sesión desde la que se hace el cambio.
export async function cerrarSesionesDe(usuarioId, { excepto } = {}) {
  let q = sbAuth().from('admin_sesiones').delete().eq('usuario_id', usuarioId)
  if (excepto) q = q.neq('token_hash', excepto)
  await q
}

/* ===========================================================================
   VERIFICACIÓN EN DOS PASOS (TOTP, RFC 6238)
   Compatible con Google Authenticator, Microsoft Authenticator, Authy, 1Password…
   =========================================================================== */
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function aBase32(buf) {
  let bits = 0, valor = 0, out = ''
  for (const byte of buf) {
    valor = (valor << 8) | byte
    bits += 8
    while (bits >= 5) {
      out += B32[(valor >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += B32[(valor << (5 - bits)) & 31]
  return out
}

export function deBase32(txt) {
  const limpio = String(txt).toUpperCase().replace(/[^A-Z2-7]/g, '')
  let bits = 0, valor = 0
  const out = []
  for (const c of limpio) {
    valor = (valor << 5) | B32.indexOf(c)
    bits += 5
    if (bits >= 8) {
      out.push((valor >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return Buffer.from(out)
}

export function codigoHOTP(secretoBase32, contador, digitos = 6) {
  const msg = Buffer.alloc(8)
  msg.writeBigUInt64BE(BigInt(contador))
  const h = crypto.createHmac('sha1', deBase32(secretoBase32)).update(msg).digest()
  const d = h[h.length - 1] & 0xf
  const num = ((h[d] & 0x7f) << 24) | (h[d + 1] << 16) | (h[d + 2] << 8) | h[d + 3]
  return String(num % 10 ** digitos).padStart(digitos, '0')
}

export const nuevoSecreto2FA = () => aBase32(crypto.randomBytes(20))

// Acepta el código actual y el de 30 s antes/después (relojes desajustados).
// Devuelve el contador usado, o -1. Nunca acepta un contador ya usado.
export function comprobarTOTP(secreto, codigo, ultimoUsado = -1, ahora = Date.now()) {
  const c = String(codigo || '').replace(/\s/g, '')
  if (!/^\d{6}$/.test(c)) return -1
  const actual = Math.floor(ahora / 1000 / 30)
  for (const desfase of [0, -1, 1]) {
    const contador = actual + desfase
    if (contador <= ultimoUsado) continue
    if (igualSeguro(codigoHOTP(secreto, contador), c)) return contador
  }
  return -1
}

export function uriOtpauth(secreto, email) {
  const emisor = 'IRM Abogados'
  const etiqueta = encodeURIComponent(emisor + ':' + email)
  return `otpauth://totp/${etiqueta}?secret=${secreto}&issuer=${encodeURIComponent(emisor)}&algorithm=SHA1&digits=6&period=30`
}

/* ---------- Códigos de recuperación (por si pierdes el móvil) ---------- */
const ALFABETO_REC = 'abcdefghjkmnpqrstuvwxyz23456789'   // sin 0/o, 1/l/i

const normalizarRecuperacion = (c) => String(c || '').toLowerCase().replace(/[^a-z0-9]/g, '')
const huellaRecuperacion = (sal, codigo) => sha256(sal + '|' + normalizarRecuperacion(codigo))

export function nuevosCodigosRecuperacion(n = 8) {
  const sal = tokenAleatorio(16)
  const codigos = []
  for (let i = 0; i < n; i++) {
    let c = ''
    for (let j = 0; j < 10; j++) c += ALFABETO_REC[crypto.randomInt(ALFABETO_REC.length)]
    codigos.push(c.slice(0, 5) + '-' + c.slice(5))
  }
  return { codigos, sal, hashes: codigos.map((c) => huellaRecuperacion(sal, c)) }
}

export const tiene2FA = (u) => !!(u && u.totp_secreto)

// Comprueba un código de la app o de recuperación de una cuenta.
// Los cambios se guardan de forma atómica: un código nunca sirve dos veces.
export async function verificarSegundoPaso(usuario, codigo) {
  if (!tiene2FA(usuario)) return { ok: false }
  const sb = sbAuth()

  const ultimo = Number(usuario.totp_ultimo ?? -1)
  const contador = comprobarTOTP(usuario.totp_secreto, codigo, ultimo)
  if (contador >= 0) {
    const { data } = await sb.from('admin_usuarios').update({ totp_ultimo: contador })
      .eq('id', usuario.id).lt('totp_ultimo', contador).select('id')
    return data && data.length ? { ok: true, via: 'app' } : { ok: false }
  }

  const lista = Array.isArray(usuario.totp_rec) ? usuario.totp_rec : []
  if (usuario.totp_rec_sal && lista.length && normalizarRecuperacion(codigo).length === 10) {
    const h = huellaRecuperacion(usuario.totp_rec_sal, codigo)
    const i = lista.findIndex((x) => igualSeguro(x, h))
    if (i >= 0) {
      const resto = lista.filter((_, j) => j !== i)
      // Solo se guarda si nadie ha gastado otro código entretanto
      const { data } = await sb.from('admin_usuarios').update({ totp_rec: resto })
        .eq('id', usuario.id).filter('totp_rec', 'eq', '{' + lista.join(',') + '}').select('id')
      if (data && data.length) return { ok: true, via: 'recuperacion', restantes: resto.length }
    }
  }
  return { ok: false }
}

export const SIN_2FA = { totp_secreto: null, totp_desde: null, totp_ultimo: -1, totp_rec_sal: null, totp_rec: null }

/* ---------- Paso intermedio del login cuando hay 2FA ---------- */
export async function crearReto(usuario) {
  const reto = tokenAleatorio(24)
  const { error } = await sbAuth().from('admin_retos').insert({
    reto_hash: sha256(reto),
    usuario_id: usuario.id,
    intentos: 0,
    caduca: new Date(Date.now() + RETO_SEG * 1000).toISOString(),
  })
  if (error) throw new Error(faltaEsquema(error) ? AVISO_ESQUEMA : error.message)
  return reto
}

export async function leerReto(reto) {
  if (!/^[a-f0-9]{48}$/.test(String(reto || ''))) return null
  const hash = sha256(reto)
  const { data } = await sbAuth().from('admin_retos')
    .select('*, usuario:admin_usuarios(*)').eq('reto_hash', hash).maybeSingle()
  if (!data) return null
  if (Date.parse(data.caduca) < Date.now() || !data.usuario || !data.usuario.activo) {
    await borrarReto(data)
    return null
  }
  return data
}

export async function borrarReto(r) {
  await sbAuth().from('admin_retos').delete().eq('reto_hash', r.reto_hash)
}

// Devuelve false cuando se agotan los intentos (hay que volver a empezar)
export async function falloReto(r) {
  const intentos = (r.intentos || 0) + 1
  if (intentos >= MAX_INTENTOS_CODIGO) {
    await borrarReto(r)
    return false
  }
  await sbAuth().from('admin_retos').update({ intentos }).eq('reto_hash', r.reto_hash)
  return true
}

/* ===========================================================================
   Datos de una cuenta que se pueden enviar al navegador
   =========================================================================== */
export const publico = (u) => u && ({
  id: u.id, email: u.email, nombre: u.nombre, rol: u.rol, activo: u.activo,
  ultimo_acceso: u.ultimo_acceso, created_at: u.created_at,
  dos_pasos: tiene2FA(u), dos_pasos_desde: u.totp_desde || null,
})
