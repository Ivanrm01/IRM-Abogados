/**
 * Helper para eventos de Google Analytics 4.
 *
 * gtag solo existe si el usuario ha aceptado las cookies de analítica
 * (ver components/Analytics.jsx). Si no las ha aceptado, esta función
 * no hace nada: no rompe la web ni lanza errores en consola.
 */
export function gaTrack(event, params = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', event, params)
}
