'use client'
import { useEffect, useMemo, useState } from 'react'
import s from './crm.module.css'
import h from './honorarios.module.css'

/* =====================================================================
   HONORARIOS
   Qué tengo pendiente de facturar, qué está facturado y sin cobrar, y qué
   honorarios variables (normalmente un % de la cuantía) siguen en
   expectativa hasta que se devenguen. Todo agrupado y editable por cliente.
   ===================================================================== */

const ESTADOS = [
  { id: 'previsto', label: 'Por devengar', labelVar: 'En expectativa', color: '#9ca3af', bg: '#f3f4f6' },
  { id: 'devengado', label: 'Pendiente de facturar', color: '#C0392B', bg: '#FDECEA' },
  { id: 'facturado', label: 'Facturado · sin cobrar', color: '#8a6f38', bg: 'rgba(184,151,90,.14)' },
  { id: 'cobrado', label: 'Cobrado', color: '#1A6B4A', bg: '#E8F5EE' },
  { id: 'anulado', label: 'No devengado', color: '#9ca3af', bg: '#f7f7f8' },
]
const estadoDe = (id) => ESTADOS.find(e => e.id === id) || ESTADOS[0]
const etiquetaEstado = (l) => {
  const e = estadoDe(l.estado)
  return l.tipo === 'variable' && e.labelVar ? e.labelVar : e.label
}

const FILTROS = [
  { id: 'pendiente', label: 'Pendiente de facturar', test: l => l.estado === 'devengado' },
  { id: 'cobro', label: 'Pendiente de cobro', test: l => l.estado === 'facturado' },
  { id: 'variables', label: 'Variables en expectativa', test: l => l.tipo === 'variable' && l.estado === 'previsto' },
  { id: 'previstos', label: 'Fijos por devengar', test: l => l.tipo !== 'variable' && l.estado === 'previsto' },
  { id: 'cobrado', label: 'Cobrado', test: l => l.estado === 'cobrado' },
  { id: 'todos', label: 'Todos', test: () => true },
]

const IVA = 0.21
const hoyISO = () => new Date().toISOString().split('T')[0]
const año = new Date().getFullYear()

const eur = (n, dec = 2) => (Number(n) || 0).toLocaleString('es-ES', {
  style: 'currency', currency: 'EUR', useGrouping: 'always', minimumFractionDigits: dec, maximumFractionDigits: dec,
})
const pct = (n) => (Number(n) || 0).toLocaleString('es-ES', { maximumFractionDigits: 2 })
const num = (v) => {
  if (typeof v === 'number') return v
  let t = String(v ?? '').trim().replace(/[€\s]/g, '')
  if (!t) return NaN
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.')
  else if ((t.match(/\./g) || []).length > 1 || /^-?\d{1,3}\.\d{3}$/.test(t)) t = t.replace(/\./g, '')
  return parseFloat(t)
}
const fecha = (v) => {
  if (!v) return ''
  const d = new Date(String(v).slice(0, 10) + 'T00:00:00')
  return isNaN(d) ? '' : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}
const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// Importe efectivo de un concepto: el guardado o, en un variable sin importe, base × %
const importeDe = (l) => {
  const i = Number(l.importe) || 0
  if (i || l.tipo !== 'variable') return i
  const b = Number(l.base), p = Number(l.porcentaje)
  return b && p ? Math.round(b * p) / 100 : 0
}

const api = async (url, opts = {}) => {
  const res = await fetch(url, {
    cache: 'no-store', credentials: 'same-origin', ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  })
  if (res.status === 401) { window.location.replace('/admin?sesion=caducada'); throw new Error('Sesión caducada') }
  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    throw new Error(j.error || 'No se pudo conectar con el servidor')
  }
  return res.json()
}

const VACIO = {
  cliente_id: '', expediente_id: '', tipo: 'fijo', concepto: '', importe: '', porcentaje: '', base: '',
  base_desc: '', condicion: '', estado: 'previsto', fecha_devengo: '', factura: '', fecha_factura: '', fecha_cobro: '', notas: '',
}

// Conceptos que salen de los datos que ya tiene un expediente
export function lineasDesdeExpediente(exp) {
  const out = []
  const hon = Number(exp.honorarios) || 0
  const fac = Number(exp.facturado) || 0
  const avanzado = ['contratado', 'en_curso', 'cerrado'].includes(exp.fase)
  if (hon > 0) {
    if (fac > 0) out.push({ tipo: 'fijo', concepto: 'Honorarios fijos (ya facturados)', importe: Math.min(fac, hon), estado: 'facturado', fecha_factura: null })
    if (hon - fac > 0) out.push({ tipo: 'fijo', concepto: 'Honorarios fijos', importe: hon - fac, estado: avanzado ? 'devengado' : 'previsto' })
  }
  const v = String(exp.variable || '').trim()
  const m = /(\d+(?:[.,]\d+)?)\s*%/.exec(v)
  if (m) {
    const resto = v.slice(m.index + m[0].length).trim()
    out.push({
      tipo: 'variable', concepto: 'Honorarios variables', porcentaje: m[1], base: Number(exp.cuantia) || null,
      base_desc: resto, importe: '', estado: exp.fase === 'perdido' ? 'anulado' : 'previsto',
    })
  } else if (v) {
    out.push({ tipo: 'variable', concepto: 'Honorarios variables: ' + v, importe: 0, estado: exp.fase === 'perdido' ? 'anulado' : 'previsto' })
  }
  return out.map(l => ({ ...l, expediente_id: exp.id, cliente_id: exp.cliente_id || null, cliente_nombre: exp.cliente_nombre || '' }))
}

export default function Honorarios({ filtro }) {
  const [clientes, setClientes] = useState([])
  const [expedientes, setExpedientes] = useState([])
  const [lineas, setLineas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [sinTabla, setSinTabla] = useState(false)
  const [aviso, setAviso] = useState('')

  const [fEstado, setFEstado] = useState('pendiente')
  const [fTipo, setFTipo] = useState('')
  const [fCliente, setFCliente] = useState('')
  const [busca, setBusca] = useState('')
  const [conIva, setConIva] = useState(false)
  const [cerrados, setCerrados] = useState({})
  const [drawer, setDrawer] = useState(null)
  const [generando, setGenerando] = useState('')

  const cargar = async () => {
    setCargando(true); setAviso(''); setSinTabla(false)
    try {
      const [cli, exp] = await Promise.all([api('/api/crm/clientes'), api('/api/crm/expedientes')])
      setClientes(cli); setExpedientes(exp)
    } catch (e) { setAviso(e.message) }
    try {
      setLineas(await api('/api/crm/honorarios'))
    } catch (e) {
      if (/does not exist|schema cache|relation/i.test(e.message)) setSinTabla(true)
      else setAviso(e.message)
    }
    setCargando(false)
  }
  useEffect(() => { cargar() }, [])

  // Llegada desde la ficha de un expediente o cliente del CRM
  useEffect(() => {
    if (!filtro) return
    if (filtro.clienteId) setFCliente(filtro.clienteId)
    setFEstado('todos')
  }, [filtro])

  const flash = (t) => { setAviso(t); setTimeout(() => setAviso(''), 4000) }
  const conI = (n) => (conIva ? n * (1 + IVA) : n)

  /* ---------------- derivados ---------------- */

  const expPorId = useMemo(() => Object.fromEntries(expedientes.map(e => [e.id, e])), [expedientes])
  const cliPorId = useMemo(() => Object.fromEntries(clientes.map(c => [c.id, c])), [clientes])
  const clienteDe = (l) => l.cliente_id || expPorId[l.expediente_id]?.cliente_id || ''
  const nombreCliente = (l) => cliPorId[clienteDe(l)]?.nombre || l.cliente_nombre || expPorId[l.expediente_id]?.cliente_nombre || 'Sin cliente'

  const kpis = useMemo(() => {
    const suma = (f) => lineas.filter(f).reduce((t, l) => t + importeDe(l), 0)
    const cuenta = (f) => lineas.filter(f).length
    return {
      pendiente: suma(l => l.estado === 'devengado'), nPendiente: cuenta(l => l.estado === 'devengado'),
      cobro: suma(l => l.estado === 'facturado'), nCobro: cuenta(l => l.estado === 'facturado'),
      variables: suma(l => l.tipo === 'variable' && l.estado === 'previsto'), nVariables: cuenta(l => l.tipo === 'variable' && l.estado === 'previsto'),
      previstos: suma(l => l.tipo !== 'variable' && l.estado === 'previsto'), nPrevistos: cuenta(l => l.tipo !== 'variable' && l.estado === 'previsto'),
      cobradoAño: suma(l => l.estado === 'cobrado' && String(l.fecha_cobro || '').startsWith(String(año))),
    }
  }, [lineas])

  const filtradas = useMemo(() => {
    const f = FILTROS.find(x => x.id === fEstado) || FILTROS[FILTROS.length - 1]
    const q = norm(busca)
    return lineas.filter(l => {
      if (!f.test(l)) return false
      if (fTipo && (l.tipo || 'fijo') !== fTipo) return false
      if (fCliente && clienteDe(l) !== fCliente) return false
      if (!q) return true
      const e = expPorId[l.expediente_id]
      return [l.concepto, nombreCliente(l), e?.referencia, e?.titulo, l.factura].some(v => norm(v).includes(q))
    })
  }, [lineas, fEstado, fTipo, fCliente, busca, expPorId, cliPorId]) // eslint-disable-line react-hooks/exhaustive-deps

  const grupos = useMemo(() => {
    const m = new Map()
    for (const l of filtradas) {
      const k = clienteDe(l) || 'nombre:' + nombreCliente(l)
      if (!m.has(k)) m.set(k, { id: clienteDe(l), nombre: nombreCliente(l), lineas: [] })
      m.get(k).lineas.push(l)
    }
    const out = [...m.values()].map(g => {
      const t = (f) => g.lineas.filter(f).reduce((a, l) => a + importeDe(l), 0)
      return {
        ...g,
        pendiente: t(l => l.estado === 'devengado'),
        cobro: t(l => l.estado === 'facturado'),
        variables: t(l => l.tipo === 'variable' && l.estado === 'previsto'),
        exps: new Set(g.lineas.map(l => l.expediente_id).filter(Boolean)).size,
      }
    })
    return out.sort((a, b) => (b.pendiente - a.pendiente) || (b.cobro - a.cobro) || a.nombre.localeCompare(b.nombre))
  }, [filtradas]) // eslint-disable-line react-hooks/exhaustive-deps

  // Expedientes con honorarios en la ficha pero sin conceptos aquí
  const sinDesglosar = useMemo(() => {
    const conLineas = new Set(lineas.map(l => l.expediente_id))
    return expedientes
      .filter(e => !conLineas.has(e.id) && e.fase !== 'perdido' && ((Number(e.honorarios) || 0) > 0 || String(e.variable || '').trim()))
      .filter(e => !fCliente || e.cliente_id === fCliente)
  }, [expedientes, lineas, fCliente])

  const conteo = useMemo(() => Object.fromEntries(FILTROS.map(f => [f.id, lineas.filter(f.test).length])), [lineas])

  /* ---------------- acciones ---------------- */

  const guardar = async () => {
    const f = drawer.form
    if (!String(f.concepto || '').trim()) { setDrawer(d => ({ ...d, error: 'Indica el concepto' })); return }
    if (!f.cliente_id && !f.expediente_id) { setDrawer(d => ({ ...d, error: 'Elige el cliente o el expediente' })); return }
    const exp = expPorId[f.expediente_id]
    const cliId = f.cliente_id || exp?.cliente_id || null
    const cuerpo = {
      ...f,
      cliente_id: cliId,
      cliente_nombre: cliPorId[cliId]?.nombre || exp?.cliente_nombre || '',
      importe: f.tipo === 'variable' && String(f.importe).trim() === '' ? '' : f.importe,
    }
    setDrawer(d => ({ ...d, guardando: true, error: '' }))
    try {
      if (f.id) {
        const act = await api('/api/crm/honorarios', { method: 'PATCH', body: JSON.stringify(cuerpo) })
        setLineas(l => l.map(x => (x.id === act.id ? act : x)))
        flash('Honorario actualizado')
      } else {
        const nuevo = await api('/api/crm/honorarios', { method: 'POST', body: JSON.stringify(cuerpo) })
        setLineas(l => [...l, nuevo])
        flash('Honorario añadido')
      }
      setDrawer(null)
    } catch (e) { setDrawer(d => ({ ...d, guardando: false, error: e.message })) }
  }

  const cambiarEstado = async (l, estado) => {
    const previo = lineas
    setLineas(ls => ls.map(x => (x.id === l.id ? { ...x, estado } : x)))
    try {
      const act = await api('/api/crm/honorarios', { method: 'PATCH', body: JSON.stringify({ id: l.id, estado }) })
      setLineas(ls => ls.map(x => (x.id === act.id ? act : x)))
    } catch (e) { setLineas(previo); flash(e.message) }
  }

  const borrar = async (l) => {
    if (!confirm(`¿Eliminar «${l.concepto}»?`)) return
    try {
      await api('/api/crm/honorarios?id=' + encodeURIComponent(l.id), { method: 'DELETE' })
      setLineas(ls => ls.filter(x => x.id !== l.id))
      setDrawer(null); flash('Honorario eliminado')
    } catch (e) { flash(e.message) }
  }

  const generar = async (exps) => {
    const nuevas = exps.flatMap(lineasDesdeExpediente)
    if (!nuevas.length) return
    setGenerando(exps.length === 1 ? exps[0].id : 'todos')
    try {
      const creadas = await api('/api/crm/honorarios', { method: 'POST', body: JSON.stringify(nuevas) })
      setLineas(l => [...l, ...creadas])
      flash(`${creadas.length} concepto(s) generados. Revisa los estados y fechas.`)
      setFEstado('todos')
    } catch (e) { flash(e.message) }
    setGenerando('')
  }

  const abrir = (datos) => setDrawer({ form: { ...VACIO, ...datos }, guardando: false, error: '' })
  // En un variable cuyo importe es justo base × %, se deja el importe en blanco para que
  // se recalcule solo si cambias el porcentaje o la base (éxito parcial, p. ej.)
  const importeAuto = (l) => l.tipo === 'variable' && l.base != null && l.porcentaje != null &&
    Math.abs((Number(l.importe) || 0) - Math.round(Number(l.base) * Number(l.porcentaje)) / 100) < 0.01
  const editar = (l, extra = {}) => abrir({
    ...l,
    importe: importeAuto(l) ? '' : (l.importe ?? ''), porcentaje: l.porcentaje ?? '', base: l.base ?? '',
    fecha_devengo: l.fecha_devengo || '', fecha_factura: l.fecha_factura || '', fecha_cobro: l.fecha_cobro || '',
    ...extra,
  })
  const campo = (k, v) => setDrawer(d => ({ ...d, form: { ...d.form, [k]: v } }))

  const exportarCSV = () => {
    const cab = ['Cliente', 'Expediente', 'Asunto', 'Concepto', 'Tipo', '%', 'Base', 'Importe (sin IVA)', 'Estado', 'Devengo', 'Factura', 'Fecha factura', 'Cobro']
    const filas = filtradas.map(l => {
      const e = expPorId[l.expediente_id]
      return [nombreCliente(l), e?.referencia, e?.titulo, l.concepto, l.tipo === 'variable' ? 'Variable' : 'Fijo',
        l.porcentaje ?? '', l.base ?? '', importeDe(l).toFixed(2).replace('.', ','), etiquetaEstado(l),
        l.fecha_devengo, l.factura, l.fecha_factura, l.fecha_cobro]
    })
    const csv = [cab, ...filas].map(f => f.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n')
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a'); a.href = url; a.download = `honorarios-${fEstado}-${hoyISO()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  /* ---------------- piezas ---------------- */

  const Estado = ({ l }) => {
    const e = estadoDe(l.estado)
    return <span className={h.estado} style={{ background: e.bg, color: e.color }}><span className={h.estadoDot} style={{ background: e.color }} />{etiquetaEstado(l)}</span>
  }

  const accionRapida = (l) => {
    if (l.estado === 'previsto') {
      return l.tipo === 'variable'
        ? <button className={h.quick} onClick={() => editar(l, { estado: 'devengado', fecha_devengo: hoyISO() })}>Se ha devengado…</button>
        : <button className={h.quick} onClick={() => cambiarEstado(l, 'devengado')}>Devengar</button>
    }
    if (l.estado === 'devengado') return <button className={`${h.quick} ${h.quickGo}`} onClick={() => editar(l, { estado: 'facturado', fecha_factura: hoyISO() })}>Facturar…</button>
    if (l.estado === 'facturado') return <button className={h.quick} onClick={() => cambiarEstado(l, 'cobrado')}>Marcar cobrado</button>
    return null
  }

  const filaLinea = (l) => {
    const e = expPorId[l.expediente_id]
    const imp = importeDe(l)
    return (
      <tr key={l.id} className={s.rowClick} onClick={() => editar(l)}>
        <td className={`${s.num} ${s.muted}`}>{e?.referencia || '—'}</td>
        <td>
          <div className={`${s.strong} ${l.estado === 'anulado' ? h.anulado : ''}`}>{l.concepto}</div>
          <div className={`${s.muted} ${h.asunto}`} title={e?.titulo || ''}>{e?.titulo || ''}</div>
        </td>
        <td className={h.hideM}>
          {l.tipo === 'variable'
            ? <><div className={h.tipoVar}>Variable{l.porcentaje != null && l.porcentaje !== '' ? ` · ${pct(l.porcentaje)} %` : ''}</div>
              {l.base ? <div className={h.formula}>s/ {eur(l.base)}{l.base_desc ? ` (${l.base_desc})` : ''}</div> : null}</>
            : <div className={h.tipoFijo}>Fijo</div>}
        </td>
        <td className={`${s.right} ${s.num}`} style={{ fontWeight: 500 }}>
          <span className={l.estado === 'anulado' ? h.anulado : ''}>{eur(conI(imp))}</span>
        </td>
        <td><Estado l={l} /></td>
        <td className={h.hideM}>
          <div className={h.fechas}>
            {l.fecha_devengo && <div>Devengo {fecha(l.fecha_devengo)}</div>}
            {l.fecha_factura && <div>Fra. {l.factura ? l.factura + ' · ' : ''}{fecha(l.fecha_factura)}</div>}
            {l.fecha_cobro && <div>Cobro {fecha(l.fecha_cobro)}</div>}
          </div>
        </td>
        <td className={s.right} onClick={ev => ev.stopPropagation()}>{accionRapida(l)}</td>
      </tr>
    )
  }

  /* ---------------- formulario ---------------- */

  const formulario = () => {
    const f = drawer.form
    const expsCliente = expedientes.filter(e => !f.cliente_id || e.cliente_id === f.cliente_id)
    const exp = expPorId[f.expediente_id]
    const p = num(f.porcentaje), b = num(f.base)
    const calculado = !isNaN(p) && !isNaN(b) ? Math.round(b * p) / 100 : null
    return (
      <>
        {drawer.error && <div className={s.error}>{drawer.error}</div>}
        <div className={s.row2}>
          <div className={s.field}>
            <label className={s.label}>Cliente</label>
            <select className={s.input} value={f.cliente_id || ''} onChange={e => { campo('cliente_id', e.target.value); if (exp && exp.cliente_id !== e.target.value) campo('expediente_id', '') }}>
              <option value="">— Elige —</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className={s.field}>
            <label className={s.label}>Expediente</label>
            <select className={s.input} value={f.expediente_id || ''} onChange={e => {
              const x = expPorId[e.target.value]
              campo('expediente_id', e.target.value)
              if (x?.cliente_id) campo('cliente_id', x.cliente_id)
            }}>
              <option value="">— Sin expediente —</option>
              {expsCliente.map(e => <option key={e.id} value={e.id}>{e.referencia} · {e.titulo}</option>)}
            </select>
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label}>Tipo</label>
          <div className={h.seg}>
            <button className={f.tipo !== 'variable' ? h.segOn : ''} onClick={() => campo('tipo', 'fijo')}>Fijo</button>
            <button className={f.tipo === 'variable' ? h.segOn : ''} onClick={() => {
              campo('tipo', 'variable')
              if (!f.base && exp?.cuantia) campo('base', String(exp.cuantia))
            }}>Variable (% de la cuantía)</button>
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label}>Concepto *</label>
          <input className={s.input} value={f.concepto} onChange={e => campo('concepto', e.target.value)}
            placeholder={f.tipo === 'variable' ? 'Honorarios variables en caso de estimación' : 'Escrito de alegaciones contra la comunicación de inicio'} />
        </div>

        {f.tipo === 'variable' ? (
          <>
            <div className={s.row3}>
              <div className={s.field}>
                <label className={s.label}>Porcentaje (%)</label>
                <input className={s.input} inputMode="decimal" value={f.porcentaje} onChange={e => campo('porcentaje', e.target.value)} placeholder="12" />
              </div>
              <div className={s.field}>
                <label className={s.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Base (€)
                  {exp?.cuantia ? <button className={h.linkBtn} onClick={() => campo('base', String(exp.cuantia))}>usar cuantía</button> : null}
                </label>
                <input className={s.input} inputMode="decimal" value={f.base} onChange={e => campo('base', e.target.value)} placeholder="17.931,00" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Importe (€)</label>
                <input className={s.input} inputMode="decimal" value={f.importe} onChange={e => campo('importe', e.target.value)}
                  placeholder={calculado !== null ? String(calculado).replace('.', ',') : 'Automático'} />
              </div>
            </div>
            {calculado !== null && (
              <div className={h.calc}>
                {pct(p)} % de {eur(b)} = <strong>{eur(calculado)}</strong> sin IVA
                {String(f.importe).trim() !== '' && Math.abs(num(f.importe) - calculado) > 0.005 && ' · usarás el importe que has escrito'}
                {String(f.importe).trim() === '' && ' · se guardará este importe'}
              </div>
            )}
            <div className={s.field}>
              <label className={s.label}>Sobre qué se calcula</label>
              <input className={s.input} value={f.base_desc} onChange={e => campo('base_desc', e.target.value)} placeholder="del importe derivado · del ahorro fiscal obtenido" />
              <div className={s.hint}>Si el éxito es parcial, cambia la base por la cantidad finalmente anulada o ahorrada.</div>
            </div>
            <div className={s.field}>
              <label className={s.label}>Se devenga…</label>
              <input className={s.input} value={f.condicion} onChange={e => campo('condicion', e.target.value)} placeholder="al notificarse la resolución estimatoria (total o parcial)" />
            </div>
          </>
        ) : (
          <div className={s.field}>
            <label className={s.label}>Importe (€, sin IVA)</label>
            <input className={s.input} inputMode="decimal" value={f.importe} onChange={e => campo('importe', e.target.value)} placeholder="100,00" />
          </div>
        )}

        <div className={s.groupLbl}>Seguimiento</div>
        <div className={s.row2}>
          <div className={s.field}>
            <label className={s.label}>Estado</label>
            <select className={s.input} value={f.estado} onChange={e => {
              const v = e.target.value
              campo('estado', v)
              if (v === 'devengado' && !f.fecha_devengo) campo('fecha_devengo', hoyISO())
              if (v === 'facturado' && !f.fecha_factura) campo('fecha_factura', hoyISO())
              if (v === 'cobrado' && !f.fecha_cobro) campo('fecha_cobro', hoyISO())
            }}>
              {ESTADOS.map(x => <option key={x.id} value={x.id}>{f.tipo === 'variable' && x.labelVar ? x.labelVar : x.label}</option>)}
            </select>
          </div>
          <div className={s.field}>
            <label className={s.label}>Fecha de devengo</label>
            <input type="date" className={s.input} value={f.fecha_devengo || ''} onChange={e => campo('fecha_devengo', e.target.value)} />
          </div>
        </div>
        {['facturado', 'cobrado'].includes(f.estado) && (
          <div className={s.row2}>
            <div className={s.field}>
              <label className={s.label}>Nº de factura</label>
              <input className={s.input} value={f.factura} onChange={e => campo('factura', e.target.value)} placeholder="2026-014" autoFocus={f.estado === 'facturado'} />
            </div>
            <div className={s.field}>
              <label className={s.label}>Fecha de factura</label>
              <input type="date" className={s.input} value={f.fecha_factura || ''} onChange={e => campo('fecha_factura', e.target.value)} />
            </div>
          </div>
        )}
        {f.estado === 'cobrado' && (
          <div className={s.field} style={{ maxWidth: '50%' }}>
            <label className={s.label}>Fecha de cobro</label>
            <input type="date" className={s.input} value={f.fecha_cobro || ''} onChange={e => campo('fecha_cobro', e.target.value)} />
          </div>
        )}
        <div className={s.field}>
          <label className={s.label}>Notas</label>
          <textarea className={`${s.input} ${s.textarea}`} value={f.notas} onChange={e => campo('notas', e.target.value)} />
        </div>
        {f.id && <button className={`${s.btn} ${s.btnDanger}`} onClick={() => borrar(f)}>Eliminar este concepto</button>}
      </>
    )
  }

  /* ---------------- render ---------------- */

  if (sinTabla) return (
    <div className={s.crm}>
      <div className={s.body}>
        <div className={s.empty} style={{ maxWidth: 640, margin: '0 auto', textAlign: 'left' }}>
          <div className={s.emptyTitle}>Falta crear la tabla de honorarios</div>
          <div className={s.emptyText}>
            Abre Supabase → SQL Editor, pega el contenido de <strong>data/honorarios-schema.sql</strong> y ejecútalo.
            Después vuelve aquí y pulsa «Reintentar». Los expedientes y clientes del CRM no se tocan.
          </div>
          <button className={`${s.btn} ${s.btnDark}`} onClick={cargar}>Reintentar</button>
        </div>
      </div>
    </div>
  )

  const Kpi = ({ id, valor, titulo, sub, clase }) => (
    <button className={`${s.kpi} ${clase} ${h.kpiBtn} ${fEstado === id ? h.kpiSel : ''}`} onClick={() => setFEstado(id)}>
      <div className={s.kpiN}>{eur(conI(valor), 0)}</div>
      <div className={s.kpiL}>{titulo}</div>
      <div className={s.kpiSub}>{sub}</div>
    </button>
  )

  return (
    <div className={s.crm}>
      <div className={h.topbar}>
        <span className={h.topHint}>Pendiente de facturar, cobros y honorarios variables por cliente</span>
        <div className={h.topRight}>
          <label className={h.iva}><input type="checkbox" checked={conIva} onChange={e => setConIva(e.target.checked)} /> Con IVA (21 %)</label>
          <button className={s.btn} onClick={exportarCSV} disabled={!filtradas.length}>Exportar CSV</button>
          <button className={`${s.btn} ${s.btnDark}`} onClick={() => abrir({ cliente_id: fCliente || '' })}>+ Honorario</button>
        </div>
      </div>

      <div className={s.body}>
        {aviso && <div className={s.error} style={{ background: '#FEF6E7', color: '#8a6f38' }}>{aviso}</div>}
        {cargando ? (
          <div className={s.loading}><span className={s.spin} /> Cargando honorarios...</div>
        ) : (
          <>
            <div className={s.kpiGrid}>
              <Kpi id="pendiente" valor={kpis.pendiente} titulo="Pendiente de facturar" clase={h.kpiRed}
                sub={`${kpis.nPendiente} concepto${kpis.nPendiente === 1 ? '' : 's'} devengado${kpis.nPendiente === 1 ? '' : 's'}`} />
              <Kpi id="cobro" valor={kpis.cobro} titulo="Facturado sin cobrar" clase={h.kpiGold}
                sub={`Cobrado en ${año}: ${eur(conI(kpis.cobradoAño), 0)}`} />
              <Kpi id="variables" valor={kpis.variables} titulo="Variables en expectativa" clase={h.kpiGreen}
                sub={`${kpis.nVariables} asunto${kpis.nVariables === 1 ? '' : 's'} · solo si prosperan`} />
              <Kpi id="previstos" valor={kpis.previstos} titulo="Fijos por devengar" clase={h.kpiGrey}
                sub={`${kpis.nPrevistos} concepto${kpis.nPrevistos === 1 ? '' : 's'} pactado${kpis.nPrevistos === 1 ? '' : 's'}`} />
            </div>

            {sinDesglosar.length > 0 && (
              <div className={h.pendBox}>
                <div className={h.pendHead}>
                  <div>
                    <div className={h.pendTitle}>Expedientes con honorarios sin desglosar</div>
                    <div className={h.pendSub}>Tienen importes en la ficha del CRM pero ningún concepto aquí. Genéralos para seguir su facturación.</div>
                  </div>
                  <button className={`${s.btn} ${s.btnDark}`} style={{ marginLeft: 'auto' }} disabled={!!generando} onClick={() => generar(sinDesglosar)}>
                    {generando === 'todos' ? 'Generando…' : `Generar todos (${sinDesglosar.length})`}
                  </button>
                </div>
                {sinDesglosar.slice(0, 6).map(e => (
                  <div key={e.id} className={h.pendRow}>
                    <span className={`${s.num} ${s.muted}`} style={{ width: 70 }}>{e.referencia}</span>
                    <div className={h.pendMain}>
                      <div className={h.pendName}>{e.titulo}</div>
                      <div className={h.pendMeta}>
                        {e.cliente_nombre || 'Sin cliente'}
                        {Number(e.honorarios) ? ` · fijos ${eur(e.honorarios)}` : ''}
                        {Number(e.facturado) ? ` (facturado ${eur(e.facturado)})` : ''}
                        {e.variable ? ` · variable: ${e.variable}` : ''}
                        {Number(e.cuantia) ? ` · cuantía ${eur(e.cuantia)}` : ''}
                      </div>
                    </div>
                    <button className={s.btn} disabled={!!generando} onClick={() => generar([e])}>{generando === e.id ? 'Generando…' : 'Generar'}</button>
                  </div>
                ))}
                {sinDesglosar.length > 6 && <div className={h.pendRow} style={{ color: '#8a6f38', fontSize: 12 }}>y {sinDesglosar.length - 6} más, incluidos en «Generar todos».</div>}
              </div>
            )}

            <div className={h.chips}>
              {FILTROS.map(f => (
                <button key={f.id} className={`${h.chip} ${fEstado === f.id ? h.chipOn : ''}`} onClick={() => setFEstado(f.id)}>
                  {f.label}<span className={h.chipN}>{conteo[f.id]}</span>
                </button>
              ))}
            </div>
            <div className={s.filters}>
              <input className={s.search} placeholder="Buscar por cliente, concepto, expediente o nº de factura..." value={busca} onChange={e => setBusca(e.target.value)} />
              <select className={s.sel} value={fCliente} onChange={e => setFCliente(e.target.value)}>
                <option value="">Todos los clientes</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <select className={s.sel} value={fTipo} onChange={e => setFTipo(e.target.value)}>
                <option value="">Fijos y variables</option>
                <option value="fijo">Solo fijos</option>
                <option value="variable">Solo variables</option>
              </select>
            </div>

            {!grupos.length ? (
              <div className={s.empty}>
                <div className={s.emptyTitle}>{lineas.length ? 'Nada en este apartado' : 'Aún no hay honorarios registrados'}</div>
                <div className={s.emptyText}>
                  {lineas.length
                    ? 'Prueba con otro filtro o con «Todos».'
                    : 'Añade el primero, genéralos desde los expedientes del CRM o regístralos al redactar una hoja de encargo.'}
                </div>
                <button className={`${s.btn} ${s.btnDark}`} onClick={() => abrir({ cliente_id: fCliente || '' })}>+ Honorario</button>
              </div>
            ) : grupos.map(g => {
              const clave = g.id || g.nombre
              const abierto = !cerrados[clave]
              const expsCliente = g.id ? expedientes.filter(e => e.cliente_id === g.id) : []
              return (
                <div key={clave} className={h.grp}>
                  <div className={h.grpHead} onClick={() => setCerrados(c => ({ ...c, [clave]: abierto }))}>
                    <span className={`${h.caret} ${abierto ? h.caretOpen : ''}`}>▶</span>
                    <div className={h.grpMain}>
                      <div className={h.grpName}>{g.nombre}</div>
                      <div className={h.grpSub}>{g.lineas.length} concepto{g.lineas.length === 1 ? '' : 's'} · {g.exps} expediente{g.exps === 1 ? '' : 's'}</div>
                    </div>
                    <div className={h.grpNums}>
                      <div className={h.grpNum}><div className={h.grpNumL}>Pte. facturar</div><div className={h.grpNumV} style={{ color: g.pendiente ? '#C0392B' : '#9ca3af' }}>{eur(conI(g.pendiente))}</div></div>
                      <div className={h.grpNum}><div className={h.grpNumL}>Sin cobrar</div><div className={h.grpNumV} style={{ color: g.cobro ? '#8a6f38' : '#9ca3af' }}>{eur(conI(g.cobro))}</div></div>
                      <div className={h.grpNum}><div className={h.grpNumL}>Variables</div><div className={h.grpNumV} style={{ color: g.variables ? '#1A6B4A' : '#9ca3af' }}>{eur(conI(g.variables))}</div></div>
                    </div>
                  </div>
                  {abierto && (
                    <div className={h.grpBody}>
                      <div style={{ overflowX: 'auto' }}>
                        <table className={`${s.table} ${h.tabla}`}>
                          <thead><tr>
                            <th className={h.cExp}>Exp.</th><th>Concepto</th><th className={`${h.hideM} ${h.cTipo}`}>Tipo</th>
                            <th className={`${s.right} ${h.cImp}`}>Importe{conIva ? ' (IVA)' : ''}</th><th className={h.cEst}>Estado</th>
                            <th className={`${h.hideM} ${h.cFec}`}>Fechas</th><th className={h.cAcc} />
                          </tr></thead>
                          <tbody>{g.lineas.map(filaLinea)}</tbody>
                        </table>
                      </div>
                      <div className={h.grpFoot}>
                        <button className={`${s.btn} ${s.btnMini}`} onClick={() => abrir({ cliente_id: g.id || '', expediente_id: expsCliente.length === 1 ? expsCliente[0].id : '' })}>+ Honorario para {g.nombre.split(' ')[0]}</button>
                        {g.id && <button className={`${s.btn} ${s.btnMini}`} onClick={() => { setFCliente(g.id); setFEstado('todos') }}>Ver todo lo de este cliente</button>}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            <div className={s.hint} style={{ marginTop: 8 }}>Importes {conIva ? 'con IVA del 21 % incluido' : 'sin IVA'}. Los variables en expectativa solo se cobran si se devengan.</div>
          </>
        )}
      </div>

      {drawer && (
        <div className={s.overlay} onMouseDown={ev => ev.target === ev.currentTarget && setDrawer(null)}>
          <div className={s.drawer}>
            <div className={s.drawerHead}>
              <div className={s.drawerTitle}>{drawer.form.id ? 'Editar honorario' : 'Nuevo honorario'}</div>
              <button className={s.closeX} onClick={() => setDrawer(null)} aria-label="Cerrar">✕</button>
            </div>
            <div className={s.drawerBody}>{formulario()}</div>
            <div className={s.drawerFoot}>
              <button className={s.btn} onClick={() => setDrawer(null)}>Cancelar</button>
              <button className={`${s.btn} ${s.btnDark}`} disabled={drawer.guardando} onClick={guardar}>
                {drawer.guardando ? 'Guardando...' : drawer.form.id ? 'Guardar cambios' : 'Añadir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
