import { NextResponse } from 'next/server'
import { getPosts, savePosts, generateSlug } from '@/lib/posts'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    const posts = getPosts()
    return NextResponse.json(posts)
  } catch (err) {
    return NextResponse.json({ error: 'Error reading posts' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const auth = req.headers.get('x-admin-key')
    if (auth !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    const posts = getPosts()
    const slug = body.slug || generateSlug(body.title)
    
    // Check slug uniqueness
    const existing = posts.find(p => p.slug === slug)
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    const newPost = {
      id: uuidv4(),
      slug: finalSlug,
      title: body.title || 'Sin título',
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
      }
    }
    posts.unshift(newPost)
    savePosts(posts)
    return NextResponse.json(newPost, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
