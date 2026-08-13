import Link from '@tiptap/extension-link'
import { mergeAttributes } from '@tiptap/core'

// Dominios que se consideran propios
const DOMINIOS_PROPIOS = ['irmabogadosasesores.com']

const esInterno = (href = '') => {
  if (!href) return false
  // Rutas relativas y anclas siempre son internas
  if (href.startsWith('/') || href.startsWith('#')) return true
  return DOMINIOS_PROPIOS.some(d => href.includes(d))
}

/**
 * Enlaces internos  -> misma pestaña, sin rel
 * Enlaces externos  -> pestaña nueva, con rel de seguridad
 * Correo y teléfono -> misma pestaña
 */
export const SmartLink = Link.extend({
  renderHTML({ HTMLAttributes }) {
    const href = HTMLAttributes.href || ''

    if (esInterno(href) || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return [
        'a',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { target: null, rel: null }),
        0,
      ]
    }

    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
      0,
    ]
  },
})

export default SmartLink
