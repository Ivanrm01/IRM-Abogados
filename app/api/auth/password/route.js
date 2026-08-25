import { NextResponse } from 'next/server'
import { sesionDe, sbAuth, cifrarPassword, comprobarPassword, passwordDebil, firmarSesion, ponerCookie } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req) {
  const s = sesionDe(req)
  if (!s) return NextResponse.json({ error: 'Sesión no válida' }, { status: 401 })

  const { actual, nueva } = await req.json().catch(() => ({}))
  const { data: usuario } = await sbAuth().from('admin_usuarios').select('*').eq('id', s.sub).maybeSingle()
  if (!usuario) return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 404 })

  if (!comprobarPassword(actual, usuario.password_hash)) {
    return NextResponse.json({ error: 'La contraseña actual no es correcta' }, { status: 401 })
  }
  const debil = passwordDebil(nueva)
  if (debil) return NextResponse.json({ error: debil }, { status: 400 })

  const { error } = await sbAuth().from('admin_usuarios')
    .update({ password_hash: cifrarPassword(nueva), debe_cambiar: false }).eq('id', usuario.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Renovamos la cookie para que el cambio no te eche de la sesión en curso
  return ponerCookie(NextResponse.json({ ok: true }), firmarSesion(usuario))
}
