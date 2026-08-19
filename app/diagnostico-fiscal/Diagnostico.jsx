'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import styles from './diagnostico.module.css'
import { SECTORES, RATIOS, CAMPOS, TRAMOS, desviacion, nivel } from '@/lib/benchmarks'

const CASO = {
  cn:'840000', apro:'672000', otros:'74000', pers:'52000', rai:'9500',
  emp:'6', remun:'4', ivasop:'158900', ivarep:'176400', caja:'38000',
}

const VACIO = Object.fromEntries(CAMPOS.map(c => [c.id, '']))
const f = (v, d) => v.toLocaleString('es-ES', { minimumFractionDigits:d, maximumFractionDigits:d })
const n = v => { const x = parseFloat(v); return isNaN(x) ? 0 : x }

const INCLUYE = [
  { i:'01', t:'Revisión de los cuatro ejercicios no prescritos: Sociedades, IVA y retenciones.' },
  { i:'02', t:'Cruce de los modelos 303 y 390 con el 200 y con la contabilidad, para detectar las incoherencias que se comprueban de oficio.' },
  { i:'03', t:'Revisión de operaciones vinculadas, retribución de socios y gastos de deducibilidad discutida.' },
  { i:'04', t:'Informe escrito con cada riesgo valorado, la documentación que lo sostiene y la que falta por reunir.' },
  { i:'05', t:'Si aparecen cuotas pagadas de más, cuantificamos lo recuperable vía rectificativa y el plazo que queda.' },
  { i:'06', t:'Reunión de una hora con el abogado que ha hecho la revisión. Sin intermediarios.' },
]

export default function Diagnostico() {
  const [sector, setSector] = useState('47')
  const [tramo, setTramo] = useState('b')
  const [datos, setDatos] = useState(VACIO)
  const [res, setRes] = useState(null)
  const [error, setError] = useState('')
  const [lead, setLead] = useState({ nombre:'', email:'', telefono:'' })
  const [envio, setEnvio] = useState('idle')  // idle | enviando | ok | error
  const salida = useRef(null)

  const set = (id, v) => setDatos(d => ({ ...d, [id]: v }))

  function calcular(fuente = datos, s = sector, t = tramo) {
    const x = Object.fromEntries(Object.entries(fuente).map(([k, v]) => [k, n(v)]))
    if (x.cn <= 0 || x.apro + x.otros <= 0) {
      setError('Faltan la cifra de negocios y los aprovisionamientos: sin esas dos no hay valor añadido que comparar.')
      setRes(null)
      return
    }
    setError('')
    x.vab = x.cn - x.apro - x.otros

    const ref = SECTORES[s][t]
    const filas = []
    let pts = 0, peso = 0, graves = 0, medias = 0

    for (const r of RATIOS) {
      const v = r.calc(x)
      if (v === null || !isFinite(v)) continue
      const q = ref[r.id]
      const des = desviacion(v, q, r.cola)
      const niv = nivel(des.d)
      if (niv === 'alerta') graves++
      else if (niv === 'ambar') medias++
      pts += (Math.min(des.d, 2.2) / 2.2) * r.p
      peso += r.p
      filas.push({ r, v, q, des, niv })
    }
    filas.sort((a, b) => b.des.d - a.des.d)

    const base = x.apro + x.otros
    const iva = (x.ivasop > 0 && base > 0)
      ? { tipo: (x.ivasop / base) * 100, base }
      : null

    setRes({
      filas, graves, medias,
      indice: Math.round((pts / peso) * 100),
      efectivo: (x.caja > 0 && x.cn > 0) ? (x.caja / x.cn) * 100 : 0,
      iva,
    })
    setTimeout(() => salida.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 60)
  }

  function ejemplo() {
    setSector('47'); setTramo('b'); setDatos(CASO)
    calcular(CASO, '47', 'b')
  }

  async function enviar() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email) || !lead.nombre.trim()) {
      setEnvio('error'); return
    }
    setEnvio('enviando')

    const detalle = res.filas
      .filter(x => x.niv !== 'verde')
      .map(x => `· ${x.r.nom}: ${f(x.v, x.r.d)}${x.r.u} (recorrido ${f(x.q[0], x.r.d)}–${f(x.q[2], x.r.d)}${x.r.u}, ${x.des.lado})`)
      .join('\n') || 'Ninguna desviación fuera de banda.'

    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: lead.nombre,
          email: lead.email,
          telefono: lead.telefono,
          servicio: 'Auditoría fiscal — 500 € + IVA',
          como: 'Diagnóstico de desviación sectorial',
          mensaje:
            `Solicitud de auditoría fiscal desde el diagnóstico sectorial.\n\n` +
            `CNAE ${sector} · ${SECTORES[sector].n}\n` +
            `Tramo: ${TRAMOS.find(t => t.v === tramo).l}\n` +
            `Índice de desviación: ${res.indice}/100 · ${res.graves} altas, ${res.medias} de atención\n\n` +
            `Ratios fuera de banda:\n${detalle}\n\n` +
            (res.iva ? `Tipo medio implícito de IVA soportado: ${f(res.iva.tipo, 1)}%\n` : '') +
            (res.efectivo > 0 ? `Peso del efectivo sobre ventas: ${f(res.efectivo, 0)}%\n` : ''),
        }),
      })
      setEnvio(r.ok ? 'ok' : 'error')
    } catch {
      setEnvio('error')
    }
  }

  const total = res ? res.graves + res.medias : 0

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className={styles.hero}>
        <div className={styles.heroLine} />
        <div className={styles.heroText}>
          <div className={styles.eyebrow}>Herramienta gratuita</div>
          <h1 className={styles.heroTitle}>Dónde se separa tu empresa <em>de su sector</em></h1>
          <p className={styles.heroDesc}>
            La AEAT no elige a quién comprobar al azar: cruza tus ratios con los de las empresas
            de tu misma actividad y tamaño. Esta herramienta hace ese mismo cruce antes que ellos,
            con estadística pública del INE y de la propia Agencia Tributaria. Diez cifras de tu
            cuenta de resultados y sabrás por dónde asomas.
          </p>
          <p className={styles.heroNota}>
            Tus cifras se calculan en tu navegador. No se envían a ningún servidor ni se guardan.
          </p>
        </div>
        <div className={styles.heroCards}>
          {[
            { l:'Fuente', t:'INE y AEAT', d:'Estadística pública, verificable y citada ratio a ratio.' },
            { l:'Alcance', t:'7 ratios', d:'Valor añadido, márgenes, personal, productividad y coherencia de IVA.' },
            { l:'Sin registro', t:'0 €', d:'No pedimos email para ver el resultado. Sólo si quieres la auditoría.' },
          ].map(c => (
            <div key={c.l} className={styles.heroCard}>
              <div className={styles.heroCardLabel}>{c.l}</div>
              <div className={styles.heroCardTitle}>{c.t}</div>
              <div className={styles.heroCardDesc}>{c.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FORMULARIO ---------------- */}
      <section className={styles.form}>
        <div className={styles.eyebrow}>01 · Sitúa tu empresa</div>
        <div className={styles.ficha}>
          <div className={styles.grid}>
            <div className={styles.campo}>
              <label htmlFor="sector">Actividad principal (CNAE)</label>
              <select id="sector" value={sector} onChange={e => setSector(e.target.value)}>
                {Object.keys(SECTORES).sort().map(k => (
                  <option key={k} value={k}>{k} · {SECTORES[k].n}</option>
                ))}
              </select>
            </div>
            <div className={styles.campo}>
              <label htmlFor="tramo">Tamaño por personal ocupado</label>
              <select id="tramo" value={tramo} onChange={e => setTramo(e.target.value)}>
                {TRAMOS.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
              </select>
              <span className={styles.pista}>El INE estratifica por ocupados, no por facturación.</span>
            </div>
          </div>
        </div>

        <div className={styles.eyebrow} style={{ marginTop: 48 }}>02 · Copia diez cifras del ejercicio cerrado</div>
        <div className={styles.ficha}>
          <div className={styles.grid}>
            {CAMPOS.map(c => (
              <div key={c.id} className={styles.campo}>
                <label htmlFor={c.id}>
                  {c.l}
                  {c.c && <span className={styles.cuenta}>{c.c}</span>}
                </label>
                <input
                  id={c.id} type="number" inputMode="decimal" placeholder="0"
                  value={datos[c.id]} onChange={e => set(c.id, e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') calcular() }}
                />
                {c.pista && <span className={styles.pista}>{c.pista}</span>}
              </div>
            ))}
          </div>
          <div className={styles.acciones}>
            <button type="button" className="btn-navy" onClick={() => calcular()}>
              Ver mis desviaciones
            </button>
            <button type="button" className={styles.linkBtn} onClick={ejemplo}>
              Rellenar con un caso de ejemplo
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </section>

      {/* ---------------- RESULTADO ---------------- */}
      {res && (
        <div ref={salida}>
          <section className={styles.resultado}>
            <div className={styles.eyebrow}>03 · Lectura</div>
            <div className={styles.cifrasFila}>
              <div className={styles.cifra}>
                <div className={`${styles.cifraV} ${res.graves >= 2 ? styles.mal : total === 0 ? styles.bien : ''}`}>{total}</div>
                <div className={styles.cifraL}>Puntos de atención</div>
              </div>
              <div className={styles.cifra}>
                <div className={`${styles.cifraV} ${res.indice >= 40 ? styles.mal : res.indice < 15 ? styles.bien : ''}`}>{res.indice}</div>
                <div className={styles.cifraL}>Índice de desviación</div>
              </div>
              <div className={styles.cifra}>
                <div className={styles.cifraV}>{res.filas.length}</div>
                <div className={styles.cifraL}>Ratios comparados</div>
              </div>
            </div>

            <p className={styles.lectura}>
              {total === 0
                ? 'Tus ratios caen dentro del recorrido habitual de tu actividad y tamaño. Es la posición cómoda: si mañana llega un requerimiento, tu contabilidad no destaca por nada y la conversación se queda en la documentación concreta que pidan.'
                : res.graves === 0
                ? `Nada alarmante, pero hay ${res.medias} ${res.medias === 1 ? 'ratio que se sale' : 'ratios que se salen'} del recorrido de tu actividad. Son las diferencias que conviene tener explicadas por escrito antes de que las pregunten, no después.`
                : `Hay ${res.graves} ${res.graves === 1 ? 'ratio que se separa' : 'ratios que se separan'} de tu actividad más de lo que explica la variación normal entre negocios parecidos. Casi siempre hay una razón legítima detrás (un ejercicio atípico, una inversión, un cambio de modelo), y precisamente por eso merece la pena documentarla mientras se recuerda.`}
              {res.efectivo > 25 && ` Aparte: el efectivo pesa un ${f(res.efectivo, 0)}% de tus ventas, y eso por sí solo cambia el nivel de detalle con el que se revisa todo lo anterior.`}
            </p>

            {res.filas.map(({ r, v, q, des, niv }) => {
              const lo = Math.min(q[0], v), hi = Math.max(q[2], v)
              const pad = Math.max((hi - lo) * 0.28, (q[2] - q[0]) * 0.35, 1e-6)
              const min = lo - pad, span = (hi + pad) - min
              const pos = k => `${(((k - min) / span) * 100).toFixed(2)}%`
              const tag = niv === 'verde' ? 'En banda' : niv === 'alerta' ? 'Desviación alta' : 'Atención'
              return (
                <div key={r.id} className={styles.ratio}>
                  <div className={styles.ratioCab}>
                    <span className={styles.ratioNom}>{r.nom}</span>
                    <span className={`${styles.tag} ${styles['t_' + niv]}`}>{tag}</span>
                  </div>
                  <p className={styles.datos}>
                    Tu empresa <b>{f(v, r.d)}{r.u}</b> · valor central {f(q[1], r.d)}{r.u} ·
                    {' '}recorrido {f(q[0], r.d)}–{f(q[2], r.d)}{r.u}
                    {des.lado !== 'en banda' && ` · ${des.d.toFixed(2)}× fuera, ${des.lado}`}
                  </p>
                  <p className={styles.origen}>{r.f}</p>
                  <div className={styles.regla}>
                    <div className={styles.pistaR} />
                    <div className={styles.iqr} style={{ left: pos(q[0]), width: `${(((q[2]-q[0]) / span) * 100).toFixed(2)}%` }} />
                    <div className={styles.med} style={{ left: pos(q[1]) }} />
                    <div className={`${styles.marca} ${niv === 'verde' ? styles.marcaOk : ''}`} style={{ left: pos(v) }} />
                    <div className={styles.escala}>
                      <span style={{ left: pos(q[0]) }}>P20</span>
                      <span style={{ left: pos(q[2]) }}>P80</span>
                    </div>
                  </div>
                  {niv !== 'verde' && <p className={styles.porque}>{r.txt}</p>}
                </div>
              )
            })}

            {res.iva && (() => {
              const alto = res.iva.tipo > 21.5, bajo = res.iva.tipo < 9
              return (
                <div className={`${styles.interna} ${alto ? styles.internaMal : bajo ? '' : styles.internaOk}`}>
                  <h3>Coherencia entre el IVA deducido y tus compras</h3>
                  <p className={styles.datos}>
                    Tipo medio implícito <b>{f(res.iva.tipo, 1)}%</b> sobre {f(res.iva.base, 0)} € de compras y gastos declarados
                  </p>
                  <p className={styles.origen}>Cálculo sobre tus propios datos · sin referencia sectorial</p>
                  <p>
                    {alto
                      ? 'Te has deducido más IVA del que pueden generar tus compras contabilizadas, ni aplicándoles el tipo general entero. O hay gasto deducido que no está en la cuenta de resultados, o hay cuotas de inversiones que conviene identificar aparte, o hay un error de arrastre entre trimestres. Es la incoherencia que salta sin abrir la contabilidad, sólo cruzando el 303 con el 200.'
                      : bajo
                      ? 'El tipo medio implícito es muy bajo para compras de este volumen. Puede ser normal si buena parte de tu gasto son salarios, seguros, alquileres sin IVA o proveedores exentos, pero si no es el caso probablemente estés dejando cuotas sin deducir, y ese dinero es recuperable dentro del plazo de prescripción.'
                      : 'El IVA deducido encaja con el volumen de compras y gastos que declaras. Es la comprobación que se hace primero al cruzar el 303 con el modelo 200, y la pasas.'}
                  </p>
                </div>
              )
            })()}
          </section>

          {/* ---------------- OFERTA ---------------- */}
          <section className={styles.oferta}>
            <div className={styles.ofertaGrid}>
              <div>
                <div className={styles.eyebrow}>El siguiente paso</div>
                <h2 className={styles.ofertaTitle}>
                  Auditoría fiscal completa de tu empresa, <em>a precio cerrado</em>
                </h2>
                <p className={styles.ofertaIntro}>
                  Este diagnóstico compara ratios. La auditoría entra en tu contabilidad real,
                  revisa los ejercicios que Hacienda todavía puede comprobar y te deja cada
                  desviación explicada y documentada antes de que te la pregunten.
                </p>
                <div className={styles.precio}>
                  <span className={styles.precioN}>500 €</span>
                  <span className={styles.precioD}>
                    <b>+ IVA · Precio cerrado</b>
                    Sin escalados por horas ni suplementos. El importe que ves es el que se factura.
                  </span>
                </div>
                <ul className={styles.incluye}>
                  {INCLUYE.map(x => (
                    <li key={x.i}><span className={styles.incluyeI}>{x.i}</span><span>{x.t}</span></li>
                  ))}
                </ul>
              </div>

              <div className={styles.formLead}>
                {envio === 'ok' ? (
                  <div className={styles.gracias}>
                    <div className={styles.graciasIcono}>✓</div>
                    <h3>Solicitud recibida</h3>
                    <p>
                      Te escribimos en menos de 24 horas con los siguientes pasos. Tu diagnóstico
                      va adjunto en la solicitud, así que llegamos a la primera conversación con
                      los números ya leídos.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className={styles.formLeadTitle}>Solicitar la auditoría</h3>
                    <p className={styles.formLeadSub}>
                      Enviamos con la solicitud el resultado de tu diagnóstico. Respondemos en menos de 24 horas.
                    </p>
                    <div className={styles.campoLead}>
                      <label htmlFor="lead-nombre">Nombre y empresa</label>
                      <input id="lead-nombre" type="text" value={lead.nombre}
                        onChange={e => setLead(l => ({ ...l, nombre: e.target.value }))} />
                    </div>
                    <div className={styles.campoLead}>
                      <label htmlFor="lead-email">Email</label>
                      <input id="lead-email" type="email" value={lead.email}
                        onChange={e => setLead(l => ({ ...l, email: e.target.value }))} />
                    </div>
                    <div className={styles.campoLead}>
                      <label htmlFor="lead-tel">Teléfono <span className={styles.opc}>opcional</span></label>
                      <input id="lead-tel" type="tel" value={lead.telefono}
                        onChange={e => setLead(l => ({ ...l, telefono: e.target.value }))} />
                    </div>
                    {envio === 'error' && (
                      <p className={styles.errorLead}>
                        Revisa el nombre y el email. Si el problema sigue, escríbenos a correo@irmabogados.es
                      </p>
                    )}
                    <button type="button" className="btn-gold" style={{ width:'100%', marginTop:8 }}
                      onClick={enviar} disabled={envio === 'enviando'}>
                      {envio === 'enviando' ? 'Enviando…' : 'Solicitar auditoría'}
                    </button>
                    <div className={styles.alternativas}>
                      <a href="https://wa.me/34614149465">WhatsApp</a>
                      <span>·</span>
                      <a href="tel:+34614149465">614 149 465</a>
                      <span>·</span>
                      <Link href="/contacto">Consulta gratuita</Link>
                    </div>
                    <p className={styles.legal}>
                      Responsable: IRM Abogados. Finalidad: atender tu solicitud de auditoría.
                      Legitimación: tu consentimiento. No cedemos datos a terceros. Puedes ejercer
                      tus derechos en correo@irmabogados.es. Más información en la{' '}
                      <Link href="/politica-de-privacidad">política de privacidad</Link>.
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* ---------------- METODOLOGÍA ---------------- */}
          <section className={styles.metodo}>
            <div className={styles.eyebrow}>Metodología</div>
            <div className={styles.metodoGrid}>
              <div>
                <h3>Cómo leer la barra</h3>
                <p>
                  La banda es el recorrido del percentil 20 al 80 entre las subactividades de tu
                  CNAE dentro de tu tramo de tamaño. La línea vertical es el valor central de tu
                  actividad; el triángulo eres tú. Salirse de la banda no es una infracción ni
                  anuncia una comprobación: es una diferencia que conviene poder explicar por escrito.
                </p>
              </div>
              <div>
                <h3>Fuentes</h3>
                <p>
                  Estadística Estructural de Empresas del INE, tablas de principales indicadores por
                  CNAE y tamaño, y Cuentas anuales no consolidadas del Impuesto sobre Sociedades de
                  la AEAT. Ambas públicas y descargables desde datos.gob.es.
                </p>
              </div>
              <div>
                <h3>Qué no es esto</h3>
                <p>
                  No calcula ninguna probabilidad de inspección: los criterios de selección de la
                  AEAT no son públicos. Mide distancia estadística respecto a tu actividad, que es
                  lo único que un dato público permite afirmar.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
