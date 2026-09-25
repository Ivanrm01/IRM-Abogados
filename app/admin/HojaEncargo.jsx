'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import s from './encargo/encargo.module.css'
import Documento, { imprimirHtml } from './encargo/Documento'
import {
  DEFECTO, encargoVacio, aNumero, importeTxt, porcentajeALetras, porcentajeTxt, fijosValidos, nombreArchivo,
} from './encargo/modelo'

// El borrador sobrevive mientras el panel siga abierto (al cambiar de herramienta y volver),
// pero nunca sale del navegador ni se guarda en disco.
let borrador = null

const TRATAMIENTOS = ['Sr.', 'Sra.', 'D.', 'Dña.', '']
const SALUDOS = ['Muy Sr. mío:', 'Muy Sra. mía:', 'Muy Sres. míos:', 'Estimado cliente:']

const minusculaInicial = (t) => (t ? t.charAt(0).toLocaleLowerCase('es-ES') + t.slice(1) : '')

// Datos que llegan desde un expediente del CRM → hoja rellenada
function desdeExpediente(p) {
  const d = encargoVacio()
  const juridica = p.clienteTipo === 'juridica'
  const nombre = p.clienteNombre || ''
  d.destNombre = nombre
  d.destNif = p.clienteNif || ''
  d.destTratamiento = juridica ? '' : 'Sr.'
  d.saludo = juridica ? 'Muy Sres. míos:' : 'Muy Sr. mío:'
  if (p.asunto) {
    d.titulo = 'PROPUESTA DE COLABORACIÓN PROFESIONAL\n' + p.asunto
    d.referido = DEFECTO.referido + minusculaInicial(p.asunto)
  }
  d.antecedentes = p.antecedentes || ''
  if (nombre) {
    d.intervencion = `La intervención profesional consistirá en la defensa de los intereses de ${juridica ? 'la mercantil' : 'don'} ${nombre}.`
  }
  if (Number(p.honorarios)) {
    d.fijos = [{ concepto: 'Honorarios profesionales por la dirección letrada del asunto', importe: String(p.honorarios) }]
  }
  const v = String(p.variable || '')
  const m = /(\d+(?:[.,]\d+)?)\s*%/.exec(v)
  if (m) {
    d.variableActivo = true
    d.variablePct = m[1]
    const resto = v.slice(m.index + m[0].length).trim()
    if (resto) d.variableBase = resto
    d.sistema = DEFECTO.sistemaConVariable
  }
  d.cuantia = Number(p.cuantia) || 0
  return d
}

export default function HojaEncargo({ prefill }) {
  const [d, setD] = useState(() => (prefill ? desdeExpediente(prefill) : borrador || encargoVacio()))
  const [paginas, setPaginas] = useState(0)
  const [grande, setGrande] = useState(false)
  const [ocupado, setOcupado] = useState('')
  const [registro, setRegistro] = useState({ estado: '', texto: '' })
  const [ancho, setAncho] = useState(700)
  const [fuenteLocal, setFuenteLocal] = useState(true)
  const doc = useRef(null)
  const docGrande = useRef(null)
  const scrollRef = useRef(null)

  // Si llega un expediente nuevo desde el CRM, sustituye el borrador
  useEffect(() => {
    if (prefill) { setD(desdeExpediente(prefill)); setRegistro({ estado: '', texto: '' }) }
  }, [prefill])
  useEffect(() => { borrador = d }, [d])

  // Escala de la vista previa según el ancho disponible
  useEffect(() => {
    const el = scrollRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([e]) => setAncho(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const escala = Math.min(1, Math.max(0.3, (ancho - 36) / 793.7))

  useEffect(() => {
    const t = setTimeout(() => setFuenteLocal(doc.current?.fuenteLocal ?? true), 1500)
    return () => clearTimeout(t)
  }, [])

  const f = (k, v) => setD(p => ({ ...p, [k]: v }))
  const setFijo = (i, k, v) => setD(p => ({ ...p, fijos: p.fijos.map((r, j) => (j === i ? { ...r, [k]: v } : r)) }))
  const addFijo = () => setD(p => ({ ...p, fijos: [...p.fijos, { concepto: '', importe: '' }] }))
  const delFijo = (i) => setD(p => ({ ...p, fijos: p.fijos.filter((_, j) => j !== i) }))

  // Al activar o quitar los variables, el párrafo del sistema de honorarios se adapta
  // (solo si no lo has personalizado)
  const toggleVariable = () => setD(p => {
    const activo = !p.variableActivo
    const sistema = p.sistema === DEFECTO.sistemaConVariable || p.sistema === DEFECTO.sistemaSoloFijos
      ? (activo ? DEFECTO.sistemaConVariable : DEFECTO.sistemaSoloFijos)
      : p.sistema
    return { ...p, variableActivo: activo, sistema }
  })

  const totalFijos = fijosValidos(d).reduce((t, r) => t + (aNumero(r.importe) || 0), 0)
  const pctNum = aNumero(d.variablePct)
  const estimadoVariable = d.cuantia && !isNaN(pctNum) ? d.cuantia * pctNum / 100 : null
  const listo = !!String(d.destNombre || '').trim()

  const descargarWord = async () => {
    setOcupado('word')
    try {
      const { generarDocx, MIME_DOCX } = await import('./encargo/docx')
      const blob = new Blob([generarDocx(d)], { type: MIME_DOCX })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = nombreArchivo(d, 'docx')
      document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    } catch (e) {
      alert('No se pudo generar el Word: ' + e.message)
    }
    setOcupado('')
  }

  const imprimir = async () => {
    const fuente = (grande ? docGrande.current : null) || doc.current
    if (!fuente) return
    setOcupado('pdf')
    try { await imprimirHtml(fuente.html(nombreArchivo(d, 'pdf').replace(/\.pdf$/, ''))) }
    finally { setOcupado('') }
  }

  // Lleva los honorarios de la hoja al módulo de Honorarios del expediente
  const registrarHonorarios = async () => {
    if (!prefill?.expedienteId) return
    const lineas = fijosValidos(d).map(r => ({
      tipo: 'fijo', concepto: r.concepto || 'Honorarios fijos', importe: r.importe, estado: 'previsto',
    }))
    if (d.variableActivo) {
      const modoImporte = d.variableModo === 'importe'
      lineas.push({
        tipo: 'variable',
        concepto: `Honorarios variables${d.variableTitulo ? ' ' + d.variableTitulo : ''}`,
        porcentaje: modoImporte ? null : d.variablePct,
        base: modoImporte ? null : (d.cuantia || null),
        base_desc: modoImporte ? '' : d.variableBase,
        importe: modoImporte ? d.variableImporte : (estimadoVariable ?? 0),
        condicion: d.variableCondicion,
        estado: 'previsto',
      })
    }
    if (!lineas.length) { setRegistro({ estado: 'err', texto: 'No hay importes que registrar.' }); return }
    setRegistro({ estado: 'enviando', texto: 'Registrando…' })
    try {
      const r = await fetch('/api/crm/honorarios', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lineas.map(l => ({
          ...l, expediente_id: prefill.expedienteId, cliente_id: prefill.clienteId || null, cliente_nombre: d.destNombre,
        }))),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.error || 'No se pudo registrar')
      setRegistro({ estado: 'ok', texto: `${lineas.length} concepto(s) registrados en Honorarios ✓` })
    } catch (e) {
      const falta = /does not exist|schema cache|relation/i.test(e.message)
      setRegistro({ estado: 'err', texto: falta ? 'Falta crear la tabla de honorarios (data/honorarios-schema.sql).' : e.message })
    }
  }

  const barraAcciones = (
    <div className={s.actions}>
      <button className={s.btn} onClick={() => setGrande(true)}>Vista previa</button>
      <button className={s.btn} onClick={descargarWord} disabled={!listo || !!ocupado}>
        {ocupado === 'word' ? 'Generando…' : '↓ Word (.docx)'}
      </button>
      <button className={`${s.btn} ${s.btnDark} ${s.btnWide}`} onClick={imprimir} disabled={!listo || !!ocupado}>
        {ocupado === 'pdf' ? 'Preparando…' : 'Imprimir / Guardar PDF'}
      </button>
      {prefill?.expedienteId && (
        <button className={`${s.btn} ${s.btnWide} ${registro.estado === 'ok' ? '' : s.btnGreen}`} onClick={registrarHonorarios}
          disabled={registro.estado === 'enviando' || registro.estado === 'ok'}>
          {registro.estado === 'ok' ? 'Honorarios registrados' : 'Registrar estos honorarios en el expediente'}
        </button>
      )}
      {!listo && <div className={`${s.status} ${s.err}`} style={{ color: '#9ca3af' }}>Indica el destinatario para descargar.</div>}
      {registro.texto && registro.estado !== 'enviando' && (
        <div className={`${s.status} ${registro.estado === 'ok' ? s.ok : s.err}`}>{registro.texto}</div>
      )}
    </div>
  )

  return (
    <div className={s.wrap}>
      {/* ================= FORMULARIO ================= */}
      <div className={s.form}>
        <div className={s.formScroll}>
          <h2 className={s.title}>Hojas de encargo</h2>
          <div className={s.sub}>Modelo «Propuesta de colaboración profesional». Rellena los campos: la vista previa es exactamente el documento que se imprime y el Word que se descarga.</div>
          {prefill?.expedienteId
            ? <div className={s.origin}>Rellenada desde el expediente <strong>{prefill.referencia || ''}</strong>. Revisa los textos antes de enviarla.</div>
            : <div className={s.note}><strong>Privacidad:</strong> el Word y el PDF se generan en tu navegador; la hoja no se guarda en ningún servidor.</div>}

          <div className={s.section}>
            <div className={s.secHead}><span className={s.secTitle}>Cabecera</span></div>
            <div className={s.field}>
              <label className={s.label}>Título del cuadro azul <small>una línea por renglón</small></label>
              <textarea className={`${s.input} ${s.textarea} ${s.mono}`} value={d.titulo} onChange={e => f('titulo', e.target.value)}
                placeholder={'PROPUESTA DE COLABORACIÓN PROFESIONAL EN RELACIÓN CON LA RECLAMACIÓN ECONÓMICO-ADMINISTRATIVA\nANTE EL TRIBUNAL ECONÓMICO-ADMINISTRATIVO REGIONAL\nFRENTE AL ACUERDO DE DERIVACIÓN DE RESPONSABILIDAD'} />
              {d.titulo.split('\n').filter(x => x.trim()).length > 7 && <div className={s.hint} style={{ color: '#C0392B' }}>El cuadro del modelo admite unas 7 líneas: acorta el título para que no se salga.</div>}
            </div>
            <div className={s.field}>
              <label className={s.label}>Destinatario</label>
              <div className={s.rowTrat}>
                <select className={s.input} value={d.destTratamiento} onChange={e => f('destTratamiento', e.target.value)}>
                  {TRATAMIENTOS.map(t => <option key={t} value={t}>{t || '(sin tratamiento)'}</option>)}
                </select>
                <input className={s.input} value={d.destNombre} onChange={e => f('destNombre', e.target.value)} placeholder="Francisco Duran Jarrin · ENROM SYSTEM, S.L.U." />
              </div>
            </div>
            <div className={s.row2}>
              <div className={s.field}>
                <label className={s.label}>N.I.F.</label>
                <input className={s.input} value={d.destNif} onChange={e => f('destNif', e.target.value)} placeholder="71.092.454-Y" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Saludo</label>
                <input className={s.input} list="he-saludos" value={d.saludo} onChange={e => f('saludo', e.target.value)} />
                <datalist id="he-saludos">{SALUDOS.map(x => <option key={x} value={x} />)}</datalist>
              </div>
            </div>
          </div>

          <div className={s.section}>
            <div className={s.secHead}><span className={s.secTitle}>Presentación</span></div>
            <div className={s.field}>
              <label className={s.label}>Objeto de la colaboración <small>continúa «…acuerdo de colaboración profesional»</small></label>
              <textarea className={`${s.input} ${s.textarea}`} value={d.referido} onChange={e => f('referido', e.target.value)}
                placeholder="referido al asesoramiento jurídico en torno a la derivación de responsabilidad…" />
            </div>
          </div>

          <div className={s.section}>
            <div className={s.secHead}><span className={s.secTitle}>I. Antecedentes y objeto</span></div>
            <div className={s.field}>
              <label className={s.label}>Antecedentes <small>cada línea, un párrafo</small></label>
              <textarea className={`${s.input} ${s.textarea} ${s.textareaTall}`} value={d.antecedentes} onChange={e => f('antecedentes', e.target.value)}
                placeholder="La Dependencia Regional de Recaudación de… ha notificado con fecha… a Don…" />
            </div>
            <div className={s.field}>
              <label className={s.label}>Intervención profesional</label>
              <textarea className={`${s.input} ${s.textarea}`} value={d.intervencion} onChange={e => f('intervencion', e.target.value)}
                placeholder="La intervención profesional consistirá en la defensa de los intereses de…" />
            </div>
            <div className={s.field}>
              <label className={s.label}>Objeto del encargo <small>va en negrita</small></label>
              <textarea className={`${s.input} ${s.textarea}`} value={d.objeto} onChange={e => f('objeto', e.target.value)}
                placeholder="El objeto de la colaboración consiste en la redacción del escrito de alegaciones…" />
            </div>
            <div className={s.field}>
              <label className={s.label}>Exclusiones <small>opcional</small></label>
              <textarea className={`${s.input} ${s.textarea}`} value={d.exclusiones} onChange={e => f('exclusiones', e.target.value)}
                placeholder="Exceden de esta propuesta… que, en su caso, serán objeto de nueva propuesta." />
            </div>
          </div>

          <div className={s.section}>
            <div className={s.secHead}><span className={s.secTitle}>II. Honorarios</span></div>
            <div className={s.field}>
              <label className={s.label}>
                Sistema de honorarios
                {d.sistema !== (d.variableActivo ? DEFECTO.sistemaConVariable : DEFECTO.sistemaSoloFijos) && (
                  <button className={s.reset} onClick={() => f('sistema', d.variableActivo ? DEFECTO.sistemaConVariable : DEFECTO.sistemaSoloFijos)}>Texto del modelo</button>
                )}
              </label>
              <textarea className={`${s.input} ${s.textarea}`} value={d.sistema} onChange={e => f('sistema', e.target.value)} />
            </div>

            <div className={s.field}>
              <label className={s.label}>II.1 · Encabezado de la tabla</label>
              <input className={s.input} value={d.tablaCabecera} onChange={e => f('tablaCabecera', e.target.value)} placeholder="Recurso contencioso-administrativo" />
            </div>
            {d.fijos.map((row, i) => (
              <div key={i}>
                <div className={s.feeNum}>II.1.{i + 1}.-</div>
                <div className={s.feeRow}>
                  <textarea className={`${s.input}`} rows={2} style={{ resize: 'vertical' }} value={row.concepto} onChange={e => setFijo(i, 'concepto', e.target.value)} placeholder="Escrito de alegaciones contra la comunicación de inicio" />
                  <input className={s.input} inputMode="decimal" value={row.importe} onChange={e => setFijo(i, 'importe', e.target.value)} placeholder="100,00 €" />
                  <button className={s.del} onClick={() => delFijo(i)} disabled={d.fijos.length === 1} aria-label="Quitar concepto">×</button>
                </div>
              </div>
            ))}
            <button className={s.add} onClick={addFijo}>+ Añadir concepto</button>
            <div className={s.total}><span>Total honorarios fijos (sin IVA)</span><strong>{importeTxt(totalFijos)} €</strong></div>

            <div className={s.field} style={{ marginTop: 14 }}>
              <label className={s.label}>
                Devengo de los fijos
                {d.devengoFijos !== DEFECTO.devengoFijos && <button className={s.reset} onClick={() => f('devengoFijos', DEFECTO.devengoFijos)}>Texto del modelo</button>}
              </label>
              <textarea className={`${s.input} ${s.textarea}`} value={d.devengoFijos} onChange={e => f('devengoFijos', e.target.value)} />
            </div>
          </div>

          <div className={s.section}>
            <div className={s.toggle} onClick={toggleVariable} role="switch" aria-checked={d.variableActivo}>
              <span className={`${s.switch} ${d.variableActivo ? s.switchOn : ''}`} />
              <span>II.2 · Honorarios variables (a éxito)</span>
            </div>
            {d.variableActivo && (
              <>
                <div className={s.seg}>
                  <button className={d.variableModo !== 'importe' ? s.segOn : ''} onClick={() => f('variableModo', 'porcentaje')}>% de la cuantía</button>
                  <button className={d.variableModo === 'importe' ? s.segOn : ''} onClick={() => f('variableModo', 'importe')}>Importe cerrado</button>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Título del apartado <small>«II.2.- Honorarios variables …»</small></label>
                  <input className={s.input} value={d.variableTitulo} onChange={e => f('variableTitulo', e.target.value)} placeholder="en caso de estimación del recurso contencioso-administrativo" />
                </div>
                {d.variableModo === 'importe' ? (
                  <div className={s.field}>
                    <label className={s.label}>Importe (€)</label>
                    <input className={s.input} inputMode="decimal" value={d.variableImporte} onChange={e => f('variableImporte', e.target.value)} placeholder="1.500,00" />
                  </div>
                ) : (
                  <>
                    <div className={s.row2}>
                      <div className={s.field}>
                        <label className={s.label}>Porcentaje</label>
                        <input className={s.input} inputMode="decimal" value={d.variablePct} onChange={e => f('variablePct', e.target.value)} placeholder="12" />
                      </div>
                      <div className={s.field}>
                        <label className={s.label}>Sobre</label>
                        <input className={s.input} value={d.variableBase} onChange={e => f('variableBase', e.target.value)} placeholder="del importe derivado" />
                      </div>
                    </div>
                    {!isNaN(pctNum) && (
                      <div className={s.hint} style={{ marginTop: -6, marginBottom: 10 }}>
                        Se escribirá: «del {porcentajeALetras(d.variablePct)} por ciento ({porcentajeTxt(d.variablePct)}%)»
                      </div>
                    )}
                    {estimadoVariable !== null && (
                      <div className={s.calc}>Sobre la cuantía del expediente ({importeTxt(d.cuantia)} €): {importeTxt(estimadoVariable)} € sin IVA</div>
                    )}
                  </>
                )}
                <div className={s.field}>
                  <label className={s.label}>Se devenga…</label>
                  <textarea className={`${s.input} ${s.textarea}`} value={d.variableCondicion} onChange={e => f('variableCondicion', e.target.value)} />
                </div>
                <div className={s.field}>
                  <label className={s.label}>
                    Devengo de los variables
                    {d.devengoVariables !== DEFECTO.devengoVariables && <button className={s.reset} onClick={() => f('devengoVariables', DEFECTO.devengoVariables)}>Texto del modelo</button>}
                  </label>
                  <textarea className={`${s.input} ${s.textarea}`} value={d.devengoVariables} onChange={e => f('devengoVariables', e.target.value)} />
                </div>
              </>
            )}
          </div>

          <div className={s.section}>
            <div className={s.secHead}><span className={s.secTitle}>Lugar y fecha</span></div>
            <div className={s.row2}>
              <div className={s.field}>
                <label className={s.label}>Lugar</label>
                <input className={s.input} value={d.lugar} onChange={e => f('lugar', e.target.value)} placeholder="Madrid" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Fecha</label>
                <input type="date" className={s.input} value={d.fecha} onChange={e => f('fecha', e.target.value)} />
              </div>
            </div>
            <button className={s.reset} style={{ fontSize: 12, marginTop: 4 }} onClick={() => { if (confirm('¿Vaciar la hoja y empezar de nuevo?')) setD(encargoVacio()) }}>
              Vaciar la hoja
            </button>
          </div>
        </div>
        {barraAcciones}
      </div>

      {/* ================= VISTA PREVIA ================= */}
      <div className={s.preview}>
        <div className={s.pvBar}>
          <span className={s.pvLabel}>Vista previa</span>
          <span className={s.pvPages}>{paginas ? `${paginas} página${paginas === 1 ? '' : 's'} · A4` : '…'}</span>
          <div className={s.pvRight}>
            <button className={s.pvBtn} onClick={() => setGrande(true)}>Ampliar</button>
          </div>
        </div>
        {!fuenteLocal && (
          <div className={s.fontWarn}>
            Este equipo no tiene instalada la fuente Garamond de Office: la vista previa y el PDF usan EB Garamond, su equivalente libre. El Word descargado usa Garamond, como el modelo.
          </div>
        )}
        <div className={s.pvScroll} ref={scrollRef}>
          <Documento ref={doc} datos={d} escala={escala} onPaginas={setPaginas} />
        </div>
      </div>

      {grande && (
        <div className={s.modal} onKeyDown={e => e.key === 'Escape' && setGrande(false)} tabIndex={-1}>
          <div className={s.modalBar}>
            <span className={s.modalTitle}>Vista previa</span>
            <span className={s.modalMeta}>{paginas} página{paginas === 1 ? '' : 's'} · A4 · márgenes 3 cm / 2,5 cm · Garamond 11</span>
            <div className={s.modalRight}>
              <button className={s.modalBtn} onClick={descargarWord} disabled={!listo || !!ocupado}>↓ Word</button>
              <button className={`${s.modalBtn} ${s.modalBtnGold}`} onClick={imprimir} disabled={!listo || !!ocupado}>Imprimir / PDF</button>
              <button className={s.modalBtn} onClick={() => setGrande(false)}>Cerrar ✕</button>
            </div>
          </div>
          <div className={s.modalScroll}>
            <Documento ref={docGrande} datos={d} escala={typeof window !== 'undefined' ? Math.min(1.15, (window.innerWidth - 40) / 793.7) : 1} separacion={24} />
          </div>
        </div>
      )}
    </div>
  )
}
