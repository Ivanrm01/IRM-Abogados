'use client'

import { useState } from 'react'
import styles from './nonresident.module.css'
import { fbTrack } from '@/lib/pixel'
import { gaTrack } from '@/lib/ga'

/**
 * Formulario en inglés de la landing de no residentes.
 *
 * Reutiliza el endpoint existente /api/contact, de modo que la consulta
 * llega al mismo buzón y con el mismo formato que el resto de la web.
 * Los campos del API son en castellano (nombre, apellidos, servicio...),
 * así que aquí se traducen antes de enviarlos.
 */

const SERVICIOS = [
  'Rental income return (Modelo 210)',
  'Imputed income — property not rented out',
  'Sale of a Spanish property / reclaiming the 3% retention',
  'Late returns or a letter from the Spanish Tax Agency',
  'Wealth tax (Impuesto sobre el Patrimonio)',
  'Not sure — I need someone to look at my situation',
]

export default function EnquiryForm() {
  const [form, setForm] = useState({
    nombre: '', apellidos: '', email: '', telefono: '',
    pais: '', provincia: '', servicio: '', mensaje: '',
    como: '', privacidad: false, empresa_web: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = k => e =>
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = async () => {
    if (!form.nombre || !form.apellidos || !form.email || !form.servicio || !form.mensaje || !form.privacidad) {
      setError('Please complete the required fields and accept the privacy policy.')
      return
    }

    setSending(true)
    setError('')

    // El cuerpo del mensaje incorpora el país de residencia fiscal y la
    // ubicación del inmueble, que no tienen campo propio en el API.
    const mensaje = [
      `Country of tax residence: ${form.pais || '—'}`,
      `Where the property is: ${form.provincia || '—'}`,
      '',
      form.mensaje,
    ].join('\n')

    let r
    try {
      r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellidos: form.apellidos,
          email: form.email,
          telefono: form.telefono,
          servicio: `[EN] ${form.servicio}`,
          mensaje,
          como: form.como,
          empresa_web: form.empresa_web,
        }),
      })
    } catch {
      setSending(false)
      setError('We could not send your message. Please email correo@irmabogados.es instead.')
      return
    }

    setSending(false)

    if (r.ok) {
      setSent(true)
      fbTrack('Lead', { content_name: form.servicio, content_category: 'Landing EN no residentes' })
      gaTrack('generate_lead', {
        origen: 'landing_en_modelo_210',
        servicio: form.servicio,
        pais_residencia: form.pais || 'no_indicado',
      })
    } else {
      setError('We could not send your message. Please try again or email correo@irmabogados.es.')
    }
  }

  if (sent) {
    return (
      <div className={styles.form}>
        <div className={styles.successBox}>
          <div className={styles.successIcon}>✓</div>
          <div className={styles.successTitle}>Message received</div>
          <p>
            A Spanish tax lawyer will reply within one working day, in English. If your
            deadline is close, call us on{' '}
            <a href="tel:+34614149465" onClick={() => gaTrack('click_telefono', { ubicacion: 'landing_en_confirmacion' })}>
              +34 614 149 465
            </a>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.form}>
      <div className={styles.formTitle}>Tell us about your property</div>
      <p className={styles.formSubtitle}>
        A few details are enough to tell you what you owe, what it costs and whether anything
        can be reclaimed. First reply within one working day.
      </p>

      {/* Trampa antispam: campo oculto que una persona nunca rellena. */}
      <input
        type="text"
        name="empresa_web"
        value={form.empresa_web}
        onChange={set('empresa_web')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
      />

      {error && <div className={styles.formError}>{error}</div>}

      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="en-first">First name *</label>
          <input id="en-first" value={form.nombre} onChange={set('nombre')} placeholder="John" autoComplete="given-name" />
        </div>
        <div className={styles.group}>
          <label htmlFor="en-last">Last name *</label>
          <input id="en-last" value={form.apellidos} onChange={set('apellidos')} placeholder="Smith" autoComplete="family-name" />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="en-email">Email *</label>
          <input id="en-email" type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" autoComplete="email" />
        </div>
        <div className={styles.group}>
          <label htmlFor="en-phone">Phone</label>
          <input id="en-phone" type="tel" value={form.telefono} onChange={set('telefono')} placeholder="+44 7700 000000" autoComplete="tel" />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="en-country">Country of tax residence</label>
          <input id="en-country" value={form.pais} onChange={set('pais')} placeholder="United Kingdom" />
        </div>
        <div className={styles.group}>
          <label htmlFor="en-where">Where the property is</label>
          <input id="en-where" value={form.provincia} onChange={set('provincia')} placeholder="Alicante" />
        </div>
      </div>

      <div className={styles.group}>
        <label htmlFor="en-service">What do you need help with? *</label>
        <select id="en-service" value={form.servicio} onChange={set('servicio')}>
          <option value="">Select an option</option>
          {SERVICIOS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label htmlFor="en-message">Your situation *</label>
        <textarea
          id="en-message"
          value={form.mensaje}
          onChange={set('mensaje')}
          placeholder="For example: I bought a flat in Alicante in 2019, I rent it out in summer and I have never filed anything in Spain."
        />
      </div>

      <div className={styles.group}>
        <label htmlFor="en-contact">Preferred way to be contacted</label>
        <select id="en-contact" value={form.como} onChange={set('como')}>
          <option value="">No preference</option>
          <option value="Email">Email</option>
          <option value="Phone call">Phone call</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Video call">Video call</option>
        </select>
      </div>

      <label className={styles.consent}>
        <input type="checkbox" checked={form.privacidad} onChange={set('privacidad')} />
        <span>
          I have read and accept the{' '}
          <a href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer">privacy policy</a>{' '}
          (in Spanish) and agree to be contacted about my enquiry. *
        </span>
      </label>

      <button type="button" className={`btn-gold ${styles.submit}`} onClick={submit} disabled={sending}>
        {sending ? 'Sending…' : 'Send my enquiry'}
      </button>
    </div>
  )
}
