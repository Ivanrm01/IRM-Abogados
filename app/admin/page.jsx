'use client'
import { useState, useEffect } from 'react'
import styles from './admin.module.css'

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'irm-admin-2025'

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '',
  category: 'Fiscal', author: 'IRM Tax & Legal',
  date: new Date().toISOString().split('T')[0], published: true, image: ''
}

const CATEGORIES = ['Fiscal', 'IRPF · 2025', 'Impuesto Sociedades', 'IVA', 'Garantías tributarias', 'Start-Ups', 'Comunidad Valenciana · 2025', 'General']

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [pw, setPw] = useState('')
  const [posts, setPosts] = useState([])
  const [view, setView] = useState('list') // list | edit | new
  const [current, setCurrent] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const login = () => {
    if (pw === ADMIN_KEY) { setAuth(true); loadPosts() }
    else setMsg('Contraseña incorrecta')
  }

  const loadPosts = async () => {
    setLoading(true)
    const r = await fetch('/api/posts')
    const data = await r.json()
    setPosts(data)
    setLoading(false)
  }

  const save = async () => {
    setLoading(true)
    setMsg('')
    const method = current.id ? 'PUT' : 'POST'
    const url = current.id ? `/api/posts/${current.id}` : '/api/posts'
    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
      body: JSON.stringify(current)
    })
    if (r.ok) {
      setMsg('✓ Guardado correctamente')
      await loadPosts()
      setView('list')
    } else {
      setMsg('✗ Error al guardar')
    }
    setLoading(false)
  }

  const del = async (id) => {
    if (!confirm('¿Eliminar este artículo?')) return
    const r = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': ADMIN_KEY }
    })
    if (r.ok) { setMsg('Artículo eliminado'); loadPosts() }
  }

  const autoSlug = (title) => title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  if (!auth) return (
    <div className={styles.loginWrap}>
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>IRM Tax & Legal</div>
        <div className={styles.loginTitle}>Panel de administración</div>
        <p className={styles.loginDesc}>Acceso restringido al equipo de IRM</p>
        <input
          type="password" placeholder="Contraseña"
          value={pw} onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          className={styles.loginInput}
        />
        <button onClick={login} className={styles.loginBtn}>Entrar</button>
        {msg && <div className={styles.loginError}>{msg}</div>}
      </div>
    </div>
  )

  return (
    <div className={styles.admin}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>IRM Admin</div>
        <nav className={styles.sideNav}>
          <button onClick={() => { setView('list'); loadPosts() }} className={view === 'list' ? styles.navActive : ''}>📄 Artículos</button>
          <button onClick={() => { setCurrent(EMPTY); setView('new') }} className={view === 'new' ? styles.navActive : ''}>✏️ Nuevo artículo</button>
          <a href="/" target="_blank" className={styles.navLink}>🌐 Ver web</a>
          <a href="/blog" target="_blank" className={styles.navLink}>📰 Ver blog</a>
        </nav>
        <button onClick={() => setAuth(false)} className={styles.logoutBtn}>Cerrar sesión</button>
      </aside>

      {/* MAIN */}
      <div className={styles.main}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            {view === 'list' ? 'Artículos del blog' : view === 'new' ? 'Nuevo artículo' : 'Editar artículo'}
          </div>
          {view === 'list' && (
            <button onClick={() => { setCurrent(EMPTY); setView('new') }} className={styles.headerBtn}>+ Nuevo artículo</button>
          )}
          {msg && <div className={styles.msg}>{msg}</div>}
        </div>

        {/* LIST */}
        {view === 'list' && (
          <div className={styles.postList}>
            {loading && <div className={styles.loading}>Cargando...</div>}
            {posts.map(p => (
              <div key={p.id} className={styles.postRow}>
                <div className={styles.postRowInfo}>
                  <div className={styles.postRowStatus} style={{background: p.published ? 'var(--green)' : '#888'}}></div>
                  <div>
                    <div className={styles.postRowTitle}>{p.title}</div>
                    <div className={styles.postRowMeta}>{p.category} · {new Date(p.date).toLocaleDateString('es-ES')} · {p.published ? 'Publicado' : 'Borrador'}</div>
                  </div>
                </div>
                <div className={styles.postRowActions}>
                  <a href={`/blog/${p.slug}`} target="_blank" className={styles.actionBtn}>Ver</a>
                  <button onClick={() => { setCurrent(p); setView('edit') }} className={styles.actionBtn}>Editar</button>
                  <button onClick={() => del(p.id)} className={`${styles.actionBtn} ${styles.actionDelete}`}>Eliminar</button>
                </div>
              </div>
            ))}
            {!loading && posts.length === 0 && <div className={styles.empty}>No hay artículos todavía.</div>}
          </div>
        )}

        {/* FORM */}
        {(view === 'new' || view === 'edit') && (
          <div className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Título *</label>
                <input
                  value={current.title}
                  onChange={e => setCurrent({...current, title: e.target.value, slug: autoSlug(e.target.value)})}
                  placeholder="Título del artículo"
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Slug (URL)</label>
                <input
                  value={current.slug}
                  onChange={e => setCurrent({...current, slug: e.target.value})}
                  placeholder="url-del-articulo"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Categoría</label>
                <select value={current.category} onChange={e => setCurrent({...current, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Autor</label>
                <input value={current.author} onChange={e => setCurrent({...current, author: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Fecha</label>
                <input type="date" value={current.date} onChange={e => setCurrent({...current, date: e.target.value})} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Resumen (excerpt)</label>
              <textarea rows={3} value={current.excerpt} onChange={e => setCurrent({...current, excerpt: e.target.value})} placeholder="Breve descripción del artículo..." />
            </div>
            <div className={styles.formGroup}>
              <label>Contenido (HTML)</label>
              <textarea
                rows={20}
                value={current.content}
                onChange={e => setCurrent({...current, content: e.target.value})}
                placeholder="<p>Contenido del artículo en HTML...</p>"
                className={styles.contentArea}
              />
              <div className={styles.htmlHint}>
                Usa etiquetas HTML: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, &lt;em&gt;
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>URL de imagen (opcional)</label>
                <input value={current.image} onChange={e => setCurrent({...current, image: e.target.value})} placeholder="https://..." />
              </div>
              <div className={styles.formGroupCheck}>
                <label className={styles.checkLabel}>
                  <input type="checkbox" checked={current.published} onChange={e => setCurrent({...current, published: e.target.checked})} />
                  Publicado
                </label>
              </div>
            </div>
            <div className={styles.formActions}>
              <button onClick={() => setView('list')} className={styles.cancelBtn}>Cancelar</button>
              <button onClick={save} className={styles.saveBtn} disabled={loading}>
                {loading ? 'Guardando...' : '✓ Guardar artículo'}
              </button>
            </div>
            {/* PREVIEW */}
            {current.content && (
              <div className={styles.preview}>
                <div className={styles.previewTitle}>Vista previa</div>
                <div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: current.content }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
