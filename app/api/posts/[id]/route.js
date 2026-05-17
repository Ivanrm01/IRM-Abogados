import { NextResponse } from 'next/server'
import { getPosts, savePosts } from '@/lib/posts'

export async function GET(req, { params }) {
  const posts = getPosts()
  const post = posts.find(p => p.id === params.id || p.slug === params.id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req, { params }) {
  const auth = req.headers.get('x-admin-key')
  if (auth !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const posts = getPosts()
  const idx = posts.findIndex(p => p.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  
  posts[idx] = {
    ...posts[idx],
    ...body,
    seo: { ...posts[idx].seo, ...(body.seo || {}) }
  }
  savePosts(posts)
  return NextResponse.json(posts[idx])
}

export async function DELETE(req, { params }) {
  const auth = req.headers.get('x-admin-key')
  if (auth !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let posts = getPosts()
  const exists = posts.find(p => p.id === params.id)
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  posts = posts.filter(p => p.id !== params.id)
  savePosts(posts)
  return NextResponse.json({ ok: true })
}
