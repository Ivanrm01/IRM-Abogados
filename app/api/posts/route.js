import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateSlug } from '@/lib/posts'
import { v4 as uuidv4 } from 'uuid'

function sb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
}

export async function GET() {
  const { data, error } = await sb().from('posts').select('*').order('date', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const auth = req.headers.get('x-admin-key')
  if (auth !== process.env.ADMIN_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.title?.trim()) return NextResponse.json({ error: 'Título obligatorio' }, { status: 400 })

  // Slug: use provided or generate from title
  let slug = generateSlug(body.slug?.trim() || body.title)

  // Check uniqueness
  const { data: existing } = await sb().from('posts').select('id').eq('slug', slug).single()
  if (existing) slug = `${slug}-${Date.now()}`

  const post = {
    id: uuidv4(),
    slug,
    title: body.title,
    excerpt: body.excerpt || '',
    content: body.content || '',
    category: body.category || 'General',
    author: body.author || 'IRM Tax & Legal',
    date: body.date || new Date().toISOString().split('T')[0],
    published: body.published ?? false,
    image: body.image || '',
    seo: {
      metaTitle: body.seo?.metaTitle || body.title || '',
      metaDescription: body.seo?.metaDescription || body.excerpt || '',
      keywords: body.seo?.keywords || '',
      canonical: body.seo?.canonical || '',
      ogImage: body.seo?.ogImage || body.image || '',
      robots: body.seo?.robots || 'index, follow',
      schema: body.seo?.schema || '',
    }
  }

  const { data, error } = await sb().from('posts').insert(post).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
