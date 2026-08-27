'use client'

import { gaTrack } from '@/lib/ga'

/**
 * Enlace <a> que registra el clic en Google Analytics.
 *
 * Existe porque las páginas del proyecto son Server Components y no
 * admiten onClick. Este componente sí es de cliente, así que puede
 * usarse dentro de ellas sin convertir la página entera.
 *
 * Deduce el evento a partir del destino, de modo que basta con
 * sustituir <a> por <TrackedLink> e indicar la ubicación.
 */
function eventoDesdeHref(href = '') {
  const h = String(href)
  if (h.startsWith('tel:')) return 'click_telefono'
  if (h.includes('wa.me')) return 'click_whatsapp'
  if (h.startsWith('mailto:')) return 'click_email'
  return null
}

export default function TrackedLink({ href, ubicacion, evento, children, ...props }) {
  const nombre = evento || eventoDesdeHref(href)
  return (
    <a
      href={href}
      onClick={() => { if (nombre) gaTrack(nombre, { ubicacion: ubicacion || 'sin_definir' }) }}
      {...props}
    >
      {children}
    </a>
  )
}
