import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { noAutorizado as sinSesion, fetchSinCache } from '@/lib/auth'

export function sb() {
  // Las tablas del CRM guardan datos de clientes sujetos a secreto profesional, así que
  // llevan RLS activado y sin políticas: la clave anon no puede leerlas ni aunque se filtre.
  // Estas rutas se ejecutan solo en el servidor, donde sí podemos usar la service_role,
  // que ignora el RLS. Si todavía no la has configurado, se sigue usando la anon.
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[CRM] Falta SUPABASE_SERVICE_ROLE_KEY. Se usa la clave anon: funcionará solo si las tablas crm_* no tienen RLS activado.')
  }
  // Siempre datos al día: nunca la caché de datos de Next.js
  return createClient(process.env.SUPABASE_URL, clave, { global: { fetch: fetchSinCache } })
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

// Acepta importes en formato español y en el que devuelve la base de datos:
//   1.500,50 → 1500.5 · 1.500 → 1500 · 1500.5 → 1500.5 · 12,5 → 12.5 · 500 (número) → 500
// (Antes, 1500.5 se convertía en 15005 al quitar el punto.)
export function numero(v) {
  if (typeof v === 'number') return isFinite(v) ? v : 0
  let s = String(v ?? '').trim().replace(/[€\s]/g, '')
  if (!s) return 0
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  else if ((s.match(/\./g) || []).length > 1 || /^-?\d{1,3}\.\d{3}$/.test(s)) s = s.replace(/\./g, '')
  const n = parseFloat(s)
  return isNaN(n) ? 0 : n
}

// Igual que numero(), pero devuelve null si el campo está vacío (columnas opcionales)
export function numeroONulo(v) {
  if (v === null || v === undefined || String(v).trim() === '') return null
  return numero(v)
}
