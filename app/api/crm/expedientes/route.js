import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { sb, noAutorizado, error, limpiar, numero } from '@/lib/crm'

export const dynamic = 'force-dynamic'

const CAMPOS = [
  'cliente_id', 'cliente_nombre', 'referencia', 'titulo', 'materia', 'fase', 'via',
  'organo', 'procedimiento', 'responsable', 'prioridad', 'variable',
  'fecha_alta', 'fecha_cierre', 'notas',
]
const NUMERICOS = ['honorarios', 'provision', 'facturado', 'cuantia']
const FECHAS = ['fecha_alta', 'fecha_cierre']

function preparar(body) {
  const r = limpiar(body, CAMPOS)
  for (const n of NUMERICOS) if (body[n] !== undefined) r[n] = numero(body[n])
  for (const f of FECHAS) if (r[f] === '') r[f] = null
  if (r.cliente_id === '') r.cliente_id = null   // columna uuid: vacío = sin asignar
  return r
}

// Referencia automática: 2026/001, 2026/002...
async function siguienteReferencia() {
  const año = new Date().getFullYear()
  const { data } = await sb()
    .from('crm_expedientes').select('referencia').like('referencia', `${año}/%`)
  const max = (data || []).reduce((m, r) => {
    const n = parseInt(String(r.referencia).split('/')[1], 10)
    return isNaN(n) ? m : Math.max(m, n)
  }, 0)
  return `${año}/${String(max + 1).padStart(3, '0')}`
}

export async function GET(req) {
  const no = noAutorizado(req); if (no) return no
  const { data, error: e } = await sb()
    .from('crm_expedientes').select('*').order('created_at', { ascending: false })
  if (e) return error(e.message)
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const no = noAutorizado(req); if (no) return no
  const body = await req.json()
  if (!body.titulo?.trim()) return error('El asunto del expediente es obligatorio', 400)

  const registro = {
    id: uuidv4(),
    ...preparar(body),
    titulo: body.titulo.trim(),
    referencia: body.referencia?.trim() || await siguienteReferencia(),
    fecha_alta: body.fecha_alta || new Date().toISOString().split('T')[0],
  }
  const { data, error: e } = await sb().from('crm_expedientes').insert(registro).select().single()
  if (e) return error(e.message)
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(req) {
  const no = noAutorizado(req); if (no) return no
  const body = await req.json()
  if (!body.id) return error('Falta el identificador del expediente', 400)

  const cambios = preparar(body)
  // Al cerrar o perder el expediente se sella la fecha si no la han puesto a mano
  if ((cambios.fase === 'cerrado' || cambios.fase === 'perdido') && !cambios.fecha_cierre) {
    cambios.fecha_cierre = new Date().toISOString().split('T')[0]
  }
  if (cambios.fase && cambios.fase !== 'cerrado' && cambios.fase !== 'perdido') {
    cambios.fecha_cierre = null
  }

  const { data, error: e } = await sb()
    .from('crm_expedientes').update(cambios).eq('id', body.id).select().single()
  if (e) return error(e.message)
  return NextResponse.json(data)
}

export async function DELETE(req) {
  const no = noAutorizado(req); if (no) return no
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return error('Falta el identificador del expediente', 400)

  await sb().from('crm_actuaciones').delete().eq('expediente_id', id)
  const { error: e } = await sb().from('crm_expedientes').delete().eq('id', id)
  if (e) return error(e.message)
  return NextResponse.json({ ok: true })
}
