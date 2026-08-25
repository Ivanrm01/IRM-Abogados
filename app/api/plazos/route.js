import { NextResponse } from 'next/server'
import { noAutorizado } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

function sb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
}

export const dynamic = 'force-dynamic'

// Listar todos los vencimientos, ordenados por fecha
export async function GET(req) {
  const no = noAutorizado(req); if (no) return no

  const { data, error } = await sb().from('plazos').select('*').order('vencimiento', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

// Crear un vencimiento
export async function POST(req) {
  const no = noAutorizado(req); if (no) return no

  const body = await req.json()
  if (!body.asunto?.trim()) return NextResponse.json({ error: 'Asunto obligatorio' }, { status: 400 })
  if (!body.vencimiento) return NextResponse.json({ error: 'Fecha de vencimiento obligatoria' }, { status: 400 })

  const registro = {
    id: uuidv4(),
    asunto: body.asunto,
    cliente: body.cliente || '',
    tipo_id: body.tipoId || 'otros',
    tipo_label: body.tipoLabel || 'Otros',
    via: body.via || 'otros',
    referencia: body.ref || '',
    notificacion: body.fechaNotif || null,
    venc_calc: body.vencCalc || body.vencimiento,
    vencimiento: body.vencimiento,
  }

  const { data, error } = await sb().from('plazos').insert(registro).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// Actualizar la fecha definitiva de un vencimiento
export async function PATCH(req) {
  const no = noAutorizado(req); if (no) return no

  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

  const { data, error } = await sb().from('plazos').update({ vencimiento: body.vencimiento }).eq('id', body.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// Eliminar un vencimiento (tarea completada)
export async function DELETE(req) {
  const no = noAutorizado(req); if (no) return no

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

  const { error } = await sb().from('plazos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
