import Link from 'next/link'
import Image from 'next/image'
import { getPosts, getPost, readingTime } from '@/lib/posts'
import { notFound } from 'next/navigation'
import styles from './post.module.css'

export async function generateStaticParams() {
  const posts = getPosts()
  return posts.filter(p => p.published).map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords,
    alternates: post.seo?.canonical ? { canonical: post.seo.canonical } : {},
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.seo?.ogImage || post.image
        ? [{ url: post.seo?.ogImage || post.image, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.seo?.ogImage || post.image ? [post.seo?.ogImage || post.image] : [],
    }
  }
}

export default function PostPage({ params }) {
  const post = getPost(params.slug)
  if (!post || !post.published) notFound()

  const all = getPosts().filter(p => p.published && p.slug !== params.slug).slice(0, 3)
  const mins = readingTime(post.content)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.seo?.metaDescription || post.excerpt,
            author: { '@type': 'Organization', name: post.author },
            publisher: {
              '@type': 'Organization',
              name: 'IRM Tax & Legal',
              url: 'https://www.irmabogadosasesores.com'
            },
            datePublished: post.date,
            image: post.image ? [post.image] : [],
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.irmabogadosasesores.com/blog/${post.slug}`
            }
          })
        }}
      />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.breadcrumb}>
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/blog">Blog</Link>
          <span>/</span>
          <span className={styles.bcCur}>{post.category}</span>
        </div>
        <div className={styles.postTag}>{post.category}</div>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <div className={styles.postMeta}>
          <span>Por {post.author}</span>
          <span>·</span>
          <span>{new Date(post.date).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })}</span>
          <span>·</span>
          <span>{mins} min de lectura</span>
        </div>
      </section>

      {/* FEATURED IMAGE */}
      {post.image && (
        <div className={styles.featuredImg}>
          <img src={post.image} alt={post.title} className={styles.featuredImgEl} />
        </div>
      )}

      {/* CONTENT */}
      <section className={styles.contentSection}>
        <div className={styles.contentWrapper}>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.inlineCta}>
            <div className={styles.inlineCtaTitle}>¿Necesitas asesoramiento sobre este tema?</div>
            <p>En IRM Tax &amp; Legal somos especialistas. Primera consulta gratuita y sin compromiso.</p>
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

      {/* RELATED */}
      {all.length > 0 && (
        <section className={styles.related}>
          <div className="eyebrow">Más artículos</div>
          <h2 className={styles.relTitle}>También te puede <em>interesar</em></h2>
          <div className={styles.relGrid}>
            {all.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} className={styles.relCard}>
                {p.image && (
                  <div className={styles.relImg}>
                    <img src={p.image} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                )}
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
