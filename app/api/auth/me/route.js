import { json, exigirSesion, publico, INACTIVIDAD_SEG } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Devuelve quién está conectado. El panel la llama al cargar para restaurar la
// sesión sin volver a pedir la contraseña, y mientras trabajas para mantenerla
// viva. Si la cuenta se desactiva, la sesión deja de valer en la siguiente
// petición.
export async function GET(req) {
  const { s, res } = await exigirSesion(req)
  if (res) return res
  return json({ usuario: publico(s.usuario), caduca: s.caduca, inactividad: INACTIVIDAD_SEG })
}
