import Link from 'next/link'
import styles from './page.module.css'
import { Gavel, Rocket, Shield } from 'lucide-react'

export const metadata = {
  title: 'IRM Abogados | Abogados Fiscalistas Madrid y Castellón',
  description: 'Especialistas en derecho fiscal y tributario. Asesoramiento para empresas y particulares. Primera consulta gratuita.',
}

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.heroBg}>IRM</div>
        <div className={styles.heroLeft}>
          <div className={styles.heroEyebrow}>Abogados fiscalistas · Madrid &amp; Castellón</div>
          <h1 className={styles.heroTitle}>Tu defensa<br />ante <em>Hacienda</em><br />en manos expertas</h1>
          <p className={styles.heroDesc}>Especialistas en derecho tributario. Optimizamos tu carga fiscal, protegemos tu patrimonio y te acompañamos ante cualquier procedimiento de la AEAT.</p>
          <div className={styles.heroBtns}>
            <Link href="/contacto" className="btn-gold">Consulta gratuita</Link>
            <Link href="/servicios" className="btn-ghost">Ver servicios</Link>
          </div>
        </div>
        <div className={styles.heroRight}>
          {[
            { icon: 'fiscal', title: 'Asesoramiento fiscal integral', desc: 'Optimización tributaria, planificación patrimonial y defensa ante inspecciones.', href: '/fiscal' },
            { icon: 'garantias', title: 'Garantías ante la AEAT', desc: 'Aplaza, fracciona o suspende tu deuda. Paralizamos embargos.', href: '/garantias-deuda-aeat' },
            { icon: 'startups', title: 'Asesoramiento a Start-Ups', desc: 'Desde la constitución hasta la ronda de inversión. Escala sin riesgos legales.', href: '/asesoramiento-start-ups' },
          ].map(c => (
            <div key={c.href} className={styles.heroCard}>
              <div className={styles.heroCardIcon}>
                {c.icon === 'fiscal' && c.title.includes('Fiscal') && <Gavel size={24} strokeWidth={1.5} color="#B8975A" />}
                {c.icon === 'garantias' && c.title.includes('Garantías') && <Shield size={24} strokeWidth={1.5} color="#B8975A" />}
                {c.icon === 'startups' && <Rocket size={24} strokeWidth={1.5} color="#B8975A" />}
              </div>
              <div className={styles.heroCardTitle}>{c.title}</div>
              <div className={styles.heroCardDesc}>{c.desc}</div>
              <Link href={c.href} className={styles.heroCardLink}>Ver servicio →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ÁREAS */}
      <section className={`section ${styles.areas}`}>
        <div className="eyebrow">Áreas de práctica</div>
        <h2>Especialización que<br /><em>genera resultados</em></h2>
        <p className="section-intro">No somos un despacho generalista. Concentramos toda nuestra energía en el derecho fiscal y tributario porque creemos que la especialización profunda es la única forma de ofrecer el mejor resultado posible a nuestros clientes.</p>
        <div className={styles.areasGrid}>
          {[
            { num: '01', title: 'Fiscal', desc: 'Asesoramiento tributario integral para personas físicas y empresas. IRPF, Sociedades, IVA, Patrimonio, Sucesiones y defensa ante inspecciones y procedimientos.', href: '/fiscal' },
            { num: '02', title: 'Start-Ups', desc: 'Acompañamiento legal integral para nuevas empresas. Constitución societaria, pactos de socios, fiscalidad de la inversión, ESOPs y preparación para rondas de financiación.', href: '/asesoramiento-start-ups' },
            { num: '03', title: 'Garantías tributarias', desc: 'Aplazamiento, fraccionamiento y suspensión de deudas ante la AEAT. Paralización de embargos y defensa ejecutiva.', href: '/garantias-deuda-aeat' },
          ].map(a => (
            <Link key={a.href} href={a.href} className={styles.areaCard}>
              <div className={styles.areaNum}>{a.num}</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
              <span className={styles.areaMore}>Saber más →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* POR QUÉ */}
      <section className={styles.porque}>
        <div className={styles.porqueLeft}>
          <div className="eyebrow">Por qué IRM Abogados</div>
          <h2 style={{color:'var(--white)'}}>Cuatro razones para<br /><em>elegirnos</em></h2>
          <p style={{color:'rgba(255,255,255,.55)',fontSize:'15px',fontWeight:300,lineHeight:1.85,marginBottom:'40px',maxWidth:'440px'}}>Llevamos años acompañando a personas y empresas en sus decisiones fiscales más importantes. Estas son las razones por las que nuestros clientes siguen contando con nosotros.</p>
          {[
            { t: 'Especialización exclusiva', d: 'Solo derecho fiscal. Esa concentración se traduce en resultados superiores.' },
            { t: 'Respuesta en 24 horas', d: 'En derecho fiscal los plazos son críticos. Nunca te dejamos esperando.' },
            { t: 'Tarifas transparentes', d: 'Conoces el coste exacto antes de empezar. Sin sorpresas ni letra pequeña.' },
            { t: 'Trato directo', d: 'Hablas siempre con el abogado responsable, no con intermediarios.' },
           ].map((i, k) => (
            <div key={k} className={styles.porqueItem}>
                <div className={styles.porqueBox}>0{k + 1}</div>
              <div>
                <div className={styles.porqueTit}>{i.t}</div>
                <div className={styles.porqueDesc}>{i.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.porqueRight}>
          {[['2','Sedes en España'],['100%','Especialización fiscal'],['24h','Tiempo de respuesta'],['0€','Primera consulta']].map(([n,l]) => (
            <div key={l} className={styles.statBox}>
              <div className={styles.statN}>{n}</div>
              <div className={styles.statL}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div>
          <div className={styles.ctaTitle}>¿Hablamos sobre<br />tu situación fiscal?</div>
          <div className={styles.ctaDesc}>Primera consulta gratuita y sin compromiso. Respondemos en menos de 24 horas.</div>
        </div>
        <div className={styles.ctaBtns}>
          <Link href="/contacto" className="btn-navy">SOLICITAR CONSULTA</Link>
          <a href="tel:+34614149465" className="btn-outline-navy">HABLAR CON UN EXPERTO</a>
        </div>
      </section>
    </>
  )
}
