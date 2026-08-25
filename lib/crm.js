import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { noAutorizado as sinSesion } from '@/lib/auth'

export function sb() {
  // Las tablas del CRM guardan datos de clientes sujetos a secreto profesional, así que
  // llevan RLS activado y sin políticas: la clave anon no puede leerlas ni aunque se filtre.
  // Estas rutas se ejecutan solo en el servidor, donde sí podemos usar la service_role,
  // que ignora el RLS. Si todavía no la has configurado, se sigue usando la anon.
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[CRM] Falta SUPABASE_SERVICE_ROLE_KEY. Se usa la clave anon: funcionará solo si las tablas crm_* no tienen RLS activado.')
  }
  return createClient(process.env.SUPABASE_URL, clave)
}

// Todas las rutas del CRM exigen sesión iniciada, también en lectura:
// aquí hay datos de clientes, no contenido público.
export const noAutorizado = sinSesion

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
