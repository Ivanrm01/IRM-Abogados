import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )
}

export async function getPosts() {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('posts')
    .select('*')
    .order('date', { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

export async function getPost(slug) {
  const sb = getSupabase()
  const { data } = await sb.from('posts').select('*').eq('slug', slug).single()
  return data || null
}

export function generateSlug(title) {
  return title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-')
}

export function readingTime(content) {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
