import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )
}

// Igual que en middleware.js: la web quita tildes y eñes de las direcciones.
// Algunos artículos antiguos tienen el slug guardado con tildes o ñ
// (p. ej. "...-del-niño"); sin esto, esos artículos darían error 404.
function quitarTildes(str) {
  return String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export async function getPosts() {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('posts')
    .select('*')
    .order('date', { ascending: false })
  if (error) { console.error(error); return [] }
  // Los enlaces del blog, el sitemap y los relacionados usan siempre el slug sin tildes
  return (data || []).map((p) => ({ ...p, slug: quitarTildes(p.slug) }))
}

export async function getPost(slug) {
  const sb = getSupabase()
  const { data } = await sb.from('posts').select('*').eq('slug', slug).single()
  if (data) return data

  // No hay coincidencia exacta: buscamos comparando sin tildes ni eñes
  const limpio = quitarTildes(slug)
  const todos = await getPosts()
  return todos.find((p) => p.slug === limpio) || null
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
