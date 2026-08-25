import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export function sb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
}

// Todas las rutas del CRM exigen la clave de administración, también en lectura:
// aquí hay datos de clientes, no contenido público.
export function noAutorizado(req) {
  const key = req.headers.get('x-admin-key')
  if (key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  return null
}

export function error(msg, status = 500) {
  return NextResponse.json({ error: msg }, { status })
}

// Deja pasar solo las columnas conocidas de la tabla y descarta el resto
export function limpiar(body, campos) {
  const out = {}
  for (const c of campos) if (body[c] !== undefined) out[c] = body[c]
  return out
}

export function numero(v) {
  const n = parseFloat(String(v ?? '').replace(/\./g, '').replace(',', '.'))
  return isNaN(n) ? 0 : n
}
