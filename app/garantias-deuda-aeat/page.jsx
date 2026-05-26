import Link from 'next/link'
import styles from './garantias.module.css'

export const metadata = {
  title: 'Aplazar, Fraccionar y Suspender Deuda con Hacienda',
  description: 'Especialistas en aplazamiento, fraccionamiento y suspensión de deudas tributarias ante la AEAT. Protege tu patrimonio y evita embargos. Primera consulta gratuita.',
}

const herramientas = [
  { n:'01', t:'Aplazamiento de deuda', d:'El aplazamiento permite mover el pago de tu deuda tributaria a una fecha futura. La AEAT acepta aplazar la deuda cuando demuestras que tu situación económica no te permite afrontarla en el plazo voluntario.', cuando:'Cuando necesitas tiempo para generar liquidez pero la deuda no está en disputa. Ideal para autónomos y empresas con tesorería ajustada.' },
  { n:'02', t:'Fraccionamiento de deuda', d:'El fraccionamiento divide la deuda en cuotas periódicas. A diferencia del aplazamiento, el fraccionamiento distribuye el importe en mensualidades, adaptando el pago a tu capacidad económica real.', cuando:'Cuando puedes pagar pero no de una sola vez. Permite mantener tu actividad económica y cumplir con Hacienda de forma escalonada.' },
  { n:'03', t:'Suspensión de la deuda', d:'La suspensión paraliza temporalmente la ejecución de la deuda mientras se tramita un recurso o reclamación. Es la herramienta más potente: detiene embargos y actuaciones ejecutivas de la AEAT mientras discutes la legalidad o el importe de la deuda.', cuando:'Cuando crees que la deuda es incorrecta, excesiva o ilegal. Se usa junto a recursos de reposición, reclamaciones económico-administrativas o recursos judiciales.' },
  { n:'04', sub:'Fundamental saberlo', t:'Los plazos son críticos', d:'En derecho tributario, los plazos para actuar son muy cortos y su incumplimiento puede ser irreversible. Una vez vencido el período voluntario, Hacienda puede embargar.', cuando:'Tienes entre 10 y 20 días hábiles desde la notificación para actuar, según el tipo de deuda. No esperes.' },
]

const tipos = [
  { t:'IRPF', d:'Deudas por liquidaciones paralelas, comprobaciones de IRPF o errores en autoliquidaciones. Aplazamos o recurrimos según el caso.​' },
  { t:'Impuesto sobre Sociedades', d:'Deudas derivadas de ajustes de la AEAT, gastos no deducibles o diferencias en la base imponible de personas jurídicas.' },
  { t:'IVA', d:'Deudas por cuotas de IVA no ingresadas, diferencias en deducciones o regularizaciones de la AEAT.' },
  { t:'Inspecciones, comprobaciones, derivaciones...', d:'Representación y defensa ante inspecciones, comprobaciones limitadas y procedimientos de derivación de responsabilidad tributaria.' },
]

const cuando = [
  { n:'01', t:'Acabas de recibir una notificación de Hacienda', d:'Aún estás en plazo voluntario. Tienes margen para solicitar el aplazamiento o fraccionamiento con las mejores condiciones posibles y sin recargos adicionales.', tag:'URGENTE — actúa esta semana', tagClass:'tagRed' },
  { n:'02', t:'La deuda ha entrado en período ejecutivo', d:'Hacienda ya puede embargar. Todavía es posible suspender las actuaciones ejecutivas con garantías adecuadas o impugnando el procedimiento, pero el tiempo apremia.', tag:'IMPORTANTE — no esperes más', tagClass:'tagOrange' },
  { n:'03', t:'Anticipas dificultades de pago próximas', d:'Sabes que no podrás hacer frente al próximo IRPF, IVA o cuota de Sociedades. La planificación previa permite negociar desde una posición mucho más favorable.', tag:'PREVENTIVO — planifica con tiempo', tagClass:'tagGreen' },
]

const pasos = [
  { n:'1', t:'Consulta gratuita', d:'Analizamos tu caso sin coste ni compromiso y te decimos exactamente qué opciones tienes.' },
  { n:'2', t:'Análisis de la deuda', d:'Revisamos la notificación, los plazos y la documentación para definir la mejor estrategia.' },
  { n:'3', t:'Preparación del expediente', d:'Redactamos y presentamos la solicitud ante la AEAT con todos los justificantes necesarios.' },
  { n:'4', t:'Negociación y seguimiento', d:'Negociamos las condiciones con la AEAT y te mantenemos informado en cada etapa del proceso.' },
  { n:'5', t:'Resolución y cierre', d:'Obtenemos la resolución favorable y te acompañamos hasta el cierre completo del expediente.' },
]

const faqs = [
  { q:'¿Cuánto tarda en resolverse una solicitud de aplazamiento?', a:'La AEAT tiene un plazo legal de 6 meses para resolver las solicitudes de aplazamiento y fraccionamiento. En la práctica, muchas resoluciones se obtienen entre 1 y 3 meses. Durante este tiempo, si la solicitud está bien presentada, Hacienda no puede iniciar actuaciones ejecutivas, lo que protege tu patrimonio mientras se tramita.' },
  { q:'¿Necesito presentar garantías para aplazar mi deuda?', a:'Depende del importe. Para deudas inferiores a 50.000 € no es necesario aportar garantía alguna. Por encima de ese importe, la AEAT puede exigir un aval bancario, hipoteca, seguro de caución u otras garantías reales. Existen fórmulas alternativas en casos de insuficiencia patrimonial que podemos gestionar para ti.' },
  { q:'¿Se pueden aplazar todos los impuestos?', a:'La mayoría de impuestos son aplazables: IRPF, Impuesto sobre Sociedades, IVA en ciertos casos, Transmisiones Patrimoniales, etc. Existen restricciones para el IVA repercutido, aunque hay excepciones. La suspensión de deuda, sin embargo, aplica a cualquier deuda mientras exista un recurso o reclamación en curso.' },
  { q:'¿Qué ocurre si ya me han embargado la cuenta?', a:'Un embargo ya ejecutado no es irreversible. Podemos interponer recursos contra el procedimiento ejecutivo si existen defectos formales o de fondo, solicitar la levantación del embargo aportando garantías alternativas, o tramitar una solicitud de aplazamiento sobrevenida que paralice nuevos embargos. Actuar rápido es esencial.' },
  { q:'¿Cuánto cuesta solicitar un aplazamiento con IRM?', a:'La primera consulta es siempre gratuita. Los honorarios por la gestión completa del aplazamiento o fraccionamiento varían según la complejidad del caso y el importe de la deuda. Te informamos del coste exacto antes de empezar, sin sorpresas. Nuestras tarifas son transparentes y proporcionales al servicio prestado.' },
  { q:'¿Puedo solicitar aplazamiento si ya tengo deudas anteriores?', a:'Tener deudas anteriores no impide solicitar un nuevo aplazamiento, pero sí puede afectar a las condiciones que la AEAT esté dispuesta a conceder. En estos casos es especialmente importante presentar una solicitud bien argumentada que demuestre capacidad de pago y voluntad de cumplimiento. Nuestra experiencia en estos expedientes complejos marca la diferencia.' },
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
        <p style={{fontSize:'15px', fontWeight:300, color:'rgba(255,255,255,.6)', maxWidth:'640px', marginTop:'24px', lineHeight:1.85}}>
          Tanto si la deuda proviene de una inspección, una autoliquidación o una sanción, nuestra especialización fiscal nos permite actuar con eficacia.
        </p>
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
        <h2 className={styles.sectionTitleLight}>¿En qué momento debes <em>contactarnos</em>?</h2>
        <p style={{fontSize:'15px', fontWeight:300, color:'rgba(255,255,255,.6)', maxWidth:'640px', marginTop:'24px', lineHeight:1.85}}>
          Cuanto antes actúes, más opciones tienes. Estos son los tres escenarios más habituales de nuestros clientes.
        </p>
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
          <div className={styles.eyebrow}>Por qué IRM Abogados</div>
          <h2 className={styles.sectionTitle}>Lo nos diferencia en<br /><em>garantías tributarias</em></h2>
        </div>
        <div className={styles.comparativaGrid}>
          <div className={styles.boxRed}>
            <div className={styles.boxRedTitle}>Sin asesoramiento especializado, te arriesgas a:</div>
            <ul className={styles.boxList}>
              {['Embargo de cuentas bancarias','Embargo de nómina o pensión','Anotación de embargo sobre inmuebles','Recargos del 5%, 10% o 20% sobre la deuda original','Intereses de demora'].map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div className={styles.boxGreen}>
            <div className={styles.boxGreenTitle}>Con IRM Abogados puedes conseguir:</div>
            <ul className={styles.boxList2}>
              {['Paralizar embargos','Pagar en cómodas cuotas mensuales','Suspender la deuda mientras se recurre','Proteger tu patrimonio y el de tu empresa'].map(i => <li key={i}>{i}</li>)}
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
