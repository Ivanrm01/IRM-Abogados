import Link from 'next/link'
import { getPosts } from '@/lib/posts'
import styles from './blog.module.css'

export const metadata = {
  title: 'Blog Fiscal',
  description: 'Noticias, análisis y guías sobre derecho fiscal y tributario en España. Actualización constante por nuestro equipo de especialistas.',
}

export default function BlogPage() {
  const posts = getPosts().filter(p => p.published)

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.breadcrumb}>Inicio <span>/ Blog fiscal</span></div>
        <div className="eyebrow">Blog</div>
        <h1>Noticias y análisis<br /><em>fiscales</em></h1>
        <p className={styles.heroDesc}>Contenido de valor sobre derecho tributario, novedades legislativas y guías prácticas. Actualizado por nuestro equipo de especialistas.</p>
      </section>

      {/* POSTS */}
      <section className={`section ${styles.postsSection}`}>
        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>Próximamente publicaremos contenido. <Link href="/contacto">Contáctanos</Link> para cualquier consulta.</p>
          </div>
        ) : (
          <>
            {/* FEATURED */}
            {posts[0] && (
              <Link href={`/blog/${posts[0].slug}`} className={styles.featured}>
                <div className={styles.featuredImg}>
                  <span className={styles.imgPlaceholder}>Imagen destacada</span>
                </div>
                <div className={styles.featuredBody}>
                  <div className={styles.postTag}>{posts[0].category}</div>
                  <h2 className={styles.featuredTitle}>{posts[0].title}</h2>
                  <p className={styles.postExcerpt}>{posts[0].excerpt}</p>
                  <div className={styles.postMeta}>
                    <span>{posts[0].author}</span>
                    <span>·</span>
                    <span>{new Date(posts[0].date).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })}</span>
                  </div>
                  <span className={styles.postMore}>Leer artículo →</span>
                </div>
              </Link>
            )}

            {/* GRID */}
            {posts.length > 1 && (
              <div className={styles.grid}>
                {posts.slice(1).map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className={styles.card}>
                    <div className={styles.cardImg}>
                      <span className={styles.imgPlaceholder}>Imagen</span>
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.postTag}>{post.category}</div>
                      <h3 className={styles.cardTitle}>{post.title}</h3>
                      <p className={styles.postExcerpt}>{post.excerpt}</p>
                      <div className={styles.postMeta}>
                        <span>{new Date(post.date).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })}</span>
                      </div>
                      <span className={styles.postMore}>Leer más →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaTitle}>¿Tienes una consulta fiscal?</div>
        <p className={styles.ctaDesc}>Primera consulta gratuita y sin compromiso</p>
        <Link href="/contacto" className="btn-navy">Contactar ahora</Link>
      </section>
    </>
  )
}
