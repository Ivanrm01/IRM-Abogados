'use client'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import styles from './admin.module.css'

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'irm-admin-2025'

const CATEGORIES = [
  'Fiscal','IRPF','Impuesto Sociedades','IVA',
  'Garantías tributarias','Start-Ups',
  'Planificación fiscal','Fiscalidad internacional','General'
]

const EMPTY = {
  title:'',slug:'',excerpt:'',content:'',
  category:'Fiscal',author:'IRM Tax & Legal',
  date:new Date().toISOString().split('T')[0],
  published:false,image:'',
  seo:{metaTitle:'',metaDescription:'',keywords:'',canonical:'',ogImage:''}
}

const RichEditor = dynamic(()=>import('./RichEditor'),{
  ssr:false,
  loading:()=><div style={{minHeight:'400px',display:'flex',alignItems:'center',justifyContent:'center',background:'#f9fafb',border:'1px solid #e5e7eb',color:'#9ca3af',fontSize:'14px'}}>Cargando editor...</div>
})

function slugify(t){
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-')
}
function stripHtml(h){return h.replace(/<[^>]*>/g,'').length}

export default function AdminPage(){
  const [auth,setAuth]=useState(false)
  const [pw,setPw]=useState('')
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
  const featRef=useRef()

  const flash=(text,type='ok')=>{
    setMsg({text,type})
    setTimeout(()=>setMsg({text:'',type:''}),4000)
  }

  const load=async()=>{
    setLoading(true)
    try{const r=await fetch('/api/posts');setPosts(await r.json())}
    catch{flash('Error cargando artículos','error')}
    setLoading(false)
  }

  const login=()=>{
    if(pw===ADMIN_KEY){setAuth(true);load()}
    else flash('Contraseña incorrecta','error')
  }

  const F=(k,v)=>setPost(p=>({...p,[k]:v}))
  const S=(k,v)=>setPost(p=>({...p,seo:{...p.seo,[k]:v}}))

  const onTitle=v=>{
    F('title',v)
    if(!post.id)F('slug',slugify(v))
    if(!post.seo.metaTitle)S('metaTitle',v)
  }
  const onExcerpt=v=>{
    F('excerpt',v)
    if(!post.seo.metaDescription)S('metaDescription',v)
  }

  const uploadImg=async(file)=>{
    if(!file)return
    setUploading(true)
    const fd=new FormData();fd.append('file',file)
    try{
      const r=await fetch('/api/upload',{method:'POST',headers:{'x-admin-key':ADMIN_KEY},body:fd})
      const d=await r.json()
      if(r.ok){F('image',d.url);S('ogImage',d.url);flash('Imagen subida ✓')}
      else flash(d.error||'Error al subir','error')
    }catch{flash('Error al subir','error')}
    setUploading(false)
  }

  const save=async()=>{
    if(!post.title.trim()){flash('El título es obligatorio','error');return}
    setSaving(true)
    const method=post.id?'PUT':'POST'
    const url=post.id?`/api/posts/${post.id}`:'/api/posts'
    try{
      const r=await fetch(url,{method,headers:{'Content-Type':'application/json','x-admin-key':ADMIN_KEY},body:JSON.stringify(post)})
      if(r.ok){flash(post.id?'Artículo actualizado ✓':'Artículo creado ✓');await load();setView('list')}
      else{const e=await r.json();flash(e.error||'Error al guardar','error')}
    }catch{flash('Error de conexión','error')}
    setSaving(false)
  }

  const del=async(id,title)=>{
    if(!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`))return
    const r=await fetch(`/api/posts/${id}`,{method:'DELETE',headers:{'x-admin-key':ADMIN_KEY}})
    if(r.ok){flash('Artículo eliminado');load()}
    else flash('Error al eliminar','error')
  }

  const togglePublish=async(p)=>{
    const r=await fetch(`/api/posts/${p.id}`,{method:'PUT',headers:{'Content-Type':'application/json','x-admin-key':ADMIN_KEY},body:JSON.stringify({published:!p.published})})
    if(r.ok)load()
  }

  const edit=(p)=>{setPost({...p,seo:p.seo||{metaTitle:'',metaDescription:'',keywords:'',canonical:'',ogImage:''}});setTab('content');setView('edit')}
  const newArt=()=>{setPost(EMPTY);setTab('content');setView('edit')}

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

  if(!auth)return(
    <div className={styles.loginWrap}>
      <div className={styles.loginBox}>
        <Image src="/logo-irm.png" alt="IRM" width={120} height={70} style={{height:'52px',width:'auto',marginBottom:'28px',objectFit:'contain'}}/>
        <div className={styles.loginTitle}>Panel de administración</div>
        <p className={styles.loginDesc}>Acceso restringido al equipo de IRM Tax & Legal</p>
        <input type="password" placeholder="Contraseña de acceso" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} className={styles.loginInput} autoFocus/>
        <button onClick={login} className={styles.loginBtn}>Entrar al panel</button>
        {msg.text&&<div className={styles.loginError}>{msg.text}</div>}
      </div>
    </div>
  )

  return(
    <div className={styles.admin}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <Image src="/logo-irm.png" alt="IRM" width={90} height={52} style={{height:'38px',width:'auto',objectFit:'contain'}}/>
        </div>
        <div className={styles.sidebarSection}>Blog</div>
        <nav className={styles.sideNav}>
          <button onClick={()=>{setView('list');load()}} className={view==='list'?styles.navActive:''}>
            <span>📄</span> Todos los artículos
            <span className={styles.badge}>{posts.filter(p=>p.published).length}</span>
          </button>
          <button onClick={newArt} className={view==='edit'&&!post.id?styles.navActive:''}>
            <span>✏️</span> Nuevo artículo
          </button>
        </nav>
        <div className={styles.sidebarSection}>Web</div>
        <nav className={styles.sideNav}>
          <a href="/" target="_blank"><span>🌐</span> Ver web</a>
          <a href="/blog" target="_blank"><span>📰</span> Ver blog</a>
        </nav>
        <button onClick={()=>setAuth(false)} className={styles.logoutBtn}>← Cerrar sesión</button>
      </aside>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.topbarTitle}>
            {view==='list'?'Artículos del blog':post.id?'Editar artículo':'Nuevo artículo'}
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

        {/* LIST */}
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

            {loading&&<div className={styles.loadingBox}><div className={styles.spinner}></div> Cargando artículos...</div>}

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
                    <div className={`${styles.pill} ${p.published?styles.pillPublished:styles.pillDraft}`}>
                      {p.published?'Publicado':'Borrador'}
                    </div>
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

        {/* EDITOR */}
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
                  <div className={styles.hint}>{post.title.length} caracteres · URL: /blog/{post.slug||'url-del-articulo'}</div>
                </div>
                <div className={styles.fg}>
                  <label className={styles.lbl}>Resumen *</label>
                  <textarea value={post.excerpt} onChange={e=>onExcerpt(e.target.value)} placeholder="Descripción breve que aparece en el listado del blog y en redes sociales..." rows={3} className={styles.excerptInp}/>
                  <div className={styles.hint}>{post.excerpt.length} caracteres · Recomendado: 100-160</div>
                </div>
                <div className={styles.fg}>
                  <label className={styles.lbl}>Contenido del artículo</label>
                  <RichEditor content={post.content} onChange={v=>F('content',v)} adminKey={ADMIN_KEY}/>
                  <div className={styles.hint}>
                    {stripHtml(post.content)} caracteres · {Math.max(1,Math.ceil(stripHtml(post.content)/1200))} min lectura
                    {stripHtml(post.content)<300&&' · ⚠️ Mínimo 300 caracteres para SEO'}
                  </div>
                </div>
              </div>
            )}

            {tab==='image'&&(
              <div className={styles.tabPane}>
                <div className={styles.imgSection}>
                  <div className={styles.imgLeft}>
                    <label className={styles.lbl}>Imagen destacada</label>
                    <p className={styles.imgDesc}>Aparece en el listado del blog, cabecera del artículo y al compartir en redes. Tamaño ideal: <strong>1200 × 630 px</strong>. Máx. 5MB.</p>
                    <div
                      className={styles.dropzone}
                      onClick={()=>featRef.current?.click()}
                      onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add(styles.dzActive)}}
                      onDragLeave={e=>e.currentTarget.classList.remove(styles.dzActive)}
                      onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove(styles.dzActive);uploadImg(e.dataTransfer.files[0])}}
                    >
                      {uploading?<div className={styles.dzLoading}><div className={styles.spinner}></div> Subiendo...</div>
                      :post.image?<div className={styles.dzPreview}><img src={post.image} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover'}}/><div className={styles.dzOverlay}>Clic para cambiar</div></div>
                      :<div className={styles.dzEmpty}><div className={styles.dzIcon}>🖼</div><div>Arrastra una imagen aquí o haz clic para seleccionar</div><div className={styles.dzHint}>JPG, PNG, WebP · Máx. 5MB</div></div>}
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
                      <label className={styles.lbl}>Vista previa en redes</label>
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
              const items=[
                ['Título +30 car.',post.title.length>=30],
                ['Resumen +80 car.',post.excerpt.length>=80],
                ['Meta título 30-60 car.',post.seo.metaTitle.length>=30&&post.seo.metaTitle.length<=60],
                ['Meta descripción 100-160 car.',post.seo.metaDescription.length>=100&&post.seo.metaDescription.length<=160],
                ['Palabras clave definidas',!!post.seo.keywords],
                ['Imagen destacada',!!post.image],
                ['Contenido +300 car.',stripHtml(post.content)>=300],
              ]
              return(
                <div className={styles.tabPane}>
                  <div className={styles.seoBox}>
                    <div className={styles.seoScoreWrap}>
                      <div className={styles.seoNum} style={{color:col}}>{pct}%</div>
                      <div className={styles.seoNumLbl}>Puntuación SEO</div>
                    </div>
                    <div className={styles.seoRight}>
                      <div className={styles.seoTrack}><div className={styles.seoFill} style={{width:`${pct}%`,background:col}}></div></div>
                      <div className={styles.seoItems}>
                        {items.map(([l,ok])=>(
                          <div key={l} className={styles.seoItem}>
                            <span className={ok?styles.seoOk:styles.seoKo}>{ok?'✓':'✗'}</span>{l}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.fg}>
                    <label className={styles.lbl}>Meta título <span className={styles.lblHint}>(aparece en Google)</span></label>
                    <input value={post.seo.metaTitle} onChange={e=>S('metaTitle',e.target.value)} placeholder={post.title||'Título que aparece en los resultados de búsqueda'} className={styles.inp}/>
                    <div className={`${styles.hint} ${post.seo.metaTitle.length>60?styles.hintWarn:''}`}>{post.seo.metaTitle.length}/60 car.{post.seo.metaTitle.length>60?' ⚠️ Demasiado largo':post.seo.metaTitle.length>0&&post.seo.metaTitle.length<30?' ⚠️ Demasiado corto':''}</div>
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
                    <textarea value={post.seo.metaDescription} onChange={e=>S('metaDescription',e.target.value)} placeholder={post.excerpt||'Descripción de 100-160 caracteres que aparece en los resultados de búsqueda...'} rows={3} className={styles.excerptInp}/>
                    <div className={`${styles.hint} ${post.seo.metaDescription.length>160?styles.hintWarn:''}`}>{post.seo.metaDescription.length}/160 car.{post.seo.metaDescription.length>160?' ⚠️ Demasiado larga, Google la cortará':''}</div>
                  </div>

                  <div className={styles.fg}>
                    <label className={styles.lbl}>Palabras clave</label>
                    <input value={post.seo.keywords} onChange={e=>S('keywords',e.target.value)} placeholder="aplazar deuda hacienda, aplazamiento AEAT, fraccionamiento impuestos" className={styles.inp}/>
                    <div className={styles.hint}>Separa las palabras clave con comas. Incluye los términos principales por los que quieres posicionar este artículo.</div>
                  </div>

                  <div className={styles.frow}>
                    <div className={styles.fg}>
                      <label className={styles.lbl}>URL del artículo (slug)</label>
                      <div className={styles.slugWrap}>
                        <span className={styles.slugPre}>/blog/</span>
                        <input value={post.slug} onChange={e=>F('slug',e.target.value)} className={styles.slugInp}/>
                      </div>
                    </div>
                    <div className={styles.fg}>
                      <label className={styles.lbl}>URL canónica <span className={styles.lblHint}>(opcional)</span></label>
                      <input value={post.seo.canonical} onChange={e=>S('canonical',e.target.value)} placeholder="Solo si este contenido existe en otra URL" className={styles.inp}/>
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
                    <label className={styles.lbl}>Fecha de publicación</label>
                    <input type="date" value={post.date} onChange={e=>F('date',e.target.value)} className={styles.inp}/>
                  </div>
                </div>

                <div className={styles.publishToggle}>
                  <label className={styles.toggleLbl}>
                    <div className={styles.switchWrap}>
                      <input type="checkbox" checked={post.published} onChange={e=>F('published',e.target.checked)} style={{display:'none'}}/>
                      <div className={`${styles.switchTrack} ${post.published?styles.switchOn:''}`} onClick={()=>F('published',!post.published)}>
                        <div className={styles.switchThumb}></div>
                      </div>
                    </div>
                    <div>
                      <div className={styles.switchTitle}>{post.published?'Publicado — visible en el blog':'Borrador — no visible en el blog'}</div>
                      <div className={styles.switchDesc}>{post.published?'El artículo aparece en el blog y puede ser indexado por Google.':'El artículo está guardado pero no es visible para los visitantes.'}</div>
                    </div>
                  </label>
                </div>

                {post.id&&(
                  <div className={styles.dangerZone}>
                    <div className={styles.dangerTitle}>⚠️ Zona de peligro</div>
                    <div className={styles.dangerDesc}>Eliminar el artículo es una acción permanente e irreversible.</div>
                    <button onClick={()=>{del(post.id,post.title);setView('list')}} className={styles.dangerBtn}>Eliminar este artículo permanentemente</button>
                  </div>
                )}
              </div>
            )}

            <div className={styles.saveBar}>
              <button onClick={()=>setView('list')} className={styles.cancelBtn}>← Volver</button>
              <div className={styles.saveRight}>
                <span className={post.published?styles.pillPublished:styles.pillDraft}>{post.published?'● Publicado':'○ Borrador'}</span>
                <button onClick={()=>F('published',!post.published)} className={styles.togglePubBtn}>{post.published?'Convertir en borrador':'Publicar'}</button>
                <button onClick={save} disabled={saving} className={styles.saveBtn}>{saving?'Guardando...':post.id?'✓ Actualizar':'✓ Crear artículo'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
