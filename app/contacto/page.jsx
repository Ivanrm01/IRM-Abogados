'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './contacto.module.css'

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre:'', apellidos:'', email:'', telefono:'', servicio:'', mensaje:'', como:'', privacidad: false })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = k => e => setForm({...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value})

  const submit = async () => {
    if (!form.nombre || !form.email || !form.servicio || !form.mensaje || !form.privacidad) {
      setError('Por favor rellena todos los campos obligatorios y acepta la política de privacidad'); return
    }
    setSending(true); setError('')
    const r = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setSending(false)
    if (r.ok) setSent(true)
    else setError('Error al enviar. Por favor inténtalo de nuevo o contáctanos directamente.')
  }

  const [openFaq, setOpenFaq] = useState(null)
  const faqs = [
    { q: '¿La primera consulta es realmente gratuita?', a: 'Sí, completamente. La primera consulta no tiene ningún coste. Analizamos tu caso, te explicamos qué opciones tienes y te informamos del coste exacto antes de que tomes ninguna decisión. Sin compromiso ni letra pequeña.' },
    { q: '¿Atendeís a clientes de toda España?', a: 'Sí. Aunque tenemos sedes físicas en Madrid y Castellón, atendemos a clientes de toda España a través de videoconferencia. La distancia no es ningún obstáculo para recibir un asesoramiento de calidad.' },
    { q: '¿Cuánto tiempo tardáis en responder?', a: 'Respondemos siempre en menos de 24 horas en días laborables. Si tu consulta es urgente (plazo inminente de Hacienda), indícanoslo en el mensaje y haremos todo lo posible por atenderte el mismo día.' },
    { q: '¿Cómo se fijan los honorarios?', a: 'Los honorarios dependen del tipo de servicio y la complejidad del caso. Siempre te informamos del coste exacto antes de empezar. Preferimos presupuestos cerrados para que sepas exactamente lo que vas a pagar.' },
    { q: '¿Qué información necesitáis para la primera consulta?', a: 'Con una descripción general de tu situación es suficiente. No necesitas preparar documentación de antemano. En la consulta te pediremos la información específica necesaria.' },
    { q: '¿Es confidencial la información que compartís?', a: 'Toda la información está protegida por el secreto profesional y nuestra política de privacidad. Nunca compartimos datos de clientes con terceros.' },
  ]

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.heroBg}>HOLA</div>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.breadcrumb}>Inicio <span>/ Contacto</span></div>
            <div className="eyebrow">Estamos aquí</div>
            <h1>Cuéntanos<br />tu caso.<br /><em>Te escuchamos</em></h1>
            <p className={styles.heroDesc}>Primera consulta siempre gratuita y sin compromiso. Analizamos tu situación y te decimos exactamente qué podemos hacer por ti antes de que tomes ninguna decisión.</p>
            <div className={styles.promises}>
              {['Respuesta garantizada en menos de 24 horas','Primera consulta siempre gratuita','Hablas directamente con el abogado','Atendemos clientes de toda España online'].map(p => (
                <div key={p} className={styles.promise}><div className={styles.dot}></div>{p}</div>
              ))}
            </div>
          </div>
          <div className={styles.quickLinks}>
            <a href="tel:+34614149465" className={styles.quickCard}>
              <div className={styles.quickIcon}>📞</div>
              <div><div className={styles.quickLabel}>Llámanos ahora</div><div className={styles.quickValue}>+34 614 149 465</div></div>
              <span className={styles.quickArrow}>→</span>
            </a>
            <a href="https://wa.me/34614149465" className={styles.quickCard}>
              <div className={styles.quickIcon}>💬</div>
              <div><div className={styles.quickLabel}>WhatsApp</div><div className={styles.quickValue}>Escríbenos directamente</div></div>
              <span className={styles.quickArrow}>→</span>
            </a>
            <a href="mailto:correo@irmabogados.es" className={styles.quickCard}>
              <div className={styles.quickIcon}>✉️</div>
              <div><div className={styles.quickLabel}>Email</div><div className={styles.quickValue}>correo@irmabogados.es</div></div>
              <span className={styles.quickArrow}>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* FORM + INFO */}
      <div className={styles.contactMain} id="formulario">
        {/* FORM */}
        <div className={styles.formSide}>
          {sent ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✓</div>
              <div className={styles.successTitle}>¡Consulta recibida!</div>
              <p>Te responderemos en menos de 24 horas. Mientras tanto, puedes llamarnos al <a href="tel:+34614149465">+34 614 149 465</a>.</p>
            </div>
          ) : (
            <>
              <div className={styles.formTitle}>Envíanos tu<br /><em>consulta</em></div>
              <p className={styles.formSubtitle}>Rellena el formulario y un abogado especialista se pondrá en contacto contigo en menos de 24 horas.</p>
              <div className={styles.row}>
                <div className={styles.group}><label>Nombre *</label><input value={form.nombre} onChange={set('nombre')} placeholder="Tu nombre" /></div>
                <div className={styles.group}><label>Apellidos *</label><input value={form.apellidos} onChange={set('apellidos')} placeholder="Tus apellidos" /></div>
              </div>
              <div className={styles.row}>
                <div className={styles.group}><label>Email *</label><input type="email" value={form.email} onChange={set('email')} placeholder="correo@ejemplo.com" /></div>
                <div className={styles.group}><label>Teléfono</label><input type="tel" value={form.telefono} onChange={set('telefono')} placeholder="+34 600 000 000" /></div>
              </div>
              <div className={styles.group}>
                <label>¿Sobre qué necesitas asesoramiento? *</label>
                <select value={form.servicio} onChange={set('servicio')}>
                  <option value="">Selecciona una opción</option>
                  <optgroup label="Fiscal"><option>IRPF — Declaración de la Renta</option><option>Impuesto sobre Sociedades</option><option>IVA y obligaciones trimestrales</option><option>Patrimonio, Sucesiones o Donaciones</option><option>Defensa ante inspección o sanción AEAT</option><option>Planificación y optimización fiscal</option></optgroup>
                  <optgroup label="Garantías tributarias"><option>Aplazamiento o fraccionamiento de deuda</option><option>Suspensión de deuda — recurso en curso</option><option>Embargo — actuación ejecutiva AEAT</option></optgroup>
                  <optgroup label="Start-Ups"><option>Constitución de sociedad</option><option>Pacto de socios</option><option>ESOP o plan de incentivos</option><option>Due diligence fiscal</option><option>Ronda de inversión</option></optgroup>
                  <option value="otro">Otro asunto</option>
                </select>
              </div>
              <div className={styles.group}>
                <label>Cuéntanos tu caso *</label>
                <textarea rows={5} value={form.mensaje} onChange={set('mensaje')} placeholder="Descríbenos brevemente tu situación..." />
              </div>
              <div className={styles.group}>
                <label>¿Cómo prefieres que te contactemos?</label>
                <select value={form.como} onChange={set('como')}>
                  <option value="">Selecciona una opción</option>
                  <option>Llamada telefónica</option><option>WhatsApp</option><option>Email</option><option>Videoconferencia</option><option>Presencial en Madrid</option><option>Presencial en Castellón</option>
                </select>
              </div>
              <label className={styles.checkLabel}>
                <input type="checkbox" checked={form.privacidad} onChange={set('privacidad')} />
                He leído y acepto la <Link href="/politica-de-privacidad">política de privacidad</Link>. Mis datos serán tratados con total confidencialidad.
              </label>
              {error && <div className={styles.errorMsg}>{error}</div>}
              <button onClick={submit} disabled={sending} className={styles.submitBtn}>
                {sending ? 'Enviando...' : '→ Enviar consulta gratuita'}
              </button>
              <div className={styles.guarantee}><div className={styles.greenDot}></div>Respuesta garantizada en menos de 24 horas · Consulta gratuita y confidencial</div>
            </>
          )}
        </div>

        {/* INFO */}
        <div className={styles.infoSide}>
          <div className={styles.infoTitle}>También puedes<br /><em>contactar directamente</em></div>
          <p className={styles.infoDesc}>Siempre atendemos nosotros personalmente, sin centralitas.</p>
          {[{icon:'📞',label:'Teléfono',value:'+34 614 149 465',sub:'Lunes a viernes · 9:00 – 19:00',href:'tel:+34614149465'},{icon:'💬',label:'WhatsApp',value:'Escríbenos por WhatsApp',sub:'Respuesta rápida en horario de oficina',href:'https://wa.me/34614149465'},{icon:'✉️',label:'Email',value:'correo@irmabogados.es',sub:'Respondemos en menos de 24 horas',href:'mailto:correo@irmabogados.es'}].map(c => (
            <div key={c.label} className={styles.contactRow}>
              <div className={styles.crIcon}>{c.icon}</div>
              <div><div className={styles.crLabel}>{c.label}</div><a href={c.href} className={styles.crValue}>{c.value}</a><div className={styles.crSub}>{c.sub}</div></div>
            </div>
          ))}
          <div className={styles.sedesTitle}>Nuestras sedes</div>
          <div className={styles.sedesGrid}>
            <a href="https://maps.google.com" target="_blank" className={styles.sedeCard}><div className={styles.sedeCity}>Madrid</div><div className={styles.sedeAddr}>C/ José Ortega y Gasset, 84 — 2º C · 28006 Madrid</div><span className={styles.sedeMap}>Ver en mapa →</span></a>
            <a href="https://maps.google.com" target="_blank" className={styles.sedeCard}><div className={styles.sedeCity}>Castellón</div><div className={styles.sedeAddr}>C/ En Medio, 22 — 6º · 12001 Castellón de la Plana</div><span className={styles.sedeMap}>Ver en mapa →</span></a>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className={`section ${styles.faqSection}`}>
        <div className="eyebrow">Antes de contactar</div>
        <h2>Preguntas <em>frecuentes</em></h2>
        <div className={styles.faqGrid}>
          {faqs.map((f,i) => (
            <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className={styles.faqQ}><h3>{f.q}</h3><div className={styles.faqTog}>{openFaq === i ? '−' : '+'}</div></div>
              {openFaq === i && <div className={styles.faqA}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
