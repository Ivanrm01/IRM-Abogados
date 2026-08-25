'use client'
import { useState, useEffect, useMemo } from 'react'
import s from './crm.module.css'

const ADMIN_KEY = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADMIN_KEY) || 'irm-admin-2025'

/* ------------------------------------------------------------------ */
/* Catálogos                                                           */
/* ------------------------------------------------------------------ */

const FASES = [
  { id:'contacto',   label:'Primer contacto', corto:'Contacto',   color:'#9ca3af', abierto:true },
  { id:'propuesta',  label:'Propuesta enviada', corto:'Propuesta', color:'#B8975A', abierto:true },
  { id:'contratado', label:'Encargo aceptado', corto:'Aceptado',  color:'#1A6B4A', abierto:true },
  { id:'en_curso',   label:'En tramitación',  corto:'Tramitación', color:'#0D1B2A', abierto:true },
  { id:'cerrado',    label:'Cerrado',         corto:'Cerrado',    color:'#4A5568', abierto:false },
  { id:'perdido',    label:'No prosperó',     corto:'No prosperó', color:'#C0392B', abierto:false },
]
const fase = (id) => FASES.find(f => f.id === id) || FASES[0]

const MATERIAS = [
  'Fiscal', 'Procedimiento tributario', 'Inspección', 'Derivación de responsabilidad',
  'Aplazamientos y garantías', 'Recaudación', 'Mercantil y societario', 'Concursal',
  'Start-ups', 'Civil', 'Laboral', 'Penal económico', 'Otros',
]

const VIAS = [
  { id:'extrajudicial', label:'Extrajudicial / consultiva' },
  { id:'administrativa', label:'Vía administrativa' },
  { id:'economico', label:'Económico-administrativa' },
  { id:'contencioso', label:'Contencioso-administrativa' },
  { id:'judicial', label:'Jurisdicción ordinaria' },
]
const via = (id) => VIAS.find(v => v.id === id)?.label || '—'

const ORIGENES = [
  { id:'web', label:'Web' }, { id:'referido', label:'Referido' },
  { id:'linkedin', label:'LinkedIn' }, { id:'llamada', label:'Llamada directa' },
  { id:'colegio', label:'Colegio / turno' }, { id:'otros', label:'Otros' },
]
const origen = (id) => ORIGENES.find(o => o.id === id)?.label || '—'

const ESTADOS_CLIENTE = [
  { id:'lead', label:'Potencial', clase:'tagGold' },
  { id:'activo', label:'Activo', clase:'tagGreen' },
  { id:'inactivo', label:'Inactivo', clase:'tagGrey' },
]

const TIPOS_ACTUACION = [
  { id:'nota', label:'Nota' }, { id:'llamada', label:'Llamada' }, { id:'email', label:'Email' },
  { id:'reunion', label:'Reunión' }, { id:'escrito', label:'Escrito presentado' },
  { id:'vista', label:'Vista / comparecencia' }, { id:'pago', label:'Cobro' },
]
const tipoAct = (id) => TIPOS_ACTUACION.find(t => t.id === id)?.label || 'Nota'

const PRIORIDADES = [
  { id:'alta', label:'Alta', color:'#C0392B' },
  { id:'media', label:'Media', color:'#B8975A' },
  { id:'baja', label:'Baja', color:'#9ca3af' },
]

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

const hoyISO = () => new Date().toISOString().split('T')[0]

// es-ES no agrupa los millares de cuatro cifras (1000 → "1000"); en importes
// del despacho se lee mejor agrupado siempre: 1.000 €
const eur = (n, dec = 0) => (Number(n) || 0).toLocaleString('es-ES', {
  style: 'currency', currency: 'EUR', useGrouping: 'always',
  minimumFractionDigits: dec, maximumFractionDigits: dec,
})

const fecha = (v, largo = false) => {
  if (!v) return '—'
  const d = String(v).length > 10 ? new Date(v) : new Date(String(v) + 'T00:00:00')
  if (isNaN(d)) return '—'
  return d.toLocaleDateString('es-ES', largo
    ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    : { day: '2-digit', month: 'short', year: 'numeric' })
}

const diasHasta = (iso) => {
  if (!iso) return null
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  return Math.round((new Date(iso + 'T00:00:00') - hoy) / 86400000)
}

const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const api = async (url, opts = {}) => {
  const res = await fetch(url, {
    cache: 'no-store',
    ...opts,
    headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY, ...(opts.headers || {}) },
  })
  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    throw new Error(j.error || 'No se pudo conectar con el servidor')
  }
  return res.json()
}

function Etiqueta({ f }) {
  const x = fase(f)
  return <span className={s.tag} style={{ background: x.color + '1a', color: x.color }}>{x.corto}</span>
}

const EXP_VACIO = {
  cliente_id: '', cliente_nombre: '', referencia: '', titulo: '', materia: 'Fiscal',
  fase: 'contacto', via: 'extrajudicial', organo: '', procedimiento: '', responsable: '',
  prioridad: 'media', honorarios: '', variable: '', provision: '', facturado: '',
  cuantia: '', fecha_alta: hoyISO(), notas: '',
}
const CLI_VACIO = {
  nombre: '', tipo: 'fisica', nif: '', email: '', telefono: '', direccion: '', ciudad: '',
  origen: 'web', estado: 'lead', responsable: '', contacto: '', notas: '',
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

export default function CRM({ onNuevoEncargo, onNuevoPlazo }) {
  const [vista, setVista] = useState('panel')
  const [clientes, setClientes] = useState([])
  const [expedientes, setExpedientes] = useState([])
  const [actuaciones, setActuaciones] = useState([])
  const [plazos, setPlazos] = useState([])

  const [cargando, setCargando] = useState(true)
  const [aviso, setAviso] = useState('')
  const [sinTablas, setSinTablas] = useState(false)

  const [abierto, setAbierto] = useState(null)      // { tipo:'expediente'|'cliente', id }
  const [drawer, setDrawer] = useState(null)        // { tipo, form, guardando, error }

  const [busca, setBusca] = useState('')
  const [fFase, setFFase] = useState('')
  const [fMateria, setFMateria] = useState('')
  const [soloAbiertos, setSoloAbiertos] = useState(false)
  const [buscaCli, setBuscaCli] = useState('')
  const [fEstadoCli, setFEstadoCli] = useState('')

  const [nuevaAct, setNuevaAct] = useState({ tipo: 'nota', fecha: hoyISO(), titulo: '', detalle: '' })
  const [arrastra, setArrastra] = useState(null)
  const [colOver, setColOver] = useState(null)

  /* ---------------- carga ---------------- */

  const cargar = async () => {
    setCargando(true); setAviso(''); setSinTablas(false)
    try {
      const [cli, exp, act] = await Promise.all([
        api('/api/crm/clientes'),
        api('/api/crm/expedientes'),
        api('/api/crm/actuaciones'),
      ])
      setClientes(cli); setExpedientes(exp); setActuaciones(act)
    } catch (e) {
      if (/does not exist|schema cache|relation/i.test(e.message)) setSinTablas(true)
      else setAviso(e.message)
    }
    try {
      const r = await fetch('/api/plazos', { cache: 'no-store' })
      if (r.ok) setPlazos(await r.json())
    } catch { /* los plazos son un extra: si fallan, el CRM sigue funcionando */ }
    setCargando(false)
  }
  useEffect(() => { cargar() }, [])

  /* ---------------- derivados ---------------- */

  const expsPorCliente = useMemo(() => {
    const m = {}
    for (const e of expedientes) { (m[e.cliente_id] = m[e.cliente_id] || []).push(e) }
    return m
  }, [expedientes])

  const abiertos = useMemo(() => expedientes.filter(e => fase(e.fase).abierto), [expedientes])

  const kpis = useMemo(() => {
    const enPipeline = expedientes.filter(e => e.fase === 'contacto' || e.fase === 'propuesta')
    const enCurso = expedientes.filter(e => e.fase === 'contratado' || e.fase === 'en_curso')
    const ganados = expedientes.filter(e => ['contratado', 'en_curso', 'cerrado'].includes(e.fase)).length
    const resueltos = ganados + expedientes.filter(e => e.fase === 'perdido').length
    return {
      abiertos: abiertos.length,
      clientesActivos: clientes.filter(c => c.estado === 'activo').length,
      leads: clientes.filter(c => c.estado === 'lead').length,
      pipeline: enPipeline.reduce((t, e) => t + (Number(e.honorarios) || 0), 0),
      oportunidades: enPipeline.length,
      pendiente: enCurso.reduce((t, e) => t + Math.max(0, (Number(e.honorarios) || 0) - (Number(e.facturado) || 0)), 0),
      facturado: expedientes.reduce((t, e) => t + (Number(e.facturado) || 0), 0),
      conversion: resueltos ? Math.round((ganados / resueltos) * 100) : null,
    }
  }, [expedientes, clientes, abiertos])

  const expsFiltrados = useMemo(() => {
    const q = norm(busca)
    return expedientes.filter(e => {
      if (fFase && e.fase !== fFase) return false
      if (fMateria && e.materia !== fMateria) return false
      if (soloAbiertos && !fase(e.fase).abierto) return false
      if (!q) return true
      return [e.titulo, e.cliente_nombre, e.referencia, e.procedimiento, e.organo, e.responsable]
        .some(v => norm(v).includes(q))
    })
  }, [expedientes, busca, fFase, fMateria, soloAbiertos])

  const clisFiltrados = useMemo(() => {
    const q = norm(buscaCli)
    return clientes.filter(c => {
      if (fEstadoCli && c.estado !== fEstadoCli) return false
      if (!q) return true
      return [c.nombre, c.nif, c.email, c.telefono, c.ciudad, c.contacto].some(v => norm(v).includes(q))
    })
  }, [clientes, buscaCli, fEstadoCli])

  const proximosPlazos = useMemo(() =>
    [...plazos]
      .filter(p => diasHasta(p.vencimiento) !== null && diasHasta(p.vencimiento) >= -3)
      .sort((a, b) => String(a.vencimiento).localeCompare(String(b.vencimiento)))
      .slice(0, 6)
  , [plazos])

  const expAbierto = abierto?.tipo === 'expediente' ? expedientes.find(e => e.id === abierto.id) : null
  const cliAbierto = abierto?.tipo === 'cliente' ? clientes.find(c => c.id === abierto.id) : null

  /* ---------------- acciones ---------------- */

  const flash = (t) => { setAviso(t); setTimeout(() => setAviso(''), 4000) }

  const abrirDrawer = (tipo, datos) => setDrawer({ tipo, form: datos, guardando: false, error: '' })
  const cerrarDrawer = () => setDrawer(null)
  const campo = (k, v) => setDrawer(d => ({ ...d, form: { ...d.form, [k]: v } }))

  const guardarCliente = async () => {
    const f = drawer.form
    if (!f.nombre?.trim()) { setDrawer(d => ({ ...d, error: 'Indica el nombre del cliente' })); return }
    setDrawer(d => ({ ...d, guardando: true, error: '' }))
    try {
      if (f.id) {
        const act = await api('/api/crm/clientes', { method: 'PATCH', body: JSON.stringify(f) })
        setClientes(l => l.map(c => c.id === act.id ? act : c))
        setExpedientes(l => l.map(e => e.cliente_id === act.id ? { ...e, cliente_nombre: act.nombre } : e))
        flash('Cliente actualizado')
      } else {
        const nuevo = await api('/api/crm/clientes', { method: 'POST', body: JSON.stringify(f) })
        setClientes(l => [...l, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre)))
        setAbierto({ tipo: 'cliente', id: nuevo.id })
        flash('Cliente creado')
      }
      cerrarDrawer()
    } catch (e) { setDrawer(d => ({ ...d, guardando: false, error: e.message })) }
  }

  const guardarExpediente = async () => {
    const f = drawer.form
    if (!f.titulo?.trim()) { setDrawer(d => ({ ...d, error: 'Indica el asunto del expediente' })); return }
    const cli = clientes.find(c => c.id === f.cliente_id)
    const cuerpo = { ...f, cliente_nombre: cli ? cli.nombre : (f.cliente_nombre || '') }
    setDrawer(d => ({ ...d, guardando: true, error: '' }))
    try {
      if (f.id) {
        const act = await api('/api/crm/expedientes', { method: 'PATCH', body: JSON.stringify(cuerpo) })
        setExpedientes(l => l.map(e => e.id === act.id ? act : e))
        flash('Expediente actualizado')
      } else {
        const nuevo = await api('/api/crm/expedientes', { method: 'POST', body: JSON.stringify(cuerpo) })
        setExpedientes(l => [nuevo, ...l])
        setAbierto({ tipo: 'expediente', id: nuevo.id })
        flash('Expediente creado')
      }
      cerrarDrawer()
    } catch (e) { setDrawer(d => ({ ...d, guardando: false, error: e.message })) }
  }

  const cambiarFase = async (exp, nuevaFase) => {
    if (exp.fase === nuevaFase) return
    const previo = expedientes
    setExpedientes(l => l.map(e => e.id === exp.id ? { ...e, fase: nuevaFase } : e))
    try {
      const act = await api('/api/crm/expedientes', { method: 'PATCH', body: JSON.stringify({ id: exp.id, fase: nuevaFase }) })
      setExpedientes(l => l.map(e => e.id === act.id ? act : e))
    } catch (e) { setExpedientes(previo); flash(e.message) }
  }

  const borrarExpediente = async (exp) => {
    if (!confirm(`¿Eliminar el expediente "${exp.titulo}" y todas sus actuaciones?`)) return
    try {
      await api('/api/crm/expedientes?id=' + encodeURIComponent(exp.id), { method: 'DELETE' })
      setExpedientes(l => l.filter(e => e.id !== exp.id))
      setActuaciones(l => l.filter(a => a.expediente_id !== exp.id))
      setAbierto(null); flash('Expediente eliminado')
    } catch (e) { flash(e.message) }
  }

  const borrarCliente = async (cli) => {
    if (!confirm(`¿Eliminar la ficha de "${cli.nombre}"?`)) return
    try {
      await api('/api/crm/clientes?id=' + encodeURIComponent(cli.id), { method: 'DELETE' })
      setClientes(l => l.filter(c => c.id !== cli.id))
      setAbierto(null); flash('Cliente eliminado')
    } catch (e) { flash(e.message) }
  }

  const anotar = async (exp) => {
    if (!nuevaAct.titulo.trim()) return
    try {
      const nueva = await api('/api/crm/actuaciones', {
        method: 'POST',
        body: JSON.stringify({ ...nuevaAct, expediente_id: exp.id, cliente_id: exp.cliente_id || null }),
      })
      setActuaciones(l => [nueva, ...l])
      setNuevaAct({ tipo: 'nota', fecha: hoyISO(), titulo: '', detalle: '' })
    } catch (e) { flash(e.message) }
  }

  const borrarActuacion = async (id) => {
    const previo = actuaciones
    setActuaciones(l => l.filter(a => a.id !== id))
    try { await api('/api/crm/actuaciones?id=' + encodeURIComponent(id), { method: 'DELETE' }) }
    catch (e) { setActuaciones(previo); flash(e.message) }
  }

  const exportarCSV = () => {
    const cab = ['Referencia', 'Asunto', 'Cliente', 'Materia', 'Fase', 'Vía', 'Órgano', 'Procedimiento',
      'Responsable', 'Cuantía', 'Honorarios', 'Provisión', 'Facturado', 'Alta', 'Cierre']
    const filas = expsFiltrados.map(e => [
      e.referencia, e.titulo, e.cliente_nombre, e.materia, fase(e.fase).label, via(e.via),
      e.organo, e.procedimiento, e.responsable, e.cuantia, e.honorarios, e.provision, e.facturado,
      e.fecha_alta, e.fecha_cierre,
    ])
    const csv = [cab, ...filas]
      .map(f => f.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'))
      .join('\r\n')
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url; a.download = `expedientes-${hoyISO()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const encargoDesde = (exp) => {
    const cli = clientes.find(c => c.id === exp.cliente_id)
    onNuevoEncargo?.({
      clienteNombre: exp.cliente_nombre || cli?.nombre || '',
      clienteNif: cli?.nif || '',
      asunto: exp.titulo || '',
      antecedentes: exp.notas || '',
      honorarios: exp.honorarios || '',
      variable: exp.variable || '',
    })
  }
  const plazoDesde = (exp) => onNuevoPlazo?.({ asunto: exp.titulo || '', cliente: exp.cliente_nombre || '' })

  /* ---------------- fragmentos de interfaz ---------------- */

  const cabecera = () => (
    <div className={s.subnav}>
      {[['panel', 'Panel'], ['pipeline', 'Pipeline'], ['expedientes', `Expedientes`], ['clientes', 'Clientes']].map(([id, l]) => (
        <button key={id} onClick={() => { setVista(id); setAbierto(null) }}
          className={`${s.subnavBtn} ${vista === id && !abierto ? s.subnavOn : ''}`}>
          {l}
          {id === 'expedientes' && <span className={s.subnavCount}>{expedientes.length}</span>}
          {id === 'clientes' && <span className={s.subnavCount}>{clientes.length}</span>}
        </button>
      ))}
      <div className={s.subnavRight}>
        <button className={s.btn} onClick={() => abrirDrawer('cliente', { ...CLI_VACIO })}>+ Cliente</button>
        <button className={`${s.btn} ${s.btnDark}`} onClick={() => abrirDrawer('expediente', { ...EXP_VACIO })}>+ Expediente</button>
      </div>
    </div>
  )

  /* ---------------- panel ---------------- */

  const panel = () => (
    <>
      <div className={s.kpiGrid}>
        <div className={s.kpi}>
          <div className={s.kpiN}>{kpis.abiertos}</div>
          <div className={s.kpiL}>Expedientes abiertos</div>
          <div className={s.kpiSub}>{expedientes.length} en total</div>
        </div>
        <div className={s.kpi}>
          <div className={s.kpiN}>{kpis.clientesActivos}</div>
          <div className={s.kpiL}>Clientes activos</div>
          <div className={s.kpiSub}>{kpis.leads} potenciales</div>
        </div>
        <div className={s.kpi}>
          <div className={s.kpiN}>{eur(kpis.pipeline)}</div>
          <div className={s.kpiL}>Pipeline</div>
          <div className={s.kpiSub}>{kpis.oportunidades} oportunidad{kpis.oportunidades === 1 ? '' : 'es'} sin cerrar</div>
        </div>
        <div className={s.kpi}>
          <div className={s.kpiN}>{eur(kpis.pendiente)}</div>
          <div className={s.kpiL}>Pendiente de facturar</div>
          <div className={s.kpiSub}>{eur(kpis.facturado)} facturado{kpis.conversion !== null ? ` · ${kpis.conversion}% conversión` : ''}</div>
        </div>
      </div>

      <div className={s.split}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className={s.card}>
            <div className={s.cardHead}>
              <div className={s.cardTitle}>Cartera por fase</div>
              <button className={`${s.btn} ${s.btnMini}`} onClick={() => setVista('pipeline')}>Ver pipeline</button>
            </div>
            <div className={s.cardBody}>
              {FASES.map(f => {
                const lista = expedientes.filter(e => e.fase === f.id)
                const pct = expedientes.length ? (lista.length / expedientes.length) * 100 : 0
                return (
                  <div key={f.id} className={s.mini}>
                    <span className={s.dot} style={{ background: f.color }} />
                    <div className={s.miniMain}>
                      <div className={s.miniName}>{f.label}</div>
                      <div style={{ height: 3, background: '#f0f1f3', marginTop: 6 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: f.color, opacity: .75 }} />
                      </div>
                    </div>
                    <div className={s.miniSide}>{lista.length} · {eur(lista.reduce((t, e) => t + (Number(e.honorarios) || 0), 0))}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHead}><div className={s.cardTitle}>Última actividad</div></div>
            <div className={s.cardBody}>
              {actuaciones.slice(0, 7).map(a => {
                const e = expedientes.find(x => x.id === a.expediente_id)
                return (
                  <div key={a.id} className={s.mini} style={{ cursor: e ? 'pointer' : 'default' }}
                    onClick={() => e && setAbierto({ tipo: 'expediente', id: e.id })}>
                    <div className={s.miniMain}>
                      <div className={s.miniName}>{a.titulo}</div>
                      <div className={s.miniSub}>{tipoAct(a.tipo)} · {e?.titulo || 'Expediente eliminado'}</div>
                    </div>
                    <div className={s.miniSide}>{fecha(a.fecha)}</div>
                  </div>
                )
              })}
              {!actuaciones.length && <div className={s.emptyText} style={{ padding: '14px 0 4px' }}>Todavía no hay actuaciones registradas.</div>}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className={s.card}>
            <div className={s.cardHead}><div className={s.cardTitle}>Próximos vencimientos</div></div>
            <div className={s.cardBody}>
              {proximosPlazos.map(p => {
                const d = diasHasta(p.vencimiento)
                const col = d < 0 ? '#7f1d1d' : d <= 7 ? '#C0392B' : d <= 20 ? '#B8975A' : '#1A6B4A'
                return (
                  <div key={p.id} className={s.mini}>
                    <span className={s.dot} style={{ background: col }} />
                    <div className={s.miniMain}>
                      <div className={s.miniName}>{p.asunto}</div>
                      <div className={s.miniSub}>{p.tipo_label}{p.cliente ? ` · ${p.cliente}` : ''}</div>
                    </div>
                    <div className={s.miniSide} style={{ color: col }}>
                      {fecha(p.vencimiento)}<br />{d < 0 ? `vencido hace ${-d} d.` : d === 0 ? 'hoy' : `en ${d} d.`}
                    </div>
                  </div>
                )
              })}
              {!proximosPlazos.length && <div className={s.emptyText} style={{ padding: '14px 0 4px' }}>Sin vencimientos próximos. Se cargan desde la herramienta Plazos.</div>}
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHead}>
              <div className={s.cardTitle}>Clientes recientes</div>
              <button className={`${s.btn} ${s.btnMini}`} onClick={() => setVista('clientes')}>Ver todos</button>
            </div>
            <div className={s.cardBody}>
              {[...clientes].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 6).map(c => (
                <div key={c.id} className={s.mini} style={{ cursor: 'pointer' }} onClick={() => setAbierto({ tipo: 'cliente', id: c.id })}>
                  <div className={s.miniMain}>
                    <div className={s.miniName}>{c.nombre}</div>
                    <div className={s.miniSub}>{origen(c.origen)} · {(expsPorCliente[c.id] || []).length} expediente(s)</div>
                  </div>
                  <div className={s.miniSide}>{fecha(c.created_at)}</div>
                </div>
              ))}
              {!clientes.length && <div className={s.emptyText} style={{ padding: '14px 0 4px' }}>Aún no hay clientes en la base.</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  )

  /* ---------------- pipeline ---------------- */

  const pipeline = () => (
    <>
      <div className={s.eyebrow}>Arrastra un expediente a otra columna para cambiar su fase</div>
      <div className={s.pipeline}>
        {FASES.map(f => {
          const lista = expedientes.filter(e => e.fase === f.id)
          const total = lista.reduce((t, e) => t + (Number(e.honorarios) || 0), 0)
          return (
            <div key={f.id}
              className={`${s.col} ${colOver === f.id ? s.colOver : ''}`}
              onDragOver={ev => { ev.preventDefault(); setColOver(f.id) }}
              onDragLeave={() => setColOver(c => c === f.id ? null : c)}
              onDrop={ev => {
                ev.preventDefault(); setColOver(null)
                const exp = expedientes.find(e => e.id === arrastra)
                if (exp) cambiarFase(exp, f.id)
                setArrastra(null)
              }}>
              <div className={s.colHead}>
                <div className={s.colTop}>
                  <span className={s.colName} style={{ color: f.color }}>{f.corto}</span>
                  <span className={s.colCount}>{lista.length}</span>
                </div>
                <div className={s.colSum}>{eur(total)}</div>
                <div className={s.colRule} style={{ background: f.color, opacity: .8 }} />
              </div>
              <div className={s.colList}>
                {lista.map(e => (
                  <div key={e.id} className={s.miniCard} draggable
                    onDragStart={() => setArrastra(e.id)}
                    onDragEnd={() => { setArrastra(null); setColOver(null) }}
                    onClick={() => setAbierto({ tipo: 'expediente', id: e.id })}>
                    <div className={s.miniRef}>{e.referencia}</div>
                    <div className={s.miniTitle}>{e.titulo}</div>
                    <div className={s.miniClient}>{e.cliente_nombre || 'Sin cliente asignado'}</div>
                    <div className={s.miniFoot}>
                      <span className={s.miniAmount}>{eur(e.honorarios)}</span>
                      <span className={`${s.tag} ${s.tagGrey}`}>{e.materia}</span>
                    </div>
                  </div>
                ))}
                {!lista.length && <div className={s.colEmpty}>Sin expedientes</div>}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )

  /* ---------------- expedientes ---------------- */

  const listaExpedientes = () => (
    <>
      <div className={s.filters}>
        <input className={s.search} placeholder="Buscar por asunto, cliente, referencia o procedimiento..."
          value={busca} onChange={e => setBusca(e.target.value)} />
        <select className={s.sel} value={fFase} onChange={e => setFFase(e.target.value)}>
          <option value="">Todas las fases</option>
          {FASES.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
        <select className={s.sel} value={fMateria} onChange={e => setFMateria(e.target.value)}>
          <option value="">Todas las materias</option>
          {MATERIAS.map(m => <option key={m}>{m}</option>)}
        </select>
        <button className={`${s.btn} ${soloAbiertos ? s.btnDark : ''}`} onClick={() => setSoloAbiertos(v => !v)}>Solo abiertos</button>
        <button className={s.btn} onClick={exportarCSV} disabled={!expsFiltrados.length}>Exportar CSV</button>
      </div>

      {!expsFiltrados.length ? (
        <div className={s.empty}>
          <div className={s.emptyTitle}>{expedientes.length ? 'Ningún expediente coincide' : 'Aún no hay expedientes'}</div>
          <div className={s.emptyText}>{expedientes.length ? 'Prueba con otros filtros o borra la búsqueda.' : 'Da de alta el primer asunto para empezar a seguirlo.'}</div>
          <button className={`${s.btn} ${s.btnDark}`} onClick={() => abrirDrawer('expediente', { ...EXP_VACIO })}>+ Nuevo expediente</button>
        </div>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th>Ref.</th><th>Asunto</th><th>Cliente</th><th>Materia</th><th>Fase</th>
              <th>Responsable</th><th className={s.right}>Honorarios</th><th>Alta</th>
            </tr></thead>
            <tbody>
              {expsFiltrados.map(e => (
                <tr key={e.id} className={s.rowClick} onClick={() => setAbierto({ tipo: 'expediente', id: e.id })}>
                  <td className={`${s.num} ${s.muted}`}>{e.referencia}</td>
                  <td className={s.strong}>{e.titulo}</td>
                  <td>{e.cliente_nombre || <span className={s.muted}>—</span>}</td>
                  <td className={s.muted}>{e.materia}</td>
                  <td><Etiqueta f={e.fase} /></td>
                  <td className={s.muted}>{e.responsable || '—'}</td>
                  <td className={`${s.right} ${s.num}`}>{eur(e.honorarios)}</td>
                  <td className={`${s.muted} ${s.num}`}>{fecha(e.fecha_alta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )

  /* ---------------- clientes ---------------- */

  const listaClientes = () => (
    <>
      <div className={s.filters}>
        <input className={s.search} placeholder="Buscar por nombre, NIF, email o teléfono..."
          value={buscaCli} onChange={e => setBuscaCli(e.target.value)} />
        <select className={s.sel} value={fEstadoCli} onChange={e => setFEstadoCli(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS_CLIENTE.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
        </select>
      </div>

      {!clisFiltrados.length ? (
        <div className={s.empty}>
          <div className={s.emptyTitle}>{clientes.length ? 'Ningún cliente coincide' : 'Aún no hay clientes'}</div>
          <div className={s.emptyText}>{clientes.length ? 'Prueba con otra búsqueda.' : 'Crea la primera ficha para vincularle expedientes.'}</div>
          <button className={`${s.btn} ${s.btnDark}`} onClick={() => abrirDrawer('cliente', { ...CLI_VACIO })}>+ Nuevo cliente</button>
        </div>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>
              <th>Cliente</th><th>NIF</th><th>Contacto</th><th>Origen</th>
              <th>Estado</th><th className={s.right}>Expedientes</th><th className={s.right}>Facturado</th>
            </tr></thead>
            <tbody>
              {clisFiltrados.map(c => {
                const exps = expsPorCliente[c.id] || []
                const est = ESTADOS_CLIENTE.find(x => x.id === c.estado) || ESTADOS_CLIENTE[0]
                return (
                  <tr key={c.id} className={s.rowClick} onClick={() => setAbierto({ tipo: 'cliente', id: c.id })}>
                    <td>
                      <div className={s.strong}>{c.nombre}</div>
                      <div className={s.muted} style={{ fontSize: 12 }}>{c.tipo === 'juridica' ? 'Persona jurídica' : 'Persona física'}{c.contacto ? ` · ${c.contacto}` : ''}</div>
                    </td>
                    <td className={`${s.muted} ${s.num}`}>{c.nif || '—'}</td>
                    <td className={s.muted} style={{ fontSize: 12 }}>
                      {c.email || '—'}{c.telefono ? <><br />{c.telefono}</> : null}
                    </td>
                    <td className={s.muted}>{origen(c.origen)}</td>
                    <td><span className={`${s.tag} ${s[est.clase]}`}>{est.label}</span></td>
                    <td className={`${s.right} ${s.num}`}>{exps.length}</td>
                    <td className={`${s.right} ${s.num}`}>{eur(exps.reduce((t, e) => t + (Number(e.facturado) || 0), 0))}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )

  /* ---------------- ficha de expediente ---------------- */

  const fichaExpediente = (e) => {
    const cli = clientes.find(c => c.id === e.cliente_id)
    const actos = actuaciones.filter(a => a.expediente_id === e.id)
    const susPlazos = plazos.filter(p =>
      (e.cliente_nombre && norm(p.cliente) === norm(e.cliente_nombre)) ||
      norm(p.asunto) === norm(e.titulo))
    const pend = Math.max(0, (Number(e.honorarios) || 0) - (Number(e.facturado) || 0))
    const prio = PRIORIDADES.find(p => p.id === e.prioridad) || PRIORIDADES[1]

    return (
      <>
        <button className={s.btn} onClick={() => setAbierto(null)} style={{ marginBottom: 14 }}>← Volver</button>

        <div className={s.fichaHead}>
          <div className={s.fichaRef}>Expediente {e.referencia}</div>
          <div className={s.fichaTitle}>{e.titulo}</div>
          <div className={s.fichaClient}>{e.cliente_nombre || 'Sin cliente asignado'}</div>
          <div className={s.fichaMeta}>
            <Etiqueta f={e.fase} />
            <span className={`${s.tag} ${s.tagGold}`}>{e.materia}</span>
            <span className={s.tag} style={{ background: prio.color + '22', color: prio.color }}>Prioridad {prio.label}</span>
          </div>
        </div>

        <div className={s.fichaGrid}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className={s.card}>
              <div className={s.cardHead}>
                <div className={s.cardTitle}>Datos del asunto</div>
                <select className={s.sel} value={e.fase} onChange={ev => cambiarFase(e, ev.target.value)}>
                  {FASES.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
              </div>
              <div className={s.dl}>
                <div className={s.dt}>Vía</div><div className={s.dd}>{via(e.via)}</div>
                <div className={s.dt}>Órgano</div><div className={s.dd}>{e.organo || '—'}</div>
                <div className={s.dt}>Procedimiento</div><div className={s.dd}>{e.procedimiento || '—'}</div>
                <div className={s.dt}>Responsable</div><div className={s.dd}>{e.responsable || '—'}</div>
                <div className={s.dt}>Cuantía</div><div className={s.dd}>{e.cuantia ? eur(e.cuantia, 2) : '—'}</div>
                <div className={s.dt}>Alta</div><div className={s.dd}>{fecha(e.fecha_alta, true)}</div>
                {e.fecha_cierre && <><div className={s.dt}>Cierre</div><div className={s.dd}>{fecha(e.fecha_cierre, true)}</div></>}
                {e.notas && <><div className={s.dt}>Notas</div><div className={s.dd} style={{ whiteSpace: 'pre-wrap' }}>{e.notas}</div></>}
              </div>
            </div>

            <div className={s.card}>
              <div className={s.cardHead}><div className={s.cardTitle}>Cronología</div></div>
              <div style={{ padding: '14px 18px 0' }}>
                <div className={s.row2}>
                  <div className={s.field}>
                    <label className={s.label}>Tipo</label>
                    <select className={s.input} value={nuevaAct.tipo} onChange={ev => setNuevaAct(a => ({ ...a, tipo: ev.target.value }))}>
                      {TIPOS_ACTUACION.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Fecha</label>
                    <input type="date" className={s.input} value={nuevaAct.fecha} onChange={ev => setNuevaAct(a => ({ ...a, fecha: ev.target.value }))} />
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Actuación</label>
                  <input className={s.input} placeholder="Presentadas alegaciones al acta A02-..." value={nuevaAct.titulo}
                    onChange={ev => setNuevaAct(a => ({ ...a, titulo: ev.target.value }))}
                    onKeyDown={ev => ev.key === 'Enter' && anotar(e)} />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Detalle <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(opcional)</span></label>
                  <textarea className={`${s.input} ${s.textarea}`} value={nuevaAct.detalle}
                    onChange={ev => setNuevaAct(a => ({ ...a, detalle: ev.target.value }))} />
                </div>
                <button className={`${s.btn} ${s.btnDark}`} onClick={() => anotar(e)} disabled={!nuevaAct.titulo.trim()}>Registrar actuación</button>
              </div>
              <div className={s.timeline} style={{ marginTop: 18 }}>
                {actos.map(a => (
                  <div key={a.id} className={s.tlItem} style={{ position: 'relative' }}>
                    <span className={s.tlDot} />
                    <div className={s.tlDate}>{fecha(a.fecha)} · {tipoAct(a.tipo)}</div>
                    <div className={s.tlTitle}>{a.titulo}</div>
                    {a.detalle && <div className={s.tlText}>{a.detalle}</div>}
                    <button className={s.tlDel} title="Eliminar" onClick={() => borrarActuacion(a.id)}>✕</button>
                  </div>
                ))}
                {!actos.length && <div className={s.emptyText}>Sin actuaciones registradas todavía.</div>}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className={s.card}>
              <div className={s.cardHead}><div className={s.cardTitle}>Honorarios</div></div>
              <div className={s.dl}>
                <div className={s.dt}>Fijos</div><div className={s.dd}>{eur(e.honorarios, 2)}</div>
                {e.variable && <><div className={s.dt}>Variables</div><div className={s.dd}>{e.variable}</div></>}
                <div className={s.dt}>Provisión</div><div className={s.dd}>{eur(e.provision, 2)}</div>
                <div className={s.dt}>Facturado</div><div className={s.dd}>{eur(e.facturado, 2)}</div>
                <div className={s.dt}>Pendiente</div>
                <div className={s.dd} style={{ color: pend > 0 ? '#C0392B' : '#1A6B4A', fontWeight: 500 }}>{eur(pend, 2)}</div>
              </div>
            </div>

            {cli && (
              <div className={s.card}>
                <div className={s.cardHead}>
                  <div className={s.cardTitle}>Cliente</div>
                  <button className={`${s.btn} ${s.btnMini}`} onClick={() => setAbierto({ tipo: 'cliente', id: cli.id })}>Ver ficha</button>
                </div>
                <div className={s.dl}>
                  <div className={s.dt}>Nombre</div><div className={s.dd}>{cli.nombre}</div>
                  <div className={s.dt}>NIF</div><div className={s.dd}>{cli.nif || '—'}</div>
                  <div className={s.dt}>Email</div>
                  <div className={s.dd}>{cli.email ? <a href={`mailto:${cli.email}`} style={{ color: '#B8975A' }}>{cli.email}</a> : '—'}</div>
                  <div className={s.dt}>Teléfono</div>
                  <div className={s.dd}>{cli.telefono ? <a href={`tel:${cli.telefono}`} style={{ color: '#B8975A' }}>{cli.telefono}</a> : '—'}</div>
                </div>
              </div>
            )}

            <div className={s.card}>
              <div className={s.cardHead}><div className={s.cardTitle}>Vencimientos</div></div>
              <div className={s.cardBody}>
                {susPlazos.map(p => {
                  const d = diasHasta(p.vencimiento)
                  return (
                    <div key={p.id} className={s.mini}>
                      <div className={s.miniMain}>
                        <div className={s.miniName}>{p.tipo_label}</div>
                        <div className={s.miniSub}>{fecha(p.vencimiento)}</div>
                      </div>
                      <div className={s.miniSide}>{d < 0 ? 'vencido' : `${d} d.`}</div>
                    </div>
                  )
                })}
                {!susPlazos.length && <div className={s.emptyText} style={{ padding: '10px 0' }}>Sin plazos asociados.</div>}
                <button className={s.btn} style={{ marginTop: 10, width: '100%', justifyContent: 'center' }} onClick={() => plazoDesde(e)}>
                  Calcular un plazo de este asunto
                </button>
              </div>
            </div>

            <div className={s.card}>
              <div className={s.cardHead}><div className={s.cardTitle}>Acciones</div></div>
              <div className={s.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14 }}>
                <button className={s.btn} style={{ justifyContent: 'center' }} onClick={() => encargoDesde(e)}>Redactar hoja de encargo</button>
                <button className={s.btn} style={{ justifyContent: 'center' }} onClick={() => abrirDrawer('expediente', {
                  ...e,
                  honorarios: e.honorarios || '', provision: e.provision || '', facturado: e.facturado || '', cuantia: e.cuantia || '',
                })}>Editar expediente</button>
                <button className={`${s.btn} ${s.btnDanger}`} style={{ justifyContent: 'center' }} onClick={() => borrarExpediente(e)}>Eliminar expediente</button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ---------------- ficha de cliente ---------------- */

  const fichaCliente = (c) => {
    const exps = expsPorCliente[c.id] || []
    const est = ESTADOS_CLIENTE.find(x => x.id === c.estado) || ESTADOS_CLIENTE[0]
    return (
      <>
        <button className={s.btn} onClick={() => setAbierto(null)} style={{ marginBottom: 14 }}>← Volver</button>

        <div className={s.fichaHead}>
          <div className={s.fichaRef}>{c.tipo === 'juridica' ? 'Persona jurídica' : 'Persona física'}</div>
          <div className={s.fichaTitle}>{c.nombre}</div>
          <div className={s.fichaClient}>{c.nif || 'Sin NIF registrado'}</div>
          <div className={s.fichaMeta}>
            <span className={`${s.tag} ${s[est.clase]}`}>{est.label}</span>
            <span className={`${s.tag} ${s.tagGold}`}>{origen(c.origen)}</span>
          </div>
        </div>

        <div className={s.fichaGrid}>
          <div className={s.card}>
            <div className={s.cardHead}>
              <div className={s.cardTitle}>Expedientes ({exps.length})</div>
              <button className={`${s.btn} ${s.btnMini}`} onClick={() => abrirDrawer('expediente', { ...EXP_VACIO, cliente_id: c.id, cliente_nombre: c.nombre })}>+ Nuevo</button>
            </div>
            {exps.length ? (
              <table className={s.table}>
                <thead><tr><th>Ref.</th><th>Asunto</th><th>Fase</th><th className={s.right}>Honorarios</th><th className={s.right}>Facturado</th></tr></thead>
                <tbody>
                  {exps.map(e => (
                    <tr key={e.id} className={s.rowClick} onClick={() => setAbierto({ tipo: 'expediente', id: e.id })}>
                      <td className={`${s.num} ${s.muted}`}>{e.referencia}</td>
                      <td className={s.strong}>{e.titulo}</td>
                      <td><Etiqueta f={e.fase} /></td>
                      <td className={`${s.right} ${s.num}`}>{eur(e.honorarios)}</td>
                      <td className={`${s.right} ${s.num}`}>{eur(e.facturado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div className={s.emptyText} style={{ padding: '22px 18px' }}>Este cliente aún no tiene expedientes.</div>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className={s.card}>
              <div className={s.cardHead}><div className={s.cardTitle}>Contacto</div></div>
              <div className={s.dl}>
                {c.contacto && <><div className={s.dt}>Persona</div><div className={s.dd}>{c.contacto}</div></>}
                <div className={s.dt}>Email</div>
                <div className={s.dd}>{c.email ? <a href={`mailto:${c.email}`} style={{ color: '#B8975A' }}>{c.email}</a> : '—'}</div>
                <div className={s.dt}>Teléfono</div>
                <div className={s.dd}>{c.telefono ? <a href={`tel:${c.telefono}`} style={{ color: '#B8975A' }}>{c.telefono}</a> : '—'}</div>
                <div className={s.dt}>Dirección</div><div className={s.dd}>{[c.direccion, c.ciudad].filter(Boolean).join(', ') || '—'}</div>
                <div className={s.dt}>Responsable</div><div className={s.dd}>{c.responsable || '—'}</div>
                <div className={s.dt}>Alta</div><div className={s.dd}>{fecha(c.created_at)}</div>
                {c.notas && <><div className={s.dt}>Notas</div><div className={s.dd} style={{ whiteSpace: 'pre-wrap' }}>{c.notas}</div></>}
              </div>
            </div>

            <div className={s.card}>
              <div className={s.cardHead}><div className={s.cardTitle}>Acciones</div></div>
              <div className={s.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14 }}>
                <button className={s.btn} style={{ justifyContent: 'center' }} onClick={() => abrirDrawer('cliente', { ...c })}>Editar ficha</button>
                <button className={`${s.btn} ${s.btnDanger}`} style={{ justifyContent: 'center' }} onClick={() => borrarCliente(c)}>Eliminar cliente</button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ---------------- formularios ---------------- */

  const formularioCliente = () => {
    const f = drawer.form
    return (
      <>
        {drawer.error && <div className={s.error}>{drawer.error}</div>}
        <div className={s.field}>
          <label className={s.label}>Nombre o razón social *</label>
          <input className={s.input} value={f.nombre} onChange={e => campo('nombre', e.target.value)} autoFocus />
        </div>
        <div className={s.row2}>
          <div className={s.field}>
            <label className={s.label}>Tipo</label>
            <select className={s.input} value={f.tipo} onChange={e => campo('tipo', e.target.value)}>
              <option value="fisica">Persona física</option>
              <option value="juridica">Persona jurídica</option>
            </select>
          </div>
          <div className={s.field}>
            <label className={s.label}>NIF / CIF</label>
            <input className={s.input} value={f.nif} onChange={e => campo('nif', e.target.value)} />
          </div>
        </div>
        {f.tipo === 'juridica' && (
          <div className={s.field}>
            <label className={s.label}>Persona de contacto</label>
            <input className={s.input} value={f.contacto} onChange={e => campo('contacto', e.target.value)} />
          </div>
        )}
        <div className={s.row2}>
          <div className={s.field}>
            <label className={s.label}>Email</label>
            <input className={s.input} type="email" value={f.email} onChange={e => campo('email', e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Teléfono</label>
            <input className={s.input} value={f.telefono} onChange={e => campo('telefono', e.target.value)} />
          </div>
        </div>
        <div className={s.row2}>
          <div className={s.field}>
            <label className={s.label}>Dirección</label>
            <input className={s.input} value={f.direccion} onChange={e => campo('direccion', e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Ciudad</label>
            <input className={s.input} value={f.ciudad} onChange={e => campo('ciudad', e.target.value)} />
          </div>
        </div>

        <div className={s.groupLbl}>Seguimiento</div>
        <div className={s.row3}>
          <div className={s.field}>
            <label className={s.label}>Estado</label>
            <select className={s.input} value={f.estado} onChange={e => campo('estado', e.target.value)}>
              {ESTADOS_CLIENTE.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
            </select>
          </div>
          <div className={s.field}>
            <label className={s.label}>Origen</label>
            <select className={s.input} value={f.origen} onChange={e => campo('origen', e.target.value)}>
              {ORIGENES.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
          <div className={s.field}>
            <label className={s.label}>Responsable</label>
            <input className={s.input} value={f.responsable} onChange={e => campo('responsable', e.target.value)} />
          </div>
        </div>
        <div className={s.field}>
          <label className={s.label}>Notas</label>
          <textarea className={`${s.input} ${s.textarea}`} value={f.notas} onChange={e => campo('notas', e.target.value)} />
        </div>
      </>
    )
  }

  const formularioExpediente = () => {
    const f = drawer.form
    return (
      <>
        {drawer.error && <div className={s.error}>{drawer.error}</div>}
        <div className={s.field}>
          <label className={s.label}>Asunto *</label>
          <input className={s.input} value={f.titulo} onChange={e => campo('titulo', e.target.value)}
            placeholder="Derivación de responsabilidad art. 42.1.a) LGT" autoFocus />
        </div>
        <div className={s.row2}>
          <div className={s.field}>
            <label className={s.label}>Cliente</label>
            <select className={s.input} value={f.cliente_id || ''} onChange={e => campo('cliente_id', e.target.value)}>
              <option value="">— Sin asignar —</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            {!clientes.length && <div className={s.hint}>Crea antes una ficha de cliente para poder vincularla.</div>}
          </div>
          <div className={s.field}>
            <label className={s.label}>Referencia</label>
            <input className={s.input} value={f.referencia} onChange={e => campo('referencia', e.target.value)} placeholder="Automática" />
            <div className={s.hint}>Si lo dejas vacío se numera solo: {new Date().getFullYear()}/001</div>
          </div>
        </div>
        <div className={s.row2}>
          <div className={s.field}>
            <label className={s.label}>Materia</label>
            <select className={s.input} value={f.materia} onChange={e => campo('materia', e.target.value)}>
              {MATERIAS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className={s.field}>
            <label className={s.label}>Fase</label>
            <select className={s.input} value={f.fase} onChange={e => campo('fase', e.target.value)}>
              {FASES.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
            </select>
          </div>
        </div>

        <div className={s.groupLbl}>Tramitación</div>
        <div className={s.row2}>
          <div className={s.field}>
            <label className={s.label}>Vía</label>
            <select className={s.input} value={f.via} onChange={e => campo('via', e.target.value)}>
              {VIAS.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
            </select>
          </div>
          <div className={s.field}>
            <label className={s.label}>Órgano</label>
            <input className={s.input} value={f.organo} onChange={e => campo('organo', e.target.value)} placeholder="AEAT · TEAR de Madrid · JCA nº 3" />
          </div>
        </div>
        <div className={s.row3}>
          <div className={s.field}>
            <label className={s.label}>Nº procedimiento</label>
            <input className={s.input} value={f.procedimiento} onChange={e => campo('procedimiento', e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Responsable</label>
            <input className={s.input} value={f.responsable} onChange={e => campo('responsable', e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Prioridad</label>
            <select className={s.input} value={f.prioridad} onChange={e => campo('prioridad', e.target.value)}>
              {PRIORIDADES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
        </div>
        <div className={s.row2}>
          <div className={s.field}>
            <label className={s.label}>Fecha de alta</label>
            <input type="date" className={s.input} value={f.fecha_alta || ''} onChange={e => campo('fecha_alta', e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Cuantía del asunto (€)</label>
            <input className={s.input} inputMode="decimal" value={f.cuantia} onChange={e => campo('cuantia', e.target.value)} placeholder="0,00" />
          </div>
        </div>

        <div className={s.groupLbl}>Honorarios</div>
        <div className={s.row3}>
          <div className={s.field}>
            <label className={s.label}>Fijos (€)</label>
            <input className={s.input} inputMode="decimal" value={f.honorarios} onChange={e => campo('honorarios', e.target.value)} placeholder="0,00" />
          </div>
          <div className={s.field}>
            <label className={s.label}>Provisión (€)</label>
            <input className={s.input} inputMode="decimal" value={f.provision} onChange={e => campo('provision', e.target.value)} placeholder="0,00" />
          </div>
          <div className={s.field}>
            <label className={s.label}>Facturado (€)</label>
            <input className={s.input} inputMode="decimal" value={f.facturado} onChange={e => campo('facturado', e.target.value)} placeholder="0,00" />
          </div>
        </div>
        <div className={s.field}>
          <label className={s.label}>Honorarios variables</label>
          <input className={s.input} value={f.variable} onChange={e => campo('variable', e.target.value)} placeholder="10% del ahorro fiscal obtenido" />
        </div>
        <div className={s.field}>
          <label className={s.label}>Notas</label>
          <textarea className={`${s.input} ${s.textarea}`} value={f.notas} onChange={e => campo('notas', e.target.value)}
            placeholder="Antecedentes, estrategia, documentación pendiente..." />
        </div>
      </>
    )
  }

  const cajon = () => (
    <div className={s.overlay} onMouseDown={ev => ev.target === ev.currentTarget && cerrarDrawer()}>
      <div className={s.drawer}>
        <div className={s.drawerHead}>
          <div className={s.drawerTitle}>
            {drawer.tipo === 'cliente'
              ? (drawer.form.id ? 'Editar cliente' : 'Nuevo cliente')
              : (drawer.form.id ? 'Editar expediente' : 'Nuevo expediente')}
          </div>
          <button className={s.closeX} onClick={cerrarDrawer} aria-label="Cerrar">✕</button>
        </div>
        <div className={s.drawerBody}>
          {drawer.tipo === 'cliente' ? formularioCliente() : formularioExpediente()}
        </div>
        <div className={s.drawerFoot}>
          <button className={s.btn} onClick={cerrarDrawer}>Cancelar</button>
          <button className={`${s.btn} ${s.btnDark}`} disabled={drawer.guardando}
            onClick={drawer.tipo === 'cliente' ? guardarCliente : guardarExpediente}>
            {drawer.guardando ? 'Guardando...' : drawer.form.id ? 'Guardar cambios' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  )

  /* ---------------- render ---------------- */

  if (sinTablas) return (
    <div className={s.crm}>
      <div className={s.body}>
        <div className={s.empty} style={{ maxWidth: 640, margin: '0 auto', textAlign: 'left' }}>
          <div className={s.emptyTitle}>Falta crear las tablas del CRM</div>
          <div className={s.emptyText}>
            El panel está listo, pero Supabase todavía no tiene las tablas donde guardar clientes y expedientes.
            Abre Supabase → SQL Editor, pega el contenido de <strong>data/crm-schema.sql</strong> y ejecútalo.
            Después vuelve aquí y recarga.
          </div>
          <button className={`${s.btn} ${s.btnDark}`} onClick={cargar}>Reintentar</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className={s.crm}>
      {cabecera()}
      <div className={s.body}>
        {aviso && <div className={s.error} style={{ background: '#FEF6E7', color: '#8a6f38' }}>{aviso}</div>}
        {cargando ? (
          <div className={s.loading}><span className={s.spin} /> Cargando la cartera...</div>
        ) : expAbierto ? fichaExpediente(expAbierto)
          : cliAbierto ? fichaCliente(cliAbierto)
            : vista === 'panel' ? panel()
              : vista === 'pipeline' ? pipeline()
                : vista === 'expedientes' ? listaExpedientes()
                  : listaClientes()}
      </div>
      {drawer && cajon()}
    </div>
  )
}
