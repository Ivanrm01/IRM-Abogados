import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { sesionDe, sbAuth, cifrarPassword, passwordDebil, publico } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function guardia(req) {
  const s = sesionDe(req)
  if (!s) return { res: NextResponse.json({ error: 'Sesión no válida' }, { status: 401 }) }
  return { s }
}

export async function GET(req) {
  const { s, res } = guardia(req); if (res) return res
  const { data, error } = await sbAuth()
    .from('admin_usuarios').select('*').order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ usuarios: (data || []).map(publico), yo: s.sub })
}

export async function POST(req) {
  const { res } = guardia(req); if (res) return res
  const { email, nombre, password } = await req.json().catch(() => ({}))
  const correo = String(email || '').trim().toLowerCase()

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
    return NextResponse.json({ error: 'Indica un email válido' }, { status: 400 })
  }
  const debil = passwordDebil(password)
  if (debil) return NextResponse.json({ error: debil }, { status: 400 })

  const { data: existe } = await sbAuth().from('admin_usuarios').select('id').eq('email', correo).maybeSingle()
  if (existe) return NextResponse.json({ error: 'Ya hay una cuenta con ese email' }, { status: 409 })

  const usuario = {
    id: uuidv4(),
    email: correo,
    nombre: String(nombre || '').trim() || correo.split('@')[0],
    password_hash: cifrarPassword(password),
    rol: 'admin',
    activo: true,
    debe_cambiar: true,   // la contraseña la fijas tú: que la cambie al entrar
  }
  const { data, error } = await sbAuth().from('admin_usuarios').insert(usuario).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ usuario: publico(data) }, { status: 201 })
}

export async function PATCH(req) {
  const { s, res } = guardia(req); if (res) return res
  const body = await req.json().catch(() => ({}))
  if (!body.id) return NextResponse.json({ error: 'Falta el identificador' }, { status: 400 })

  const cambios = {}
  if (body.nombre !== undefined) cambios.nombre = String(body.nombre).trim()
  if (body.activo !== undefined) {
    if (body.id === s.sub && !body.activo) {
      return NextResponse.json({ error: 'No puedes desactivar tu propia cuenta' }, { status: 400 })
    }
    cambios.activo = !!body.activo
  }
  if (body.password) {
    const debil = passwordDebil(body.password)
    if (debil) return NextResponse.json({ error: debil }, { status: 400 })
    cambios.password_hash = cifrarPassword(body.password)
    cambios.debe_cambiar = body.id !== s.sub
  }
  if (!Object.keys(cambios).length) return NextResponse.json({ error: 'Nada que cambiar' }, { status: 400 })

  const { data, error } = await sbAuth().from('admin_usuarios').update(cambios).eq('id', body.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ usuario: publico(data) })
}

export async function DELETE(req) {
  const { s, res } = guardia(req); if (res) return res
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Falta el identificador' }, { status: 400 })
  if (id === s.sub) return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta' }, { status: 400 })

  const { count } = await sbAuth().from('admin_usuarios').select('id', { count: 'exact', head: true }).eq('activo', true)
  if ((count || 0) <= 1) return NextResponse.json({ error: 'Debe quedar al menos una cuenta activa' }, { status: 400 })

  const { error } = await sbAuth().from('admin_usuarios').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
