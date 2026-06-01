import Link from 'next/link'
import { User, Briefcase, Activity } from 'lucide-react'
import styles from './servicios.module.css'

export const metadata = {
  title: 'Servicios | Asesoramiento Fiscal y Tributario',
  description: 'Servicios de derecho fiscal y tributario para empresas y particulares. Especialistas en IRPF, Sociedades, IVA, start-ups y garantías ante la AEAT.',
}

const servicios = [
  {
    num: '01', href: '/fiscal',
    title: 'Fiscal',
    desc: 'Asesoramiento tributario integral para personas físicas y jurídicas. Planificación fiscal, declaraciones, optimización de la carga impositiva y defensa ante la AEAT.',
    tags: ['IRPF', 'Sociedades', 'IVA', 'Patrimonio', 'Sucesiones', 'Defensa AEAT'],
  },
  {
    num: '02', href: '/asesoramiento-start-ups',
    title: 'Start-Ups',
    desc: 'Asesoramiento legal y fiscal integral para nuevas empresas y emprendedores. Desde la idea hasta la ronca de inversión, cubriendo todas las etapas de crecimiento.',
    tags: ['Constitución', 'Pacto de socios', 'ESOP', 'Due diligence', 'Inversión'],
  },
  {
    num: '03', href: '/garantias-deuda-aeat',
    title: 'Garantías tributarias',
    desc: 'Aplazamiento, fraccionamiento y suspensión de deudas ante la AEAT. Protegemos tu patrimonio y paralizamos procedimientos ejecutivos mientras defendemos tu caso.',
    tags: ['Aplazamiento', 'Fraccionamiento', 'Suspensión', 'Embargos', 'AEAT'],
  },
]

const perfiles = [
  { icon: '👤', title: 'Particulares', items: ['Declaraciones de la Renta', 'Planificación patrimonial', 'Planificación fiscal de herencias y donaciones', 'Gestión fiscal de activos digitales y criptomonedas'] },
  { icon: '💼', title: 'Empresas y PYMEs', items: ['Impuesto sobre Sociedades', 'IVA e impuestos indirectos', 'Operaciones de reestructuración', 'Consolidación fiscal y grupos fiscales', 'Operaciones con no residentes'] },
  { icon: '🚀', title: 'Start-Ups', items: ['Constitución y estructura societaria', 'Pacto de socios', 'Due diligence fiscal', 'Rondas de inversión'] },
]

const pasos = [
  { n:'1', t:'Consulta inicial gratuita', d:'Analizamos tu caso sin coste y te decimos qué podemos hacer por ti.' },
  { n:'2', t:'Propuesta y honorarios', d:'Te presentamos la estrategia y el coste exacto. Sin sorpresas.' },
  { n:'3', t:'Ejecución y seguimiento', d:'Gestionamos todo y te mantenemos informado en cada momento.' },
  { n:'4', t:'Resolución y acompañamiento final', d:'Te explicamos el resultado obtenido y cómo actuar después.' },
]

export default function ServiciosPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.heroBg}>LEX</div>
        <div className={styles.breadcrumb}>Inicio <span>/ Servicios</span></div>
        <div className={styles.eyebrow}>Nuestros servicios</div>
        <h1 className={styles.heroTitle}>Soluciones fiscales<br /><em>a medida</em> para cada caso</h1>
        <p className={styles.heroDesc}>Cada cliente tiene una situación única. Nuestro enfoque siempre parte del análisis detallado de tu caso para ofrecerte la estrategia fiscal más eficiente y segura dentro del marco legal.</p>
      </section>

      <section className={styles.serviciosSection}>
        <div className={styles.eyebrow2}>Áreas de especialización</div>
        <h2 className={styles.sectionTitle}>Todo lo que <em>necesitas</em>,<br />bajo un mismo techo</h2>
        <p className={styles.sectionIntro}>Concentramos nuestra práctica en tres áreas donde la especialización marca la diferencia. Nuestra especialización aporta un valor real, con resultados medibles. </p>
        <div className={styles.serviciosGrid}>
          {servicios.map(s => (
            <Link key={s.href} href={s.href} className={styles.servicioCard}>
              <div className={styles.scNum}>{s.num}</div>
              <h3 className={styles.scTitle}>{s.title}</h3>
              <p className={styles.scDesc}>{s.desc}</p>
              <div className={styles.scTags}>{s.tags.map(t => <span key={t} className={styles.scTag}>{t}</span>)}</div>
              <span className={styles.scCta}>Ver servicio completo →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.paraQuien}>
        <div className={styles.eyebrow2} style={{color:'var(--gold)'}}>Para quién</div>
        <h2 className={styles.sectionTitleLight}>Trabajamos con <em>todo tipo</em> de clientes</h2>
        <p className={styles.pqIntro}>Tanto si eres particular, autónomo o empresa, tenemos el servicio que necesitas. La especialización fiscal nos permite atender con la misma excelencia perfiles muy distintos.</p>
        <div className={styles.pqGrid}>
          {perfiles.map(p => (
            <div key={p.title} className={styles.pqCard}>
              <div className={styles.pqIcon}>
                {p.icon === '👤' && <User size={28} strokeWidth={1.5} color="#B8975A" />}
                {p.icon === '💼' && <Briefcase size={28} strokeWidth={1.5} color="#B8975A" />}
                {p.icon === '🚀' && <Activity size={28} strokeWidth={1.5} color="#B8975A" />}
              </div>
              <h3 className={styles.pqTitle}>{p.title}</h3>
              <ul className={styles.pqList}>{p.items.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.proceso}>
        <div className={styles.eyebrow2}>Cómo trabajamos</div>
        <h2 className={styles.sectionTitle}>Un proceso <em>claro</em> desde el primer día</h2>
        <p className={styles.procesoDesc}>Sabemos que hablar con un abogado puede generar dudas. Por eso hemos diseñado un proceso donde siempre sabes en qué paso estás.</p>
        <div className={styles.pasos}>
          {pasos.map(p => (
            <div key={p.n} className={styles.paso}>
              <div className={styles.pasoCircle}>{p.n}</div>
              <h3 className={styles.pasoTitle}>{p.t}</h3>
              <p className={styles.pasoDesc}>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div>
          <div className={styles.ctaTitle}>¿No encuentras el servicio que necesitas?</div>
          <div className={styles.ctaDesc}>Cuéntanos tu caso y te decimos si podemos ayudarte. Sin compromiso.</div>
        </div>
        <div className={styles.ctaBtns}>
          <Link href="/contacto" className="btn-navy">SOLICITAR CONSULTA</Link>
          <a href="tel:+34614149465" className="btn-outline-navy">HABLAR CON UN EXPERTO</a>
        </div>
      </section>
    </>
  )
}
