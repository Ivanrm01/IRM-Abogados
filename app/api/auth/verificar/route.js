import {
  json, peticionPropia, ipDe, bloqueoActivo, anotarAcceso, anotarFallo,
  leerReto, falloReto, borrarReto, verificarSegundoPaso, crearSesion, publico,
} from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// LOGIN · paso 2: código de la app del móvil o código de recuperación
export async function POST(req) {
  if (!peticionPropia(req)) return json({ error: 'Petición no permitida' }, 403)

  const { reto: retoTxt, codigo } = await req.json().catch(() => ({}))
  const reto = await leerReto(retoTxt)
  if (!reto) {
    return json({ error: 'Ha pasado demasiado tiempo. Vuelve a escribir tu email y contraseña.', reiniciar: true }, 401)
  }
  const usuario = reto.usuario

  const minutos = await bloqueoActivo(ipDe(req), usuario.email)
  if (minutos) {
    await borrarReto(reto)
    return json({ error: `Demasiados intentos fallidos. Espera ${minutos} min.`, reiniciar: true }, 429)
  }

  const r = await verificarSegundoPaso(usuario, String(codigo || '').slice(0, 20))
  if (!r.ok) {
    await anotarFallo(req, { motivo: 'Código de verificación incorrecto', email: usuario.email, usuarioId: usuario.id })
    const sigue = await falloReto(reto)
    return json({
      error: sigue ? 'El código no es correcto.' : 'Demasiados códigos incorrectos. Vuelve a empezar.',
      reiniciar: !sigue,
    }, 401)
  }

  await borrarReto(reto)
  try {
    const res = json({ usuario: publico(usuario), codigosRestantes: r.restantes })
    await crearSesion(req, res, usuario)
    await anotarAcceso(req, {
      tipo: 'entrada',
      motivo: r.via === 'recuperacion' ? 'Entrada con código de recuperación' : 'Entrada correcta (2 pasos)',
      email: usuario.email, usuarioId: usuario.id,
    })
    return res
  } catch (e) {
    return json({ error: e.message || 'No se ha podido abrir la sesión' }, 500)
  }
}
