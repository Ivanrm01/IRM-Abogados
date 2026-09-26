import {
  json, sbAuth, comprobarPassword, gastarTiempo, crearSesion, publico, peticionPropia,
  ipDe, bloqueoActivo, anotarAcceso, anotarFallo, tiene2FA, crearReto,
  faltaEsquema, AVISO_ESQUEMA,
} from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// LOGIN · paso 1: email y contraseña.
// Si la cuenta tiene activada la verificación en dos pasos, no abre sesión:
// devuelve un «reto» con el que /api/auth/verificar pedirá el código.
export async function POST(req) {
  if (!peticionPropia(req)) return json({ error: 'Petición no permitida' }, 403)

  const { email, password } = await req.json().catch(() => ({}))
  const correo = String(email || '').trim().toLowerCase().slice(0, 120)
  const pass = String(password || '').slice(0, 200)
  if (!correo || !pass) return json({ error: 'Indica el email y la contraseña' }, 400)

  const ip = ipDe(req)
  const minutos = await bloqueoActivo(ip, correo)
  if (minutos) {
    await anotarAcceso(req, { tipo: 'bloqueo', motivo: 'Bloqueado por demasiados intentos', email: correo })
    return json({ error: `Demasiados intentos fallidos. Por seguridad, espera ${minutos} min antes de volver a probar.` }, 429)
  }

  const { data: usuario, error } = await sbAuth()
    .from('admin_usuarios').select('*').eq('email', correo).maybeSingle()
  if (error) return json({ error: faltaEsquema(error) ? AVISO_ESQUEMA : error.message }, 500)

  // Mismo mensaje (y mismo tiempo) para email inexistente y contraseña
  // incorrecta: no revelamos qué direcciones tienen cuenta.
  let valido = false
  if (usuario) valido = comprobarPassword(pass, usuario.password_hash) && usuario.activo
  else gastarTiempo(pass)

  if (!valido) {
    await anotarFallo(req, {
      motivo: usuario && !usuario.activo ? 'Cuenta desactivada' : 'Email o contraseña incorrectos',
      email: correo, usuarioId: usuario?.id,
    })
    return json({ error: 'Email o contraseña incorrectos' }, 401)
  }

  try {
    // Contraseña correcta. ¿Hace falta el segundo paso?
    if (tiene2FA(usuario)) {
      const reto = await crearReto(usuario)
      return json({ dosPasos: true, reto })
    }

    const res = json({ usuario: publico(usuario) })
    await crearSesion(req, res, usuario)
    await anotarAcceso(req, { tipo: 'entrada', motivo: 'Entrada correcta', email: correo, usuarioId: usuario.id })
    return res
  } catch (e) {
    return json({ error: e.message || 'No se ha podido abrir la sesión' }, 500)
  }
}
