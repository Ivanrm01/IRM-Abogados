import { Extension } from '@tiptap/core'

const STEP = 32 // píxeles por nivel de sangría

/**
 * Sangría ajustable por niveles.
 * Funciona en párrafos, títulos, citas, listas y listas numeradas.
 *
 * - Botones ⇤ / ⇥  : desplazan el bloque completo a izquierda o derecha.
 * - Tab / Shift+Tab : dentro de una lista, crean o deshacen un sub-nivel.
 */
export const Indent = Extension.create({
  name: 'indent',

  addOptions() {
    return {
      // El orden importa: se aplica al primero que coincida.
      // Las listas van antes que el párrafo porque el cursor,
      // dentro de una lista, también está dentro de un párrafo.
      types: ['bulletList', 'orderedList', 'blockquote', 'heading', 'paragraph'],
      step: STEP,
      max: 6,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: element => {
              const ml = parseInt(element.style.marginLeft || 0, 10)
              return ml ? Math.round(ml / STEP) : 0
            },
            renderHTML: attributes => {
              if (!attributes.indent) return {}
              return { style: `margin-left: ${attributes.indent * STEP}px` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    const shift = delta => ({ editor, commands }) => {
      const type = this.options.types.find(t => editor.isActive(t))
      if (!type) return false
      const current = editor.getAttributes(type).indent || 0
      const next = Math.min(Math.max(current + delta, 0), this.options.max)
      return commands.updateAttributes(type, { indent: next })
    }

    return {
      indentMore: () => shift(1),
      indentLess: () => shift(-1),
    }
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.isActive('table')) return false // no romper el salto entre celdas
        if (this.editor.isActive('listItem')) return this.editor.commands.sinkListItem('listItem')
        return this.editor.commands.indentMore()
      },
      'Shift-Tab': () => {
        if (this.editor.isActive('table')) return false
        if (this.editor.isActive('listItem')) return this.editor.commands.liftListItem('listItem')
        return this.editor.commands.indentLess()
      },
    }
  },
})

export default Indent
