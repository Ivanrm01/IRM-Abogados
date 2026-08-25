import { NextResponse } from 'next/server'
import { sbAuth, comprobarPassword, firmarSesion, ponerCookie, publico } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Freno a la fuerza bruta. Es por instancia del servidor, así que no es una
// barrera infalible, pero corta en seco los intentos automáticos habituales.
const intentos = new Map()
const VENTANA = 15 * 60 * 1000
const MAXIMO = 8

function bloqueado(clave) {
  const reg = intentos.get(clave)
  if (!reg) return false
  if (Date.now() - reg.desde > VENTANA) { intentos.delete(clave); return false }
  return reg.n >= MAXIMO
}
function fallo(clave) {
  const reg = intentos.get(clave)
  if (!reg || Date.now() - reg.desde > VENTANA) intentos.set(clave, { n: 1, desde: Date.now() })
  else reg.n++
}

export async function POST(req) {
  const { email, password } = await req.json().catch(() => ({}))
  const correo = String(email || '').trim().toLowerCase()
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const clave = `${ip}|${correo}`

  if (bloqueado(clave)) {
    return NextResponse.json({ error: 'Demasiados intentos fallidos. Espera unos minutos.' }, { status: 429 })
  }
  if (!correo || !password) {
    return NextResponse.json({ error: 'Indica el email y la contraseña' }, { status: 400 })
  }

  const { data: usuario, error } = await sbAuth()
    .from('admin_usuarios').select('*').eq('email', correo).maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mismo mensaje para email inexistente y contraseña incorrecta: no revelamos
  // qué direcciones tienen cuenta.
  const valido = usuario && usuario.activo && comprobarPassword(password, usuario.password_hash)
  if (!valido) {
    fallo(clave)
    await new Promise(r => setTimeout(r, 400))
    return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
  }

  intentos.delete(clave)
  await sbAuth().from('admin_usuarios')
    .update({ ultimo_acceso: new Date().toISOString() }).eq('id', usuario.id)

  const res = NextResponse.json({ usuario: publico(usuario) })
  return ponerCookie(res, firmarSesion(usuario))
}
