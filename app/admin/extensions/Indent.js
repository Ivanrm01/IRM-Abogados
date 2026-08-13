import { Extension } from '@tiptap/core'

const STEP = 32 // píxeles por nivel de sangría

/**
 * Sangría ajustable por niveles.
 * En párrafos, títulos y citas aplica margen izquierdo.
 * Dentro de una lista, anida o desanida el elemento.
 */
export const Indent = Extension.create({
  name: 'indent',

  addOptions() {
    return { types: ['paragraph', 'heading', 'blockquote'], step: STEP, max: 6 }
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
      if (editor.isActive('listItem')) {
        return delta > 0
          ? commands.sinkListItem('listItem')
          : commands.liftListItem('listItem')
      }
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
        if (this.editor.isActive('table')) return false // no romper la navegación entre celdas
        return this.editor.commands.indentMore()
      },
      'Shift-Tab': () => {
        if (this.editor.isActive('table')) return false
        return this.editor.commands.indentLess()
      },
    }
  },
})

export default Indent
