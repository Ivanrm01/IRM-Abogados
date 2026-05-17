import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json')

export function getPosts() {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const posts = JSON.parse(raw)
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch {
    return []
  }
}

export function getPost(slug) {
  const posts = getPosts()
  return posts.find(p => p.slug === slug) || null
}

export function savePosts(posts) {
  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2))
  } catch (e) {
    console.error('Error saving posts:', e)
    throw e
  }
}

// Generate slug from title
export function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Calculate reading time
export function readingTime(content) {
  const text = content.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).length
  return Math.ceil(words / 200)
}
