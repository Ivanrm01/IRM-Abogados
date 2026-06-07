'use client'
import { useState, useEffect } from 'react'

function useIsMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const check = () => setM(window.innerWidth <= 900)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return m
}

const STORAGE_KEY = 'irm_plazos_asuntos'

// Festivos nacionales (mismos cada año, formato MM-DD). Los traslados de festivos en domingo no se contemplan: verificar siempre.
const FESTIVOS_NACIONALES = ['01-01','01-06','05-01','08-15','10-12','11-01','12-06','12-08','12-25']

// Tipos de plazo predefinidos. dias = plazo en días hábiles; meses = plazo en meses (fecha a fecha)
const TIPOS = [
  { id:'aleg_inicio', via:'administrativa', label:'Alegaciones a comunicación de inicio', meses:0, dias:15, ref:'15 días hábiles' },
  { id:'aleg_acta', via:'administrativa', label:'Alegaciones a acta / propuesta de liquidación', meses:0, dias:15, ref:'15 días hábiles' },
  { id:'req', via:'administrativa', label:'Atención a requerimiento', meses:0, dias:10, ref:'10 días hábiles (verificar el plazo concedido)' },
  { id:'reposicion', via:'administrativa', label:'Recurso de reposición', meses:1, dias:0, ref:'1 mes (art. 223 LGT)' },
  { id:'tear', via:'economico', label:'Reclamación económico-administrativa (TEAR/TEAC)', meses:1, dias:0, ref:'1 mes (art. 235 LGT)' },
  { id:'alzada', via:'economico', label:'Recurso de alzada ordinario ante el TEAC', meses:1, dias:0, ref:'1 mes (art. 241 LGT)' },
  { id:'anulacion', via:'economico', label:'Recurso de anulación', meses:0, dias:15, ref:'15 días (art. 241 bis LGT)' },
  { id:'contencioso', via:'contencioso', label:'Recurso contencioso-administrativo', meses:2, dias:0, ref:'2 meses (art. 46 LJCA · agosto inhábil)' },
  { id:'casacion', via:'contencioso', label:'Preparación recurso de casación', meses:1, dias:0, ref:'30 días (art. 89 LJCA · agosto inhábil)' },
]

const VIAS = {
  administrativa: { label:'Administrativa', color:'#1A6B4A', agostoInhabil:false },
  economico: { label:'Económico-administrativa', color:'#B8975A', agostoInhabil:false },
  contencioso: { label:'Contencioso-administrativa', color:'#0D1B2A', agostoInhabil:true },
}

const lineInput = { width:'100%', padding:'10px 12px', border:'1px solid #d4d9e0', borderRadius:'6px', fontSize:'14px', fontFamily:'Outfit, sans-serif', boxSizing:'border-box', background:'#fff' }
const lbl = { display:'block', fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#6b7280', marginBottom:'6px' }
const fieldWrap = { marginBottom:'16px' }

const loadScript = (src) => new Promise((res, rej) => {
  const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s)
})

const toISO = (d) => d.toISOString().split('T')[0]
const esFinde = (d) => d.getDay()===0 || d.getDay()===6
const esFestivo = (d) => {
  const mmdd = String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')
  return FESTIVOS_NACIONALES.includes(mmdd)
}
const esInhabilAdmin = (d) => esFinde(d) || esFestivo(d)
const siguienteHabil = (d, agostoInhabil) => {
  const x = new Date(d)
  while (esInhabilAdmin(x) || (agostoInhabil && x.getMonth()===7)) x.setDate(x.getDate()+1)
  return x
}

// Suma días hábiles (excluye sábados, domingos y festivos)
const sumarDiasHabiles = (inicio, n) => {
  const d = new Date(inicio); let contados = 0
  while (contados < n) { d.setDate(d.getDate()+1); if (!esInhabilAdmin(d)) contados++ }
  return d
}

// Suma meses de fecha a fecha (vence el día correlativo). Maneja fin de mes.
const sumarMesesFechaAFecha = (inicio, meses) => {
  const d = new Date(inicio)
  const diaOriginal = d.getDate()
  d.setMonth(d.getMonth()+meses)
  if (d.getDate() < diaOriginal) d.setDate(0) // se pasó de mes: último día del mes anterior
  return d
}

// Calcula fecha de vencimiento según el tipo
const calcularVencimiento = (tipo, fechaNotifStr) => {
  if (!fechaNotifStr) return null
  const via = VIAS[tipo.via]
  let inicio = new Date(fechaNotifStr+'T00:00:00')
  let venc

  if (tipo.meses > 0) {
    // Plazo por meses, de fecha a fecha
    let base = new Date(inicio)
    // Contencioso: si la notificación cae en agosto, el cómputo arranca el 1 de septiembre
    if (via.agostoInhabil && base.getMonth()===7) {
      base = new Date(base.getFullYear(), 8, 1)
      venc = sumarMesesFechaAFecha(base, tipo.meses)
    } else {
      venc = sumarMesesFechaAFecha(base, tipo.meses)
    }
    // Si vence en inhábil → siguiente hábil
    venc = siguienteHabil(venc, via.agostoInhabil)
  } else {
    // Plazo por días hábiles, desde el día siguiente
    venc = sumarDiasHabiles(inicio, tipo.dias)
    venc = siguienteHabil(venc, via.agostoInhabil)
  }
  return toISO(venc)
}

const fechaLarga = (iso) => {
  if (!iso) return '—'
  try { return new Date(iso+'T00:00:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) }
  catch { return iso }
}
const diasRestantes = (iso) => {
  if (!iso) return null
  const hoy = new Date(); hoy.setHours(0,0,0,0)
  const v = new Date(iso+'T00:00:00')
  return Math.round((v-hoy)/(1000*60*60*24))
}

export default function Plazos() {
  const isMobile = useIsMobile()
  const [asuntos, setAsuntos] = useState([])
  const [form, setForm] = useState({ asunto:'', cliente:'', tipo:'reposicion', fechaNotif:'', fechaDef:'' })
  const [vista, setVista] = useState('lista') // 'lista' | 'mes'
  const [mesRef, setMesRef] = useState(() => { const h=new Date(); return { y:h.getFullYear(), m:h.getMonth() } })
  const [cargado, setCargado] = useState(false)

  // Cargar de localStorage al montar (datos en el propio equipo, no online)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setAsuntos(JSON.parse(raw))
    } catch (e) {}
    setCargado(true)
  }, [])

  // Guardar cada vez que cambian (solo tras la carga inicial)
  useEffect(() => {
    if (!cargado) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(asuntos)) } catch (e) {}
  }, [asuntos, cargado])

  const f = (k,v) => setForm(p => ({ ...p, [k]:v }))

  const tipoSel = TIPOS.find(t=>t.id===form.tipo)
  const vencCalc = calcularVencimiento(tipoSel, form.fechaNotif)
  const vencFinal = form.fechaDef || vencCalc

  const añadir = () => {
    if (!form.asunto || !form.fechaNotif) return
    const venc = calcularVencimiento(tipoSel, form.fechaNotif)
    setAsuntos(arr => [...arr, {
      id: Date.now(),
      asunto: form.asunto, cliente: form.cliente,
      tipoId: tipoSel.id, tipoLabel: tipoSel.label, via: tipoSel.via, ref: tipoSel.ref,
      fechaNotif: form.fechaNotif,
      vencCalc: venc,
      vencFinal: form.fechaDef || venc,
    }])
    setForm({ asunto:'', cliente:'', tipo:form.tipo, fechaNotif:'', fechaDef:'' })
  }
  const eliminar = (id) => setAsuntos(arr => arr.filter(a=>a.id!==id))
  const editarFecha = (id, nuevaFecha) => setAsuntos(arr => arr.map(a=> a.id===id ? {...a, vencFinal:nuevaFecha||a.vencCalc} : a))

  const ordenados = [...asuntos].sort((a,b)=> (a.vencFinal||'').localeCompare(b.vencFinal||''))

  const colorUrg = (dias) => {
    if (dias===null) return '#9ca3af'
    if (dias < 0) return '#7f1d1d'
    if (dias <= 7) return '#C0392B'
    if (dias <= 20) return '#B8975A'
    return '#1A6B4A'
  }

  // ---- PDF ----
  const generarPDF = async () => {
    if (!ordenados.length) return
    try {
      if (!window.jspdf) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
      const { jsPDF } = window.jspdf
      const doc = new jsPDF({ unit:'mm', format:'a4' })
      const NAVY=[13,27,42], GOLD=[184,151,90], INK=[38,38,38], GREY=[110,110,110]
      const PW=210, PH=297, M=16, W=PW-M*2
      let y=0

      doc.setFillColor(...NAVY); doc.rect(0,0,PW,34,'F')
      doc.setFont('times','bold'); doc.setFontSize(24); doc.setTextColor(255,255,255); doc.text('IRM', M, 20)
      doc.setFont('times','normal'); doc.setFontSize(6.5); doc.setTextColor(...GOLD); doc.text('A B O G A D O S   &   A S E S O R E S', M, 25)
      doc.setFont('times','normal'); doc.setFontSize(8.5); doc.setTextColor(220,220,225)
      doc.text('Calendario de vencimientos procesales', PW-M, 18, {align:'right'})
      doc.text(new Date().toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}), PW-M, 23, {align:'right'})

      y = 44
      // Cabecera tabla
      const cols = [ {t:'Asunto', w:46}, {t:'Trámite', w:54}, {t:'Notificación', w:26}, {t:'Vencimiento', w:34}, {t:'Días', w:14} ]
      const drawHead = () => {
        doc.setFillColor(...NAVY); doc.rect(M, y, W, 8, 'F')
        doc.setFont('times','bold'); doc.setFontSize(8.5); doc.setTextColor(255,255,255)
        let x = M+2
        cols.forEach(c=>{ doc.text(c.t, x, y+5.4); x += c.w })
        y += 8
      }
      drawHead()
      doc.setTextColor(...INK)
      ordenados.forEach((a,idx)=>{
        const dias = diasRestantes(a.vencFinal)
        const asuntoLines = doc.splitTextToSize(a.asunto+(a.cliente?' · '+a.cliente:''), cols[0].w-3)
        const tramiteLines = doc.splitTextToSize(a.tipoLabel, cols[1].w-3)
        const h = Math.max(8, Math.max(asuntoLines.length, tramiteLines.length)*4+3)
        if (y+h > PH-16) { doc.addPage(); y=M; drawHead(); doc.setTextColor(...INK) }
        if (idx%2===1){ doc.setFillColor(248,246,240); doc.rect(M,y,W,h,'F') }
        doc.setDrawColor(220,220,220); doc.setLineWidth(0.1); doc.rect(M,y,W,h)
        doc.setFont('times','normal'); doc.setFontSize(8.5); doc.setTextColor(...INK)
        let x = M+2
        asuntoLines.forEach((l,i)=>doc.text(l, x, y+4.8+i*4)); x+=cols[0].w
        tramiteLines.forEach((l,i)=>doc.text(l, x, y+4.8+i*4)); x+=cols[1].w
        doc.text(new Date(a.fechaNotif+'T00:00:00').toLocaleDateString('es-ES'), x, y+4.8); x+=cols[2].w
        doc.setFont('times','bold'); doc.text(new Date(a.vencFinal+'T00:00:00').toLocaleDateString('es-ES'), x, y+4.8); x+=cols[3].w
        const c = colorUrg(dias); doc.setTextColor(c[0]||0,0,0)
        // color por texto simple
        doc.setTextColor(...(dias!==null&&dias<=7?[192,57,43]:dias<=20?[184,151,90]:[26,107,74]))
        doc.text(dias===null?'—':String(dias), x, y+4.8)
        doc.setTextColor(...INK)
        y += h
      })

      y += 8
      if (y > PH-30) { doc.addPage(); y=M }
      doc.setFont('times','italic'); doc.setFontSize(8); doc.setTextColor(...GREY)
      const aviso = doc.splitTextToSize('AVISO: Las fechas de este calendario son orientativas y se han calculado considerando únicamente los festivos nacionales. No sustituyen el control de plazos del despacho. Deben verificarse los festivos autonómicos y locales aplicables, así como las particularidades de cada cómputo antes de cualquier presentación.', W)
      aviso.forEach(l=>{ doc.text(l, M, y); y+=4 })

      doc.save('Calendario-vencimientos-'+toISO(new Date())+'.pdf')
    } catch(e){ alert('Error al generar el PDF: '+e.message) }
  }

  // ---- Excel ----
  const generarExcel = async () => {
    if (!ordenados.length) return
    try {
      if (!window.XLSX) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')
      const XLSX = window.XLSX
      const rows = [['IRM Tax & Legal — Calendario de vencimientos procesales']]
      rows.push(['Generado', new Date().toLocaleDateString('es-ES')])
      rows.push([])
      rows.push(['Asunto','Cliente','Trámite','Vía','Plazo','Notificación','Vencimiento','Días restantes'])
      ordenados.forEach(a=>{
        rows.push([a.asunto, a.cliente||'', a.tipoLabel, VIAS[a.via].label, a.ref,
          new Date(a.fechaNotif+'T00:00:00').toLocaleDateString('es-ES'),
          new Date(a.vencFinal+'T00:00:00').toLocaleDateString('es-ES'),
          diasRestantes(a.vencFinal)])
      })
      rows.push([])
      rows.push(['AVISO','Fechas orientativas calculadas solo con festivos nacionales. No sustituyen el control de plazos del despacho. Verificar festivos autonómicos/locales y particularidades de cada cómputo.'])
      const ws = XLSX.utils.aoa_to_sheet(rows)
      ws['!cols'] = [{wch:28},{wch:20},{wch:38},{wch:24},{wch:32},{wch:14},{wch:14},{wch:14}]
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Vencimientos')
      XLSX.writeFile(wb, 'Calendario-vencimientos-'+toISO(new Date())+'.xlsx')
    } catch(e){ alert('Error al generar el Excel: '+e.message) }
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'minmax(360px, 420px) 1fr', gap:'0', height: isMobile?'auto':'100%' }}>
      {/* FORMULARIO */}
      <div style={{ padding:'24px 26px', overflowY: isMobile?'visible':'auto', borderRight: isMobile?'none':'1px solid #e5e7eb', borderBottom: isMobile?'1px solid #e5e7eb':'none', fontFamily:'Outfit, sans-serif' }}>
        <div style={{ background:'#FDECEA', border:'1px solid #F5C6C2', borderRadius:'8px', padding:'12px 14px', marginBottom:'20px', fontSize:'12px', color:'#7a2820', lineHeight:1.55 }}>
          <strong>Importante:</strong> fechas orientativas, calculadas solo con festivos nacionales. No sustituyen el control de plazos del despacho. Verifica festivos autonómicos/locales y cada cómputo. Puedes editar la fecha definitiva.
        </div>
        <h2 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'24px', fontWeight:400, color:'#0D1B2A', marginBottom:'4px' }}>Plazos y vencimientos</h2>
        <p style={{ fontSize:'12px', color:'#6b7280', marginBottom:'24px' }}>Añade trámites y genera el calendario de vencimientos por asuntos.</p>

        <div style={fieldWrap}><label style={lbl}>Asunto / referencia</label><input style={lineInput} value={form.asunto} onChange={e=>f('asunto',e.target.value)} placeholder="Liquidación IVA 2023 — Enrom System" /></div>
        <div style={fieldWrap}><label style={lbl}>Cliente (opcional)</label><input style={lineInput} value={form.cliente} onChange={e=>f('cliente',e.target.value)} placeholder="Enrom System, S.L.U." /></div>

        <div style={fieldWrap}>
          <label style={lbl}>Tipo de trámite</label>
          <select style={lineInput} value={form.tipo} onChange={e=>f('tipo',e.target.value)}>
            {Object.keys(VIAS).map(via=>(
              <optgroup key={via} label={VIAS[via].label}>
                {TIPOS.filter(t=>t.via===via).map(t=><option key={t.id} value={t.id}>{t.label} ({t.ref})</option>)}
              </optgroup>
            ))}
          </select>
        </div>

        <div style={fieldWrap}><label style={lbl}>Fecha de notificación</label><input type="date" style={lineInput} value={form.fechaNotif} onChange={e=>f('fechaNotif',e.target.value)} /></div>

        {form.fechaNotif && (
          <div style={{ background:'#F8F4EE', borderRadius:'8px', padding:'14px', marginBottom:'16px' }}>
            <div style={{ fontSize:'11px', color:'#9ca3af', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'4px' }}>Vencimiento calculado</div>
            <div style={{ fontSize:'15px', fontWeight:600, color:'#0D1B2A', textTransform:'capitalize' }}>{fechaLarga(vencCalc)}</div>
            <div style={{ fontSize:'11px', color:'#6b7280', marginTop:'4px' }}>{tipoSel.ref}{VIAS[tipoSel.via].agostoInhabil?' · agosto inhábil':''}</div>
          </div>
        )}

        <button onClick={añadir} disabled={!form.asunto||!form.fechaNotif} style={{ width:'100%', padding:'14px', background:(form.asunto&&form.fechaNotif)?'#0D1B2A':'#9ca3af', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:600, cursor:(form.asunto&&form.fechaNotif)?'pointer':'not-allowed', fontFamily:'Outfit, sans-serif' }}>+ Añadir al calendario</button>

        {asuntos.length>0 && (
          <div style={{ marginTop:'20px', display:'flex', gap:'10px' }}>
            <button onClick={generarPDF} style={{ flex:1, padding:'12px', background:'transparent', color:'#0D1B2A', border:'1px solid #0D1B2A', borderRadius:'8px', fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'Outfit, sans-serif' }}>↓ PDF</button>
            <button onClick={generarExcel} style={{ flex:1, padding:'12px', background:'transparent', color:'#1A6B4A', border:'1px solid #1A6B4A', borderRadius:'8px', fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'Outfit, sans-serif' }}>↓ Excel</button>
          </div>
        )}
      </div>

      {/* CALENDARIO */}
      <div style={{ background:'#e8eaed', overflowY: isMobile?'visible':'auto', padding:'28px' }}>
        <div style={{ maxWidth:'640px', margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
            <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9ca3af', fontFamily:'Outfit, sans-serif' }}>Calendario de vencimientos {asuntos.length>0&&'· '+asuntos.length}</div>
            <div style={{ display:'flex', gap:'4px', background:'#fff', borderRadius:'8px', padding:'3px', fontFamily:'Outfit, sans-serif' }}>
              <button onClick={()=>setVista('lista')} style={{ padding:'6px 14px', border:'none', borderRadius:'6px', fontSize:'12px', fontWeight:500, cursor:'pointer', background:vista==='lista'?'#0D1B2A':'transparent', color:vista==='lista'?'#fff':'#6b7280' }}>Lista</button>
              <button onClick={()=>setVista('mes')} style={{ padding:'6px 14px', border:'none', borderRadius:'6px', fontSize:'12px', fontWeight:500, cursor:'pointer', background:vista==='mes'?'#0D1B2A':'transparent', color:vista==='mes'?'#fff':'#6b7280' }}>Mes</button>
            </div>
          </div>

          {asuntos.length>0 && <p style={{ fontSize:'11px', color:'#9ca3af', marginBottom:'14px', fontFamily:'Outfit, sans-serif' }}>Los vencimientos se guardan en este equipo y siguen aquí aunque cierres. Exporta a PDF/Excel para conservar copia.</p>}

          {/* VISTA MES */}
          {vista==='mes' && (() => {
            const primero = new Date(mesRef.y, mesRef.m, 1)
            const finMes = new Date(mesRef.y, mesRef.m+1, 0).getDate()
            let offset = primero.getDay() - 1; if (offset < 0) offset = 6 // lunes primero
            const celdas = []
            for (let i=0;i<offset;i++) celdas.push(null)
            for (let d=1; d<=finMes; d++) celdas.push(d)
            const mmddVenc = (d) => {
              const target = mesRef.y+'-'+String(mesRef.m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0')
              return ordenados.filter(a=> a.vencFinal===target)
            }
            const nombreMes = primero.toLocaleDateString('es-ES',{month:'long',year:'numeric'})
            return (
              <div style={{ background:'#fff', borderRadius:'10px', padding:'18px', fontFamily:'Outfit, sans-serif', boxShadow:'0 1px 8px rgba(0,0,0,.06)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                  <button onClick={()=>setMesRef(r=>{ const m=r.m-1; return m<0?{y:r.y-1,m:11}:{y:r.y,m} })} style={{ background:'none', border:'1px solid #e5e7eb', borderRadius:'6px', width:'32px', height:'32px', cursor:'pointer', color:'#6b7280', fontSize:'16px' }}>‹</button>
                  <div style={{ fontSize:'16px', fontWeight:600, color:'#0D1B2A', textTransform:'capitalize' }}>{nombreMes}</div>
                  <button onClick={()=>setMesRef(r=>{ const m=r.m+1; return m>11?{y:r.y+1,m:0}:{y:r.y,m} })} style={{ background:'none', border:'1px solid #e5e7eb', borderRadius:'6px', width:'32px', height:'32px', cursor:'pointer', color:'#6b7280', fontSize:'16px' }}>›</button>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px', marginBottom:'4px' }}>
                  {['L','M','X','J','V','S','D'].map((d,i)=><div key={i} style={{ textAlign:'center', fontSize:'11px', fontWeight:600, color:'#9ca3af', padding:'4px' }}>{d}</div>)}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px' }}>
                  {celdas.map((d,i)=>{
                    if (d===null) return <div key={i}></div>
                    const vencs = mmddVenc(d)
                    const hoy = new Date()
                    const esHoy = hoy.getFullYear()===mesRef.y && hoy.getMonth()===mesRef.m && hoy.getDate()===d
                    return (
                      <div key={i} style={{ minHeight:'58px', borderRadius:'6px', border:'1px solid '+(esHoy?'#0D1B2A':'#f0f0f0'), padding:'4px', background:vencs.length?'#FDF6E3':'#fff' }}>
                        <div style={{ fontSize:'11px', fontWeight:esHoy?700:500, color:esHoy?'#0D1B2A':'#9ca3af', textAlign:'right', marginBottom:'2px' }}>{d}</div>
                        {vencs.map(v=>{
                          const dias = diasRestantes(v.vencFinal)
                          return <div key={v.id} title={v.asunto+' — '+v.tipoLabel} style={{ fontSize:'9px', lineHeight:1.2, padding:'2px 3px', borderRadius:'3px', marginBottom:'2px', background:colorUrg(dias), color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.asunto}</div>
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* VISTA LISTA */}
          {vista==='lista' && (ordenados.length===0 ? (
            <div style={{ background:'#fff', borderRadius:'10px', padding:'48px 24px', textAlign:'center', color:'#9ca3af', fontFamily:'Outfit, sans-serif', fontSize:'14px' }}>
              Añade trámites desde el formulario para ver aquí el calendario ordenado por urgencia.
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {ordenados.map(a=>{
                const dias = diasRestantes(a.vencFinal)
                const c = colorUrg(dias)
                const editada = a.vencFinal !== a.vencCalc
                return (
                  <div key={a.id} style={{ background:'#fff', borderRadius:'10px', overflow:'hidden', boxShadow:'0 1px 8px rgba(0,0,0,.08)', fontFamily:'Outfit, sans-serif', borderLeft:'4px solid '+c }}>
                    <div style={{ padding:'16px 20px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:'15px', fontWeight:600, color:'#0D1B2A' }}>{a.asunto}</div>
                          {a.cliente && <div style={{ fontSize:'12px', color:'#9ca3af' }}>{a.cliente}</div>}
                          <div style={{ display:'inline-block', marginTop:'6px', fontSize:'11px', padding:'2px 8px', borderRadius:'4px', background:VIAS[a.via].color+'18', color:VIAS[a.via].color, fontWeight:500 }}>{VIAS[a.via].label}</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:'22px', fontWeight:700, color:c, lineHeight:1 }}>{dias===null?'—':dias<0?'Vencido':dias+'d'}</div>
                          <div style={{ fontSize:'10px', color:'#9ca3af', marginTop:'2px' }}>{dias>=0?'restantes':''}</div>
                        </div>
                      </div>
                      <div style={{ fontSize:'13px', color:'#374151', marginTop:'10px' }}>{a.tipoLabel}</div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'12px', paddingTop:'12px', borderTop:'1px solid #f0f0f0' }}>
                        <div style={{ fontSize:'12px', color:'#6b7280' }}>
                          Notif.: {new Date(a.fechaNotif+'T00:00:00').toLocaleDateString('es-ES')}
                          <span style={{ margin:'0 6px', color:'#d1d5db' }}>→</span>
                          Vence: <strong style={{ color:'#0D1B2A', textTransform:'capitalize' }}>{fechaLarga(a.vencFinal)}</strong>
                          {editada && <span style={{ marginLeft:'6px', fontSize:'10px', color:'#B8975A' }}>(editada)</span>}
                        </div>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'10px', gap:'10px' }}>
                        <label style={{ fontSize:'11px', color:'#9ca3af', display:'flex', alignItems:'center', gap:'6px' }}>
                          Fecha definitiva:
                          <input type="date" value={a.vencFinal} onChange={e=>editarFecha(a.id, e.target.value)} style={{ padding:'4px 8px', border:'1px solid #d4d9e0', borderRadius:'5px', fontSize:'12px', fontFamily:'Outfit, sans-serif' }} />
                        </label>
                        <button onClick={()=>eliminar(a.id)} style={{ background:'none', border:'none', color:'#C0392B', fontSize:'12px', cursor:'pointer', fontFamily:'Outfit, sans-serif' }}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
