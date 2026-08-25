import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { sb, noAutorizado, error, limpiar } from '@/lib/crm'

export const dynamic = 'force-dynamic'

const CAMPOS = ['expediente_id', 'cliente_id', 'tipo', 'fecha', 'titulo', 'detalle']

export async function GET(req) {
  const no = noAutorizado(req); if (no) return no
  const { searchParams } = new URL(req.url)
  const expediente = searchParams.get('expediente')
  const limite = parseInt(searchParams.get('limite') || '300', 10)

  let q = sb().from('crm_actuaciones').select('*')
    .order('fecha', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limite)
  if (expediente) q = q.eq('expediente_id', expediente)

  const { data, error: e } = await q
  if (e) return error(e.message)
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const no = noAutorizado(req); if (no) return no
  const body = await req.json()
  if (!body.titulo?.trim()) return error('Describe la actuación', 400)
  if (!body.expediente_id) return error('Falta el expediente', 400)

  const registro = {
    id: uuidv4(),
    ...limpiar(body, CAMPOS),
    titulo: body.titulo.trim(),
    fecha: body.fecha || new Date().toISOString().split('T')[0],
  }
  const { data, error: e } = await sb().from('crm_actuaciones').insert(registro).select().single()
  if (e) return error(e.message)
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req) {
  const no = noAutorizado(req); if (no) return no
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return error('Falta el identificador de la actuación', 400)

  const { error: e } = await sb().from('crm_actuaciones').delete().eq('id', id)
  if (e) return error(e.message)
  return NextResponse.json({ ok: true })
}
