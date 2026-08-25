import { NextResponse } from 'next/server'
import { sesionDe, sbAuth, publico } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Devuelve quién está conectado. El panel la llama al cargar para restaurar la
// sesión sin volver a pedir la contraseña.
export async function GET(req) {
  const s = sesionDe(req)
  if (!s) return NextResponse.json({ error: 'Sin sesión' }, { status: 401 })

  // Comprobamos que la cuenta siga existiendo y activa: si la desactivas, la
  // sesión abierta deja de valer en la siguiente carga.
  const { data } = await sbAuth().from('admin_usuarios').select('*').eq('id', s.sub).maybeSingle()
  if (!data || !data.activo) return NextResponse.json({ error: 'Cuenta no disponible' }, { status: 401 })

  return NextResponse.json({ usuario: publico(data) })
}
