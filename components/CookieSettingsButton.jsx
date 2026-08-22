'use client'

/**
 * Reabre el panel de configuración de cookies.
 * Retirar el consentimiento debe ser tan sencillo como prestarlo (art. 7.3 RGPD),
 * por eso este acceso está permanentemente disponible en el pie de página.
 */
export default function CookieSettingsButton({ className, children }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event('irm:open-cookie-prefs'))}
    >
      {children || 'Configuración de cookies'}
    </button>
  )
}
