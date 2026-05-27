'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/sobre-nosotros', label: 'Sobre nosotros' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/garantias-deuda-aeat', label: 'Garantías' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/logo-irm.png"
          alt="IRM Abogados"
          width={130}
          height={75}
          className={styles.logoImg}
          priority
        />
      </Link>

      <ul className={styles.links}>
        {links.map(l => (
          <li key={l.href}>
            <Link href={l.href} className={pathname === l.href ? styles.active : ''}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/contacto" className={styles.cta}>Consulta gratuita</Link>

      <button className={styles.burger} onClick={() => setOpen(!open)} aria-label="Menú">
        <span className={open ? styles.burgerOpen : ''}></span>
        <span className={open ? styles.burgerOpen : ''}></span>
        <span className={open ? styles.burgerOpen : ''}></span>
      </button>

      {open && (
        <div className={styles.mobile}>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Cerrar">✕</button>
          {links.map(l => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? styles.mobileActive : ''}>
              {l.label}
            </Link>
          ))}
          <Link href="/contacto" className={styles.mobileCta}>Consulta gratuita</Link>
        </div>
      )}
    </nav>
  )
}
