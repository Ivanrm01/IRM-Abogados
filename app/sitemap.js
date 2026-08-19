import { getPosts } from '@/lib/posts'

const BASE = 'https://www.irmabogadosasesores.com'

const FECHAS = {
  '': '2026-08-09',
  '/sobre-nosotros': '2026-08-09',
  '/servicios': '2026-08-09',
  '/fiscal': '2026-08-09',
  '/asesoramiento-start-ups': '2026-08-09',
  '/garantias-deuda-aeat': '2026-08-09',
  '/derivaciones-responsabilidad-tributaria': '2026-08-09',
  '/diagnostico-fiscal': '2026-08-19',
  '/contacto': '2026-08-09',
  '/blog': '2026-08-09',
  '/aviso-legal': '2026-08-09',
  '/politica-de-privacidad': '2026-08-09',
  '/politica-de-cookies': '2026-08-09',
}

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
    '/diagnostico-fiscal',
    '/contacto',
    '/blog',
    '/aviso-legal',
    '/politica-de-privacidad',
    '/politica-de-cookies',
  ]

  const paginas = rutas.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: new Date(FECHAS[r] || '2026-08-09'),
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
        lastModified: new Date(p.updated_at || p.date || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.6,
      }))
  } catch (e) {
    articulos = []
  }

  return [...paginas, ...articulos]
}

