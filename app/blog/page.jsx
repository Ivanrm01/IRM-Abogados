import Link from 'next/link'
import { getPosts } from '@/lib/posts'
import styles from './blog.module.css'

export async function generateMetadata({ searchParams }) {
  const page = Number(searchParams?.page) || 1
  const titulo = page > 1 ? `Blog Fiscal — Página ${page}` : 'Blog Fiscal'
  const descripcion = 'Artículos de actualidad fiscal, tributaria y legal redactados por los especialistas de IRM Abogados.'
  const url = page > 1 ? `/blog?page=${page}` : '/blog'
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      siteName: 'IRM Abogados',
      url,
      title: 'Blog fiscal de IRM Abogados',
      description: descripcion,
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'IRM Abogados' }],
    },
  }
}

export const revalidate = 60

const POSTS_PER_PAGE = 9

export default async function BlogPage({ searchParams }) {
  const all = await getPosts()
  const published = all.filter(p => p.published)
  const currentPage = Number(searchParams?.page) || 1
  const totalPages = Math.ceil(published.length / POSTS_PER_PAGE)
  const posts = published.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className="eyebrow">Actualidad fiscal</div>
        <h1>Blog de <em>IRM Abogados</em></h1>
        <p className={styles.heroDesc}>Artículos, guías y análisis redactados por nuestros especialistas en derecho tributario.</p>
      </section>

      <section className={styles.content}>
        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>Próximamente publicaremos artículos de actualidad fiscal.</p>
            <Link href="/contacto" className="btn-gold">Contactar</Link>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {posts.map(p => (
                <Link key={p.id} href={`/blog/${p.slug}`} className={styles.card}>
                  <div className={styles.cardImg}>
                    {p.image
                      ? <img src={p.image} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      : <div className={styles.cardImgEmpty}></div>
                    }
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardCat}>{p.category}</span>
                      <span className={styles.cardDate}>{new Date(p.date).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})}</span>
                    </div>
                    <h2 className={styles.cardTitle}>{p.title}</h2>
                    <p className={styles.cardExcerpt}>{p.excerpt}</p>
                    <span className={styles.cardMore}>Leer artículo →</span>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'48px',flexWrap:'wrap'}}>
                {Array.from({length: totalPages}, (_, i) => {
                  const pageNum = i + 1
                  const isActive = pageNum === currentPage
                  return (
                    <Link
                      key={pageNum}
                      href={pageNum === 1 ? '/blog' : `/blog?page=${pageNum}`}
                      style={{
                        padding:'8px 16px',
                        border:'1px solid',
                        borderColor: isActive ? '#B8975A' : '#e5e7eb',
                        background: isActive ? '#B8975A' : 'transparent',
                        color: isActive ? '#0D1B2A' : '#4A5568',
                        fontSize:'13px',
                        textDecoration:'none',
                        fontFamily:'Outfit,sans-serif'
                      }}
                    >
                      {pageNum}
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
