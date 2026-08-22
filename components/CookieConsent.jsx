'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './CookieConsent.module.css'
import { readConsent, writeConsent, ALLOW_ALL, DENY_ALL } from '@/lib/consent'

export default function CookieConsent() {
  const [mode, setMode] = useState('hidden') // 'hidden' | 'banner' | 'panel'
  const [prefs, setPrefs] = useState(DENY_ALL) // nunca premarcado
  const panelRef = useRef(null)

  useEffect(() => {
    const stored = readConsent()
    if (!stored) {
      setMode('banner')
    } else {
      setPrefs({ analytics: stored.analytics, marketing: stored.marketing })
    }
    // Permite reabrir el panel desde el pie de página o desde la política.
    const open = () => {
      const current = readConsent()
      if (current) setPrefs({ analytics: current.analytics, marketing: current.marketing })
      setMode('panel')
    }
    window.irmOpenCookiePrefs = open
    window.addEventListener('irm:open-cookie-prefs', open)
    return () => {
      delete window.irmOpenCookiePrefs
      window.removeEventListener('irm:open-cookie-prefs', open)
    }
  }, [])

  const save = useCallback((value) => {
    writeConsent(value)
    setPrefs({ analytics: value.analytics, marketing: value.marketing })
    setMode('hidden')
  }, [])

  // Escape cierra el panel sin guardar nada (cerrar nunca equivale a consentir).
  useEffect(() => {
    if (mode !== 'panel') return
    const onKey = (e) => {
      if (e.key === 'Escape') setMode(readConsent() ? 'hidden' : 'banner')
    }
    document.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [mode])

  if (mode === 'hidden') return null

  if (mode === 'banner') {
    return (
      <div
        className={styles.banner}
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-banner-title"
      >
        <div className={styles.inner}>
          <div className={styles.text}>
            <h2 id="cookie-banner-title" className={styles.title}>
              Cookies en <em>irmabogadosasesores.com</em>
            </h2>
            <p>
              Usamos cookies propias necesarias para que el sitio funcione y, solo si
              lo autoriza, cookies de Google&nbsp;LLC (analítica) y de Meta&nbsp;Platforms y
              LinkedIn (publicidad y medición), que implican transferencias de datos a
              EE.&nbsp;UU. y elaboración de perfiles. Puede aceptarlas, rechazarlas o
              elegir por finalidad. Más detalle en la{' '}
              <a href="/politica-de-cookies">política de cookies</a>.
            </p>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.btnPrimary} onClick={() => save(ALLOW_ALL)}>
              Aceptar todas
            </button>
            <button type="button" className={styles.btnPrimary} onClick={() => save(DENY_ALL)}>
              Rechazar todas
            </button>
            <button type="button" className={styles.btnGhost} onClick={() => setMode('panel')}>
              Configurar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-panel-title"
        tabIndex={-1}
        ref={panelRef}
      >
        <h2 id="cookie-panel-title" className={styles.panelTitle}>
          Configuración de <em>cookies</em>
        </h2>
        <p className={styles.panelIntro}>
          Elija qué finalidades autoriza. Su decisión se guarda 12 meses y puede cambiarla
          cuando quiera desde «Configuración de cookies», en el pie de página.
        </p>

        <div className={styles.group}>
          <div className={styles.groupHead}>
            <div>
              <div className={styles.groupName}>Necesarias</div>
              <div className={styles.groupTag}>Siempre activas · exentas de consentimiento</div>
            </div>
            <span className={styles.locked}>Activas</span>
          </div>
          <p className={styles.groupDesc}>
            Solo la cookie <code>irm_consent</code>, que guarda la elección que haga aquí.
            Sin ella tendríamos que preguntarle en cada página.
          </p>
        </div>

        <Toggle
          name="Analíticas"
          tag="Google Analytics 4 (Google LLC) · EE. UU."
          desc="Miden qué páginas se visitan y cómo se llega al sitio para mejorarlo. Los datos no son anónimos: incluyen un identificador de navegador y la dirección IP."
          checked={prefs.analytics}
          onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
        />

        <Toggle
          name="Publicidad y redes sociales"
          tag="Meta Platforms (Facebook e Instagram) y LinkedIn · EE. UU."
          desc="Permiten medir campañas, crear audiencias y mostrarle anuncios nuestros en Facebook, Instagram y LinkedIn. Implican elaboración de perfiles."
          checked={prefs.marketing}
          onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
        />

        <div className={styles.panelActions}>
          <button type="button" className={styles.btnPrimary} onClick={() => save(ALLOW_ALL)}>
            Aceptar todas
          </button>
          <button type="button" className={styles.btnPrimary} onClick={() => save(DENY_ALL)}>
            Rechazar todas
          </button>
          <button type="button" className={styles.btnGhost} onClick={() => save(prefs)}>
            Guardar selección
          </button>
        </div>

        <p className={styles.panelNote}>
          Detalle de cada cookie, plazos y proveedores en la{' '}
          <a href="/politica-de-cookies">política de cookies</a>.
        </p>
      </div>
    </div>
  )
}

function Toggle({ name, tag, desc, checked, onChange }) {
  return (
    <div className={styles.group}>
      <div className={styles.groupHead}>
        <div>
          <div className={styles.groupName}>{name}</div>
          <div className={styles.groupTag}>{tag}</div>
        </div>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-label={`Activar cookies de ${name.toLowerCase()}`}
          />
          <span className={styles.slider} aria-hidden="true" />
        </label>
      </div>
      <p className={styles.groupDesc}>{desc}</p>
    </div>
  )
}
