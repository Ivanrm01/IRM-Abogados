'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapImage from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { useRef } from 'react'
import { FontSize } from './extensions/FontSize'
import { LineHeight } from './extensions/LineHeight'
import styles from './editor.module.css'
import './editor-global.css'
import { Indent } from './extensions/Indent'

const MenuBar = ({ editor, adminKey }) => {
  const fileRef = useRef()
  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('URL del enlace:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const uploadImg = async (file) => {
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-key': adminKey },
        body: fd
      })
      const d = await r.json()
      if (r.ok) editor.chain().focus().setImage({ src: d.url }).run()
      else alert(d.error || 'Error al subir imagen')
    } catch { alert('Error al subir imagen') }
  }

  const B = ({ action, title, label, active }) => (
    <button
      type="button"
      onClick={action}
      title={title}
      className={`${styles.menuBtn} ${active ? styles.menuBtnActive : ''}`}
    >{label}</button>
  )

  const inTable = editor.isActive('table')

  // Tamaño actual del texto seleccionado (para que el desplegable lo refleje)
  const currentSize = editor.getAttributes('textStyle').fontSize || ''
  const currentLh = editor.getAttributes('paragraph').lineHeight
    || editor.getAttributes('heading').lineHeight || ''

  return (
    <>
      <div className={styles.menuBar}>
        <div className={styles.menuGroup}>
          <B action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Título H2" label="H2" active={editor.isActive('heading', { level: 2 })} />
          <B action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Título H3" label="H3" active={editor.isActive('heading', { level: 3 })} />
          <B action={() => editor.chain().focus().setParagraph().run()} title="Párrafo" label="P" active={editor.isActive('paragraph')} />
        </div>
        <div className={styles.menuDivider}></div>
        <div className={styles.menuGroup}>
          <B action={() => editor.chain().focus().toggleBold().run()} title="Negrita" label="B" active={editor.isActive('bold')} />
          <B action={() => editor.chain().focus().toggleItalic().run()} title="Cursiva" label="I" active={editor.isActive('italic')} />
          <B action={() => editor.chain().focus().toggleUnderline().run()} title="Subrayado" label="U" active={editor.isActive('underline')} />
          <B action={() => editor.chain().focus().toggleHighlight().run()} title="Resaltar" label="✎" active={editor.isActive('highlight')} />
        </div>
        <div className={styles.menuDivider}></div>

        {/* Tamaño de letra */}
        <div className={styles.menuGroup}>
          <select
            className={styles.menuSelect}
            title="Tamaño de letra"
            value={currentSize}
            onChange={e => {
              const v = e.target.value
              if (!v) editor.chain().focus().unsetFontSize().run()
              else editor.chain().focus().setFontSize(v).run()
            }}
          >
            <option value="">Tamaño</option>
            <option value="14px">Pequeño</option>
            <option value="15px">Normal</option>
            <option value="17px">Grande</option>
            <option value="20px">Destacado</option>
          </select>
        </div>

        {/* Interlineado */}
        <div className={styles.menuGroup}>
          <select
            className={styles.menuSelect}
            title="Interlineado"
            value={currentLh}
            onChange={e => {
              const v = e.target.value
              if (!v) editor.chain().focus().unsetLineHeight().run()
              else editor.chain().focus().setLineHeight(v).run()
            }}
          >
            <option value="">Interlineado</option>
            <option value="1.5">Compacto</option>
            <option value="1.85">Normal</option>
            <option value="2.2">Amplio</option>
          </select>
        </div>

        <div className={styles.menuDivider}></div>
        <div className={styles.menuGroup}>
          <B action={() => editor.chain().focus().toggleBulletList().run()} title="Lista" label="• Lista" active={editor.isActive('bulletList')} />
          <B action={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada" label="1. Lista" active={editor.isActive('orderedList')} />
          <B action={() => editor.chain().focus().toggleBlockquote().run()} title="Cita" label="❝ Cita" active={editor.isActive('blockquote')} />
        </div>
        <div className={styles.menuDivider}></div>
        <div className={styles.menuGroup}>
          <B action={() => editor.chain().focus().setTextAlign('left').run()} title="Alinear izquierda" label="⬅" active={editor.isActive({ textAlign: 'left' })} />
          <B action={() => editor.chain().focus().setTextAlign('center').run()} title="Centrar" label="☰" active={editor.isActive({ textAlign: 'center' })} />
          <B action={() => editor.chain().focus().setTextAlign('right').run()} title="Alinear derecha" label="➡" active={editor.isActive({ textAlign: 'right' })} />
          <B action={() => editor.chain().focus().indentLess().run()} title="Reducir sangría" label="⇤" active={false} />
          <B action={() => editor.chain().focus().indentMore().run()} title="Aumentar sangría" label="⇥" active={false} />
        </div>
        <div className={styles.menuDivider}></div>
        <div className={styles.menuGroup}>
          <B action={addLink} title="Insertar enlace" label="🔗 Enlace" active={editor.isActive('link')} />
          {editor.isActive('link') && (
            <B action={() => editor.chain().focus().unsetLink().run()} title="Quitar enlace" label="🚫" active={false} />
          )}
          <button type="button" title="Insertar imagen" className={styles.menuBtn} onClick={() => fileRef.current?.click()}>
            🖼 Imagen
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => uploadImg(e.target.files[0])} />
          <B
            action={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insertar tabla"
            label="▦ Tabla"
            active={false}
          />
        </div>
        <div className={styles.menuDivider}></div>
        <div className={styles.menuGroup}>
          <B action={() => editor.chain().focus().undo().run()} title="Deshacer" label="↩" active={false} />
          <B action={() => editor.chain().focus().redo().run()} title="Rehacer" label="↪" active={false} />
          <B action={() => editor.chain().focus().setHorizontalRule().run()} title="Separador" label="—" active={false} />
          <B action={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Limpiar formato" label="✕ Formato" active={false} />
        </div>
      </div>

      {/* Segunda barra: solo visible con el cursor dentro de una tabla */}
      {inTable && (
        <div className={`${styles.menuBar} ${styles.menuBarTable}`}>
          <span className={styles.menuLabel}>Tabla</span>
          <div className={styles.menuGroup}>
            <B action={() => editor.chain().focus().addColumnBefore().run()} title="Columna a la izquierda" label="+ Col ←" active={false} />
            <B action={() => editor.chain().focus().addColumnAfter().run()} title="Columna a la derecha" label="+ Col →" active={false} />
            <B action={() => editor.chain().focus().deleteColumn().run()} title="Eliminar columna" label="− Col" active={false} />
          </div>
          <div className={styles.menuDivider}></div>
          <div className={styles.menuGroup}>
            <B action={() => editor.chain().focus().addRowBefore().run()} title="Fila arriba" label="+ Fila ↑" active={false} />
            <B action={() => editor.chain().focus().addRowAfter().run()} title="Fila abajo" label="+ Fila ↓" active={false} />
            <B action={() => editor.chain().focus().deleteRow().run()} title="Eliminar fila" label="− Fila" active={false} />
          </div>
          <div className={styles.menuDivider}></div>
          <div className={styles.menuGroup}>
            <B action={() => editor.chain().focus().toggleHeaderRow().run()} title="Fila de cabecera" label="Cabecera" active={false} />
            <B action={() => editor.chain().focus().mergeOrSplit().run()} title="Combinar o dividir celdas" label="Combinar" active={false} />
            <B action={() => editor.chain().focus().deleteTable().run()} title="Eliminar tabla" label="🗑 Tabla" active={false} />
          </div>
        </div>
      )}
    </>
  )
}

export default function RichEditor({ content, onChange, adminKey }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      TipTapImage.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: null, rel: 'noopener noreferrer' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TextStyle,
      FontSize,
      LineHeight,
      Indent,
      Highlight.configure({ multicolor: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: 'Empieza a escribir el contenido del artículo aquí...\n\nUsa la barra de herramientas para dar formato: títulos, negrita, listas, tablas, imágenes y más.'
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'irm-editor-content' },
    },
  })

  return (
    <div className={styles.editorWrap}>
      <MenuBar editor={editor} adminKey={adminKey} />
      <EditorContent editor={editor} className={styles.editorBody} />
    </div>
  )
}
