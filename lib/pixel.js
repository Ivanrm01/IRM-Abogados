/**
 * Helper para eventos del Píxel de Meta.
 *
 * fbq solo existe si el usuario ha aceptado las cookies de marketing
 * (ver components/Analytics.jsx). Si no las ha aceptado, esta función
 * no hace nada: no rompe la web ni lanza errores en consola.
 */
export function fbTrack(event, params = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  window.fbq('track', event, params)
}
