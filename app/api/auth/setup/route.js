import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { sbAuth, cifrarPassword, passwordDebil, firmarSesion, ponerCookie, publico } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ¿Hace falta crear el primer acceso? El panel lo consulta para enseñar el
// formulario de alta en lugar del de entrada.
export async function GET() {
  const { count, error } = await sbAuth()
    .from('admin_usuarios').select('id', { count: 'exact', head: true })

  if (error) {
    const faltaTabla = /does not exist|schema cache|relation/i.test(error.message)
    return NextResponse.json({ error: error.message, faltaTabla }, { status: 500 })
  }
  return NextResponse.json({ necesario: (count || 0) === 0 })
}

// Crea la primera cuenta. Solo funciona mientras la tabla esté vacía: en cuanto
// existe un usuario, esta ruta queda cerrada para siempre.
export async function POST(req) {
  const { count } = await sbAuth().from('admin_usuarios').select('id', { count: 'exact', head: true })
  if ((count || 0) > 0) {
    return NextResponse.json({ error: 'Ya hay cuentas creadas. Entra con la tuya.' }, { status: 409 })
  }

  const { email, password, nombre } = await req.json().catch(() => ({}))
  const correo = String(email || '').trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
    return NextResponse.json({ error: 'Indica un email válido' }, { status: 400 })
  }
  const debil = passwordDebil(password)
  if (debil) return NextResponse.json({ error: debil }, { status: 400 })

  const usuario = {
    id: uuidv4(),
    email: correo,
    nombre: String(nombre || '').trim() || correo.split('@')[0],
    password_hash: cifrarPassword(password),
    rol: 'admin',
    activo: true,
  }
  const { data, error } = await sbAuth().from('admin_usuarios').insert(usuario).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const res = NextResponse.json({ usuario: publico(data) })
  return ponerCookie(res, firmarSesion(data))
}
