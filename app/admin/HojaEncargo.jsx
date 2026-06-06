'use client'
import { useState } from 'react'

// Datos fijos del letrado — se incluyen en todas las hojas
const LETRADO = {
  nombre: 'Iván Rojas Monfort',
  nif: '53.729.767-L',
  colegio: 'Abogado ICAM nº 142.327',
  email: 'ivanrojasmonfort@icam.es',
}

// Texto fijo de los apartados III y IV (idéntico en todas las hojas)
const LIMITACION = `La responsabilidad máxima asumida por el letrado Iván Rojas Monfort y los letrados intervinientes, ante el cliente o frente a terceros, por cualquier concepto, con relación a los servicios de la presente propuesta, no excederá del importe total de los honorarios fijos facturados por este trabajo.

El Letrado abajo firmante y sus eventuales colaboradores no serán responsables y se mantendrán indemnes por el Cliente ante cualquier pérdida, multa, daño, costas o gastos, ya sea ocasional, incidental o específico (incluyendo, a título meramente enunciativo, costes de oportunidad y lucro cesante), incluso si se hubiera advertido de su existencia, salvo que se demuestre, según las circunstancias del caso, su plena culpabilidad o grave negligencia profesional. Esta limitación de responsabilidad permanecerá en vigor incluso después de la realización del presente trabajo.`

const PROTECCION = `El cliente autoriza expresamente al letrado Iván Rojas Monfort para la inclusión en sus ficheros y el tratamiento de los datos de carácter personal respecto de toda la información y documentación que le fuera facilitada para el ejercicio de la prestación objeto de este encargo profesional. Dichos datos permanecerán en sus ficheros, pudiendo ejercer el Cliente sus derechos ARCO (Acceso, Rectificación, Cancelación u Olvido y/u Oposición), mediante solicitud escrita del interesado, de acuerdo con la legislación vigente.`

const lineInput = { width:'100%', padding:'10px 12px', border:'1px solid #d4d9e0', borderRadius:'6px', fontSize:'14px', fontFamily:'Outfit, sans-serif', boxSizing:'border-box', background:'#fff' }
const lbl = { display:'block', fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#6b7280', marginBottom:'6px' }
const fieldWrap = { marginBottom:'18px' }

export default function HojaEncargo() {
  const [d, setD] = useState({
    fecha: new Date().toISOString().split('T')[0],
    lugar: 'Madrid',
    clienteNombre: '',
    clienteNif: '',
    asunto: '',
    objeto: '',
    deudorNombre: '',
    deudorNif: '',
    importe: '',
    expediente: '',
  })
  const [fijos, setFijos] = useState([{ concepto:'', importe:'' }])
  const [variable, setVariable] = useState({ concepto:'', importe:'' })
  const [generando, setGenerando] = useState(false)

  const f = (k,v) => setD(p => ({ ...p, [k]:v }))
  const setFijo = (i,k,v) => setFijos(arr => arr.map((row,idx)=> idx===i ? {...row,[k]:v} : row))
  const addFijo = () => setFijos(arr => [...arr, { concepto:'', importe:'' }])
  const delFijo = (i) => setFijos(arr => arr.filter((_,idx)=> idx!==i))

  const fmt = (n) => {
    const num = parseFloat(String(n).replace(',','.'))
    if (isNaN(num)) return n
    return num.toLocaleString('es-ES', { minimumFractionDigits:2, maximumFractionDigits:2 })
  }
  const fechaLarga = (iso) => {
    try {
      return new Date(iso+'T00:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})
    } catch { return iso }
  }

  const generarPDF = async () => {
    setGenerando(true)
    try {
      // Cargar jsPDF desde CDN bajo demanda (no se incluye en el bundle)
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
      const M = 20            // margen
      const W = 210 - M*2     // ancho útil
      let y = M

      const checkBreak = (h) => { if (y + h > 277) { doc.addPage(); y = M } }
      const p = (text, { size=10, style='normal', gap=5, color=[40,40,40], align='left' } = {}) => {
        doc.setFont('times', style); doc.setFontSize(size); doc.setTextColor(...color)
        const lines = doc.splitTextToSize(text, W)
        lines.forEach(line => {
          checkBreak(size*0.42 + 1)
          doc.text(line, align==='center' ? 105 : M, y, { align })
          y += size*0.42 + 1.2
        })
        y += gap
      }

      // Encabezado letrado
      doc.setFont('times','bold'); doc.setFontSize(11); doc.setTextColor(13,27,42)
      doc.text(LETRADO.nombre.toUpperCase(), M, y); y += 5
      doc.setFont('times','normal'); doc.setFontSize(9); doc.setTextColor(80,80,80)
      doc.text(`N.I.F ${LETRADO.nif}`, M, y); y += 4
      doc.text(LETRADO.colegio, M, y); y += 4
      doc.text(LETRADO.email, M, y); y += 10

      // Título
      doc.setFont('times','bold'); doc.setFontSize(12); doc.setTextColor(13,27,42)
      const titulo = doc.splitTextToSize('PROPUESTA DE COLABORACIÓN PROFESIONAL', W)
      titulo.forEach(l => { doc.text(l, 105, y, { align:'center' }); y += 6 })
      if (d.asunto) {
        doc.setFontSize(10)
        const sub = doc.splitTextToSize(d.asunto.toUpperCase(), W)
        sub.forEach(l => { doc.text(l, 105, y, { align:'center' }); y += 5 })
      }
      y += 6

      // Cliente
      p(`Don/Doña ${d.clienteNombre || '—'}`, { style:'bold', gap:1 })
      p(`N.I.F ${d.clienteNif || '—'}`, { size:9, color:[80,80,80] })

      p('Muy Sres. míos:', { gap:4 })
      p('En respuesta a su amable petición y para reflejar el acuerdo al que hemos llegado, tengo el gusto de presentarle este documento que refleja nuestro acuerdo de colaboración profesional.')

      // I. Antecedentes y objeto
      p('I. ANTECEDENTES Y OBJETO DE LA COLABORACIÓN', { style:'bold', size:11, gap:3 })
      if (d.objeto) p(d.objeto)
      if (d.deudorNombre || d.importe || d.expediente) {
        let det = 'Datos del expediente: '
        const partes = []
        if (d.deudorNombre) partes.push(`deudor principal ${d.deudorNombre}${d.deudorNif?` (NIF: ${d.deudorNif})`:''}`)
        if (d.importe) partes.push(`importe de ${fmt(d.importe)} euros`)
        if (d.expediente) partes.push(`nº de expediente ${d.expediente}`)
        det += partes.join(', ') + '.'
        p(det)
      }
      p('La ejecución de los trabajos se efectuará en régimen de arrendamiento de servicios, de conformidad con las normas deontológicas del Colegio de Abogados de Madrid, y las cláusulas previstas en esta propuesta.')

      // II. Honorarios
      p('II. HONORARIOS Y FACTURACIÓN', { style:'bold', size:11, gap:3 })
      p('II.1.- Honorarios fijos.', { style:'bold', size:10, gap:2 })
      fijos.filter(r=>r.concepto||r.importe).forEach(r => {
        checkBreak(7)
        doc.setFont('times','normal'); doc.setFontSize(10); doc.setTextColor(40,40,40)
        const cl = doc.splitTextToSize(r.concepto || '—', W-35)
        cl.forEach((line,idx) => {
          doc.text(line, M, y)
          if (idx===0) doc.text(`${fmt(r.importe)} €`, 210-M, y, { align:'right' })
          y += 5
        })
        y += 2
      })
      y += 2
      p('A las cantidades indicadas como honorarios habrá que añadir el IVA al tipo vigente en la fecha de facturación.', { size:8, color:[120,120,120] })

      if (variable.concepto || variable.importe) {
        p('II.2.- Honorarios variables.', { style:'bold', size:10, gap:2 })
        checkBreak(7)
        doc.setFont('times','normal'); doc.setFontSize(10); doc.setTextColor(40,40,40)
        const vl = doc.splitTextToSize(variable.concepto || '—', W-35)
        vl.forEach((line,idx) => {
          doc.text(line, M, y)
          if (idx===0) doc.text(`${fmt(variable.importe)} €`, 210-M, y, { align:'right' })
          y += 5
        })
        y += 3
        p('Los honorarios variables se devengarán y serán exigibles el día en que se notifique la resolución estimatoria. A las cantidades indicadas habrá que añadir el IVA vigente.', { size:8, color:[120,120,120] })
      }

      // III. Limitación
      p('III. LIMITACIÓN DE RESPONSABILIDAD', { style:'bold', size:11, gap:3 })
      p(LIMITACION)

      // IV. Protección de datos
      p('IV. PROTECCIÓN DE DATOS', { style:'bold', size:11, gap:3 })
      p(PROTECCION)

      // Fecha y firmas
      y += 4
      p(`En ${d.lugar || 'Madrid'}, a ${fechaLarga(d.fecha)}`, { gap:14 })
      checkBreak(30)
      doc.setDrawColor(120,120,120)
      doc.line(M, y, M+60, y)
      doc.line(210-M-60, y, 210-M, y)
      y += 5
      doc.setFont('times','normal'); doc.setFontSize(9); doc.setTextColor(60,60,60)
      doc.text(LETRADO.nombre, M, y)
      doc.text('Acepto,', 210-M-60, y)
      y += 4
      doc.text(d.clienteNombre || 'El Cliente', 210-M-60, y)

      const nombreArch = `Hoja-encargo-${(d.clienteNombre||'cliente').replace(/\s+/g,'-')}-${d.fecha}.pdf`
      doc.save(nombreArch)
    } catch (e) {
      alert('Error al generar el PDF: ' + e.message)
    }
    setGenerando(false)
  }

  return (
    <div style={{ padding:'28px', maxWidth:'860px', margin:'0 auto', fontFamily:'Outfit, sans-serif' }}>
      <div style={{ background:'#FDF6E3', border:'1px solid #E8D9B5', borderRadius:'8px', padding:'14px 16px', marginBottom:'24px', fontSize:'13px', color:'#7a6a3f', lineHeight:1.6 }}>
        <strong>Privacidad:</strong> los datos que introduzcas aquí no se guardan en ningún servidor. El PDF se genera en tu navegador y se descarga directamente a tu equipo. Guarda el archivo en el sistema documental del despacho.
      </div>

      <h2 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'26px', fontWeight:400, color:'#0D1B2A', marginBottom:'4px' }}>Generador de hojas de encargo</h2>
      <p style={{ fontSize:'13px', color:'#6b7280', marginBottom:'28px' }}>Rellena los campos y descarga la propuesta en PDF con tu plantilla.</p>

      {/* Datos del cliente */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'16px' }}>
        <div style={fieldWrap}>
          <label style={lbl}>Cliente (nombre completo)</label>
          <input style={lineInput} value={d.clienteNombre} onChange={e=>f('clienteNombre',e.target.value)} placeholder="Doña Cristina Varela Mancebo" />
        </div>
        <div style={fieldWrap}>
          <label style={lbl}>NIF del cliente</label>
          <input style={lineInput} value={d.clienteNif} onChange={e=>f('clienteNif',e.target.value)} placeholder="20.849.877-D" />
        </div>
      </div>

      <div style={fieldWrap}>
        <label style={lbl}>Asunto / subtítulo de la propuesta</label>
        <input style={lineInput} value={d.asunto} onChange={e=>f('asunto',e.target.value)} placeholder="En relación con el acuerdo de derivación de responsabilidad solidaria ex art. 42.2.a) LGT" />
      </div>

      <div style={fieldWrap}>
        <label style={lbl}>Objeto de la colaboración</label>
        <textarea style={{...lineInput, minHeight:'90px', resize:'vertical'}} value={d.objeto} onChange={e=>f('objeto',e.target.value)} placeholder="El objeto de la colaboración consiste en la presentación de alegaciones frente a la comunicación de inicio, así como, en su caso, la interposición de una reclamación económico-administrativa ante el TEAR de la Comunidad Valenciana." />
      </div>

      {/* Datos opcionales del expediente */}
      <div style={{ borderTop:'1px solid #eef0f3', paddingTop:'18px', marginTop:'6px' }}>
        <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9ca3af', marginBottom:'14px' }}>Datos del expediente (opcional)</div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'16px' }}>
          <div style={fieldWrap}>
            <label style={lbl}>Deudor principal</label>
            <input style={lineInput} value={d.deudorNombre} onChange={e=>f('deudorNombre',e.target.value)} placeholder="Iván Beti Avellaneda" />
          </div>
          <div style={fieldWrap}>
            <label style={lbl}>NIF deudor</label>
            <input style={lineInput} value={d.deudorNif} onChange={e=>f('deudorNif',e.target.value)} placeholder="20.849.163-P" />
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={fieldWrap}>
            <label style={lbl}>Importe de la deuda (€)</label>
            <input style={lineInput} value={d.importe} onChange={e=>f('importe',e.target.value)} placeholder="112500" />
          </div>
          <div style={fieldWrap}>
            <label style={lbl}>Nº de expediente</label>
            <input style={lineInput} value={d.expediente} onChange={e=>f('expediente',e.target.value)} placeholder="462655300652X" />
          </div>
        </div>
      </div>

      {/* Honorarios fijos */}
      <div style={{ borderTop:'1px solid #eef0f3', paddingTop:'18px', marginTop:'6px' }}>
        <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9ca3af', marginBottom:'14px' }}>Honorarios fijos</div>
        {fijos.map((row,i)=>(
          <div key={i} style={{ display:'grid', gridTemplateColumns:'3fr 1fr auto', gap:'10px', marginBottom:'10px', alignItems:'center' }}>
            <input style={lineInput} value={row.concepto} onChange={e=>setFijo(i,'concepto',e.target.value)} placeholder="Estudio de antecedentes" />
            <input style={lineInput} value={row.importe} onChange={e=>setFijo(i,'importe',e.target.value)} placeholder="100" />
            <button onClick={()=>delFijo(i)} disabled={fijos.length===1} style={{ background:'none', border:'1px solid #e5e7eb', borderRadius:'6px', width:'38px', height:'38px', cursor:fijos.length===1?'not-allowed':'pointer', color:'#C0392B', fontSize:'18px', opacity:fijos.length===1?.3:1 }}>×</button>
          </div>
        ))}
        <button onClick={addFijo} style={{ background:'none', border:'1px dashed #B8975A', borderRadius:'6px', padding:'8px 16px', color:'#B8975A', fontSize:'13px', cursor:'pointer', fontWeight:500 }}>+ Añadir concepto</button>
      </div>

      {/* Honorario variable */}
      <div style={{ borderTop:'1px solid #eef0f3', paddingTop:'18px', marginTop:'18px' }}>
        <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9ca3af', marginBottom:'14px' }}>Honorario variable (opcional)</div>
        <div style={{ display:'grid', gridTemplateColumns:'3fr 1fr auto', gap:'10px', alignItems:'center' }}>
          <input style={lineInput} value={variable.concepto} onChange={e=>setVariable(v=>({...v,concepto:e.target.value}))} placeholder="Por estimación de las alegaciones o reclamación" />
          <input style={lineInput} value={variable.importe} onChange={e=>setVariable(v=>({...v,importe:e.target.value}))} placeholder="10000" />
          <div style={{ width:'38px' }}></div>
        </div>
      </div>

      {/* Lugar y fecha */}
      <div style={{ borderTop:'1px solid #eef0f3', paddingTop:'18px', marginTop:'18px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div style={fieldWrap}>
          <label style={lbl}>Lugar de firma</label>
          <input style={lineInput} value={d.lugar} onChange={e=>f('lugar',e.target.value)} placeholder="Madrid" />
        </div>
        <div style={fieldWrap}>
          <label style={lbl}>Fecha</label>
          <input type="date" style={lineInput} value={d.fecha} onChange={e=>f('fecha',e.target.value)} />
        </div>
      </div>

      <button onClick={generarPDF} disabled={generando||!d.clienteNombre} style={{ width:'100%', marginTop:'12px', padding:'16px', background:d.clienteNombre?'#0D1B2A':'#9ca3af', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:600, letterSpacing:'.05em', cursor:d.clienteNombre?'pointer':'not-allowed', fontFamily:'Outfit, sans-serif' }}>
        {generando ? 'Generando PDF...' : '↓ Generar y descargar hoja de encargo'}
      </button>
      {!d.clienteNombre && <p style={{ fontSize:'12px', color:'#9ca3af', textAlign:'center', marginTop:'8px' }}>Introduce al menos el nombre del cliente para generar el PDF.</p>}
    </div>
  )
}
