import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { sb, noAutorizado, error, limpiar } from '@/lib/crm'

export const dynamic = 'force-dynamic'

const CAMPOS = [
  'nombre', 'tipo', 'nif', 'email', 'telefono', 'direccion', 'ciudad',
  'origen', 'estado', 'responsable', 'contacto', 'notas',
]

export async function GET(req) {
  const no = noAutorizado(req); if (no) return no
  const { data, error: e } = await sb()
    .from('crm_clientes').select('*').order('nombre', { ascending: true })
  if (e) return error(e.message)
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const no = noAutorizado(req); if (no) return no
  const body = await req.json()
  if (!body.nombre?.trim()) return error('El nombre del cliente es obligatorio', 400)

  const registro = {
    id: uuidv4(),
    ...limpiar(body, CAMPOS),
    nombre: body.nombre.trim(),
  }
  const { data, error: e } = await sb().from('crm_clientes').insert(registro).select().single()
  if (e) return error(e.message)
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(req) {
  const no = noAutorizado(req); if (no) return no
  const body = await req.json()
  if (!body.id) return error('Falta el identificador del cliente', 400)

  const cambios = limpiar(body, CAMPOS)
  const { data, error: e } = await sb()
    .from('crm_clientes').update(cambios).eq('id', body.id).select().single()
  if (e) return error(e.message)

  // Mantiene el nombre sincronizado en los expedientes del cliente
  if (cambios.nombre) {
    await sb().from('crm_expedientes')
      .update({ cliente_nombre: cambios.nombre }).eq('cliente_id', body.id)
  }
  return NextResponse.json(data)
}

export async function DELETE(req) {
  const no = noAutorizado(req); if (no) return no
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return error('Falta el identificador del cliente', 400)

  const { count } = await sb()
    .from('crm_expedientes').select('id', { count: 'exact', head: true }).eq('cliente_id', id)
  if (count > 0) {
    return error(`El cliente tiene ${count} expediente(s). Elimínalos o reasígnalos antes de borrar la ficha.`, 409)
  }

  const { error: e } = await sb().from('crm_clientes').delete().eq('id', id)
  if (e) return error(e.message)
  return NextResponse.json({ ok: true })
}
