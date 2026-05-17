import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json')

export function getPosts() {
  try {
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
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2))
}
