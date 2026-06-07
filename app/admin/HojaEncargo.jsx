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

const LETRADO = {
  nombre: 'Iván Rojas Monfort',
  nif: '53.729.767-L',
  colegio: 'Abogado ICAM nº 142.327',
  email: 'ivanrojasmonfort@icam.es',
}

const LIMITACION_1 = 'La responsabilidad máxima asumida por el letrado Iván Rojas Monfort y los letrados intervinientes, ante el cliente o frente a terceros, por cualquier concepto, con relación a los servicios de la presente propuesta, no excederá del importe total de los honorarios fijos facturados por este trabajo.'
const LIMITACION_2 = 'El Letrado abajo firmante y sus eventuales colaboradores no serán responsables y se mantendrán indemnes por el Cliente ante cualquier pérdida, multa, daño, costas o gastos, ya sea ocasional, incidental o específico (incluyendo, a título meramente enunciativo, costes de oportunidad y lucro cesante), incluso si se hubiera advertido de su existencia, salvo que se demuestre, según las circunstancias del caso, su plena culpabilidad o grave negligencia profesional. Esta limitación de responsabilidad permanecerá en vigor incluso después de la realización del presente trabajo.'
const PROTECCION = 'El cliente autoriza expresamente al letrado Iván Rojas Monfort para la inclusión en sus ficheros y el tratamiento de los datos de carácter personal respecto de toda la información y documentación que le fuera facilitada para el ejercicio de la prestación objeto de este encargo profesional. Dichos datos permanecerán en sus ficheros, pudiendo ejercer el Cliente sus derechos ARCO (Acceso, Rectificación, Cancelación u Olvido y/u Oposición), mediante solicitud escrita del interesado, de acuerdo con la legislación vigente.'

const lineInput = { width:'100%', padding:'10px 12px', border:'1px solid #d4d9e0', borderRadius:'6px', fontSize:'14px', fontFamily:'Outfit, sans-serif', boxSizing:'border-box', background:'#fff' }
const lbl = { display:'block', fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#6b7280', marginBottom:'6px' }
const fieldWrap = { marginBottom:'16px' }
const sectionLbl = { fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9ca3af', marginBottom:'14px', borderTop:'1px solid #eef0f3', paddingTop:'18px', marginTop:'6px' }

const loadScript = (src) => new Promise((res, rej) => {
  const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s)
})

export default function HojaEncargo() {
  const isMobile = useIsMobile()
  const [d, setD] = useState({
    fecha: new Date().toISOString().split('T')[0],
    lugar: 'Madrid',
    clienteNombre: '',
    clienteNif: '',
    tratamiento: 'Muy Sr. mío:',
    asunto: '',
    antecedentes: '',
    objeto: '',
  })
  const [fijos, setFijos] = useState([{ concepto:'', importe:'' }])
  const [variable, setVariable] = useState({ concepto:'', importe:'' })
  const [generando, setGenerando] = useState(false)

  const f = (k,v) => setD(p => ({ ...p, [k]:v }))
  const setFijo = (i,k,v) => setFijos(arr => arr.map((row,idx)=> idx===i ? {...row,[k]:v} : row))
  const addFijo = () => setFijos(arr => [...arr, { concepto:'', importe:'' }])
  const delFijo = (i) => setFijos(arr => arr.filter((_,idx)=> idx!==i))

  const fmt = (n) => {
    const num = parseFloat(String(n).replace(/\./g,'').replace(',','.'))
    if (isNaN(num)) return n || ''
    return num.toLocaleString('es-ES', { minimumFractionDigits:2, maximumFractionDigits:2 })
  }
  const fechaLarga = (iso) => {
    try { return new Date(iso+'T00:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) }
    catch { return iso }
  }

  const fijosValidos = fijos.filter(r=>r.concepto||r.importe)
  const tieneVariable = variable.concepto || variable.importe

  const generarPDF = async () => {
    setGenerando(true)
    try {
      if (!window.jspdf) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
      const { jsPDF } = window.jspdf
      const doc = new jsPDF({ unit:'mm', format:'a4' })

      // Cargar fuente EB Garamond (Garamond real) desde Google Fonts y embeberla
      if (!doc.getFontList()['EBGaramond'] || !doc.getFontList()['EBGaramond'].includes('normal')) {
        const fetchB64 = async (url) => {
          const r = await fetch(url)
          const buf = await r.arrayBuffer()
          let bin = ''; const bytes = new Uint8Array(buf)
          for (let i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i])
          return btoa(bin)
        }
        const reg = await fetchB64('https://raw.githubusercontent.com/google/fonts/main/ofl/ebgaramond/EBGaramond%5Bwght%5D.ttf')
        doc.addFileToVFS('EBGaramond.ttf', reg)
        doc.addFont('EBGaramond.ttf', 'EBGaramond', 'normal')
        doc.addFont('EBGaramond.ttf', 'EBGaramond', 'bold')
      }
      const FONT = 'EBGaramond'

      const NAVY = [13,27,42], GOLD = [184,151,90], INK = [38,38,38], GREY = [110,110,110]
      const PW = 210, PH = 297, M = 24, W = PW - M*2
      let y = 0, page = 1

      const footer = () => {
        doc.setDrawColor(GOLD[0],GOLD[1],GOLD[2]); doc.setLineWidth(0.4)
        doc.line(M, PH-16, PW-M, PH-16)
        doc.setFont(FONT,'normal'); doc.setFontSize(7.5); doc.setTextColor(GREY[0],GREY[1],GREY[2])
        doc.text(LETRADO.nombre+'  ·  '+LETRADO.colegio+'  ·  '+LETRADO.email, M, PH-11)
        doc.text(String(page), PW-M, PH-11, { align:'right' })
      }
      const newPage = () => { footer(); doc.addPage(); page++; y = M+4 }
      const brk = (h) => { if (y + h > PH-22) newPage() }

      const para = (text, { size=10.5, style='normal', gap=3.4, color=INK, align='justify', lh=1.55, indent=0 } = {}) => {
        if (!text) return
        doc.setFont(FONT,style); doc.setFontSize(size); doc.setTextColor(color[0],color[1],color[2])
        const lines = doc.splitTextToSize(text, W-indent)
        const lineH = size*0.352*lh
        lines.forEach((ln,i) => {
          brk(lineH)
          const isLast = i===lines.length-1
          if (align==='justify' && !isLast && lines.length>1) {
            justifyLine(ln, M+indent, y, W-indent, size)
          } else if (align==='center') doc.text(ln, PW/2, y, {align:'center'})
          else if (align==='right') doc.text(ln, PW-M, y, {align:'right'})
          else doc.text(ln, M+indent, y)
          y += lineH
        })
        y += gap
      }
      // Justificado real repartiendo el espacio entre palabras
      const justifyLine = (line, x, yy, width, size) => {
        const words = line.split(' ').filter(Boolean)
        if (words.length === 1) { doc.text(line, x, yy); return }
        const textW = doc.getStringUnitWidth(words.join('')) * size / doc.internal.scaleFactor
        const space = (width - textW) / (words.length - 1)
        let cx = x
        words.forEach((w,i) => {
          doc.text(w, cx, yy)
          cx += (doc.getStringUnitWidth(w) * size / doc.internal.scaleFactor) + space
        })
      }
      const heading = (text) => {
        brk(11)
        y += 2
        doc.setFont(FONT,'bold'); doc.setFontSize(12); doc.setTextColor(NAVY[0],NAVY[1],NAVY[2])
        doc.text(text, M, y)
        doc.setDrawColor(GOLD[0],GOLD[1],GOLD[2]); doc.setLineWidth(0.5)
        doc.line(M, y+1.8, M+doc.getTextWidth(text), y+1.8)
        y += 7
      }

      // ===== PORTADA / CABECERA =====
      // Banda superior navy
      doc.setFillColor(NAVY[0],NAVY[1],NAVY[2])
      doc.rect(0, 0, PW, 42, 'F')
      doc.setFont(FONT,'bold'); doc.setFontSize(30); doc.setTextColor(255,255,255)
      doc.text('IRM', M, 24)
      doc.setFont(FONT,'normal'); doc.setFontSize(8); doc.setTextColor(GOLD[0],GOLD[1],GOLD[2])
      doc.text('A B O G A D O S   &   A S E S O R E S', M, 31)
      // Datos letrado a la derecha
      doc.setFont(FONT,'normal'); doc.setFontSize(8.5); doc.setTextColor(220,220,225)
      doc.text(LETRADO.nombre, PW-M, 18, {align:'right'})
      doc.text('N.I.F '+LETRADO.nif, PW-M, 23, {align:'right'})
      doc.text(LETRADO.colegio, PW-M, 28, {align:'right'})
      doc.text(LETRADO.email, PW-M, 33, {align:'right'})

      y = 56
      // Etiqueta dorada
      doc.setFont(FONT,'normal'); doc.setFontSize(8.5); doc.setTextColor(GOLD[0],GOLD[1],GOLD[2])
      doc.text('PROPUESTA DE COLABORACIÓN PROFESIONAL', M, y)
      y += 8
      // Título (asunto)
      if (d.asunto) {
        doc.setFont(FONT,'bold'); doc.setFontSize(17); doc.setTextColor(NAVY[0],NAVY[1],NAVY[2])
        const t = doc.splitTextToSize(d.asunto, W)
        t.forEach(l => { doc.text(l, M, y); y += 7.5 })
      }
      y += 4
      doc.setDrawColor(GOLD[0],GOLD[1],GOLD[2]); doc.setLineWidth(0.6)
      doc.line(M, y, M+30, y)
      y += 12

      // Destinatario
      doc.setFont(FONT,'bold'); doc.setFontSize(11.5); doc.setTextColor(NAVY[0],NAVY[1],NAVY[2])
      doc.text(d.clienteNombre || '—', M, y); y += 5.5
      if (d.clienteNif) { doc.setFont(FONT,'normal'); doc.setFontSize(9.5); doc.setTextColor(GREY[0],GREY[1],GREY[2]); doc.text('N.I.F '+d.clienteNif, M, y); y += 8 }
      else y += 3

      para(d.tratamiento || 'Muy Sr. mío:', { gap:3 })
      para('En respuesta a su amable petición y para reflejar el acuerdo al que hemos llegado, tengo el gusto de presentarle este documento que refleja nuestro acuerdo de colaboración profesional.')
      para('De conformidad con nuestras normas deontológicas, toda la información que nos suministre o aquélla a la que pudiéramos tener acceso, sería tratada de forma estrictamente confidencial.')
      para('Entiendo que esta propuesta se ajusta a los acuerdos que hemos alcanzado. Sin embargo, de no ser así, estoy a su disposición para estudiar las consideraciones que deseen plantearme.', { gap:5 })

      heading('I. Antecedentes de esta colaboración profesional')
      para(d.antecedentes)
      para('Objeto de este encargo profesional, y régimen jurídico del mismo.', { style:'bold', align:'left', gap:2 })
      para(d.objeto)
      para('La ejecución de los trabajos que ahora se ratifica con la firma de conformidad a esta propuesta se efectuará en régimen de arrendamiento de servicios, de conformidad con las normas deontológicas del Colegio de Abogados de Madrid, y las cláusulas previstas en esta propuesta.')

      heading('II. Honorarios y facturación')
      para('La determinación de los honorarios se realiza en función del tiempo previsto y de otros factores tales como la complejidad del trabajo, la experiencia necesaria o la cualificación de las personas intervinientes.')
      para('II.1.- Honorarios fijos.', { style:'bold', align:'left', gap:3 })

      const drawTable = (header, rows) => {
        const c1 = W-38, c2 = 38, rh = 8.5
        brk(rh*2)
        // cabecera
        doc.setFillColor(NAVY[0],NAVY[1],NAVY[2])
        doc.rect(M, y, c1, rh, 'F'); doc.rect(M+c1, y, c2, rh, 'F')
        doc.setFont(FONT,'bold'); doc.setFontSize(9.5); doc.setTextColor(255,255,255)
        doc.text(header[0], M+3, y+5.6)
        doc.text(header[1], M+c1+c2-3, y+5.6, {align:'right'})
        y += rh
        doc.setTextColor(INK[0],INK[1],INK[2])
        rows.forEach((r,idx) => {
          doc.setFont(FONT,'normal'); doc.setFontSize(10)
          const lines = doc.splitTextToSize(r.concepto||'—', c1-6)
          const h = Math.max(rh, lines.length*4.6 + 3.5)
          brk(h)
          if (idx%2===1){ doc.setFillColor(248,246,240); doc.rect(M,y,c1,h,'F'); doc.rect(M+c1,y,c2,h,'F') }
          doc.setDrawColor(210,210,210); doc.setLineWidth(0.2)
          doc.rect(M, y, c1, h); doc.rect(M+c1, y, c2, h)
          lines.forEach((ln,i)=> doc.text(ln, M+3, y+5.2+i*4.6))
          doc.setFont(FONT,'bold')
          doc.text(fmt(r.importe)+' €', M+c1+c2-3, y+5.2, {align:'right'})
          y += h
        })
        y += 3
      }

      if (fijosValidos.length) drawTable(['Concepto','Honorarios'], fijosValidos)
      para('A las indicadas cantidades como honorarios de este despacho habrá que añadir el Impuesto sobre el Valor Añadido (I.V.A.) al tipo vigente en la fecha de facturación.', { size:8.5, color:GREY, gap:4 })
      para('Los honorarios fijos se devengarán y serán exigibles el día en que quede presentado el escrito correspondiente. En dicha fecha se emitirá la factura a favor del letrado Iván Rojas Monfort.')

      if (tieneVariable) {
        para('II.2.- Honorarios variables.', { style:'bold', align:'left', gap:3 })
        drawTable(['Presupuesto de honorarios variables','Honorarios'], [variable])
        para('A las indicadas cantidades habrá que añadir el I.V.A. vigente. Los honorarios variables se devengarán el día en que se notifique la resolución o sentencia estimatoria.', { size:8.5, color:GREY })
      }

      heading('III. Limitación de responsabilidad')
      para(LIMITACION_1)
      para(LIMITACION_2)

      heading('IV. Protección de datos')
      para(PROTECCION, { gap:8 })

      brk(40)
      doc.setFont(FONT,'bold'); doc.setFontSize(10.5); doc.setTextColor(NAVY[0],NAVY[1],NAVY[2])
      doc.text('En '+(d.lugar||'Madrid')+', a '+fechaLarga(d.fecha)+'.', M, y)
      y += 22
      doc.setDrawColor(120,120,120); doc.setLineWidth(0.3)
      doc.line(M, y, M+62, y)
      doc.line(PW-M-62, y, PW-M, y)
      y += 5
      doc.setFont(FONT,'normal'); doc.setFontSize(10); doc.setTextColor(INK[0],INK[1],INK[2])
      doc.text(LETRADO.nombre, M, y)
      doc.setFont(FONT,'bold'); doc.text('Acepto,', PW-M-62, y-9.5)
      doc.setFont(FONT,'normal'); doc.text(d.clienteNombre||'El Cliente', PW-M-62, y)

      footer()
      doc.save('Hoja-encargo-'+(d.clienteNombre||'cliente').replace(/\s+/g,'-')+'-'+d.fecha+'.pdf')
    } catch (e) {
      alert('Error al generar el PDF: ' + e.message)
    }
    setGenerando(false)
  }

  const sheet = { background:'#fff', boxShadow:'0 2px 16px rgba(0,0,0,.12)', fontFamily:'"EB Garamond", Garamond, "Times New Roman", serif', fontSize:'11px', lineHeight:1.6, color:'#262626' }
  const pj = { textAlign:'justify', margin:'0 0 9px' }
  const h2 = { fontWeight:700, color:'#0D1B2A', fontSize:'12.5px', margin:'18px 0 4px', borderBottom:'1.5px solid #B8975A', display:'inline-block', paddingBottom:'2px' }
  const tbl = { width:'100%', borderCollapse:'collapse', margin:'8px 0 4px' }
  const thd = { background:'#0D1B2A', color:'#fff', textAlign:'left', padding:'7px 9px', fontWeight:700, fontSize:'10.5px' }
  const tdc = { padding:'7px 9px', border:'1px solid #d2d2d2', fontSize:'10.5px' }
  const note = { fontSize:'9px', color:'#6e6e6e', fontStyle:'italic', margin:'2px 0 10px' }

  return (
    <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'minmax(380px, 440px) 1fr', gap:'0', height: isMobile?'auto':'100%' }}>
      {/* FORMULARIO */}
      <div style={{ padding:'24px 26px', overflowY: isMobile?'visible':'auto', borderRight: isMobile?'none':'1px solid #e5e7eb', borderBottom: isMobile?'1px solid #e5e7eb':'none', fontFamily:'Outfit, sans-serif' }}>
        <div style={{ background:'#FDF6E3', border:'1px solid #E8D9B5', borderRadius:'8px', padding:'12px 14px', marginBottom:'20px', fontSize:'12px', color:'#7a6a3f', lineHeight:1.55 }}>
          <strong>Privacidad:</strong> nada se guarda online. El PDF se genera en tu navegador y se descarga a tu equipo.
        </div>
        <h2 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'24px', fontWeight:400, color:'#0D1B2A', marginBottom:'4px' }}>Hojas de encargo</h2>
        <p style={{ fontSize:'12px', color:'#6b7280', marginBottom:'24px' }}>Rellena los campos · la vista previa se actualiza a la derecha.</p>

        <div style={fieldWrap}>
          <label style={lbl}>Asunto / título de la propuesta</label>
          <textarea style={{...lineInput, minHeight:'66px', resize:'vertical'}} value={d.asunto} onChange={e=>f('asunto',e.target.value)} placeholder="En relación con el acuerdo de derivación de responsabilidad solidaria ex art. 42.2.a) LGT" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'12px' }}>
          <div style={fieldWrap}><label style={lbl}>Cliente</label><input style={lineInput} value={d.clienteNombre} onChange={e=>f('clienteNombre',e.target.value)} placeholder="ENROM SYSTEM, S.L.U." /></div>
          <div style={fieldWrap}><label style={lbl}>NIF</label><input style={lineInput} value={d.clienteNif} onChange={e=>f('clienteNif',e.target.value)} placeholder="B-73.836.744" /></div>
        </div>
        <div style={fieldWrap}><label style={lbl}>Tratamiento</label><input style={lineInput} value={d.tratamiento} onChange={e=>f('tratamiento',e.target.value)} placeholder="Muy Sr. mío:" /></div>

        <div style={sectionLbl}>Contenido</div>
        <div style={fieldWrap}><label style={lbl}>I. Antecedentes</label><textarea style={{...lineInput, minHeight:'120px', resize:'vertical'}} value={d.antecedentes} onChange={e=>f('antecedentes',e.target.value)} placeholder="La Dependencia Regional de Recaudación de... notificó a la mercantil... Acuerdo de derivación..." /></div>
        <div style={fieldWrap}><label style={lbl}>Objeto del encargo</label><textarea style={{...lineInput, minHeight:'80px', resize:'vertical'}} value={d.objeto} onChange={e=>f('objeto',e.target.value)} placeholder="El objeto de la colaboración consiste en..." /></div>

        <div style={sectionLbl}>Honorarios fijos</div>
        {fijos.map((row,i)=>(
          <div key={i} style={{ display:'grid', gridTemplateColumns:'3fr 1fr auto', gap:'8px', marginBottom:'8px', alignItems:'center' }}>
            <input style={lineInput} value={row.concepto} onChange={e=>setFijo(i,'concepto',e.target.value)} placeholder="Estudio de antecedentes" />
            <input style={lineInput} value={row.importe} onChange={e=>setFijo(i,'importe',e.target.value)} placeholder="100" />
            <button onClick={()=>delFijo(i)} disabled={fijos.length===1} style={{ background:'none', border:'1px solid #e5e7eb', borderRadius:'6px', width:'36px', height:'36px', cursor:fijos.length===1?'not-allowed':'pointer', color:'#C0392B', fontSize:'18px', opacity:fijos.length===1?.3:1 }}>×</button>
          </div>
        ))}
        <button onClick={addFijo} style={{ background:'none', border:'1px dashed #B8975A', borderRadius:'6px', padding:'8px 14px', color:'#B8975A', fontSize:'13px', cursor:'pointer', fontWeight:500, marginTop:'2px' }}>+ Añadir concepto</button>

        <div style={sectionLbl}>Honorario variable (opcional)</div>
        <div style={{ display:'grid', gridTemplateColumns:'3fr 1fr', gap:'8px' }}>
          <input style={lineInput} value={variable.concepto} onChange={e=>setVariable(v=>({...v,concepto:e.target.value}))} placeholder="Por estimación del recurso" />
          <input style={lineInput} value={variable.importe} onChange={e=>setVariable(v=>({...v,importe:e.target.value}))} placeholder="11500" />
        </div>

        <div style={sectionLbl}>Lugar y fecha</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <div style={fieldWrap}><label style={lbl}>Lugar</label><input style={lineInput} value={d.lugar} onChange={e=>f('lugar',e.target.value)} placeholder="Castellón" /></div>
          <div style={fieldWrap}><label style={lbl}>Fecha</label><input type="date" style={lineInput} value={d.fecha} onChange={e=>f('fecha',e.target.value)} /></div>
        </div>

        <button onClick={generarPDF} disabled={generando||!d.clienteNombre} style={{ width:'100%', marginTop:'10px', padding:'15px', background:d.clienteNombre?'#0D1B2A':'#9ca3af', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:600, letterSpacing:'.04em', cursor:d.clienteNombre?'pointer':'not-allowed', fontFamily:'Outfit, sans-serif' }}>
          {generando ? 'Generando PDF...' : '↓ Descargar PDF profesional'}
        </button>
        {!d.clienteNombre && <p style={{ fontSize:'12px', color:'#9ca3af', textAlign:'center', marginTop:'8px' }}>Introduce el nombre del cliente para generar el PDF.</p>}
      </div>

      {/* VISTA PREVIA */}
      <div style={{ background:'#e8eaed', overflowY: isMobile?'visible':'auto', padding:'28px' }}>
        <div style={{ maxWidth:'600px', margin:'0 auto' }}>
          <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9ca3af', marginBottom:'12px', fontFamily:'Outfit, sans-serif' }}>Vista previa</div>
          <div style={sheet}>
            {/* Cabecera navy */}
            <div style={{ background:'#0D1B2A', color:'#fff', padding:'22px 30px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontSize:'30px', fontWeight:700, lineHeight:1 }}>IRM</div>
                <div style={{ fontSize:'7px', letterSpacing:'.3em', color:'#B8975A', marginTop:'3px' }}>ABOGADOS &amp; ASESORES</div>
              </div>
              <div style={{ textAlign:'right', fontSize:'8.5px', color:'#dcdce1', lineHeight:1.5 }}>
                <div>{LETRADO.nombre}</div><div>N.I.F {LETRADO.nif}</div><div>{LETRADO.colegio}</div><div>{LETRADO.email}</div>
              </div>
            </div>
            <div style={{ padding:'28px 30px' }}>
              <div style={{ fontSize:'8.5px', letterSpacing:'.12em', color:'#B8975A', marginBottom:'8px' }}>PROPUESTA DE COLABORACIÓN PROFESIONAL</div>
              {d.asunto && <div style={{ fontSize:'17px', fontWeight:700, color:'#0D1B2A', lineHeight:1.25 }}>{d.asunto}</div>}
              <div style={{ width:'30px', height:'2px', background:'#B8975A', margin:'12px 0 16px' }}></div>

              <div style={{ fontWeight:700, color:'#0D1B2A', fontSize:'11.5px' }}>{d.clienteNombre || '—'}</div>
              {d.clienteNif && <div style={{ color:'#6e6e6e', fontSize:'10px', marginBottom:'10px' }}>N.I.F {d.clienteNif}</div>}

              <p style={{...pj, marginTop:'10px'}}>{d.tratamiento || 'Muy Sr. mío:'}</p>
              <p style={pj}>En respuesta a su amable petición y para reflejar el acuerdo al que hemos llegado, tengo el gusto de presentarle este documento que refleja nuestro acuerdo de colaboración profesional.</p>
              <p style={pj}>De conformidad con nuestras normas deontológicas, toda la información que nos suministre sería tratada de forma estrictamente confidencial.</p>

              <div style={h2}>I. Antecedentes de esta colaboración profesional</div>
              {d.antecedentes && <p style={pj}>{d.antecedentes}</p>}
              <p style={{ fontWeight:700, margin:'6px 0 6px' }}>Objeto de este encargo profesional, y régimen jurídico del mismo.</p>
              {d.objeto && <p style={pj}>{d.objeto}</p>}

              <div style={h2}>II. Honorarios y facturación</div>
              <p style={{ fontWeight:700, margin:'10px 0 4px' }}>II.1.- Honorarios fijos.</p>
              {fijosValidos.length > 0 && (
                <table style={tbl}><tbody>
                  <tr><th style={thd}>Concepto</th><th style={{...thd, textAlign:'right', width:'90px'}}>Honorarios</th></tr>
                  {fijosValidos.map((r,i)=>(<tr key={i} style={{background:i%2?'#f8f6f0':'#fff'}}><td style={tdc}>{r.concepto||'—'}</td><td style={{...tdc, textAlign:'right', fontWeight:700}}>{fmt(r.importe)} €</td></tr>))}
                </tbody></table>
              )}
              <p style={note}>A las cantidades indicadas habrá que añadir el I.V.A. vigente en la fecha de facturación.</p>

              {tieneVariable && (<>
                <p style={{ fontWeight:700, margin:'10px 0 4px' }}>II.2.- Honorarios variables.</p>
                <table style={tbl}><tbody>
                  <tr><th style={thd}>Presupuesto de honorarios variables</th><th style={{...thd, textAlign:'right', width:'90px'}}>Honorarios</th></tr>
                  <tr><td style={tdc}>{variable.concepto||'—'}</td><td style={{...tdc, textAlign:'right', fontWeight:700}}>{fmt(variable.importe)} €</td></tr>
                </tbody></table>
                <p style={note}>A las cantidades indicadas habrá que añadir el I.V.A. vigente.</p>
              </>)}

              <div style={h2}>III. Limitación de responsabilidad</div>
              <p style={pj}>{LIMITACION_1}</p>
              <div style={h2}>IV. Protección de datos</div>
              <p style={pj}>{PROTECCION}</p>

              <p style={{ fontWeight:700, color:'#0D1B2A', margin:'18px 0 34px' }}>En {d.lugar||'Madrid'}, a {fechaLarga(d.fecha)}.</p>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px' }}>
                <div><div style={{ borderTop:'1px solid #777', width:'150px', marginBottom:'4px' }}></div>{LETRADO.nombre}</div>
                <div><div style={{ fontWeight:700, marginBottom:'4px' }}>Acepto,</div><div style={{ borderTop:'1px solid #777', width:'150px', marginBottom:'4px' }}></div>{d.clienteNombre||'El Cliente'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
