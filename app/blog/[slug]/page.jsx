import Link from 'next/link'
import { getPosts, getPost } from '@/lib/posts'
import { notFound } from 'next/navigation'
import styles from './post.module.css'

export async function generateStaticParams() {
  const posts = getPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default function PostPage({ params }) {
  const post = getPost(params.slug)
  if (!post || !post.published) notFound()

  const all = getPosts().filter(p => p.published && p.slug !== params.slug).slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.breadcrumb}>
          <Link href="/">Inicio</Link> <span>/</span>
          <Link href="/blog">Blog</Link> <span>/</span>
          <span className={styles.bcCurrent}>{post.title.substring(0, 40)}...</span>
        </div>
        <div className={styles.postTag}>{post.category}</div>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <div className={styles.postMeta}>
          <span>{post.author}</span>
          <span>·</span>
          <span>{new Date(post.date).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })}</span>
        </div>
      </section>

      {/* CONTENT */}
      <section className={styles.contentSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* CTA INLINE */}
          <div className={styles.inlineCta}>
            <div className={styles.inlineCtaTitle}>¿Necesitas asesoramiento sobre este tema?</div>
            <p>En IRM Tax &amp; Legal somos especialistas. Primera consulta gratuita y sin compromiso.</p>
            <Link href="/contacto" className="btn-gold">Consultar ahora</Link>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>Consulta gratuita</div>
            <p>¿Tienes dudas sobre este tema? Contáctanos y analizamos tu caso sin coste.</p>
            <Link href="/contacto" className="btn-gold" style={{display:'block',textAlign:'center',marginTop:'16px'}}>Contactar</Link>
          </div>
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>Nuestros servicios</div>
            <ul className={styles.sideLinks}>
              <li><Link href="/fiscal">Asesoramiento Fiscal →</Link></li>
              <li><Link href="/garantias-deuda-aeat">Garantías AEAT →</Link></li>
              <li><Link href="/asesoramiento-start-ups">Start-Ups →</Link></li>
            </ul>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {all.length > 0 && (
        <section className={styles.related}>
          <div className="eyebrow">Más artículos</div>
          <h2>También te puede <em>interesar</em></h2>
          <div className={styles.relatedGrid}>
            {all.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} className={styles.relCard}>
                <div className={styles.relTag}>{p.category}</div>
                <h3 className={styles.relTitle}>{p.title}</h3>
                <span className={styles.relMore}>Leer →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
