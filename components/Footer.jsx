import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'
import { Phone, Mail, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topline}></div>

      {/* CTA STRIP */}
      <div className={styles.cta}>
        <div>
          <div className={styles.ctaTag}>Primera consulta gratuita</div>
          <div className={styles.ctaTitle}>¿Tienes una duda fiscal?<br /><em>Cuéntanos tu caso</em></div>
        </div>
        <div className={styles.ctaBtns}>
          <Link href="/contacto" className="btn-gold">Consultar ahora</Link>
          <a href="tel:+34614149465" className={styles.btnPhone}>+34 614 149 465</a>
        </div>
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {/* MARCA */}
        <div>
          <Link href="/" className={styles.brandName}>
            <Image
              src="/logo-irm.png"
              alt="IRM Abogados"
              width={160}
              height={93}
              className={styles.footerLogo}
            />
          </Link>
          <p className={styles.tagline}>Especialistas en derecho tributario con sedes en Madrid y Castellón. Compromiso, excelencia y transparencia en cada caso.</p>
          <div className={styles.contactMini}>
            <a href="tel:+34614149465" className={styles.contactItem}>
              <span className={styles.contactIcon}><Phone size={16} strokeWidth={1.5} color="#B8975A" /></span>
              <span>+34 614 149 465</span>
            </a>
            <a href="mailto:correo@irmabogados.es" className={styles.contactItem}>
              <span className={styles.contactIcon}><Mail size={16} strokeWidth={1.5} color="#B8975A" /></span>
              <span>correo@irmabogados.es</span>
            </a>
            <a href="https://wa.me/34614149465" className={styles.contactItem}>
              <span className={styles.contactIcon}><MessageCircle size={16} strokeWidth={1.5} color="#B8975A" /></span>
              <span>WhatsApp</span>
            </a>
          </div>
          <div className={styles.social}>
            <a href="https://www.instagram.com/irmabogados/" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/irm-abogados-asesores" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://www.facebook.com/irmabogados/" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        {/* SERVICIOS */}
        <div>
          <div className={styles.colTitle}>Servicios</div>
          <ul className={styles.linkList}>
            <li><Link href="/fiscal">Fiscal</Link></li>
            <li><Link href="/asesoramiento-start-ups">Start-Ups</Link></li>
            <li><Link href="/garantias-deuda-aeat">Garantías AEAT</Link></li>
            <li><Link href="/fiscal#irpf">IRPF</Link></li>
            <li><Link href="/fiscal#sociedades">Impuesto Sociedades</Link></li>
            <li><Link href="/fiscal#iva">IVA</Link></li>
            <li><Link href="/fiscal#defensa">Defensa ante AEAT</Link></li>
            <li><Link href="/derivaciones-responsabilidad-tributaria#derivacion">Derivación responsabilidad</Link></li>
          </ul>
        </div>

        {/* DESPACHO */}
        <div>
          <div className={styles.colTitle}>Despacho</div>
          <ul className={styles.linkList}>
            <li><Link href="/sobre-nosotros">Sobre nosotros</Link></li>
            <li><Link href="/blog">Blog fiscal</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
          </ul>
          <div className={styles.horario}>
            <div className={styles.colTitle} style={{marginTop:'28px'}}>Horario</div>
            <p>Lunes a viernes<br />8:00 – 14:00 · 16:00 – 19:00</p>
            <span>También online para toda España</span>
          </div>
        </div>

        {/* SEDES */}
        <div>
          <div className={styles.colTitle}>Nuestras sedes</div>
          <div className={styles.sede}>
            <div className={styles.sedeCity}>Madrid</div>
            <div className={styles.sedeAddr}>C/ José Ortega y Gasset, 84 — 2º C<br />28006 Madrid</div>
            <a href="https://www.google.com/maps/place//data=!4m2!3m1!1s0xd422998a9854829:0x8b1b5bcd693ee257?sa=X&ved=1t:8290&ictx=111" target="_blank" rel="noopener noreferrer" className={styles.sedeMap}>Ver en mapa →</a>
          </div>
          <div className={styles.sede}>
            <div className={styles.sedeCity}>Castellón</div>
            <div className={styles.sedeAddr}>C/ En Medio, 22 — 6º<br />12001 Castellón de la Plana</div>
            <a href="https://www.google.com/maps/place//data=!4m2!3m1!1s0xd5fff3b9b2f08b7:0xb24b628bcb10cb3?sa=X&ved=1t:8290&ictx=111" target="_blank" rel="noopener noreferrer" className={styles.sedeMap}>Ver en mapa →</a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className={styles.bottom}>
        <div className={styles.copy}>© {new Date().getFullYear()} IRM Abogados. Todos los derechos reservados.</div>
        <div className={styles.legal}>
          <Link href="/aviso-legal">Aviso legal</Link>
          <Link href="/politica-de-privacidad">Política de privacidad</Link>
          <Link href="/politica-de-cookies">Política de cookies</Link>
        </div>
        <div className={styles.badge}>Madrid · Castellón · España</div>
      </div>
    </footer>
  )
}
