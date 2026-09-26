import {
  json, exigirSesion, sbAuth, cifrarPassword, comprobarPassword, passwordDebil,
  ipDe, bloqueoActivo, anotarAcceso, anotarFallo, cerrarSesionesDe,
} from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req) {
  const { s, res } = await exigirSesion(req)
  if (res) return res
  const usuario = s.usuario

  const minutos = await bloqueoActivo(ipDe(req), usuario.email)
  if (minutos) return json({ error: `Demasiados intentos fallidos. Espera ${minutos} min.` }, 429)

  const { actual, nueva } = await req.json().catch(() => ({}))
  if (!comprobarPassword(actual, usuario.password_hash)) {
    await anotarFallo(req, { motivo: 'Contraseña incorrecta al cambiarla', email: usuario.email, usuarioId: usuario.id })
    return json({ error: 'La contraseña actual no es correcta' }, 401)
  }
  const debil = passwordDebil(nueva)
  if (debil) return json({ error: debil }, 400)

  const { error } = await sbAuth().from('admin_usuarios')
    .update({ password_hash: cifrarPassword(nueva), debe_cambiar: false }).eq('id', usuario.id)
  if (error) return json({ error: error.message }, 500)

  // Con la contraseña nueva, se cierran tus sesiones en otros dispositivos;
  // la de este navegador sigue abierta.
  await cerrarSesionesDe(usuario.id, { excepto: s.tokenHash })
  await anotarAcceso(req, { motivo: 'Contraseña cambiada', email: usuario.email, usuarioId: usuario.id })
  return json({ ok: true })
}
