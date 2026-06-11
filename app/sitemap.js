import { getPosts } from '@/lib/posts'

const BASE = 'https://www.irmabogadosasesores.com'

export const revalidate = 3600

export default async function sitemap() {
  // Páginas estáticas principales
  const rutas = [
    '',
    '/sobre-nosotros',
    '/servicios',
    '/fiscal',
    '/asesoramiento-start-ups',
    '/garantias-deuda-aeat',
    '/derivaciones-responsabilidad-tributaria',
    '/contacto',
    '/blog',
    '/aviso-legal',
    '/politica-de-privacidad',
    '/politica-de-cookies',
  ]

  const paginas = rutas.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: new Date(),
    changeFrequency: r === '' || r === '/blog' ? 'weekly' : 'monthly',
    priority: r === '' ? 1 : r === '/blog' ? 0.8 : 0.7,
  }))

  // Artículos del blog publicados, desde Supabase
  let articulos = []
  try {
    const posts = await getPosts()
    articulos = (posts || [])
      .filter((p) => p.published)
      .map((p) => ({
        url: `${BASE}/blog/${p.slug}`,
        lastModified: p.date ? new Date(p.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }))
  } catch (e) {
    articulos = []
  }

  return [...paginas, ...articulos]
}
