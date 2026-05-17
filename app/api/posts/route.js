import { NextResponse } from 'next/server'
import { getPosts, savePosts } from '@/lib/posts'
import { v4 as uuidv4 } from 'uuid'

// GET /api/posts
export async function GET() {
  try {
    const posts = getPosts()
    return NextResponse.json(posts)
  } catch (err) {
    return NextResponse.json({ error: 'Error reading posts' }, { status: 500 })
  }
}

// POST /api/posts
export async function POST(req) {
  try {
    const auth = req.headers.get('x-admin-key')
    if (auth !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    const posts = getPosts()
    const newPost = {
      id: uuidv4(),
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: body.title,
      excerpt: body.excerpt || '',
      content: body.content || '',
      category: body.category || 'General',
      author: body.author || 'IRM Tax & Legal',
      date: body.date || new Date().toISOString().split('T')[0],
      published: body.published ?? true,
      image: body.image || '',
    }
    posts.unshift(newPost)
    savePosts(posts)
    return NextResponse.json(newPost, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
