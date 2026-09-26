import { v4 as uuidv4 } from 'uuid'
import {
  json, exigirSesion, sbAuth, cifrarPassword, passwordDebil, publico,
  cerrarSesionesDe, anotarAcceso, SIN_2FA,
} from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req) {
  const { s, res } = await exigirSesion(req); if (res) return res
  const { data, error } = await sbAuth()
    .from('admin_usuarios').select('*').order('created_at', { ascending: true })
  if (error) return json({ error: error.message }, 500)
  return json({ usuarios: (data || []).map(publico), yo: s.sub })
}

export async function POST(req) {
  const { s, res } = await exigirSesion(req); if (res) return res
  const { email, nombre, password } = await req.json().catch(() => ({}))
  const correo = String(email || '').trim().toLowerCase()

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
    return json({ error: 'Indica un email válido' }, 400)
  }
  const debil = passwordDebil(password)
  if (debil) return json({ error: debil }, 400)

  const { data: existe } = await sbAuth().from('admin_usuarios').select('id').eq('email', correo).maybeSingle()
  if (existe) return json({ error: 'Ya hay una cuenta con ese email' }, 409)

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
  if (error) return json({ error: error.message }, 500)
  await anotarAcceso(req, { motivo: `Cuenta creada: ${correo}`, email: s.email, usuarioId: s.sub })
  return json({ usuario: publico(data) }, 201)
}

export async function PATCH(req) {
  const { s, res } = await exigirSesion(req); if (res) return res
  const body = await req.json().catch(() => ({}))
  if (!body.id) return json({ error: 'Falta el identificador' }, 400)

  const { data: cuenta } = await sbAuth().from('admin_usuarios').select('id,email').eq('id', body.id).maybeSingle()
  if (!cuenta) return json({ error: 'Cuenta no encontrada' }, 404)

  const cambios = {}
  const eventos = []
  let cerrarSesiones = false

  if (body.nombre !== undefined) cambios.nombre = String(body.nombre).trim()
  if (body.activo !== undefined) {
    if (body.id === s.sub && !body.activo) {
      return json({ error: 'No puedes desactivar tu propia cuenta' }, 400)
    }
    cambios.activo = !!body.activo
    if (!cambios.activo) cerrarSesiones = true
    eventos.push(`Cuenta ${cambios.activo ? 'reactivada' : 'desactivada'}: ${cuenta.email}`)
  }
  if (body.password) {
    const debil = passwordDebil(body.password)
    if (debil) return json({ error: debil }, 400)
    cambios.password_hash = cifrarPassword(body.password)
    cambios.debe_cambiar = body.id !== s.sub
    cerrarSesiones = true
    eventos.push(`Contraseña cambiada: ${cuenta.email}`)
  }
  // Para quien ha perdido el móvil y los códigos de recuperación. La tuya se
  // quita desde Seguridad, confirmando con tu contraseña y un código.
  if (body.quitar2fa) {
    if (body.id === s.sub) {
      return json({ error: 'Tu propia verificación se desactiva desde Seguridad' }, 400)
    }
    Object.assign(cambios, SIN_2FA)
    eventos.push(`Verificación en dos pasos quitada: ${cuenta.email}`)
  }
  if (!Object.keys(cambios).length) return json({ error: 'Nada que cambiar' }, 400)

  const { data, error } = await sbAuth().from('admin_usuarios').update(cambios).eq('id', body.id).select().single()
  if (error) return json({ error: error.message }, 500)

  // Desactivar la cuenta o cambiarle la contraseña cierra sus sesiones abiertas
  // (menos la tuya actual, si te la cambias a ti mismo).
  if (cerrarSesiones) await cerrarSesionesDe(body.id, { excepto: body.id === s.sub ? s.tokenHash : undefined })
  for (const motivo of eventos) await anotarAcceso(req, { motivo, email: s.email, usuarioId: s.sub })

  return json({ usuario: publico(data) })
}

export async function DELETE(req) {
  const { s, res } = await exigirSesion(req); if (res) return res
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return json({ error: 'Falta el identificador' }, 400)
  if (id === s.sub) return json({ error: 'No puedes eliminar tu propia cuenta' }, 400)

  const { count } = await sbAuth().from('admin_usuarios').select('id', { count: 'exact', head: true }).eq('activo', true)
  if ((count || 0) <= 1) return json({ error: 'Debe quedar al menos una cuenta activa' }, 400)

  const { data: cuenta } = await sbAuth().from('admin_usuarios').select('email').eq('id', id).maybeSingle()
  const { error } = await sbAuth().from('admin_usuarios').delete().eq('id', id)
  if (error) return json({ error: error.message }, 500)
  await anotarAcceso(req, { motivo: `Cuenta eliminada: ${cuenta?.email || id}`, email: s.email, usuarioId: s.sub })
  return json({ ok: true })
}
