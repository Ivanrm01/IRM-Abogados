'use client'
import { useState } from 'react'

const LETRADO = {
  nombre: 'Iván Rojas Monfort',
  nif: '53.729.767-L',
  colegio: 'Abogado ICAM nº 142.327',
  email: 'ivanrojasmonfort@icam.es',
}

const LIMITACION = `La responsabilidad máxima asumida por el letrado Iván Rojas Monfort y los letrados intervinientes, ante el cliente o frente a terceros, por cualquier concepto, con relación a los servicios de la presente propuesta, no excederá del importe total de los honorarios fijos facturados por este trabajo.

El Letrado abajo firmante y sus eventuales colaboradores no serán responsables y se mantendrán indemnes por el Cliente ante cualquier pérdida, multa, daño, costas o gastos, ya sea ocasional, incidental o específico (incluyendo, a título meramente enunciativo, costes de oportunidad y lucro cesante), incluso si se hubiera advertido de su existencia, salvo que se demuestre, según las circunstancias del caso, su plena culpabilidad o grave negligencia profesional. Esta limitación de responsabilidad permanecerá en vigor incluso después de la realización del presente trabajo.`

const PROTECCION = `El cliente autoriza expresamente al letrado Iván Rojas Monfort para la inclusión en sus ficheros y el tratamiento de los datos de carácter personal respecto de toda la información y documentación que le fuera facilitada para el ejercicio de la prestación objeto de este encargo profesional. Dichos datos permanecerán en sus ficheros, pudiendo ejercer el Cliente sus derechos ARCO (Acceso, Rectificación, Cancelación u Olvido y/u Oposición), mediante solicitud escrita del interesado, de acuerdo con la legislación vigente.`

const lineInput = { width:'100%', padding:'10px 12px', border:'1px solid #d4d9e0', borderRadius:'6px', fontSize:'14px', fontFamily:'Outfit, sans-serif', boxSizing:'border-box', background:'#fff' }
const lbl = { display:'block', fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#6b7280', marginBottom:'6px' }
const fieldWrap = { marginBottom:'16px' }
const sectionLbl = { fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9ca3af', marginBottom:'14px', borderTop:'1px solid #eef0f3', paddingTop:'18px', marginTop:'6px' }

export default function HojaEncargo() {
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

  const loadScript = (src) => new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src = src; s.onload = res; s.onerror = rej
    document.head.appendChild(s)
  })

  const generarDOCX = async () => {
    setGenerando(true)
    try {
      if (!window.docx) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/docx/8.5.0/docx.min.js')
      }
      const D = window.docx
      const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = D
      const NAVY = '0D1B2A'

      // Helpers de párrafo
      const P = (text, { bold=false, align='both', size=21, after=120, color='232323' } = {}) => new Paragraph({
        alignment: align==='center'?AlignmentType.CENTER : align==='left'?AlignmentType.LEFT : align==='right'?AlignmentType.RIGHT : AlignmentType.JUSTIFIED,
        spacing: { after, line: 276 },
        children: [ new TextRun({ text: text||'', bold, size, color, font:'Times New Roman' }) ]
      })
      const H = (text) => new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [ new TextRun({ text, bold:true, size:22, color:NAVY, font:'Times New Roman' }) ]
      })

      // Tabla de honorarios estilo Word con cabecera azul
      const cell = (text, { header=false, w=70, align='left' } = {}) => new TableCell({
        width: { size: w, type: WidthType.PERCENTAGE },
        shading: header ? { type: ShadingType.SOLID, color: NAVY, fill: NAVY } : undefined,
        margins: { top: 60, bottom: 60, left: 90, right: 90 },
        children: [ new Paragraph({
          alignment: align==='right'?AlignmentType.RIGHT:AlignmentType.LEFT,
          children: [ new TextRun({ text, bold:header, color: header?'FFFFFF':'232323', size:20, font:'Times New Roman' }) ]
        }) ]
      })
      const tabla = (encabezado, filas) => new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [ cell(encabezado[0], {header:true, w:78}), cell(encabezado[1], {header:true, w:22, align:'right'}) ] }),
          ...filas.map(r => new TableRow({ children: [ cell(r.concepto||'—', {w:78}), cell(fmt(r.importe)+' €', {w:22, align:'right'}) ] }))
        ]
      })

      const kids = []
      if (d.asunto) kids.push(new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:240}, children:[ new TextRun({ text:'PROPUESTA DE COLABORACIÓN PROFESIONAL '+d.asunto.toUpperCase(), bold:true, size:22, color:NAVY, font:'Times New Roman' }) ] }))

      kids.push(new Paragraph({ spacing:{after:0}, children:[ new TextRun({ text:LETRADO.nombre.toUpperCase(), bold:true, size:22, color:NAVY, font:'Times New Roman' }) ] }))
      kids.push(P('N.I.F '+LETRADO.nif, { size:19, color:'464646', after:0 }))
      kids.push(P(LETRADO.colegio, { size:19, color:'464646', after:0 }))
      kids.push(P(LETRADO.email, { size:19, color:'464646', after:240 }))

      kids.push(new Paragraph({ spacing:{after:0}, children:[ new TextRun({ text:d.clienteNombre||'—', bold:true, size:22, color:NAVY, font:'Times New Roman' }) ] }))
      if (d.clienteNif) kids.push(P('N.I.F '+d.clienteNif, { size:19, color:'464646', after:200 }))

      kids.push(P(d.tratamiento||'Muy Sr. mío:', { after:160 }))
      kids.push(P('En respuesta a su amable petición y para reflejar el acuerdo al que hemos llegado, tengo el gusto de presentarle este documento que refleja nuestro acuerdo de colaboración profesional.'))
      kids.push(P('De conformidad con nuestras normas deontológicas, toda la información que nos suministre o aquélla a la que pudiéramos tener acceso, sería tratada de forma estrictamente confidencial.'))
      kids.push(P('Entiendo que esta propuesta se ajusta a los acuerdos que hemos alcanzado. Sin embargo, de no ser así, estoy a su disposición para estudiar las consideraciones que deseen plantearme.'))
      kids.push(P('* * * * *', { align:'center', after:160 }))

      kids.push(H('I. ANTECEDENTES DE ESTA COLABORACIÓN PROFESIONAL'))
      if (d.antecedentes) kids.push(P(d.antecedentes))
      kids.push(P('Objeto de este encargo profesional, y régimen jurídico del mismo.', { bold:true, align:'left' }))
      if (d.objeto) kids.push(P(d.objeto))
      kids.push(P('La ejecución de los trabajos que ahora se ratifica con la firma de conformidad a esta propuesta se efectuará en régimen de arrendamiento de servicios, de conformidad con las normas deontológicas del Colegio de Abogados de Madrid, y las cláusulas previstas en esta propuesta.'))

      kids.push(H('II. HONORARIOS Y FACTURACIÓN'))
      kids.push(P('La determinación de los honorarios se realiza en función del tiempo previsto y de otros factores tales como la complejidad del trabajo, la experiencia necesaria o la cualificación de las personas intervinientes.'))
      kids.push(P('II.1.- Honorarios fijos.', { bold:true, align:'left', after:80 }))
      if (fijosValidos.length) { kids.push(tabla(['Concepto','Honorarios'], fijosValidos)); kids.push(P('', {after:40})) }
      kids.push(P('A las indicadas cantidades como honorarios de este despacho habrá que añadir el IVA al tipo vigente en la fecha de facturación.', { size:17, color:'6e6e6e' }))
      kids.push(P('Los honorarios fijos se devengarán y serán exigibles el día en que quede presentado el escrito correspondiente. En dicha fecha se emitirá la factura a favor del letrado Iván Rojas Monfort.'))

      if (tieneVariable) {
        kids.push(P('II.2.- Honorarios variables.', { bold:true, align:'left', after:80 }))
        kids.push(tabla(['Presupuesto de honorarios variables','Honorarios'], [variable]))
        kids.push(P('', {after:40}))
        kids.push(P('A las indicadas cantidades habrá que añadir el IVA vigente. Los honorarios variables se devengarán el día en que se notifique la resolución o sentencia estimatoria.', { size:17, color:'6e6e6e' }))
      }

      kids.push(H('III. LIMITACIÓN DE RESPONSABILIDAD'))
      LIMITACION.split('\n\n').forEach(par => kids.push(P(par)))
      kids.push(H('IV. PROTECCIÓN DE DATOS'))
      kids.push(P(PROTECCION, { after:300 }))

      kids.push(P('En '+(d.lugar||'Madrid')+', a '+fechaLarga(d.fecha)+'.', { bold:true, align:'left', after:600 }))

      // Firmas en dos columnas
      const sinBorde = { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} }
      kids.push(new Table({
        width:{ size:100, type:WidthType.PERCENTAGE },
        borders: sinBorde,
        rows:[ new TableRow({ children:[
          new TableCell({ borders:sinBorde, width:{size:50,type:WidthType.PERCENTAGE}, children:[ new Paragraph({ children:[ new TextRun({ text:'_____________________________', font:'Times New Roman', size:20 }) ] }), new Paragraph({ children:[ new TextRun({ text:LETRADO.nombre, font:'Times New Roman', size:20 }) ] }) ] }),
          new TableCell({ borders:sinBorde, width:{size:50,type:WidthType.PERCENTAGE}, children:[ new Paragraph({ children:[ new TextRun({ text:'Acepto,', bold:true, font:'Times New Roman', size:20 }) ] }), new Paragraph({ children:[ new TextRun({ text:'_____________________________', font:'Times New Roman', size:20 }) ] }), new Paragraph({ children:[ new TextRun({ text:d.clienteNombre||'El Cliente', font:'Times New Roman', size:20 }) ] }) ] })
        ] }) ]
      }))

      const doc = new Document({ sections:[ { properties:{ page:{ margin:{ top:1134, bottom:1134, left:1247, right:1247 } } }, children: kids } ] })
      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Hoja-encargo-'+(d.clienteNombre||'cliente').replace(/\s+/g,'-')+'-'+d.fecha+'.docx'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Error al generar el Word: ' + e.message)
    }
    setGenerando(false)
  }

  const generarPDF = async () => {
    setGenerando(true)
    try {
      if (!window.jspdf) {
        await new Promise((res, rej) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
          s.onload = res; s.onerror = rej
          document.head.appendChild(s)
        })
      }
      const { jsPDF } = window.jspdf
      const doc = new jsPDF({ unit:'mm', format:'a4' })
      const M = 22, W = 210 - M*2
      let y = M

      const brk = (h) => { if (y + h > 275) { doc.addPage(); y = M } }
      const par = (text, { size=10.5, style='normal', gap=4, color=[35,35,35], align='justify', lh=1.5 } = {}) => {
        if (!text) return
        doc.setFont('times', style); doc.setFontSize(size); doc.setTextColor(color[0],color[1],color[2])
        const lines = doc.splitTextToSize(text, W)
        const lineH = size*0.352*lh
        lines.forEach((line)=> {
          brk(lineH)
          if (align==='center') doc.text(line, 105, y, { align:'center' })
          else if (align==='right') doc.text(line, 210-M, y, { align:'right' })
          else doc.text(line, M, y)
          y += lineH
        })
        y += gap
      }

      if (d.asunto) {
        doc.setFont('times','bold'); doc.setFontSize(11); doc.setTextColor(13,27,42)
        const t = doc.splitTextToSize('PROPUESTA DE COLABORACIÓN PROFESIONAL '+d.asunto.toUpperCase(), W)
        t.forEach(l => { brk(6); doc.text(l, 105, y, { align:'center' }); y += 5 })
        y += 6
      }

      doc.setFont('times','bold'); doc.setFontSize(11); doc.setTextColor(13,27,42)
      doc.text(LETRADO.nombre.toUpperCase(), M, y); y += 5
      doc.setFont('times','normal'); doc.setFontSize(9.5); doc.setTextColor(70,70,70)
      doc.text('N.I.F '+LETRADO.nif, M, y); y += 4.2
      doc.text(LETRADO.colegio, M, y); y += 4.2
      doc.text(LETRADO.email, M, y); y += 9

      doc.setFont('times','bold'); doc.setFontSize(11); doc.setTextColor(13,27,42)
      doc.text(d.clienteNombre || '—', M, y); y += 5
      if (d.clienteNif) { doc.setFont('times','normal'); doc.setFontSize(9.5); doc.setTextColor(70,70,70); doc.text('N.I.F '+d.clienteNif, M, y); y += 8 }
      else y += 3

      par(d.tratamiento || 'Muy Sr. mío:', { gap:3 })
      par('En respuesta a su amable petición y para reflejar el acuerdo al que hemos llegado, tengo el gusto de presentarle este documento que refleja nuestro acuerdo de colaboración profesional.')
      par('De conformidad con nuestras normas deontológicas, toda la información que nos suministre o aquélla a la que pudiéramos tener acceso, sería tratada de forma estrictamente confidencial.')
      par('Entiendo que esta propuesta se ajusta a los acuerdos que hemos alcanzado. Sin embargo, de no ser así, estoy a su disposición para estudiar las consideraciones que deseen plantearme.', { gap:3 })
      par('* * * * *', { align:'center', gap:4 })

      par('I. ANTECEDENTES DE ESTA COLABORACIÓN PROFESIONAL', { style:'bold', size:11, gap:3, align:'left' })
      if (d.antecedentes) par(d.antecedentes)
      par('Objeto de este encargo profesional, y régimen jurídico del mismo.', { style:'bold', size:10.5, gap:2, align:'left' })
      if (d.objeto) par(d.objeto)
      par('La ejecución de los trabajos que ahora se ratifica con la firma de conformidad a esta propuesta se efectuará en régimen de arrendamiento de servicios, de conformidad con las normas deontológicas del Colegio de Abogados de Madrid, y las cláusulas previstas en esta propuesta.')

      par('II. HONORARIOS Y FACTURACIÓN', { style:'bold', size:11, gap:3, align:'left' })
      par('La determinación de los honorarios se realiza en función del tiempo previsto y de otros factores tales como la complejidad del trabajo, la experiencia necesaria o la cualificación de las personas intervinientes.')
      par('II.1.- Honorarios fijos.', { style:'bold', size:10.5, gap:3, align:'left' })

      const drawTable = (header, rows) => {
        const colW = [W-40, 40]
        const rowH = (txt) => { const l = doc.splitTextToSize(txt, colW[0]-6); return Math.max(8, l.length*4.5 + 3) }
        brk(9)
        doc.setFillColor(13,27,42); doc.setDrawColor(13,27,42)
        doc.rect(M, y, colW[0], 8, 'FD'); doc.rect(M+colW[0], y, colW[1], 8, 'FD')
        doc.setFont('times','bold'); doc.setFontSize(10); doc.setTextColor(255,255,255)
        doc.text(header[0], M+3, y+5.3)
        doc.text(header[1], M+colW[0]+3, y+5.3)
        y += 8
        doc.setTextColor(35,35,35)
        rows.forEach(r => {
          const h = rowH(r.concepto || '—')
          brk(h)
          doc.setDrawColor(180,180,180)
          doc.rect(M, y, colW[0], h); doc.rect(M+colW[0], y, colW[1], h)
          doc.setFont('times','normal'); doc.setFontSize(10)
          const l = doc.splitTextToSize(r.concepto || '—', colW[0]-6)
          l.forEach((line,i)=> doc.text(line, M+3, y+5+i*4.5))
          doc.text(fmt(r.importe)+' €', M+colW[0]+colW[1]-3, y+5, { align:'right' })
          y += h
        })
        y += 3
      }

      if (fijosValidos.length) drawTable(['Concepto','Honorarios'], fijosValidos)
      par('A las cantidades indicadas habrá que añadir el IVA al tipo vigente en la fecha de facturación.', { size:8.5, color:[110,110,110], gap:4 })
      par('Los honorarios fijos se devengarán y serán exigibles el día en que quede presentado el escrito correspondiente. En dicha fecha se emitirá la factura a favor del letrado Iván Rojas Monfort.')

      if (tieneVariable) {
        par('II.2.- Honorarios variables.', { style:'bold', size:10.5, gap:3, align:'left' })
        drawTable(['Presupuesto de honorarios variables','Honorarios'], [variable])
        par('A las cantidades indicadas habrá que añadir el IVA vigente. Los honorarios variables se devengarán el día en que se notifique la resolución/sentencia estimatoria.', { size:8.5, color:[110,110,110] })
      }

      par('III. LIMITACIÓN DE RESPONSABILIDAD', { style:'bold', size:11, gap:3, align:'left' })
      par(LIMITACION)
      par('IV. PROTECCIÓN DE DATOS', { style:'bold', size:11, gap:3, align:'left' })
      par(PROTECCION, { gap:8 })

      par('En '+(d.lugar || 'Madrid')+', a '+fechaLarga(d.fecha)+'.', { style:'bold', gap:16, align:'left' })
      brk(24)
      doc.setDrawColor(120,120,120)
      doc.line(M, y, M+62, y)
      doc.line(210-M-62, y, 210-M, y)
      y += 5
      doc.setFont('times','normal'); doc.setFontSize(10); doc.setTextColor(40,40,40)
      doc.text(LETRADO.nombre, M, y)
      doc.setFont('times','bold'); doc.text('Acepto,', 210-M-62, y)
      y += 4.5
      doc.setFont('times','normal'); doc.text(d.clienteNombre || 'El Cliente', 210-M-62, y)

      doc.save('Hoja-encargo-'+(d.clienteNombre||'cliente').replace(/\s+/g,'-')+'-'+d.fecha+'.pdf')
    } catch (e) {
      alert('Error al generar el PDF: ' + e.message)
    }
    setGenerando(false)
  }

  const sheet = { background:'#fff', boxShadow:'0 2px 16px rgba(0,0,0,.12)', padding:'40px 44px', fontFamily:'Georgia, "Times New Roman", serif', fontSize:'11px', lineHeight:1.55, color:'#232323' }
  const pTitle = { textAlign:'center', fontWeight:700, color:'#0D1B2A', fontSize:'11.5px', marginBottom:'18px', textTransform:'uppercase', lineHeight:1.4 }
  const h2 = { fontWeight:700, color:'#0D1B2A', fontSize:'12px', margin:'16px 0 8px' }
  const pj = { textAlign:'justify', margin:'0 0 9px' }
  const tbl = { width:'100%', borderCollapse:'collapse', margin:'6px 0 4px' }
  const thd = { background:'#0D1B2A', color:'#fff', textAlign:'left', padding:'6px 8px', fontWeight:700, border:'1px solid #0D1B2A' }
  const tdc = { padding:'6px 8px', border:'1px solid #b4b4b4' }
  const note = { fontSize:'9px', color:'#777', fontStyle:'italic', margin:'2px 0 10px' }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'minmax(380px, 460px) 1fr', gap:'0', height:'100%' }}>
      <div style={{ padding:'24px 28px', overflowY:'auto', borderRight:'1px solid #e5e7eb', fontFamily:'Outfit, sans-serif' }}>
        <div style={{ background:'#FDF6E3', border:'1px solid #E8D9B5', borderRadius:'8px', padding:'12px 14px', marginBottom:'20px', fontSize:'12px', color:'#7a6a3f', lineHeight:1.55 }}>
          <strong>Privacidad:</strong> nada se guarda online. El PDF se genera en tu navegador y se descarga a tu equipo.
        </div>
        <h2 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'24px', fontWeight:400, color:'#0D1B2A', marginBottom:'4px' }}>Generador de hojas de encargo</h2>
        <p style={{ fontSize:'12px', color:'#6b7280', marginBottom:'24px' }}>Los cambios se ven en la vista previa de la derecha.</p>

        <div style={fieldWrap}>
          <label style={lbl}>Asunto / subtítulo de la propuesta</label>
          <textarea style={{...lineInput, minHeight:'60px', resize:'vertical'}} value={d.asunto} onChange={e=>f('asunto',e.target.value)} placeholder="en relación con el recurso contencioso-administrativo ante la Audiencia Nacional..." />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'14px' }}>
          <div style={fieldWrap}>
            <label style={lbl}>Cliente</label>
            <input style={lineInput} value={d.clienteNombre} onChange={e=>f('clienteNombre',e.target.value)} placeholder="ENROM SYSTEM, S.L.U." />
          </div>
          <div style={fieldWrap}>
            <label style={lbl}>NIF cliente</label>
            <input style={lineInput} value={d.clienteNif} onChange={e=>f('clienteNif',e.target.value)} placeholder="B-73.836.744" />
          </div>
        </div>

        <div style={fieldWrap}>
          <label style={lbl}>Tratamiento</label>
          <input style={lineInput} value={d.tratamiento} onChange={e=>f('tratamiento',e.target.value)} placeholder="Muy Sr. mío:" />
        </div>

        <div style={sectionLbl}>Contenido</div>
        <div style={fieldWrap}>
          <label style={lbl}>I. Antecedentes</label>
          <textarea style={{...lineInput, minHeight:'120px', resize:'vertical'}} value={d.antecedentes} onChange={e=>f('antecedentes',e.target.value)} placeholder="La Dependencia Regional de Recaudación... notificó a la mercantil... Acuerdo de derivación de responsabilidad..." />
        </div>
        <div style={fieldWrap}>
          <label style={lbl}>Objeto del encargo</label>
          <textarea style={{...lineInput, minHeight:'80px', resize:'vertical'}} value={d.objeto} onChange={e=>f('objeto',e.target.value)} placeholder="El objeto de la colaboración consiste en la interposición de un recurso contencioso-administrativo..." />
        </div>

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
          <input style={lineInput} value={variable.concepto} onChange={e=>setVariable(v=>({...v,concepto:e.target.value}))} placeholder="Estimación del recurso contencioso-administrativo" />
          <input style={lineInput} value={variable.importe} onChange={e=>setVariable(v=>({...v,importe:e.target.value}))} placeholder="11500" />
        </div>

        <div style={sectionLbl}>Lugar y fecha</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
          <div style={fieldWrap}>
            <label style={lbl}>Lugar</label>
            <input style={lineInput} value={d.lugar} onChange={e=>f('lugar',e.target.value)} placeholder="Castellón" />
          </div>
          <div style={fieldWrap}>
            <label style={lbl}>Fecha</label>
            <input type="date" style={lineInput} value={d.fecha} onChange={e=>f('fecha',e.target.value)} />
          </div>
        </div>

        <button onClick={generarDOCX} disabled={generando||!d.clienteNombre} style={{ width:'100%', marginTop:'8px', padding:'15px', background:d.clienteNombre?'#0D1B2A':'#9ca3af', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:600, letterSpacing:'.04em', cursor:d.clienteNombre?'pointer':'not-allowed', fontFamily:'Outfit, sans-serif' }}>
          {generando ? 'Generando...' : '↓ Descargar Word (.docx)'}
        </button>
        <button onClick={generarPDF} disabled={generando||!d.clienteNombre} style={{ width:'100%', marginTop:'10px', padding:'12px', background:'transparent', color:d.clienteNombre?'#0D1B2A':'#9ca3af', border:'1px solid '+(d.clienteNombre?'#0D1B2A':'#d4d9e0'), borderRadius:'8px', fontSize:'13px', fontWeight:500, cursor:d.clienteNombre?'pointer':'not-allowed', fontFamily:'Outfit, sans-serif' }}>
          ↓ Descargar PDF (borrador rápido)
        </button>
        {!d.clienteNombre && <p style={{ fontSize:'12px', color:'#9ca3af', textAlign:'center', marginTop:'8px' }}>Introduce el nombre del cliente para generar el documento.</p>}
        <p style={{ fontSize:'11px', color:'#9ca3af', textAlign:'center', marginTop:'10px', lineHeight:1.5 }}>El Word mantiene el formato fiel a tu plantilla. Ábrelo en Word y expórtalo a PDF si lo necesitas.</p>
      </div>

      <div style={{ background:'#e8eaed', overflowY:'auto', padding:'28px' }}>
        <div style={{ maxWidth:'620px', margin:'0 auto' }}>
          <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9ca3af', marginBottom:'12px', fontFamily:'Outfit, sans-serif' }}>Vista previa</div>
          <div style={sheet}>
            {d.asunto && <div style={pTitle}>PROPUESTA DE COLABORACIÓN PROFESIONAL {d.asunto.toUpperCase()}</div>}

            <div style={{ fontWeight:700, color:'#0D1B2A' }}>{LETRADO.nombre.toUpperCase()}</div>
            <div style={{ color:'#555', fontSize:'10px' }}>N.I.F {LETRADO.nif}</div>
            <div style={{ color:'#555', fontSize:'10px' }}>{LETRADO.colegio}</div>
            <div style={{ color:'#555', fontSize:'10px', marginBottom:'14px' }}>{LETRADO.email}</div>

            <div style={{ fontWeight:700, color:'#0D1B2A' }}>{d.clienteNombre || '—'}</div>
            {d.clienteNif && <div style={{ color:'#555', fontSize:'10px', marginBottom:'10px' }}>N.I.F {d.clienteNif}</div>}

            <p style={{...pj, marginTop:'10px'}}>{d.tratamiento || 'Muy Sr. mío:'}</p>
            <p style={pj}>En respuesta a su amable petición y para reflejar el acuerdo al que hemos llegado, tengo el gusto de presentarle este documento que refleja nuestro acuerdo de colaboración profesional.</p>
            <p style={pj}>De conformidad con nuestras normas deontológicas, toda la información que nos suministre sería tratada de forma estrictamente confidencial.</p>
            <p style={{ textAlign:'center', margin:'10px 0' }}>* * * * *</p>

            <div style={h2}>I. ANTECEDENTES DE ESTA COLABORACIÓN PROFESIONAL</div>
            {d.antecedentes && <p style={pj}>{d.antecedentes}</p>}
            <p style={{ fontWeight:700, margin:'8px 0 6px' }}>Objeto de este encargo profesional, y régimen jurídico del mismo.</p>
            {d.objeto && <p style={pj}>{d.objeto}</p>}
            <p style={pj}>La ejecución de los trabajos se efectuará en régimen de arrendamiento de servicios, de conformidad con las normas deontológicas del Colegio de Abogados de Madrid.</p>

            <div style={h2}>II. HONORARIOS Y FACTURACIÓN</div>
            <p style={{ fontWeight:700, margin:'8px 0 4px' }}>II.1.- Honorarios fijos.</p>
            {fijosValidos.length > 0 && (
              <table style={tbl}><tbody>
                <tr><th style={thd}>Concepto</th><th style={{...thd, textAlign:'right', width:'90px'}}>Honorarios</th></tr>
                {fijosValidos.map((r,i)=>(
                  <tr key={i}><td style={tdc}>{r.concepto||'—'}</td><td style={{...tdc, textAlign:'right'}}>{fmt(r.importe)} €</td></tr>
                ))}
              </tbody></table>
            )}
            <p style={note}>A las cantidades indicadas habrá que añadir el IVA vigente en la fecha de facturación.</p>

            {tieneVariable && (
              <>
                <p style={{ fontWeight:700, margin:'8px 0 4px' }}>II.2.- Honorarios variables.</p>
                <table style={tbl}><tbody>
                  <tr><th style={thd}>Presupuesto de honorarios variables</th><th style={{...thd, textAlign:'right', width:'90px'}}>Honorarios</th></tr>
                  <tr><td style={tdc}>{variable.concepto||'—'}</td><td style={{...tdc, textAlign:'right'}}>{fmt(variable.importe)} €</td></tr>
                </tbody></table>
                <p style={note}>A las cantidades indicadas habrá que añadir el IVA vigente.</p>
              </>
            )}

            <div style={h2}>III. LIMITACIÓN DE RESPONSABILIDAD</div>
            <p style={pj}>{LIMITACION}</p>
            <div style={h2}>IV. PROTECCIÓN DE DATOS</div>
            <p style={pj}>{PROTECCION}</p>

            <p style={{ fontWeight:700, margin:'16px 0 30px' }}>En {d.lugar||'Madrid'}, a {fechaLarga(d.fecha)}.</p>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px' }}>
              <div><div style={{ borderTop:'1px solid #777', width:'140px', marginBottom:'4px' }}></div>{LETRADO.nombre}</div>
              <div><div style={{ fontWeight:700, marginBottom:'4px' }}>Acepto,</div><div style={{ borderTop:'1px solid #777', width:'140px', marginBottom:'4px' }}></div>{d.clienteNombre||'El Cliente'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
