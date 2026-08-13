import { Extension } from '@tiptap/core'

/**
 * Permite ajustar el interlineado de párrafos y títulos.
 * Se aplica al bloque completo donde está el cursor.
 */
export const LineHeight = Extension.create({
  name: 'lineHeight',

  addOptions() {
    return { types: ['paragraph', 'heading'] }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight || null,
            renderHTML: attributes => {
              if (!attributes.lineHeight) return {}
              return { style: `line-height: ${attributes.lineHeight}` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight: value => ({ commands }) =>
        this.options.types.every(type => commands.updateAttributes(type, { lineHeight: value })),
      unsetLineHeight: () => ({ commands }) =>
        this.options.types.every(type => commands.resetAttributes(type, 'lineHeight')),
    }
  },
})

export default LineHeight
