import Link from 'next/link'
import styles from './page.module.css'

export const metadata = {
  title: 'Sobre Nosotros | Abogados Fiscalistas Madrid y Castellón',
  description: 'Conoce al equipo de IRM Tax & Legal, despacho especializado en derecho tributario. Compromiso, excelencia y tarifas transparentes.',
}

export default function SobreNosotrosPage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.heroBg}>IRM</div>
        <div className={styles.breadcrumb}>Inicio <span>/ Sobre nosotros</span></div>
        <div className="eyebrow">Sobre nosotros</div>
        <h1>Derecho fiscal con<br /><em>precisión</em> y compromiso</h1>
        <p className={styles.heroDesc}>Somos un equipo joven y especializado en derecho tributario y mercantil. Acompañamos a personas y empresas con rigor técnico, transparencia y un trato cercano que marca la diferencia.</p>
        <div className={styles.heroStats}>
          {[['2','Sedes en España'],['100%','Especialización fiscal'],['24h','Tiempo de respuesta'],['0€','Primera consulta']].map(([n,l]) => (
            <div key={l} className={styles.stat}><div className={styles.statN}>{n}</div><div className={styles.statL}>{l}</div></div>
          ))}
        </div>
      </section>

      {/* PILARES */}
      <section className={`section ${styles.pilares}`}>
        <div className="eyebrow">Nuestra filosofía</div>
        <h2>Tres pilares que <em>nos definen</em></h2>
        <div className={styles.pilaresGrid}>
          {[
            { n:'01', t:'Compromiso', d:'Nos involucramos en cada caso como si fuera el nuestro. Tu problema fiscal es nuestro problema, y trabajamos hasta encontrar la mejor solución dentro de la legalidad vigente.' },
            { n:'02', t:'Excelencia', d:'Un equipo altamente cualificado con formación especializada. La actualización constante en derecho tributario nos permite ofrecerte siempre las mejores estrategias fiscales.' },
            { n:'03', t:'Tarifas transparentes', d:'Conoces el coste antes de empezar. Sin sorpresas, sin letra pequeña. La transparencia en los honorarios es la base de una relación profesional duradera.' },
          ].map(p => (
            <div key={p.n} className={styles.pilarCard}>
              <div className={styles.pilarNum}>{p.n}</div>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIFERENCIAL */}
      <section className={styles.diferencial}>
        <div className={styles.difContent}>
          <div className="eyebrow">Por qué elegirnos</div>
          <h2>Lo que nos hace <em>diferentes</em></h2>
          <div className={styles.difList}>
            {[
              { t:'Especialización exclusiva en derecho fiscal', d:'No somos un despacho generalista. El derecho tributario es lo que hacemos y lo que sabemos hacer mejor.' },
              { t:'Acceso directo a tu abogado', d:'Sin intermediarios. Hablas directamente con el abogado responsable de tu caso desde el primer día.' },
              { t:'Presencia en Madrid y Castellón', d:'Dos sedes y atención online para clientes de cualquier punto de España.' },
              { t:'Primera consulta sin coste', d:'Te contamos si podemos ayudarte y cómo antes de que tomes ninguna decisión.' },
            ].map((d,i) => (
              <div key={i} className={styles.difItem}>
                <div className={styles.difMark}>✓</div>
                <div><div className={styles.difTit}>{d.t}</div><div className={styles.difDesc}>{d.d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.difVisual}>
          {[['2','Sedes en España'],['100%','Especialización fiscal'],['24h','Respuesta garantizada'],['0€','Consulta inicial']].map(([n,l]) => (
            <div key={l} className={styles.difCell}><div className={styles.difCellN}>{n}</div><div className={styles.difCellL}>{l}</div></div>
          ))}
        </div>
      </section>

      {/* SEDES */}
      <section className={`section ${styles.sedes}`}>
        <div className="eyebrow">Dónde estamos</div>
        <h2 style={{color:'var(--white)'}}>Nuestras <em>sedes</em></h2>
        <div className={styles.sedesGrid}>
          {[
            { city:'Madrid', tag:'Sede principal', addr:'C/ José Ortega y Gasset, 84 — 2º C · 28006 Madrid' },
            { city:'Castellón', tag:'Sede Levante', addr:'C/ En Medio, 22 — 6º · 12001 Castellón de la Plana' },
          ].map(s => (
            <div key={s.city} className={styles.sedeCard}>
              <div className={styles.sedeTag}>{s.tag}</div>
              <div className={styles.sedeCity}>{s.city}</div>
              <p className={styles.sedeAddr}>{s.addr}</p>
              <p className={styles.sedePhone}>+34 614 149 465</p>
              <p className={styles.sedeEmail}>correo@irmabogados.es</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaTitle}>¿Hablamos sobre<br />tu situación fiscal?</div>
        <p className={styles.ctaDesc}>Primera consulta gratuita y sin compromiso. Respondemos en menos de 24 horas.</p>
        <div className={styles.ctaBtns}>
          <Link href="/contacto" className="btn-navy">Enviar consulta</Link>
          <a href="tel:+34614149465" className="btn-outline-navy">Llamar ahora</a>
        </div>
      </section>
    </>
  )
}
