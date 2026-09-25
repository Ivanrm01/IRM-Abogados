'use client'
/* =====================================================================
   HOJA DE ENCARGO · vista previa paginada y PDF
   ---------------------------------------------------------------------
   Maqueta los bloques de modelo.js en páginas A4 con las mismas medidas
   del Word: márgenes 3 cm (izq./der.) y 2,5 cm (sup./inf.), Garamond 11,
   interlineado múltiple 1,15 / 1,08, cuadro azul, tabla y notas. Parte los
   párrafos entre páginas con el control de viudas y huérfanas de Word
   (mínimo dos líneas a cada lado). Lo que se ve es exactamente lo que se
   imprime: el PDF sale de estas mismas páginas.
   ===================================================================== */

import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { construirBloques } from './modelo'

export const FUENTES_URL = 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&display=swap'
const FAMILIA = `Garamond, 'EB Garamond', 'Times New Roman', serif`

// Alto de una línea sencilla de Garamond respecto al cuerpo (ascendente + descendente).
// Si el equipo tiene la Garamond de Office instalada se mide la real; si no, se usa este valor.
const FACTOR_GARAMOND = 1.13

const MM = 96 / 25.4           // px por milímetro
const ALTO_UTIL = 247 * MM      // 297 − 2 × 25 mm
const EPS = 0.75

// Interlineado Word: «múltiple» × alto natural de la fuente
const lh = (f, cuerpo, ls) => +(cuerpo * f * ls / 240).toFixed(3)

// Word («smart justify») estrecha hasta un 20 % los espacios de los párrafos justificados
// para que quepa una palabra más. Lo imitamos restando ese 20 % al espacio: el salto de
// línea cae donde lo pone Word y la justificación reparte después el sobrante.
const ESPACIO_GARAMOND = 0.25   // ancho del espacio en em (se mide en el equipo)

export function cssDocumento(f = FACTOR_GARAMOND, esp = ESPACIO_GARAMOND) {
  return `
.hd-page{width:210mm;height:297mm;position:relative;background:#fff;overflow:hidden;color:#000;font-family:${FAMILIA};font-size:11pt;font-weight:400;font-style:normal;letter-spacing:0;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;font-kerning:normal}
.hd-page *,.hd-medida *{box-sizing:border-box;margin:0;padding:0}
.hd-cuerpo{position:absolute;left:30mm;top:25mm;width:150mm;height:247mm}
.hd-medida{position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;width:150mm;color:#000;font-family:${FAMILIA};font-size:11pt;font-weight:400;letter-spacing:0;font-kerning:normal}
.hd-p{white-space:normal;overflow-wrap:break-word;position:relative}
.hd-pre{white-space:pre-wrap}
.hd-l276{line-height:${lh(f, 11, 276)}pt}
.hd-l259{line-height:${lh(f, 11, 259)}pt}
.hd-both{text-align:justify;word-spacing:-${(0.2 * esp).toFixed(4)}em}.hd-left{text-align:left}.hd-center{text-align:center}.hd-right{text-align:right}
.hd-b{font-weight:700}.hd-i{font-style:italic}
.hd-sup{font-size:.67em;line-height:0;position:relative;top:-.36em;vertical-align:baseline}
.hd-link{color:#0563C1;text-decoration:underline}
.hd-tab{position:absolute;top:0}
.hd-nota{padding-left:36pt;font-style:italic}
.hd-nota-n{position:absolute;left:18pt;top:0}
.hd-anc{line-height:${lh(f, 13, 259)}pt;font-size:13pt;font-weight:700}
.hd-titulo{position:relative}
.hd-rect{position:absolute;left:9.78pt;top:-.68pt;width:403pt;height:156.33pt;background:#4472C4;border:1pt solid #2F528F}
.hd-caja{position:absolute;left:13.85pt;top:${(lh(f, 13, 259) + 1.1).toFixed(3)}pt;width:397.5pt;height:128pt;padding:3.6pt 7.2pt;color:#fff;font-weight:700;font-size:12pt;line-height:${lh(f, 12, 259)}pt;text-align:center}
.hd-tabla{border-collapse:collapse;table-layout:fixed;width:424.7pt}
.hd-tabla td{border:.5pt solid #000;padding:0 5.4pt;vertical-align:top;line-height:${lh(f, 11, 276)}pt}
.hd-tabla td.hd-th{background:#4472C4;color:#fff;font-weight:700}
.hd-corte{overflow:hidden;position:relative}
`
}

/* ---------------- piezas del documento ---------------- */

const clsP = (b) => `hd-p hd-l${b.ls || 276} hd-${b.jc || 'both'}${b.pre ? ' hd-pre' : ''}`

function Runs({ runs }) {
  return runs.map((r, i) => {
    if (r.tab) return null
    const c = [r.b && 'hd-b', r.i && 'hd-i', r.sup && 'hd-sup', r.link && 'hd-link'].filter(Boolean).join(' ')
    return <span key={i} className={c || undefined}>{r.t}</span>
  })
}

function Parrafo({ b, notaN }) {
  const tabIdx = b.runs.findIndex(r => r.tab)
  const antes = tabIdx >= 0 ? b.runs.slice(0, tabIdx) : b.runs
  const despues = tabIdx >= 0 ? b.runs.slice(tabIdx + 1) : []
  const estilo = b.ind ? { marginLeft: (b.ind / 20) + 'pt' } : undefined
  return (
    <div className={clsP(b) + (b.nota ? ' hd-nota' : '')} style={estilo}>
      {b.nota && <span className="hd-nota-n"><span className="hd-sup">({notaN})</span></span>}
      <Runs runs={antes} />
      {tabIdx >= 0 && <span className="hd-tab" style={{ left: (b.runs[tabIdx].tab / 20) + 'pt' }}><Runs runs={despues} /></span>}
      {!b.runs.some(r => r.t && r.t.trim()) && ' '}
    </div>
  )
}

function Titulo({ b }) {
  return (
    <div className="hd-titulo">
      <div className="hd-anc">{' '}</div>
      <div className="hd-anc">{' '}</div>
      <div className="hd-rect" />
      <div className="hd-caja">
        {b.lineas.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  )
}

function Tabla({ b, desde = 0, hasta }) {
  const filas = b.filas.slice(desde, hasta ?? b.filas.length)
  return (
    <table className="hd-tabla">
      <colgroup><col style={{ width: '332.9pt' }} /><col style={{ width: '91.8pt' }} /></colgroup>
      <tbody>
        {desde === 0 && (
          <tr data-fila="cab">
            <td className="hd-th hd-both">{b.cabecera[0]}</td>
            <td className="hd-th hd-center">{b.cabecera[1]}</td>
          </tr>
        )}
        {filas.map((f, i) => (
          <tr key={i + desde} data-fila={i + desde}>
            <td className="hd-both">{f.concepto}</td>
            <td className="hd-center">{f.importe}{f.importe && <span className="hd-sup">(1)</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Bloque({ b, notaN }) {
  if (b.k === 'titulo') return <Titulo b={b} />
  if (b.k === 'tabla') return <Tabla b={b} />
  if (b.k === 'blank') return <div className={clsP(b)}>{' '}</div>
  return <Parrafo b={b} notaN={notaN} />
}

/* ---------------- paginación ---------------- */

function paginar(medidas) {
  const paginas = [[]]
  let y = 0
  const nueva = () => { paginas.push([]); y = 0 }
  const poner = (s) => { paginas[paginas.length - 1].push(s); y += s.h }

  medidas.forEach((m, i) => {
    if (m.k === 'tabla') {
      // La cabecera va con la primera fila; las filas no se parten
      let a = 0
      const n = m.filas.length
      while (a < n) {
        let b = a
        while (b < n && y + m.alto(a, b + 1) <= ALTO_UTIL + EPS) b++
        if (b === a) {
          if (y > 0) { nueva(); continue }
          b = a + 1
        }
        poner({ i, desde: a, hasta: b, h: m.alto(a, b) })
        a = b
        if (a < n) nueva()
      }
      return
    }

    if (y + m.h <= ALTO_UTIL + EPS) return poner({ i, h: m.h, off: 0 })

    if (m.k === 'p' && m.lineas > 1) {
      let cabe = Math.floor((ALTO_UTIL - y + EPS) / m.lh)
      if (m.lineas - cabe < 2) cabe = m.lineas - 2         // viuda: pasa una línea más
      if (cabe >= 2 || (y === 0 && cabe >= 1)) {
        let off = 0, quedan = m.lineas
        for (;;) {
          poner({ i, h: cabe * m.lh, off })
          off += cabe * m.lh
          quedan -= cabe
          nueva()
          if (quedan * m.lh <= ALTO_UTIL + EPS) { poner({ i, h: m.h - off, off }); return }
          cabe = Math.floor((ALTO_UTIL + EPS) / m.lh)
          if (quedan - cabe < 2) cabe = quedan - 2
        }
      }
    }
    if (y > 0) nueva()                                       // huérfana: el párrafo entero pasa
    poner({ i, h: m.h, off: 0 })
  })
  return paginas
}

function medir(contenedor, bloques) {
  const hijos = Array.from(contenedor.children)
  return bloques.map((b, i) => {
    const el = hijos[i]
    const h = el.getBoundingClientRect().height
    if (b.k === 'tabla') {
      const tabla = el.querySelector('table')
      const top = tabla.getBoundingClientRect().top
      const filas = Array.from(tabla.querySelectorAll('tr'))
      const cortes = filas.map(tr => tr.getBoundingClientRect().top - top)   // [cabecera, fila0, fila1…]
      const total = tabla.getBoundingClientRect().height
      // alto de las filas [a, b) (la cabecera cuenta con la primera parte)
      const alto = (a, bb) => {
        const ini = a === 0 ? 0 : cortes[a + 1]
        const fin = bb >= b.filas.length ? total : cortes[bb + 1]
        return fin - ini + (a === 0 ? 0 : 1)
      }
      return { k: 'tabla', h, filas: b.filas, alto }
    }
    if (b.k === 'p') {
      const lhPx = parseFloat(getComputedStyle(el.firstElementChild || el).lineHeight) || 19
      const lineas = Math.max(1, Math.round(h / lhPx))
      return { k: 'p', h, lineas, lh: h / lineas }
    }
    return { k: b.k, h }
  })
}

// ¿Tiene el equipo la Garamond de verdad? Si la tiene, medimos su alto de línea real.
function calibrar() {
  if (typeof document === 'undefined') return { local: false, f: FACTOR_GARAMOND, esp: ESPACIO_GARAMOND }
  const s = document.createElement('span')
  s.textContent = 'mmmmmmmmmmlliI0OqWw'
  s.style.cssText = 'position:absolute;left:-9999px;top:0;font-size:72px;white-space:nowrap;line-height:normal'
  document.body.appendChild(s)
  s.style.fontFamily = 'monospace'
  const w0 = s.offsetWidth
  s.style.fontFamily = 'Garamond, monospace'
  const w1 = s.offsetWidth
  const local = Math.abs(w1 - w0) > 1
  let f = FACTOR_GARAMOND
  if (local) {
    s.style.fontFamily = 'Garamond'
    const h = s.getBoundingClientRect().height / 72
    if (h > 1 && h < 1.4) f = +h.toFixed(4)
  }
  // Ancho del espacio de la fuente que se va a usar (Garamond o, si no está, EB Garamond)
  let esp = ESPACIO_GARAMOND
  try {
    const ctx = document.createElement('canvas').getContext('2d')
    ctx.font = `100px ${FAMILIA}`
    const w = ctx.measureText('x x').width - ctx.measureText('xx').width
    if (w > 5 && w < 60) esp = +(w / 100).toFixed(4)
  } catch { /* sin canvas: valor por defecto */ }
  s.remove()
  return { local, f, esp }
}

function cargarFuentes() {
  if (typeof document === 'undefined') return Promise.resolve()
  if (!document.querySelector(`link[href="${FUENTES_URL}"]`)) {
    const l = document.createElement('link')
    l.rel = 'stylesheet'; l.href = FUENTES_URL
    document.head.appendChild(l)
  }
  const pedir = ['11pt "EB Garamond"', 'bold 11pt "EB Garamond"', 'italic 11pt "EB Garamond"', 'bold 12pt "EB Garamond"']
  return Promise.all(pedir.map(f => document.fonts?.load(f).catch(() => null)))
    .then(() => document.fonts?.ready).catch(() => null)
}

/* ---------------- componente ---------------- */

const Documento = forwardRef(function Documento({ datos, escala = 1, separacion = 18, onPaginas }, ref) {
  const bloques = useMemo(() => construirBloques(datos), [datos])
  const medidor = useRef(null)
  const paginasRef = useRef(null)
  const [fuentesListas, setFuentesListas] = useState(false)
  const [calib, setCalib] = useState({ local: false, f: FACTOR_GARAMOND, esp: ESPACIO_GARAMOND })
  const [paginas, setPaginas] = useState([])
  const css = useMemo(() => cssDocumento(calib.f, calib.esp), [calib.f, calib.esp])

  useEffect(() => {
    let vivo = true
    cargarFuentes().then(() => { if (vivo) { setCalib(calibrar()); setFuentesListas(true) } })
    return () => { vivo = false }
  }, [])

  // Numeración de las notas (1), (2) en el orden en que aparecen
  const notas = useMemo(() => {
    let n = 0
    return bloques.map(b => (b.nota ? ++n : null))
  }, [bloques])

  useLayoutEffect(() => {
    if (!medidor.current) return
    const pags = paginar(medir(medidor.current, bloques))
    setPaginas(pags)
    onPaginas?.(pags.length)
  }, [bloques, css, fuentesListas]) // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(ref, () => ({
    // HTML completo y autónomo de las páginas, listo para imprimir
    html(titulo) {
      const cuerpo = Array.from(paginasRef.current?.querySelectorAll('.hd-page') || []).map(p => {
        const copia = p.cloneNode(true)
        copia.style.transform = ''          // en pantalla van a escala; en papel, a tamaño real
        return copia.outerHTML
      }).join('')
      return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${String(titulo || 'Hoja de encargo').replace(/</g, '')}</title>` +
        `<link rel="stylesheet" href="${FUENTES_URL}"><style>${css}` +
        '@page{size:A4;margin:0}html,body{margin:0;padding:0;background:#fff}' +
        '.hd-page{height:296.8mm;break-after:page;page-break-after:always}.hd-page:last-child{break-after:auto;page-break-after:auto}' +
        '</style></head><body>' + cuerpo + '</body></html>'
    },
    fuenteLocal: calib.local,
  }), [css, calib.local])

  const W = 210 * MM, H = 297 * MM

  return (
    <>
      <style>{css}</style>
      {/* Columna oculta donde se mide cada bloque (recortada para no alargar el scroll de la página) */}
      <div style={{ position: 'relative', height: 0, overflow: 'hidden' }} aria-hidden="true">
        <div ref={medidor} className="hd-medida">
          {bloques.map((b, i) => <div key={i}><Bloque b={b} notaN={notas[i]} /></div>)}
        </div>
      </div>
      <div ref={paginasRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: separacion }}>
        {paginas.map((pag, pi) => (
          <div key={pi} style={{ width: W * escala, height: H * escala, flexShrink: 0, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.12), 0 6px 22px rgba(13,27,42,.10)', background: '#fff' }}>
            <div className="hd-page" style={{ transform: `scale(${escala})`, transformOrigin: 'top left' }}>
              <div className="hd-cuerpo">
                {pag.map((s, si) => {
                  const b = bloques[s.i]
                  if (!b) return null
                  if (b.k === 'tabla') {
                    return <div key={si} style={{ height: s.h }}><Tabla b={b} desde={s.desde} hasta={s.hasta} /></div>
                  }
                  if (b.k === 'titulo') return <div key={si} style={{ height: s.h }}><Titulo b={b} /></div>
                  return (
                    <div key={si} className="hd-corte" style={{ height: s.h }}>
                      <div style={{ marginTop: -(s.off || 0) }}><Bloque b={b} notaN={notas[s.i]} /></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
})

export default Documento

// Abre el diálogo de impresión con las páginas (el usuario elige «Guardar como PDF»)
export function imprimirHtml(html) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('aria-hidden', 'true')
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none'
    document.body.appendChild(iframe)
    const limpiar = () => { setTimeout(() => iframe.remove(), 500); resolve() }
    iframe.onload = async () => {
      const w = iframe.contentWindow
      try { await w.document.fonts?.ready } catch { /* sin API de fuentes */ }
      await new Promise(r => setTimeout(r, 150))
      w.addEventListener('afterprint', limpiar)
      w.focus()
      w.print()
      // Safari no siempre lanza afterprint
      setTimeout(limpiar, 120000)
    }
    iframe.srcdoc = html
  })
}
