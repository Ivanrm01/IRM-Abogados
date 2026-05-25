import Link from 'next/link'
import styles from './garantias.module.css'

export const metadata = {
  title: 'Aplazar, Fraccionar y Suspender Deuda con Hacienda',
  description: 'Especialistas en aplazamiento, fraccionamiento y suspensión de deudas tributarias ante la AEAT. Protege tu patrimonio y evita embargos. Primera consulta gratuita.',
}

const herramientas = [
  { n:'01', t:'Aplazamiento de deuda', d:'Mueve el pago de tu deuda a una fecha futura. La AEAT acepta aplazar cuando demuestras que tu situación económica no te permite afrontarla sin poner en riesgo tu actividad o patrimonio.', cuando:'Cuando necesitas tiempo para generar liquidez pero la deuda no está en disputa. Ideal para autónomos y empresas con tesorería ajustada.' },
  { n:'02', sub:'Herramienta 02', t:'Fraccionamiento de pago', d:'Divide la deuda en cuotas periódicas. A diferencia del aplazamiento, el fraccionamiento distribuye el importe en mensualidades adaptando el pago a tu capacidad económica real.', cuando:'Cuando puedes pagar pero no de una sola vez. Permite mantener tu actividad y cumplir con Hacienda de forma escalonada.' },
  { n:'03', sub:'Herramienta 03', t:'Suspensión de la deuda', d:'Paraliza temporalmente la ejecución de la deuda mientras se tramita un recurso o reclamación. Detiene embargos y actuaciones ejecutivas mientras discutes la legalidad o el importe.', cuando:'Cuando crees que la deuda es incorrecta, excesiva o ilegal. Se usa junto a recursos de reposición o reclamaciones económico-administrativas.' },
  { n:'04', sub:'Fundamental saberlo', t:'Los plazos son críticos', d:'En derecho tributario, los plazos para actuar son muy cortos y su incumplimiento puede ser irreversible. Una vez vencido el período voluntario, Hacienda puede embargar sin previo aviso.', cuando:'Tienes entre 10 y 20 días hábiles desde la notificación para actuar, según el tipo de deuda. No esperes.' },
]

const tipos = [
  { t:'IRPF · Declaración de la Renta', d:'Deudas por liquidaciones paralelas, comprobaciones o errores en autoliquidaciones. Aplazamos o recurrimos según el caso.' },
  { t:'Impuesto sobre Sociedades', d:'Deudas derivadas de ajustes de la AEAT, gastos no deducibles o diferencias en la base imponible de personas jurídicas.' },
  { t:'IVA · Modelo 303 y 390', d:'Deudas por cuotas de IVA no ingresadas, diferencias en deducciones o regularizaciones por operaciones intracomunitarias.' },
  { t:'Inspecciones, comprobaciones, derivaciones...', d:'Representación y defensa ante cualquier actuación de la AEAT: inspecciones, comprobaciones limitadas y derivaciones de responsabilidad.' },
]

const cuando = [
  { n:'01', t:'Acabas de recibir una notificación', d:'Aún estás en plazo voluntario. Tienes margen para solicitar el aplazamiento con las mejores condiciones posibles y sin recargos adicionales.', tag:'URGENTE — actúa esta semana', tagClass:'tagRed' },
  { n:'02', t:'La deuda ha entrado en periodo ejecutivo', d:'Hacienda ya puede embargar. Todavía es posible suspender las actuaciones ejecutivas, pero el tiempo apremia.', tag:'IMPORTANTE — no esperes más', tagClass:'tagOrange' },
  { n:'03', t:'Anticipas dificultades de pago próximas', d:'Sabes que no podrás hacer frente al próximo IRPF, IVA o Sociedades. La planificación previa permite negociar desde una posición mucho más favorable.', tag:'PREVENTIVO — planifica con tiempo', tagClass:'tagGreen' },
]

const pasos = [
  { n:'1', t:'Consulta gratuita', d:'Analizamos tu caso sin coste ni compromiso.' },
  { n:'2', t:'Análisis de la deuda', d:'Revisamos la notificación, plazos y documentación.' },
  { n:'3', t:'Preparación del expediente', d:'Redactamos y presentamos la solicitud ante la AEAT.' },
  { n:'4', t:'Negociación y seguimiento', d:'Negociamos las condiciones y te mantenemos informado.' },
  { n:'5', t:'Resolución y cierre', d:'Acompañamos hasta el cierre completo del expediente.' },
]

const faqs = [
  { q:'¿Cuánto tarda en resolverse una solicitud de aplazamiento?', a:'La AEAT tiene un plazo legal de 6 meses para resolver. En la práctica, muchas resoluciones se obtienen entre 1 y 3 meses. Durante este tiempo, si la solicitud está bien presentada, Hacienda no puede iniciar actuaciones ejecutivas.' },
  { q:'¿Necesito presentar garantías para aplazar mi deuda?', a:'Para deudas inferiores a 30.000€ no es necesario aportar garantía. Por encima de ese importe, la AEAT puede exigir aval bancario, hipoteca u otras garantías reales.' },
  { q:'¿Se pueden aplazar todos los impuestos?', a:'La mayoría son aplazables: IRPF, Impuesto sobre Sociedades, IVA en ciertos casos, Transmisiones Patrimoniales, etc. Existen restricciones para el IVA repercutido, aunque hay excepciones.' },
  { q:'¿Qué ocurre si ya me han embargado la cuenta?', a:'Un embargo ya ejecutado no es irreversible. Podemos interponer recursos, solicitar la levantación aportando garantías alternativas o tramitar una solicitud de aplazamiento sobrevenida.' },
  { q:'¿Cuánto cuesta solicitar un aplazamiento con IRM?', a:'La primera consulta es siempre gratuita. Los honorarios varían según la complejidad y el importe de la deuda. Te informamos del coste exacto antes de empezar, sin sorpresas.' },
  { q:'¿Puedo solicitar aplazamiento si ya tengo deudas anteriores?', a:'Tener deudas anteriores no impide solicitar uno nuevo, pero puede afectar a las condiciones. En estos casos es especialmente importante presentar una solicitud bien argumentada.' },
]

export default function GarantiasPage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.heroBg}>AEAT</div>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.breadcrumb}>Inicio <span>/ Garantías tributarias</span></div>
            <div className={styles.alert}>¿Has recibido una notificación de Hacienda? Actúa antes de que sea tarde</div>
            <h1 className={styles.heroTitle}>Aplaza, fracciona<br />o suspende tu<br /><em>deuda con Hacienda</em></h1>
            <p className={styles.heroDesc}>Cuando recibes una deuda tributaria, tienes derechos que muchos desconocen.  En IRM Abogados ofrecemos soluciones seguras y legales para aplazar, fraccionar o suspender deudas tributarias mediante garantías inmobiliarias conforme a la normativa vigente.</p>
            <div className={styles.heroBtns}>
              <Link href="/contacto" className="btn-gold">SOLICITAR CONSULTA</Link>
              <a href="#herramientas" className="btn-ghost">¿CÓMO FUNCIONA?</a>
            </div>
          </div>
          <div className={styles.urgencyCard}>
            <div className={styles.urgencyTitle}>¿Estás en alguna de estas situaciones?</div>
            <ul className={styles.urgencyList}>
              <li>Has recibido una liquidación o sanción de la AEAT</li>
              <li>No puedes pagar el importe de golpe</li>
              <li>Temes un embargo de cuentas o bienes</li>
              <li>Tienes una reclamación o recurso pendiente</li>
              <li className={styles.urgencyOk}>Podemos ayudarte. Primera consulta gratuita.</li>
            </ul>
            <Link href="/contacto" className={styles.urgencyCta}>HABLAR CON UN ABOGADO AHORA</Link>
          </div>
        </div>
      </section>

      {/* HERRAMIENTAS */}
      <section className={styles.herramientasSection} id="herramientas">
        <div className={styles.eyebrow}>Las tres herramientas clave</div>
        <h2 className={styles.sectionTitle}>¿Qué es el aplazamiento, el fraccionamiento<br />y la <em>suspensión de deuda</em>?</h2>
        <p className={styles.sectionIntro}>La AEAT no solo recauda: también tiene mecanismos legales que permiten a los contribuyentes gestionar sus deudas de forma ordenada. Conocerlos y usarlos correctamente marca la diferencia entre proteger tu patrimonio o perderlo.</p>
        <div className={styles.herramientasGrid}>
          {herramientas.map(h => (
            <div key={h.n} className={styles.herramientaCard}>
              <div className={styles.hNum}>{h.n}</div>
              <div className={styles.hSub}>{h.sub}</div>
              <h3 className={styles.hTitle}>{h.t}</h3>
              <p className={styles.hDesc}>{h.d}</p>
              <div className={styles.hCuando}>
                <div className={styles.hCuandoLabel}>Cuándo se usa</div>
                <div className={styles.hCuandoText}>{h.cuando}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIPOS */}
      <section className={styles.tiposSection}>
        <div className={styles.eyebrow2}>¿Qué deudas gestionamos?</div>
        <h2 className={styles.sectionTitleLight}>Resolvemos todo tipo de<br /><em>deudas tributarias</em></h2>
        <div className={styles.tiposGrid}>
          {tipos.map(t => (
            <div key={t.t} className={styles.tipoCard}>
              <h3 className={styles.tipoTitle}>{t.t}</h3>
              <p className={styles.tipoDesc}>{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CUÁNDO ACTUAR */}
      <section className={styles.cuandoSection}>
        <div className={styles.eyebrow}>Urgencia de actuación</div>
        <h2 className={styles.sectionTitle}>¿En qué momento debes <em>contactarnos</em>?</h2>
        <div className={styles.cuandoGrid}>
          {cuando.map(c => (
            <div key={c.n} className={styles.cuandoCard}>
              <div className={styles.cuandoNum}>{c.n}</div>
              <h3 className={styles.cuandoTitle}>{c.t}</h3>
              <p className={styles.cuandoDesc}>{c.d}</p>
              <span className={`${styles.cuandoTag} ${styles[c.tagClass]}`}>{c.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESO */}
      <section className={styles.procesoSection}>
        <div className={styles.eyebrow}>Cómo trabajamos</div>
        <h2 className={styles.sectionTitle}>El proceso paso a paso,<br /><em>sin complicaciones</em></h2>
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

      {/* SIN ASESORAMIENTO / CON IRM */}
      <section className={styles.comparativaSection}>
        <div className={styles.comparativaInner}>
          <div className={styles.eyebrow}>Por qué IRM</div>
          <h2 className={styles.sectionTitle}>Lo que cambia con<br /><em>asesoramiento especializado</em></h2>
        </div>
        <div className={styles.comparativaGrid}>
          <div className={styles.boxRed}>
            <div className={styles.boxRedTitle}>Sin asesoramiento especializado, te arriesgas a:</div>
            <ul className={styles.boxList}>
              {['Embargo de cuentas bancarias sin previo aviso','Embargo de nómina o pensión','Anotación de embargo sobre inmuebles','Recargos del 5%, 10% o 20% sobre la deuda original','Intereses de demora acumulados','Declaración de responsabilidad solidaria o subsidiaria'].map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div className={styles.boxGreen}>
            <div className={styles.boxGreenTitle}>Con IRM Tax & Legal puedes conseguir:</div>
            <ul className={styles.boxList2}>
              {['Paralizar cualquier embargo en curso','Pagar en cómodas cuotas mensuales','Reducir o anular sanciones improcedentes','Suspender la deuda mientras se recurre','Negociar condiciones favorables con la AEAT','Proteger tu patrimonio y el de tu empresa'].map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <div className={styles.eyebrow}>Preguntas frecuentes</div>
        <h2 className={styles.sectionTitle}>Todo lo que necesitas saber sobre<br /><em>aplazamientos y garantías</em></h2>
        <div className={styles.faqGrid}>
          {faqs.map((f, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.faqQ}>{f.q}<span className={styles.faqIcon}>+</span></summary>
              <div className={styles.faqA}>{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaLeft}>
          <div className={styles.ctaEyebrow}>Primera consulta gratuita</div>
          <div className={styles.ctaTitle}>¿Tienes una deuda<br />con Hacienda?<br />Cuéntanos tu caso</div>
          <p className={styles.ctaDesc}>Analizamos tu situación sin coste y te decimos exactamente qué opciones tienes. Te respondemos en menos de 24 horas.</p>
          <div className={styles.ctaBtns}>
            <a href="mailto:correo@irmabogados.es" className="btn-navy">Enviar consulta</a>
            <a href="tel:+34614149465" className="btn-outline-navy">Llamar ahora</a>
          </div>
        </div>
        <div className={styles.ctaRight}>
          {[{icon:'📞',label:'Teléfono',value:'+34 614 149 465',href:'tel:+34614149465'},{icon:'✉️',label:'Email',value:'correo@irmabogados.es',href:'mailto:correo@irmabogados.es'},{icon:'📍',label:'Sedes',value:'Madrid · Castellón · Online',href:'/contacto'}].map(c => (
            <div key={c.label} className={styles.ctaContactRow}>
              <div className={styles.ctaIcon}>{c.icon}</div>
              <div><div className={styles.ctaLabel}>{c.label}</div><a href={c.href} className={styles.ctaValue}>{c.value}</a></div>
            </div>
          ))}
          <div className={styles.badge}><div className={styles.badgeDot}></div>Respondemos en menos de 24 horas · Consulta siempre gratuita</div>
        </div>
      </section>
    </>
  )
}
