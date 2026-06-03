import Link from 'next/link'
import { getPosts, readingTime } from '@/lib/posts'
import styles from './blog.module.css'

export const metadata = {
  title: 'Actualidad Tributaria | IRM Abogados',
  description: 'Artículos de actualidad fiscal redactados por los especialistas de IRM Abogados.',
}

export const revalidate = 60

export default async function BlogPage() {
  const all = await getPosts()
  const POSTS_PER_PAGE = 9
  const page = 1
  const posts = all.filter(p => p.published).slice(0, POSTS_PER_PAGE)
  const total = all.filter(p => p.published).length
  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))]

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className="eyebrow">Actualidad fiscal</div>
        <h1>El Blog de <em>IRM Abogados</em></h1>
        <p className={styles.heroDesc}>Artículos de actualidad fiscal redactados por los especialistas de IRM Abogados.</p>
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
          {Array.from({length: totalPages}, (_, i) => (
            
              key={i}
              href={i === 0 ? '/blog' : `/blog?page=${i + 1}`}
              style={{
                padding:'8px 16px',
                border:'1px solid',
                borderColor: i === 0 ? '#B8975A' : '#e5e7eb',
                background: i === 0 ? '#B8975A' : 'transparent',
                color: i === 0 ? '#0D1B2A' : '#4A5568',
                fontSize:'13px',
                textDecoration:'none',
                fontFamily:'Outfit,sans-serif'
              }}
            >
              {i + 1}
            </a>
          ))}
        </div>
      )}
    </>
  )}
</section>
