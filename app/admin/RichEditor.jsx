'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapImage from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useRef } from 'react'
import styles from './editor.module.css'
import './editor-global.css'

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

  return (
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
      </div>
      <div className={styles.menuDivider}></div>
      <div className={styles.menuGroup}>
        <B action={() => editor.chain().focus().undo().run()} title="Deshacer" label="↩" active={false} />
        <B action={() => editor.chain().focus().redo().run()} title="Rehacer" label="↪" active={false} />
        <B action={() => editor.chain().focus().setHorizontalRule().run()} title="Separador" label="—" active={false} />
      </div>
    </div>
  )
}

export default function RichEditor({ content, onChange, adminKey }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      TipTapImage.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Placeholder.configure({
        placeholder: 'Empieza a escribir el contenido del artículo aquí...\n\nUsa la barra de herramientas para dar formato: títulos, negrita, listas, imágenes y más.'
      }),
    ],
    content: content || '',
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
