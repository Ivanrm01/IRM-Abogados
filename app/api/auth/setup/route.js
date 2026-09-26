import { v4 as uuidv4 } from 'uuid'
import {
  json, sbAuth, cifrarPassword, passwordDebil, crearSesion, publico, peticionPropia,
  anotarAcceso, faltaEsquema,
} from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ¿Hace falta crear el primer acceso? ¿Falta alguna tabla? El panel lo
// consulta para enseñar el formulario de alta o el aviso correspondiente.
export async function GET() {
  const sb = sbAuth()
  const { count, error } = await sb
    .from('admin_usuarios').select('id', { count: 'exact', head: true })

  if (error) {
    return json({ error: error.message, faltaTabla: faltaEsquema(error) }, 500)
  }

  // Tablas de data/seguridad-schema.sql
  const comprobaciones = await Promise.all([
    sb.from('admin_usuarios').select('totp_desde,totp_rec').limit(1),
    sb.from('admin_sesiones').select('creada').limit(1),
    sb.from('admin_retos').select('caduca').limit(1),
    sb.from('admin_accesos').select('fecha').limit(1),
  ])
  const faltaSeguridad = comprobaciones.some((r) => r.error)

  return json({ necesario: (count || 0) === 0, faltaSeguridad })
}

// Crea la primera cuenta. Solo funciona mientras la tabla esté vacía: en cuanto
// existe un usuario, esta ruta queda cerrada para siempre.
export async function POST(req) {
  if (!peticionPropia(req)) return json({ error: 'Petición no permitida' }, 403)

  const { count } = await sbAuth().from('admin_usuarios').select('id', { count: 'exact', head: true })
  if ((count || 0) > 0) {
    return json({ error: 'Ya hay cuentas creadas. Entra con la tuya.' }, 409)
  }

  const { email, password, nombre } = await req.json().catch(() => ({}))
  const correo = String(email || '').trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
    return json({ error: 'Indica un email válido' }, 400)
  }
  const debil = passwordDebil(password)
  if (debil) return json({ error: debil }, 400)

  const usuario = {
    id: uuidv4(),
    email: correo,
    nombre: String(nombre || '').trim() || correo.split('@')[0],
    password_hash: cifrarPassword(password),
    rol: 'admin',
    activo: true,
  }
  const { data, error } = await sbAuth().from('admin_usuarios').insert(usuario).select().single()
  if (error) return json({ error: error.message }, 500)

  try {
    const res = json({ usuario: publico(data) })
    await crearSesion(req, res, data)
    await anotarAcceso(req, { tipo: 'entrada', motivo: 'Primera cuenta creada', email: correo, usuarioId: data.id })
    return res
  } catch (e) {
    return json({ error: e.message }, 500)
  }
}
