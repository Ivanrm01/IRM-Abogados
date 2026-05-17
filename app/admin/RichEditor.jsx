'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useRef, useCallback } from 'react'
import styles from './editor.module.css'

const MenuBar = ({ editor, adminKey, onImageUpload }) => {
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
      const data = await r.json()
      if (r.ok) {
        editor.chain().focus().setImage({ src: data.url }).run()
      } else {
        alert(data.error || 'Error al subir imagen')
      }
    } catch {
      alert('Error al subir imagen')
    }
  }

  const btn = (action, title, content, active) => (
    <button
      type="button"
      onClick={action}
      title={title}
      className={`${styles.menuBtn} ${active ? styles.menuBtnActive : ''}`}
    >
      {content}
    </button>
  )

  return (
    <div className={styles.menuBar}>
      <div className={styles.menuGroup}>
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'Título H2', 'H2', editor.isActive('heading', { level: 2 }))}
        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'Título H3', 'H3', editor.isActive('heading', { level: 3 }))}
        {btn(() => editor.chain().focus().setParagraph().run(), 'Párrafo', 'P', editor.isActive('paragraph'))}
      </div>
      <div className={styles.menuDivider}></div>
      <div className={styles.menuGroup}>
        {btn(() => editor.chain().focus().toggleBold().run(), 'Negrita', <strong>B</strong>, editor.isActive('bold'))}
        {btn(() => editor.chain().focus().toggleItalic().run(), 'Cursiva', <em>I</em>, editor.isActive('italic'))}
        {btn(() => editor.chain().focus().toggleUnderline().run(), 'Subrayado', <u>U</u>, editor.isActive('underline'))}
      </div>
      <div className={styles.menuDivider}></div>
      <div className={styles.menuGroup}>
        {btn(() => editor.chain().focus().toggleBulletList().run(), 'Lista', '• Lista', editor.isActive('bulletList'))}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), 'Lista numerada', '1. Lista', editor.isActive('orderedList'))}
        {btn(() => editor.chain().focus().toggleBlockquote().run(), 'Cita', '❝', editor.isActive('blockquote'))}
      </div>
      <div className={styles.menuDivider}></div>
      <div className={styles.menuGroup}>
        {btn(() => editor.chain().focus().setTextAlign('left').run(), 'Alinear izquierda', '⬅', editor.isActive({ textAlign: 'left' }))}
        {btn(() => editor.chain().focus().setTextAlign('center').run(), 'Centrar', '☰', editor.isActive({ textAlign: 'center' }))}
        {btn(() => editor.chain().focus().setTextAlign('right').run(), 'Alinear derecha', '➡', editor.isActive({ textAlign: 'right' }))}
      </div>
      <div className={styles.menuDivider}></div>
      <div className={styles.menuGroup}>
        {btn(addLink, 'Insertar enlace', '🔗', editor.isActive('link'))}
        {editor.isActive('link') && btn(
          () => editor.chain().focus().unsetLink().run(),
          'Quitar enlace', '🚫', false
        )}
        <button
          type="button"
          title="Insertar imagen"
          className={styles.menuBtn}
          onClick={() => fileRef.current?.click()}
        >🖼</button>
        <input
          ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => uploadImg(e.target.files[0])}
        />
      </div>
      <div className={styles.menuDivider}></div>
      <div className={styles.menuGroup}>
        {btn(() => editor.chain().focus().undo().run(), 'Deshacer', '↩', false)}
        {btn(() => editor.chain().focus().redo().run(), 'Rehacer', '↪', false)}
        {btn(() => editor.chain().focus().setHorizontalRule().run(), 'Separador', '—', false)}
      </div>
    </div>
  )
}

export default function RichEditor({ content, onChange, adminKey }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Placeholder.configure({ placeholder: 'Empieza a escribir el contenido del artículo aquí...\n\nUsa los botones de la barra de herramientas para dar formato: títulos, negrita, listas, imágenes y más.' }),
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
