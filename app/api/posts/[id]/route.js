import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateSlug } from '@/lib/posts'

function sb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
}

export async function GET(req, { params }) {
  const { data } = await sb().from('posts').select('*').eq('id', params.id).single()
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req, { params }) {
  const auth = req.headers.get('x-admin-key')
  if (auth !== process.env.ADMIN_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Merge SEO fields carefully
  const { data: current } = await sb().from('posts').select('seo').eq('id', params.id).single()
  const mergedSeo = { ...(current?.seo || {}), ...(body.seo || {}) }

  const { data, error } = await sb()
    .from('posts')
    .update({ ...body, seo: mergedSeo })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req, { params }) {
  const auth = req.headers.get('x-admin-key')
  if (auth !== process.env.ADMIN_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await sb().from('posts').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
