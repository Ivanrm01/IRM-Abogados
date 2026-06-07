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

const DEMORA_2026 = 4.0625
const LEGAL_2026 = 3.25
const RECARGO_APREMIO = 20

const lineInput = { width:'100%', padding:'10px 12px', border:'1px solid #d4d9e0', borderRadius:'6px', fontSize:'14px', fontFamily:'Outfit, sans-serif', boxSizing:'border-box', background:'#fff' }
const lbl = { display:'block', fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#6b7280', marginBottom:'6px' }
const fieldWrap = { marginBottom:'16px' }
const sectionLbl = { fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9ca3af', marginBottom:'14px', borderTop:'1px solid #eef0f3', paddingTop:'18px', marginTop:'6px' }

const loadScript = (src) => new Promise((res, rej) => {
  const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s)
})

const eur = (n) => (isNaN(n)?0:n).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' €'
const parseImporte = (v) => { const n = parseFloat(String(v).replace(/\./g,'').replace(',','.')); return isNaN(n)?0:n }

export default function Calculadoras() {
  const isMobile = useIsMobile()
  const [modo, setModo] = useState('suspension') // 'suspension' | 'aplazamiento'

  // comunes: conceptos de deuda
  const [conceptos, setConceptos] = useState([{ concepto:'', importe:'' }])
  const setC = (i,k,v) => setConceptos(arr => arr.map((r,idx)=> idx===i?{...r,[k]:v}:r))
  const addC = () => setConceptos(arr => [...arr, { concepto:'', importe:'' }])
  const delC = (i) => setConceptos(arr => arr.filter((_,idx)=> idx!==i))
  const totalDeuda = conceptos.reduce((s,r)=> s + parseImporte(r.importe), 0)

  // suspensión
  const [anios, setAnios] = useState('1')
  const [tipoInteresSusp, setTipoInteresSusp] = useState(String(LEGAL_2026))

  // aplazamiento
  const [periodo, setPeriodo] = useState('voluntario') // 'voluntario' | 'ejecutivo'
  const [mesesApl, setMesesApl] = useState('12')
  const [tipoInteresApl, setTipoInteresApl] = useState(String(LEGAL_2026))

  const [cliente, setCliente] = useState('')
  const [generando, setGenerando] = useState(false)

  // ---- Cálculos ----
  let resultado = null
  if (modo === 'suspension') {
    const aniosN = parseFloat(String(anios).replace(',','.')) || 0
    const tipo = parseFloat(String(tipoInteresSusp).replace(',','.')) || 0
    const intereses = totalDeuda * (tipo/100) * aniosN
    const recargo = totalDeuda * (RECARGO_APREMIO/100)
    const total = totalDeuda + intereses + recargo
    resultado = {
      titulo: 'Garantía para suspensión (art. 233 LGT)',
      filas: [
        ['Importe de la deuda', totalDeuda],
        ['Intereses de demora ('+tipo+'% · '+aniosN+' año/s)', intereses],
        ['Recargo de apremio ordinario ('+RECARGO_APREMIO+'%)', recargo],
      ],
      total,
      nota: 'Conforme al art. 233 LGT, la garantía para la suspensión automática debe cubrir el importe de la deuda, los intereses de demora que genere la suspensión y los recargos que procederían en caso de ejecución de la garantía.'
    }
  } else {
    const meses = parseFloat(String(mesesApl).replace(',','.')) || 0
    const tipo = parseFloat(String(tipoInteresApl).replace(',','.')) || 0
    if (periodo === 'voluntario') {
      const intereses = totalDeuda * (tipo/100) * (meses/12)
      const base = totalDeuda + intereses
      const margen = base * 0.25
      const total = base + margen
      resultado = {
        titulo: 'Garantía para aplazamiento/fraccionamiento · Periodo voluntario',
        filas: [
          ['Importe de la deuda', totalDeuda],
          ['Intereses de demora ('+tipo+'% · '+meses+' meses)', intereses],
          ['25% de (deuda + intereses)', margen],
        ],
        total,
        nota: 'Conforme al art. 48.2 RGR, en periodo voluntario la garantía cubrirá el importe de la deuda, los intereses de demora que genere el aplazamiento y un 25% de la suma de ambas partidas.'
      }
    } else {
      const recargo = totalDeuda * (RECARGO_APREMIO/100)
      const intereses = totalDeuda * (tipo/100) * (meses/12)
      const base = totalDeuda + recargo + intereses
      const margen = base * 0.05
      const total = base + margen
      resultado = {
        titulo: 'Garantía para aplazamiento/fraccionamiento · Periodo ejecutivo',
        filas: [
          ['Importe de la deuda', totalDeuda],
          ['Recargo de apremio ('+RECARGO_APREMIO+'%)', recargo],
          ['Intereses de demora ('+tipo+'% · '+meses+' meses)', intereses],
          ['5% de (deuda + recargo + intereses)', margen],
        ],
        total,
        nota: 'Conforme al art. 48.2 RGR, en periodo ejecutivo la garantía cubrirá el importe aplazado incluyendo el recargo del periodo ejecutivo, los intereses de demora que genere el aplazamiento, más un 5% de la suma de ambas partidas.'
      }
    }
  }

  const conceptosValidos = conceptos.filter(c=>c.concepto||c.importe)

  // ---- PDF ----
  const generarPDF = async () => {
    setGenerando(true)
    try {
      if (!window.jspdf) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
      const { jsPDF } = window.jspdf
      const doc = new jsPDF({ unit:'mm', format:'a4' })
      const NAVY=[13,27,42], GOLD=[184,151,90], INK=[38,38,38], GREY=[110,110,110]
      const PW=210, PH=297, M=22, W=PW-M*2
      let y=0

      doc.setFillColor(...NAVY); doc.rect(0,0,PW,38,'F')
      doc.setFont('times','bold'); doc.setFontSize(26); doc.setTextColor(255,255,255); doc.text('IRM', M, 22)
      doc.setFont('times','normal'); doc.setFontSize(7); doc.setTextColor(...GOLD); doc.text('A B O G A D O S   &   A S E S O R E S', M, 28)
      doc.setFont('times','normal'); doc.setFontSize(8.5); doc.setTextColor(220,220,225)
      doc.text('Informe de cálculo de garantía', PW-M, 20, {align:'right'})
      doc.text(new Date().toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}), PW-M, 25, {align:'right'})

      y = 50
      doc.setFont('times','normal'); doc.setFontSize(8.5); doc.setTextColor(...GOLD)
      doc.text('INFORME', M, y); y += 7
      doc.setFont('times','bold'); doc.setFontSize(15); doc.setTextColor(...NAVY)
      const t = doc.splitTextToSize(resultado.titulo, W); t.forEach(l=>{ doc.text(l,M,y); y+=7 })
      y += 2
      doc.setDrawColor(...GOLD); doc.setLineWidth(0.6); doc.line(M,y,M+30,y); y += 10

      if (cliente) { doc.setFont('times','normal'); doc.setFontSize(10.5); doc.setTextColor(...INK); doc.text('Cliente: '+cliente, M, y); y += 8 }

      // Detalle de conceptos de deuda
      doc.setFont('times','bold'); doc.setFontSize(11); doc.setTextColor(...NAVY); doc.text('Detalle de la deuda', M, y); y += 6
      const c1=W-42, c2=42, rh=8
      doc.setFillColor(...NAVY); doc.rect(M,y,c1,rh,'F'); doc.rect(M+c1,y,c2,rh,'F')
      doc.setFont('times','bold'); doc.setFontSize(9.5); doc.setTextColor(255,255,255)
      doc.text('Concepto', M+3, y+5.4); doc.text('Importe', M+c1+c2-3, y+5.4, {align:'right'}); y+=rh
      doc.setTextColor(...INK)
      conceptosValidos.forEach((r,idx)=>{
        const lines = doc.splitTextToSize(r.concepto||'—', c1-6)
        const h = Math.max(rh, lines.length*4.6+3)
        if (idx%2===1){ doc.setFillColor(248,246,240); doc.rect(M,y,c1,h,'F'); doc.rect(M+c1,y,c2,h,'F') }
        doc.setDrawColor(210,210,210); doc.setLineWidth(0.2); doc.rect(M,y,c1,h); doc.rect(M+c1,y,c2,h)
        doc.setFont('times','normal'); doc.setFontSize(10)
        lines.forEach((ln,i)=> doc.text(ln, M+3, y+5.2+i*4.6))
        doc.text(eur(parseImporte(r.importe)), M+c1+c2-3, y+5.2, {align:'right'}); y+=h
      })
      y += 8

      // Cálculo de la garantía
      doc.setFont('times','bold'); doc.setFontSize(11); doc.setTextColor(...NAVY); doc.text('Cálculo de la garantía', M, y); y += 6
      resultado.filas.forEach(([concepto, valor])=>{
        doc.setDrawColor(225,225,225); doc.setLineWidth(0.2); doc.line(M, y+1.5, PW-M, y+1.5)
        doc.setFont('times','normal'); doc.setFontSize(10.5); doc.setTextColor(...INK)
        doc.text(concepto, M, y)
        doc.text(eur(valor), PW-M, y, {align:'right'}); y += 8
      })
      // Total
      doc.setFillColor(...NAVY); doc.rect(M, y-1, W, 12, 'F')
      doc.setFont('times','bold'); doc.setFontSize(12); doc.setTextColor(255,255,255)
      doc.text('IMPORTE TOTAL DE LA GARANTÍA', M+4, y+6.5)
      doc.setTextColor(...GOLD); doc.text(eur(resultado.total), PW-M-4, y+6.5, {align:'right'})
      y += 20

      // Nota legal
      doc.setFont('times','italic'); doc.setFontSize(8.5); doc.setTextColor(...GREY)
      const nota = doc.splitTextToSize(resultado.nota, W); nota.forEach(l=>{ doc.text(l,M,y); y+=4.2 })
      y += 4
      const disc = doc.splitTextToSize('Este informe tiene carácter orientativo y no vinculante. El importe definitivo de la garantía exigible corresponde determinarlo a la Administración tributaria competente. Cálculo basado en los tipos vigentes indicados.', W)
      disc.forEach(l=>{ doc.text(l,M,y); y+=4.2 })

      doc.setDrawColor(...GOLD); doc.setLineWidth(0.4); doc.line(M, PH-16, PW-M, PH-16)
      doc.setFont('times','normal'); doc.setFontSize(7.5); doc.setTextColor(...GREY)
      doc.text('IRM Tax & Legal · Abogados & Asesores · ivanrojasmonfort@icam.es', M, PH-11)

      doc.save('Informe-garantia-'+(cliente||'calculo').replace(/\s+/g,'-')+'.pdf')
    } catch(e){ alert('Error al generar el PDF: '+e.message) }
    setGenerando(false)
  }

  // ---- Excel ----
  const generarExcel = async () => {
    setGenerando(true)
    try {
      if (!window.XLSX) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')
      const XLSX = window.XLSX
      const rows = []
      rows.push(['IRM Tax & Legal — Informe de cálculo de garantía'])
      rows.push([resultado.titulo])
      if (cliente) rows.push(['Cliente', cliente])
      rows.push(['Fecha', new Date().toLocaleDateString('es-ES')])
      rows.push([])
      rows.push(['Detalle de la deuda'])
      rows.push(['Concepto','Importe (€)'])
      conceptosValidos.forEach(r=> rows.push([r.concepto||'—', parseImporte(r.importe)]))
      rows.push(['TOTAL DEUDA', totalDeuda])
      rows.push([])
      rows.push(['Cálculo de la garantía'])
      resultado.filas.forEach(([c,v])=> rows.push([c, Math.round(v*100)/100]))
      rows.push(['IMPORTE TOTAL DE LA GARANTÍA', Math.round(resultado.total*100)/100])
      rows.push([])
      rows.push(['Nota legal', resultado.nota])
      rows.push(['Aviso','Informe orientativo y no vinculante. El importe definitivo corresponde a la Administración tributaria.'])

      const ws = XLSX.utils.aoa_to_sheet(rows)
      ws['!cols'] = [{wch:55},{wch:18}]
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Garantía')
      XLSX.writeFile(wb, 'Informe-garantia-'+(cliente||'calculo').replace(/\s+/g,'-')+'.xlsx')
    } catch(e){ alert('Error al generar el Excel: '+e.message) }
    setGenerando(false)
  }

  const tabBtn = (activo) => ({ flex:1, padding:'12px', border:'none', borderBottom:'3px solid '+(activo?'#B8975A':'transparent'), background:activo?'#fff':'#f4f5f7', color:activo?'#0D1B2A':'#9ca3af', fontWeight:activo?700:500, fontSize:'13px', cursor:'pointer', fontFamily:'Outfit, sans-serif' })

  return (
    <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'minmax(380px, 460px) 1fr', gap:'0', height: isMobile?'auto':'100%' }}>
      {/* FORMULARIO */}
      <div style={{ overflowY: isMobile?'visible':'auto', borderRight: isMobile?'none':'1px solid #e5e7eb', borderBottom: isMobile?'1px solid #e5e7eb':'none', fontFamily:'Outfit, sans-serif' }}>
        <div style={{ display:'flex', borderBottom:'1px solid #e5e7eb', position:'sticky', top:0, zIndex:2 }}>
          <button style={tabBtn(modo==='suspension')} onClick={()=>setModo('suspension')}>Garantía suspensión</button>
          <button style={tabBtn(modo==='aplazamiento')} onClick={()=>setModo('aplazamiento')}>Garantía aplazamiento</button>
        </div>

        <div style={{ padding:'22px 26px' }}>
          <div style={fieldWrap}>
            <label style={lbl}>Cliente (opcional)</label>
            <input style={lineInput} value={cliente} onChange={e=>setCliente(e.target.value)} placeholder="Nombre del cliente o sociedad" />
          </div>

          <div style={sectionLbl}>Conceptos de la deuda</div>
          {conceptos.map((row,i)=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'3fr 1fr auto', gap:'8px', marginBottom:'8px', alignItems:'center' }}>
              <input style={lineInput} value={row.concepto} onChange={e=>setC(i,'concepto',e.target.value)} placeholder="IVA 2023 — liquidación" />
              <input style={lineInput} value={row.importe} onChange={e=>setC(i,'importe',e.target.value)} placeholder="10000" />
              <button onClick={()=>delC(i)} disabled={conceptos.length===1} style={{ background:'none', border:'1px solid #e5e7eb', borderRadius:'6px', width:'36px', height:'36px', cursor:conceptos.length===1?'not-allowed':'pointer', color:'#C0392B', fontSize:'18px', opacity:conceptos.length===1?.3:1 }}>×</button>
            </div>
          ))}
          <button onClick={addC} style={{ background:'none', border:'1px dashed #B8975A', borderRadius:'6px', padding:'8px 14px', color:'#B8975A', fontSize:'13px', cursor:'pointer', fontWeight:500, marginTop:'2px' }}>+ Añadir concepto</button>
          <div style={{ marginTop:'12px', fontSize:'13px', color:'#6b7280' }}>Total deuda: <strong style={{color:'#0D1B2A'}}>{eur(totalDeuda)}</strong></div>

          {modo==='suspension' ? (
            <>
              <div style={sectionLbl}>Parámetros de suspensión</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                <div style={fieldWrap}>
                  <label style={lbl}>Años de suspensión</label>
                  <input style={lineInput} value={anios} onChange={e=>setAnios(e.target.value)} placeholder="1" />
                </div>
                <div style={fieldWrap}>
                  <label style={lbl}>Tipo interés demora (%)</label>
                  <input style={lineInput} value={tipoInteresSusp} onChange={e=>setTipoInteresSusp(e.target.value)} placeholder="3.25" />
                </div>
              </div>
              <p style={{ fontSize:'11px', color:'#9ca3af', lineHeight:1.5 }}>Con aval o seguro de caución se aplica el interés legal ({LEGAL_2026}%). El interés de demora general es {DEMORA_2026}%.</p>
            </>
          ) : (
            <>
              <div style={sectionLbl}>Parámetros del aplazamiento</div>
              <div style={fieldWrap}>
                <label style={lbl}>¿En qué periodo está la deuda?</label>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={()=>setPeriodo('voluntario')} style={{ flex:1, padding:'10px', borderRadius:'6px', border:'1px solid '+(periodo==='voluntario'?'#0D1B2A':'#d4d9e0'), background:periodo==='voluntario'?'#0D1B2A':'#fff', color:periodo==='voluntario'?'#fff':'#6b7280', fontSize:'13px', cursor:'pointer', fontFamily:'Outfit, sans-serif', fontWeight:500 }}>Voluntario</button>
                  <button onClick={()=>setPeriodo('ejecutivo')} style={{ flex:1, padding:'10px', borderRadius:'6px', border:'1px solid '+(periodo==='ejecutivo'?'#0D1B2A':'#d4d9e0'), background:periodo==='ejecutivo'?'#0D1B2A':'#fff', color:periodo==='ejecutivo'?'#fff':'#6b7280', fontSize:'13px', cursor:'pointer', fontFamily:'Outfit, sans-serif', fontWeight:500 }}>Ejecutivo</button>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                <div style={fieldWrap}>
                  <label style={lbl}>Meses de aplazamiento</label>
                  <input style={lineInput} value={mesesApl} onChange={e=>setMesesApl(e.target.value)} placeholder="12" />
                </div>
                <div style={fieldWrap}>
                  <label style={lbl}>Tipo interés demora (%)</label>
                  <input style={lineInput} value={tipoInteresApl} onChange={e=>setTipoInteresApl(e.target.value)} placeholder="3.25" />
                </div>
              </div>
              {periodo==='ejecutivo' && <p style={{ fontSize:'11px', color:'#9ca3af', lineHeight:1.5 }}>En periodo ejecutivo se incluye el recargo de apremio del {RECARGO_APREMIO}% y el margen es del 5%. En voluntario el margen es del 25%.</p>}
            </>
          )}

          <button onClick={generarPDF} disabled={generando||totalDeuda===0} style={{ width:'100%', marginTop:'14px', padding:'14px', background:totalDeuda>0?'#0D1B2A':'#9ca3af', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:600, cursor:totalDeuda>0?'pointer':'not-allowed', fontFamily:'Outfit, sans-serif' }}>
            {generando?'Generando...':'↓ Descargar informe PDF'}
          </button>
          <button onClick={generarExcel} disabled={generando||totalDeuda===0} style={{ width:'100%', marginTop:'10px', padding:'12px', background:'transparent', color:totalDeuda>0?'#1A6B4A':'#9ca3af', border:'1px solid '+(totalDeuda>0?'#1A6B4A':'#d4d9e0'), borderRadius:'8px', fontSize:'13px', fontWeight:500, cursor:totalDeuda>0?'pointer':'not-allowed', fontFamily:'Outfit, sans-serif' }}>
            ↓ Descargar informe Excel
          </button>
          {totalDeuda===0 && <p style={{ fontSize:'12px', color:'#9ca3af', textAlign:'center', marginTop:'8px' }}>Introduce al menos un concepto con importe.</p>}
        </div>
      </div>

      {/* VISTA PREVIA RESULTADO */}
      <div style={{ background:'#e8eaed', overflowY: isMobile?'visible':'auto', padding:'28px' }}>
        <div style={{ maxWidth:'540px', margin:'0 auto' }}>
          <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9ca3af', marginBottom:'12px', fontFamily:'Outfit, sans-serif' }}>Resultado</div>
          <div style={{ background:'#fff', borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,.1)', fontFamily:'Outfit, sans-serif' }}>
            <div style={{ background:'#0D1B2A', color:'#fff', padding:'20px 26px' }}>
              <div style={{ fontSize:'11px', letterSpacing:'.1em', color:'#B8975A', marginBottom:'6px' }}>INFORME DE GARANTÍA</div>
              <div style={{ fontSize:'17px', fontFamily:'Cormorant Garamond, serif', lineHeight:1.3 }}>{resultado.titulo}</div>
            </div>
            <div style={{ padding:'24px 26px' }}>
              {resultado.filas.map(([c,v],i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #eef0f3', fontSize:'14px', color:'#374151' }}>
                  <span>{c}</span><span style={{ fontWeight:500 }}>{eur(v)}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'18px', padding:'16px 20px', background:'#0D1B2A', borderRadius:'8px' }}>
                <span style={{ color:'#fff', fontSize:'13px', fontWeight:600, letterSpacing:'.04em' }}>IMPORTE TOTAL DE LA GARANTÍA</span>
                <span style={{ color:'#D4B483', fontSize:'20px', fontWeight:700, fontFamily:'Cormorant Garamond, serif' }}>{eur(resultado.total)}</span>
              </div>
              <p style={{ fontSize:'11.5px', color:'#9ca3af', lineHeight:1.6, marginTop:'18px', fontStyle:'italic' }}>{resultado.nota}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
