'use client'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import styles from './admin.module.css'

const CATEGORIES = ['Fiscal','IRPF','Impuesto Sociedades','IVA','Garantías tributarias','Start-Ups','Planificación fiscal','Fiscalidad internacional','General']
const EMPTY = {
  title:'',slug:'',excerpt:'',content:'',
  category:'Fiscal',author:'IRM Abogados',
  date:new Date().toISOString().split('T')[0],
  published:false,image:'',
  seo:{metaTitle:'',metaDescription:'',keywords:'',canonical:'',ogImage:'',robots:'index, follow'}
}

const RichEditor = dynamic(()=>import('./RichEditor'),{
  ssr:false,
  loading:()=><div style={{minHeight:'400px',display:'flex',alignItems:'center',justifyContent:'center',background:'#f9fafb',border:'1px solid #e5e7eb',color:'#9ca3af',fontSize:'14px'}}>Cargando editor...</div>
})

const HojaEncargo = dynamic(()=>import('./HojaEncargo'),{
  ssr:false,
  loading:()=><div style={{minHeight:'400px',display:'flex',alignItems:'center',justifyContent:'center',color:'#9ca3af',fontSize:'14px'}}>Cargando generador...</div>
})

const Calculadoras = dynamic(()=>import('./Calculadoras'),{
  ssr:false,
  loading:()=><div style={{minHeight:'400px',display:'flex',alignItems:'center',justifyContent:'center',color:'#9ca3af',fontSize:'14px'}}>Cargando calculadoras...</div>
})

const Plazos = dynamic(()=>import('./Plazos'),{
  ssr:false,
  loading:()=><div style={{minHeight:'400px',display:'flex',alignItems:'center',justifyContent:'center',color:'#9ca3af',fontSize:'14px'}}>Cargando plazos...</div>
})

const Usuarios = dynamic(()=>import('./Usuarios'),{
  ssr:false,
  loading:()=><div style={{minHeight:'400px',display:'flex',alignItems:'center',justifyContent:'center',color:'#9ca3af',fontSize:'14px'}}>Cargando cuentas...</div>
})

const CRM = dynamic(()=>import('./CRM'),{
  ssr:false,
  loading:()=><div style={{minHeight:'400px',display:'flex',alignItems:'center',justifyContent:'center',color:'#9ca3af',fontSize:'14px'}}>Cargando el CRM...</div>
})

function slugify(t){
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-')
}
function stripHtml(h){return h.replace(/<[^>]*>/g,'').length}

export default function AdminPage(){
  const [usuario,setUsuario]=useState(null)      // null = sin sesión
  const [comprobando,setComprobando]=useState(true)
  const [acceso,setAcceso]=useState({email:'',password:'',nombre:'',password2:''})
  const [entrando,setEntrando]=useState(false)
  const [altaInicial,setAltaInicial]=useState(false)
  const [faltaTabla,setFaltaTabla]=useState(false)
  const [posts,setPosts]=useState([])
  const [view,setView]=useState('list')
  const [post,setPost]=useState(EMPTY)
  const [tab,setTab]=useState('content')
  const [loading,setLoading]=useState(false)
  const [saving,setSaving]=useState(false)
  const [msg,setMsg]=useState({text:'',type:''})
  const [uploading,setUploading]=useState(false)
  const [search,setSearch]=useState('')
  const [filterCat,setFilterCat]=useState('')
  const [slugManual,setSlugManual]=useState(false)
  const [prefill,setPrefill]=useState(null)   // datos que el CRM pasa a otra herramienta
  const [menuAbierto,setMenuAbierto]=useState(false)  // cajón lateral en móvil
  const featRef=useRef()

  // Salta del CRM a otra herramienta llevándose los datos del expediente
  const irAEncargo=(datos)=>{setPrefill({destino:'encargos',datos});setView('encargos')}
  const irAPlazo=(datos)=>{setPrefill({destino:'plazos',datos});setView('plazos')}

  const flash=(text,type='ok')=>{setMsg({text,type});setTimeout(()=>setMsg({text:'',type:''}),4000)}

  const load=async()=>{
    setLoading(true)
    try{
      const r=await fetch('/api/posts',{credentials:'same-origin',cache:'no-store'})
      if(r.status===401){setUsuario(null);setLoading(false);return}
      const d=await r.json();setPosts(Array.isArray(d)?d:[])
    }
    catch{flash('Error cargando artículos','error')}
    setLoading(false)
  }

  // Al abrir el panel: ¿hay sesión abierta? ¿hace falta crear el primer acceso?
  useEffect(()=>{(async()=>{
    try{
      const r=await fetch('/api/auth/me',{credentials:'same-origin',cache:'no-store'})
      if(r.ok){const d=await r.json();setUsuario(d.usuario);load();setComprobando(false);return}
      const st=await fetch('/api/auth/setup',{cache:'no-store'})
      const d=await st.json().catch(()=>({}))
      if(d.faltaTabla) setFaltaTabla(true)
      else setAltaInicial(!!d.necesario)
    }catch{ /* sin conexión: se queda en la pantalla de acceso */ }
    setComprobando(false)
  })()},[])

  const A=(k,v)=>setAcceso(p=>({...p,[k]:v}))

  const entrar=async()=>{
    setEntrando(true)
    try{
      const r=await fetch('/api/auth/login',{
        method:'POST',credentials:'same-origin',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email:acceso.email,password:acceso.password}),
      })
      const d=await r.json().catch(()=>({}))
      if(r.ok){setUsuario(d.usuario);setAcceso({email:'',password:'',nombre:'',password2:''});load()}
      else flash(d.error||'No se pudo entrar','error')
    }catch{flash('Error de conexión','error')}
    setEntrando(false)
  }

  const crearPrimerAcceso=async()=>{
    if(acceso.password!==acceso.password2){flash('Las contraseñas no coinciden','error');return}
    setEntrando(true)
    try{
      const r=await fetch('/api/auth/setup',{
        method:'POST',credentials:'same-origin',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email:acceso.email,password:acceso.password,nombre:acceso.nombre}),
      })
      const d=await r.json().catch(()=>({}))
      if(r.ok){setUsuario(d.usuario);setAltaInicial(false);setAcceso({email:'',password:'',nombre:'',password2:''});load()}
      else flash(d.error||'No se pudo crear la cuenta','error')
    }catch{flash('Error de conexión','error')}
    setEntrando(false)
  }

  const salir=async()=>{
    try{await fetch('/api/auth/logout',{method:'POST',credentials:'same-origin'})}catch{}
    setUsuario(null);setPosts([]);setView('list')
  }

  const F=(k,v)=>setPost(p=>({...p,[k]:v}))
  const S=(k,v)=>setPost(p=>({...p,seo:{...p.seo,[k]:v}}))

  const onTitle=v=>{
    F('title',v)
    if(!post.id&&!slugManual) F('slug',slugify(v))
    if(!post.seo.metaTitle) S('metaTitle',v)
  }
  const onExcerpt=v=>{
    F('excerpt',v)
    if(!post.seo.metaDescription) S('metaDescription',v)
  }
  const onSlug=v=>{F('slug',slugify(v));setSlugManual(true)}

  const uploadImg=async(file)=>{
    if(!file)return
    setUploading(true)
    const fd=new FormData();fd.append('file',file)
    try{
      const r=await fetch('/api/upload',{method:'POST',credentials:'same-origin',body:fd})
      const d=await r.json()
      if(r.ok){F('image',d.url);S('ogImage',d.url);flash('Imagen subida ✓')}
      else flash(d.error||'Error al subir','error')
    }catch{flash('Error al subir la imagen','error')}
    setUploading(false)
  }

  const save=async()=>{
    if(!post.title.trim()){flash('El título es obligatorio','error');return}
    setSaving(true)
    const method=post.id?'PUT':'POST'
    const url=post.id?`/api/posts/${post.id}`:'/api/posts'
    try{
      const r=await fetch(url,{method,credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(post)})
      if(r.ok){flash(post.id?'Artículo actualizado ✓':'Artículo creado ✓');await load();setView('list')}
      else{const e=await r.json();flash(e.error||'Error al guardar','error')}
    }catch{flash('Error de conexión','error')}
    setSaving(false)
  }

  const del=async(id,title)=>{
    if(!confirm(`¿Eliminar "${title}"?`))return
    const r=await fetch(`/api/posts/${id}`,{method:'DELETE',credentials:'same-origin'})
    if(r.ok){flash('Artículo eliminado');load()}
    else flash('Error al eliminar','error')
  }

  const togglePublish=async(p)=>{
    const r=await fetch(`/api/posts/${p.id}`,{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({published:!p.published})})
    if(r.ok)load()
    else flash('Error al cambiar estado','error')
  }

  const edit=(p)=>{
    setPost({...p,seo:p.seo||{metaTitle:'',metaDescription:'',keywords:'',canonical:'',ogImage:'',robots:'index, follow'}})
    setSlugManual(true)
    setTab('content');setView('edit')
  }
  const newArt=()=>{setPost(EMPTY);setSlugManual(false);setTab('content');setView('edit')}

  const filtered=posts.filter(p=>{
    const ms=!search||p.title.toLowerCase().includes(search.toLowerCase())
    const mc=!filterCat||p.category===filterCat
    return ms&&mc
  })

  const score=()=>{
    let s=0
    if(post.title.length>=30)s++
    if(post.excerpt.length>=80)s++
    if(post.seo.metaTitle.length>=30&&post.seo.metaTitle.length<=60)s++
    if(post.seo.metaDescription.length>=100&&post.seo.metaDescription.length<=160)s++
    if(post.seo.keywords)s++
    if(post.image)s++
    if(stripHtml(post.content)>=300)s++
    return{s,t:7}
  }

  // ---------- PANTALLA DE ACCESO ----------
  if(!usuario)return(
    <div className={styles.loginWrap}>
      <div className={styles.loginBox}>
        <Image src="/logo-irm.png" alt="IRM" width={120} height={70} style={{height:'52px',width:'auto',marginBottom:'28px',objectFit:'contain'}}/>

        {comprobando?(
          <>
            <div className={styles.loginTitle}>Panel de administración</div>
            <p className={styles.loginDesc}>Comprobando la sesión...</p>
          </>
        ):faltaTabla?(
          <>
            <div className={styles.loginTitle}>Falta crear la tabla de accesos</div>
            <p className={styles.loginDesc}>
              Abre Supabase → SQL Editor, ejecuta el archivo <strong>data/auth-schema.sql</strong> del
              proyecto y recarga esta página.
            </p>
            <button onClick={()=>window.location.reload()} className={styles.loginBtn}>Reintentar</button>
          </>
        ):altaInicial?(
          <>
            <div className={styles.loginTitle}>Crea tu acceso</div>
            <p className={styles.loginDesc}>
              Todavía no hay ninguna cuenta. La primera que crees será la tuya, y desde el panel
              podrás dar de alta al resto del equipo.
            </p>
            <input type="text" placeholder="Nombre y apellidos" value={acceso.nombre} onChange={e=>A('nombre',e.target.value)} className={styles.loginInput} autoFocus/>
            <input type="email" placeholder="Email" value={acceso.email} onChange={e=>A('email',e.target.value)} className={styles.loginInput} autoComplete="username"/>
            <input type="password" placeholder="Contraseña" value={acceso.password} onChange={e=>A('password',e.target.value)} className={styles.loginInput} autoComplete="new-password"/>
            <input type="password" placeholder="Repite la contraseña" value={acceso.password2} onChange={e=>A('password2',e.target.value)} onKeyDown={e=>e.key==='Enter'&&crearPrimerAcceso()} className={styles.loginInput} autoComplete="new-password"/>
            <div className={styles.loginHint}>Mínimo 10 caracteres, con letras y números.</div>
            <button onClick={crearPrimerAcceso} disabled={entrando} className={styles.loginBtn}>
              {entrando?'Creando...':'Crear mi acceso'}
            </button>
          </>
        ):(
          <>
            <div className={styles.loginTitle}>Panel de administración</div>
            <p className={styles.loginDesc}>Acceso restringido al equipo de IRM Abogados</p>
            <input type="email" placeholder="Email" value={acceso.email} onChange={e=>A('email',e.target.value)} onKeyDown={e=>e.key==='Enter'&&entrar()} className={styles.loginInput} autoComplete="username" autoFocus/>
            <input type="password" placeholder="Contraseña" value={acceso.password} onChange={e=>A('password',e.target.value)} onKeyDown={e=>e.key==='Enter'&&entrar()} className={styles.loginInput} autoComplete="current-password"/>
            <button onClick={entrar} disabled={entrando} className={styles.loginBtn}>
              {entrando?'Entrando...':'Entrar al panel'}
            </button>
          </>
        )}

        {msg.text&&<div className={styles.loginError}>{msg.text}</div>}
      </div>
    </div>
  )

  return(
    <div className={styles.admin}>
      {menuAbierto&&<div className={styles.backdrop} onClick={()=>setMenuAbierto(false)}/>}
      <aside className={`${styles.sidebar} ${menuAbierto?styles.sidebarOpen:''}`} onClick={()=>setMenuAbierto(false)}>
        <div className={styles.sidebarLogo}>
          <Image src="/logo-irm.png" alt="IRM" width={90} height={52} style={{height:'38px',width:'auto',objectFit:'contain'}}/>
          <button className={styles.sidebarClose} onClick={()=>setMenuAbierto(false)} aria-label="Cerrar menú">×</button>
        </div>
        <div className={styles.sidebarSection}>Despacho</div>
        <nav className={styles.sideNav}>
          <button onClick={()=>{setPrefill(null);setView('crm')}} className={view==='crm'?styles.navActive:''}>
            <span>⚖️</span> CRM legal
          </button>
        </nav>
        <div className={styles.sidebarSection}>Blog</div>
        <nav className={styles.sideNav}>
          <button onClick={()=>{setView('list');load()}} className={view==='list'?styles.navActive:''}>
            <span>📄</span> Artículos
            <span className={styles.badge}>{posts.filter(p=>p.published).length}</span>
          </button>
          <button onClick={newArt} className={view==='edit'&&!post.id?styles.navActive:''}>
            <span>✏️</span> Nuevo artículo
          </button>
        </nav>
        <div className={styles.sidebarSection}>Herramientas</div>
        <nav className={styles.sideNav}>
          <button onClick={()=>setView('encargos')} className={view==='encargos'?styles.navActive:''}>
            <span>📝</span> Hojas de encargo
          </button>
          <button onClick={()=>setView('calculadoras')} className={view==='calculadoras'?styles.navActive:''}>
            <span>🧮</span> Calculadoras
          </button>
          <button onClick={()=>setView('plazos')} className={view==='plazos'?styles.navActive:''}>
            <span>📅</span> Plazos
          </button>
        </nav>
        <div className={styles.sidebarSection}>Web</div>
        <nav className={styles.sideNav}>
          <a href="/" target="_blank"><span>🌐</span> Ver web</a>
          <a href="/blog" target="_blank"><span>📰</span> Ver blog</a>
        </nav>
        <div className={styles.sidebarSection}>Cuenta</div>
        <nav className={styles.sideNav}>
          <button onClick={()=>{setPrefill(null);setView('usuarios')}} className={view==='usuarios'?styles.navActive:''}>
            <span>🔑</span> Accesos
          </button>
        </nav>
        <div className={styles.sesionBox}>
          <div className={styles.sesionNombre}>{usuario?.nombre}</div>
          <div className={styles.sesionEmail}>{usuario?.email}</div>
        </div>
        <button onClick={salir} className={styles.logoutBtn}>← Cerrar sesión</button>
      </aside>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <button className={styles.menuBtn} onClick={()=>setMenuAbierto(true)} aria-label="Abrir menú">☰</button>
          <div className={styles.topbarTitle}>
            {view==='usuarios'?'Accesos al panel':view==='crm'?'CRM legal':view==='list'?'Artículos del blog':view==='encargos'?'Hojas de encargo':view==='calculadoras'?'Calculadoras de garantías':view==='plazos'?'Plazos y vencimientos':post.id?'Editar artículo':'Nuevo artículo'}
          </div>
          <div className={styles.topbarRight}>
            {msg.text&&<div className={`${styles.toast} ${msg.type==='error'?styles.toastErr:styles.toastOk}`}>{msg.text}</div>}
            {view==='list'&&<button onClick={newArt} className={styles.btnPrimary}>+ Nuevo artículo</button>}
            {view==='edit'&&<>
              <span className={post.published?styles.pillPublished:styles.pillDraft}>{post.published?'● Publicado':'○ Borrador'}</span>
              <button onClick={save} disabled={saving} className={styles.btnPrimary}>{saving?'Guardando...':'✓ Guardar'}</button>
            </>}
          </div>
        </div>

        {/* LIST VIEW */}
        {view==='list'&&(
          <div className={styles.listWrap}>
            <div className={styles.listFilters}>
              <input type="text" placeholder="Buscar artículos..." value={search} onChange={e=>setSearch(e.target.value)} className={styles.searchInput}/>
              <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} className={styles.filterSel}>
                <option value="">Todas las categorías</option>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.statsRow}>
              {[['Total',posts.length],['Publicados',posts.filter(p=>p.published).length],['Borradores',posts.filter(p=>!p.published).length],['Con imagen',posts.filter(p=>p.image).length]].map(([l,n])=>(
                <div key={l} className={styles.statCard}><div className={styles.statN}>{n}</div><div className={styles.statL}>{l}</div></div>
              ))}
            </div>
            {loading&&<div className={styles.loadingBox}><div className={styles.spinner}></div> Cargando...</div>}
            {!loading&&filtered.length===0&&(
              <div className={styles.emptyBox}>
                <div className={styles.emptyIcon}>📝</div>
                <div className={styles.emptyTitle}>{search?'Sin resultados':'No hay artículos todavía'}</div>
                <p>{search?'Prueba con otra búsqueda':'Crea tu primer artículo'}</p>
                {!search&&<button onClick={newArt} className={styles.btnPrimary}>+ Crear primer artículo</button>}
              </div>
            )}
            <div className={styles.postList}>
              {filtered.map(p=>(
                <div key={p.id} className={styles.postCard}>
                  <div className={styles.postThumb}>
                    {p.image?<img src={p.image} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div className={styles.thumbEmpty}>📷</div>}
                  </div>
                  <div className={styles.postInfo}>
                    <div className={styles.postMeta2}>
                      <span className={styles.postCat}>{p.category}</span>
                      <span className={styles.postDate}>{new Date(p.date).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})}</span>
                    </div>
                    <div className={styles.postTitle2}>{p.title}</div>
                    <div className={styles.postExcerpt2}>{p.excerpt?.substring(0,110)}{p.excerpt?.length>110?'...':''}</div>
                  </div>
                  <div className={styles.postActions}>
                    <div className={`${styles.pill} ${p.published?styles.pillPublished:styles.pillDraft}`}>{p.published?'Publicado':'Borrador'}</div>
                    <div className={styles.actionRow}>
                      <button onClick={()=>edit(p)} className={styles.actionBtn}>✏️ Editar</button>
                      <button onClick={()=>togglePublish(p)} className={styles.actionBtn}>{p.published?'🔒 Ocultar':'🌐 Publicar'}</button>
                      {p.published&&<a href={`/blog/${p.slug}`} target="_blank" className={styles.actionBtn}>👁 Ver</a>}
                      <button onClick={()=>del(p.id,p.title)} className={`${styles.actionBtn} ${styles.actionDel}`}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDIT VIEW */}
        {view==='edit'&&(
          <div className={styles.editWrap}>
            <div className={styles.tabs}>
              {[['content','📝 Contenido'],['image',`🖼 Imagen${post.image?' ✓':''}`],['seo',`🔍 SEO (${score().s}/${score().t})`],['settings','⚙️ Ajustes']].map(([k,l])=>(
                <button key={k} onClick={()=>setTab(k)} className={tab===k?styles.tabActive:styles.tab}>{l}</button>
              ))}
            </div>

            {tab==='content'&&(
              <div className={styles.tabPane}>
                <div className={styles.fg}>
                  <label className={styles.lbl}>Título del artículo *</label>
                  <input value={post.title} onChange={e=>onTitle(e.target.value)} placeholder="Escribe un título claro y descriptivo..." className={styles.titleInp}/>
                  <div className={styles.hint}>{post.title.length} caracteres</div>
                </div>
                <div className={styles.fg}>
                  <label className={styles.lbl}>Resumen *</label>
                  <textarea value={post.excerpt} onChange={e=>onExcerpt(e.target.value)} placeholder="Descripción breve visible en el listado del blog y al compartir en redes..." rows={3} className={styles.excerptInp}/>
                  <div className={styles.hint}>{post.excerpt.length} caracteres · Recomendado: 100-160</div>
                </div>
                <div className={styles.fg}>
                  <label className={styles.lbl}>Contenido del artículo</label>
                  <RichEditor content={post.content} onChange={v=>F('content',v)}/>
                  <div className={styles.hint}>{stripHtml(post.content)} caracteres{stripHtml(post.content)<300?' · ⚠️ Mínimo 300 para SEO':''}</div>
                </div>
              </div>
            )}

            {tab==='image'&&(
              <div className={styles.tabPane}>
                <div className={styles.imgSection}>
                  <div className={styles.imgLeft}>
                    <label className={styles.lbl}>Imagen destacada</label>
                    <p className={styles.imgDesc}>Aparece en el listado del blog y cabecera del artículo. Tamaño ideal: <strong>1200 × 630 px</strong>. Máx. 5MB.</p>
                    <div
                      className={styles.dropzone}
                      onClick={()=>featRef.current?.click()}
                      onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add(styles.dzActive)}}
                      onDragLeave={e=>e.currentTarget.classList.remove(styles.dzActive)}
                      onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove(styles.dzActive);uploadImg(e.dataTransfer.files[0])}}
                    >
                      {uploading
                        ?<div className={styles.dzLoading}><div className={styles.spinner}></div> Subiendo...</div>
                        :post.image
                          ?<div className={styles.dzPreview}><img src={post.image} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover'}}/><div className={styles.dzOverlay}>Clic para cambiar</div></div>
                          :<div className={styles.dzEmpty}><div className={styles.dzIcon}>🖼</div><div>Arrastra una imagen aquí o haz clic para seleccionar</div><div className={styles.dzHint}>JPG, PNG, WebP · Máx. 5MB</div></div>
                      }
                    </div>
                    <input ref={featRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>uploadImg(e.target.files[0])}/>
                    {post.image&&<div className={styles.imgBtns}>
                      <button onClick={()=>featRef.current?.click()} className={styles.actionBtn}>🔄 Cambiar</button>
                      <button onClick={()=>{F('image','');S('ogImage','')}} className={`${styles.actionBtn} ${styles.actionDel}`}>🗑 Eliminar</button>
                    </div>}
                    <div className={styles.fg} style={{marginTop:'20px'}}>
                      <label className={styles.lbl}>O pega una URL de imagen</label>
                      <input value={post.image} onChange={e=>{F('image',e.target.value);S('ogImage',e.target.value)}} placeholder="https://..." className={styles.inp}/>
                    </div>
                  </div>
                  {post.image&&(
                    <div className={styles.imgRight}>
                      <label className={styles.lbl}>Vista previa en redes sociales</label>
                      <div className={styles.socialPrev}>
                        <div className={styles.spImg}><img src={post.image} alt="social preview" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
                        <div className={styles.spBody}>
                          <div className={styles.spSite}>irmabogadosasesores.com</div>
                          <div className={styles.spTitle}>{post.seo.metaTitle||post.title||'Título del artículo'}</div>
                          <div className={styles.spDesc}>{(post.seo.metaDescription||post.excerpt||'').substring(0,120)}...</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab==='seo'&&(()=>{
              const {s,t}=score()
              const pct=Math.round((s/t)*100)
              const col=pct>=80?'#1A6B4A':pct>=50?'#B8975A':'#C0392B'
              return(
                <div className={styles.tabPane}>
                  <div className={styles.seoBox}>
                    <div className={styles.seoScoreWrap}>
                      <div className={styles.seoNum} style={{color:col}}>{pct}%</div>
                      <div className={styles.seoNumLbl}>SEO</div>
                    </div>
                    <div className={styles.seoRight}>
                      <div className={styles.seoTrack}><div className={styles.seoFill} style={{width:`${pct}%`,background:col}}></div></div>
                      <div className={styles.seoItems}>
                        {[
                          ['Título +30 car.',post.title.length>=30],
                          ['Resumen +80 car.',post.excerpt.length>=80],
                          ['Meta título 30-60 car.',post.seo.metaTitle.length>=30&&post.seo.metaTitle.length<=60],
                          ['Meta descripción 100-160 car.',post.seo.metaDescription.length>=100&&post.seo.metaDescription.length<=160],
                          ['Palabras clave',!!post.seo.keywords],
                          ['Imagen destacada',!!post.image],
                          ['Contenido +300 car.',stripHtml(post.content)>=300],
                        ].map(([l,ok])=>(
                          <div key={l} className={styles.seoItem}><span className={ok?styles.seoOk:styles.seoKo}>{ok?'✓':'✗'}</span>{l}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.fg}>
                    <label className={styles.lbl}>URL del artículo <span className={styles.lblHint}>(editable manualmente)</span></label>
                    <div className={styles.slugWrap}>
                      <span className={styles.slugPre}>/blog/</span>
                      <input value={post.slug} onChange={e=>onSlug(e.target.value)} className={styles.slugInp} placeholder="url-del-articulo"/>
                    </div>
                    <div className={styles.hint}>Sin espacios ni mayúsculas. Ejemplo: como-aplazar-deuda-hacienda</div>
                  </div>

                  <div className={styles.fg}>
                    <label className={styles.lbl}>Meta título <span className={styles.lblHint}>(aparece en Google)</span></label>
                    <input value={post.seo.metaTitle} onChange={e=>S('metaTitle',e.target.value)} placeholder={post.title||'Título que aparece en los resultados de búsqueda'} className={styles.inp}/>
                    <div className={`${styles.hint} ${post.seo.metaTitle.length>60?styles.hintWarn:''}`}>{post.seo.metaTitle.length}/60{post.seo.metaTitle.length>60?' ⚠️ Demasiado largo':''}</div>
                  </div>

                  <div className={styles.googlePrev}>
                    <div className={styles.gpLabel}>Vista previa en Google</div>
                    <div className={styles.gpBox}>
                      <div className={styles.gpUrl}>irmabogadosasesores.com › blog › {post.slug||'url-articulo'}</div>
                      <div className={styles.gpTitle}>{post.seo.metaTitle||post.title||'Título del artículo'}</div>
                      <div className={styles.gpDesc}>{post.seo.metaDescription||post.excerpt||'La meta descripción aparecerá aquí...'}</div>
                    </div>
                  </div>

                  <div className={styles.fg}>
                    <label className={styles.lbl}>Meta descripción <span className={styles.lblHint}>(aparece en Google)</span></label>
                    <textarea value={post.seo.metaDescription} onChange={e=>S('metaDescription',e.target.value)} placeholder="100-160 caracteres que aparecen en los resultados de búsqueda..." rows={3} className={styles.excerptInp}/>
                    <div className={`${styles.hint} ${post.seo.metaDescription.length>160?styles.hintWarn:''}`}>{post.seo.metaDescription.length}/160{post.seo.metaDescription.length>160?' ⚠️ Demasiado larga':''}</div>
                  </div>

                  <div className={styles.fg}>
                    <label className={styles.lbl}>Palabras clave</label>
                    <input value={post.seo.keywords} onChange={e=>S('keywords',e.target.value)} placeholder="aplazar deuda hacienda, aplazamiento AEAT, fraccionamiento impuestos" className={styles.inp}/>
                    <div className={styles.hint}>Separa las palabras clave con comas.</div>
                  </div>

                  <div className={styles.frow}>
                    <div className={styles.fg}>
                      <label className={styles.lbl}>Robots <span className={styles.lblHint}>(indexación Google)</span></label>
                      <select value={post.seo.robots||'index, follow'} onChange={e=>S('robots',e.target.value)} className={styles.sel}>
                        <option value="index, follow">index, follow (recomendado)</option>
                        <option value="noindex, follow">noindex, follow</option>
                        <option value="noindex, nofollow">noindex, nofollow</option>
                      </select>
                    </div>
                    <div className={styles.fg}>
                      <label className={styles.lbl}>URL canónica <span className={styles.lblHint}>(opcional)</span></label>
                      <input value={post.seo.canonical} onChange={e=>S('canonical',e.target.value)} placeholder="Solo si el contenido existe en otra URL" className={styles.inp}/>
                    </div>
                  </div>
                </div>
              )
            })()}

            {tab==='settings'&&(
              <div className={styles.tabPane}>
                <div className={styles.frow}>
                  <div className={styles.fg}>
                    <label className={styles.lbl}>Categoría</label>
                    <select value={post.category} onChange={e=>F('category',e.target.value)} className={styles.sel}>
                      {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className={styles.fg}>
                    <label className={styles.lbl}>Autor</label>
                    <input value={post.author} onChange={e=>F('author',e.target.value)} className={styles.inp}/>
                  </div>
                  <div className={styles.fg}>
                    <label className={styles.lbl}>Fecha</label>
                    <input type="date" value={post.date} onChange={e=>F('date',e.target.value)} className={styles.inp}/>
                  </div>
                </div>
                <div className={styles.publishToggle}>
                  <label className={styles.toggleLbl}>
                    <div className={styles.switchWrap}>
                      <div className={`${styles.switchTrack} ${post.published?styles.switchOn:''}`} onClick={()=>F('published',!post.published)}>
                        <div className={styles.switchThumb}></div>
                      </div>
                    </div>
                    <div>
                      <div className={styles.switchTitle}>{post.published?'Publicado — visible en el blog':'Borrador — no visible en el blog'}</div>
                      <div className={styles.switchDesc}>{post.published?'El artículo es visible para todos los visitantes.':'El artículo está guardado pero nadie lo verá.'}</div>
                    </div>
                  </label>
                </div>
                {post.id&&(
                  <div className={styles.dangerZone}>
                    <div className={styles.dangerTitle}>⚠️ Zona de peligro</div>
                    <div className={styles.dangerDesc}>Eliminar el artículo es permanente e irreversible.</div>
                    <button onClick={()=>{del(post.id,post.title);setView('list')}} className={styles.dangerBtn}>Eliminar este artículo</button>
                  </div>
                )}
              </div>
            )}

            <div className={styles.saveBar}>
              <button onClick={()=>setView('list')} className={styles.cancelBtn}>← Volver</button>
              <div className={styles.saveRight}>
                <button onClick={()=>F('published',!post.published)} className={styles.togglePubBtn}>{post.published?'Convertir en borrador':'Publicar'}</button>
                <button onClick={save} disabled={saving} className={styles.saveBtn}>{saving?'Guardando...':post.id?'✓ Actualizar':'✓ Crear artículo'}</button>
              </div>
            </div>
          </div>
        )}

        {/* USUARIOS VIEW */}
        {view==='usuarios'&&(
          <div className={styles.toolPane}>
            <Usuarios usuario={usuario}/>
          </div>
        )}

        {/* CRM VIEW */}
        {view==='crm'&&(
          <div className={styles.toolPane}>
            <CRM onNuevoEncargo={irAEncargo} onNuevoPlazo={irAPlazo}/>
          </div>
        )}

        {/* ENCARGOS VIEW */}
        {view==='encargos'&&(
          <div className={styles.toolPane}>
            <HojaEncargo prefill={prefill?.destino==='encargos'?prefill.datos:null}/>
          </div>
        )}

        {/* CALCULADORAS VIEW */}
        {view==='calculadoras'&&(
          <div className={styles.toolPane}>
            <Calculadoras/>
          </div>
        )}

        {/* PLAZOS VIEW */}
        {view==='plazos'&&(
          <div className={styles.toolPane}>
            <Plazos prefill={prefill?.destino==='plazos'?prefill.datos:null}/>
          </div>
        )}
      </div>
    </div>
  )
}
