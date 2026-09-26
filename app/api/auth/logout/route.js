import { json, cerrarSesion, peticionPropia } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req) {
  if (!peticionPropia(req)) return json({ error: 'Petición no permitida' }, 403)
  return cerrarSesion(req, json({ ok: true }))
}
