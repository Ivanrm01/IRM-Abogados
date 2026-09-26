import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { sb, noAutorizado, error, limpiar, numero, numeroONulo } from '@/lib/crm'

export const dynamic = 'force-dynamic'

const CAMPOS = [
  'expediente_id', 'cliente_id', 'cliente_nombre', 'concepto', 'tipo', 'base_desc',
  'condicion', 'estado', 'fecha_devengo', 'factura', 'fecha_factura', 'fecha_cobro', 'notas',
]
const FECHAS = ['fecha_devengo', 'fecha_factura', 'fecha_cobro']
const ESTADOS = ['previsto', 'devengado', 'facturado', 'cobrado', 'anulado']
const hoy = () => new Date().toISOString().split('T')[0]

function preparar(body) {
  const r = limpiar(body, CAMPOS)
  for (const f of FECHAS) if (r[f] === '') r[f] = null
  if (r.expediente_id === '') r.expediente_id = null
  if (r.cliente_id === '') r.cliente_id = null
  if (r.tipo && !['fijo', 'variable'].includes(r.tipo)) r.tipo = 'fijo'
  if (r.estado && !ESTADOS.includes(r.estado)) r.estado = 'previsto'
  if (body.porcentaje !== undefined) r.porcentaje = numeroONulo(body.porcentaje)
  if (body.base !== undefined) r.base = numeroONulo(body.base)
  if (body.importe !== undefined) r.importe = numero(body.importe)

  // Variable sin importe: se calcula como base × %
  const vacio = body.importe === undefined || body.importe === null || String(body.importe).trim() === ''
  if ((r.tipo === 'variable' || body.tipo === 'variable') && vacio && r.porcentaje != null && r.base != null) {
    r.importe = Math.round(r.base * r.porcentaje) / 100
  }

  // Al cambiar de estado se sella la fecha correspondiente si no viene puesta
  if (r.estado === 'devengado' && !r.fecha_devengo && body.fecha_devengo === undefined) r.fecha_devengo = hoy()
  if (r.estado === 'facturado' && !r.fecha_factura && body.fecha_factura === undefined) r.fecha_factura = hoy()
  if (r.estado === 'cobrado' && !r.fecha_cobro && body.fecha_cobro === undefined) r.fecha_cobro = hoy()
  return r
}

export async function GET(req) {
  const no = await noAutorizado(req); if (no) return no
  const { data, error: e } = await sb()
    .from('crm_honorarios').select('*').order('created_at', { ascending: true })
  if (e) return error(e.message)
  return NextResponse.json(data || [])
}

// Admite un concepto o una lista (al generar desde un expediente o una hoja de encargo)
export async function POST(req) {
  const no = await noAutorizado(req); if (no) return no
  const body = await req.json()
  const lista = Array.isArray(body) ? body : [body]
  if (!lista.length) return error('No hay conceptos que guardar', 400)

  const registros = []
  for (const b of lista) {
    if (!String(b.concepto || '').trim()) return error('Cada honorario necesita un concepto', 400)
    registros.push({
      id: uuidv4(),
      tipo: 'fijo',
      estado: 'previsto',
      ...preparar(b),
      concepto: String(b.concepto).trim(),
    })
  }
  const { data, error: e } = await sb().from('crm_honorarios').insert(registros).select()
  if (e) return error(e.message)
  return NextResponse.json(Array.isArray(body) ? data : data[0], { status: 201 })
}

export async function PATCH(req) {
  const no = await noAutorizado(req); if (no) return no
  const body = await req.json()
  if (!body.id) return error('Falta el identificador del honorario', 400)
  const cambios = preparar(body)
  if (cambios.concepto !== undefined && !String(cambios.concepto).trim()) return error('El concepto no puede quedar vacío', 400)

  const { data, error: e } = await sb()
    .from('crm_honorarios').update(cambios).eq('id', body.id).select().single()
  if (e) return error(e.message)
  return NextResponse.json(data)
}

export async function DELETE(req) {
  const no = await noAutorizado(req); if (no) return no
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return error('Falta el identificador del honorario', 400)
  const { error: e } = await sb().from('crm_honorarios').delete().eq('id', id)
  if (e) return error(e.message)
  return NextResponse.json({ ok: true })
}
