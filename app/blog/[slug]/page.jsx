import Link from 'next/link'
import { getPosts, getPost, readingTime } from '@/lib/posts'
import { notFound } from 'next/navigation'
import styles from './post.module.css'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.filter(p => p.published).map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug)
  if (!post) return {}
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords,
    robots: post.seo?.robots || 'index, follow',
    alternates: { canonical: post.seo?.canonical || `/blog/${post.slug}` },
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [{ url: post.image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.image ? [post.image] : [],
    }
  }
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug)
  if (!post || !post.published) notFound()

  const all = await getPosts()
  const related = all.filter(p => p.published && p.slug !== params.slug).slice(0, 3)
  const mins = readingTime(post.content)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo?.metaDescription || post.excerpt,
    author: { '@type': 'Organization', name: 'IRM Abogados' },
    publisher: { '@type': 'Organization', name: 'IRM Abogados', url: 'https://www.irmabogadosasesores.com' },
    datePublished: post.date,
    image: post.image ? [post.image] : [],
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.irmabogadosasesores.com/blog/${post.slug}` }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.breadcrumb}>
          <Link href="/">Inicio</Link><span>/</span>
          <Link href="/blog">Blog</Link><span>/</span>
          <span>{post.category}</span>
        </div>
        <div className={styles.postTag}>{post.category}</div>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <div className={styles.postMeta}>
          <span>Por {post.author}</span><span>·</span>
          <span>{new Date(post.date).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})}</span>
          <span>·</span><span>{mins} min de lectura</span>
        </div>
      </section>

      {post.image && (
        <div className={styles.featuredImg}>
          <img src={post.image} alt={post.title} className={styles.featuredImgEl}/>
        </div>
      )}

      <section className={styles.contentSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }}/>
          <div className={styles.inlineCta}>
            <div className={styles.inlineCtaTitle}>¿Necesitas asesoramiento sobre este tema?</div>
            <p>En IRM Abogados somos especialistas. Primera consulta gratuita y sin compromiso.</p>
            <Link href="/contacto" className="btn-gold">Consultar ahora</Link>
          </div>
        </div>
        <div className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>Consulta gratuita</div>
            <p>¿Tienes dudas sobre este tema? Analizamos tu caso sin coste.</p>
            <Link href="/contacto" className="btn-gold" style={{display:'block',textAlign:'center',marginTop:'14px',fontSize:'11px'}}>Contactar ahora</Link>
          </div>
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>Nuestros servicios</div>
            <ul className={styles.sideLinks}>
              <li><Link href="/fiscal">Asesoramiento Fiscal →</Link></li>
              <li><Link href="/garantias-deuda-aeat">Garantías AEAT →</Link></li>
              <li><Link href="/asesoramiento-start-ups">Start-Ups →</Link></li>
            </ul>
          </div>
          {post.seo?.keywords && (
            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Etiquetas</div>
              <div className={styles.tagCloud}>
                {post.seo.keywords.split(',').map(k => (
                  <span key={k} className={styles.tag}>{k.trim()}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className={styles.related}>
          <div className="eyebrow">Más artículos</div>
          <h2 className={styles.relTitle}>También te puede <em>interesar</em></h2>
          <div className={styles.relGrid}>
            {related.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} className={styles.relCard}>
                {p.image && <div className={styles.relImg}><img src={p.image} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>}
                <div className={styles.relBody}>
                  <div className={styles.relTag}>{p.category}</div>
                  <h3 className={styles.relH3}>{p.title}</h3>
                  <span className={styles.relMore}>Leer artículo →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
