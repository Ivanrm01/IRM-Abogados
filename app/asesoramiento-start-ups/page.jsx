import Link from 'next/link'
import styles from './startups.module.css'
import { Shield, Clock, DollarSign, Users, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'Asesoramiento Legal y Fiscal para Start-Ups',
  description: 'Asesoramiento integral para start-ups desde su constitución hasta la ronda de inversión. Pactos de socios, ESOPs, fiscalidad de la inversión y due diligence fiscal.',
}

const fases = [
  { n:'01', tag:'Fase 1 · Constitución', t:'Nace tu empresa', d:'Todo lo que necesitas para arrancar con una estructura sólida y bien diseñada desde el primer día. Las decisiones que tomes aquí condicionan todo lo que viene después.', items:['Elección de forma jurídica óptima (SL, SA...)','Redacción de estatutos sociales a medida','Pacto de socios fundadores completo','Régimen fiscal más ventajoso para el inicio','Alta y registro en la Agencia Tributaria'] },
  { n:'02', tag:'Fase 2 · Operaciones', t:'Primeros clientes y equipo', d:'Cuando empiezas a generar ingresos y a incorporar personas, la estructura fiscal y laboral cobra toda su importancia. Construimos bien para que puedas escalar.', items:['Fiscalidad operativa — IS, IVA, IRPF trimestral','Contratos con empleados y freelances','Planes de incentivos — ESOPs y phantomshares','Contratos con clientes y proveedores clave','Cumplimiento LOPD y RGPD'] },
  { n:'03', tag:'Fase 3 · Inversión', t:'Rondas de financiación', d:'Preparación legal y fiscal para atraer inversores y cerrar rondas en las mejores condiciones posibles. La due diligence no te pillará por sorpresa.', items:['Due diligence fiscal preventiva','Estructuración societaria para inversión','Fiscalidad de business angels y fondos VC','Ampliaciones de capital y dilución','Pacto de socios para entrada de inversores'] },
]

const servicios = [
  { t:'Pacto de socios', d:'El documento más importante que firmarás con tus cofundadores. Regula derechos, obligaciones y mecanismos de resolución de conflictos.', tags:['Vesting','Drag & Tag Along','Antidilución','Good/Bad Leaver'] },
  { t:'ESOPs y planes de incentivos', d:'Diseño de planes de opciones sobre acciones para retener y atraer talento. Optimización fiscal para la empresa y para los empleados.', tags:['Stock Options','Phantom Shares','Warrants','RSUs'] },
  { t:'Due diligence fiscal preventiva', d:'Revisión completa de la situación fiscal antes de que lleguen los inversores. Identificamos y solucionamos problemas antes de que sean dealbreakers.', tags:['Revisión fiscal','Riesgo tributario','Pre-inversión','VDR'] },
  { t:'Fiscalidad de la inversión', d:'Estructuración fiscal de las rondas de inversión. Optimización para inversores business angel, fondos de capital riesgo y family offices.', tags:['Business Angels','Capital riesgo','ENISA','Deducción 50%'] },
  { t:'Fiscalidad operativa continua', d:'Gestión fiscal del día a día de tu startup. IS, IVA, retenciones y cumplimiento de todas las obligaciones periódicas.', tags:['IS','IVA trimestral','Retenciones','Modelos informativos'] },
  { t:'Expansión internacional', d:'Estructuración fiscal para startups que escalan fuera de España. Establecimiento permanente, precios de transferencia y estructura holding.', tags:['Holding','Delaware','Transfer Pricing','IP Box'] },
]

const faqs = [
  { q:'¿Qué forma jurídica es mejor para una startup?', a:'Para la mayoría de startups en España, la Sociedad Limitada (SL) es la opción más adecuada por su flexibilidad, bajo capital mínimo y menor coste de constitución. Lo importante es elegir bien los estatutos y el pacto de socios, más que la forma jurídica en sí.' },
  { q:'¿Qué debe incluir un buen pacto de socios?', a:'Un pacto completo debe cubrir: régimen de vesting, cláusulas drag-along y tag-along, derecho de tanteo y retracto, cláusulas good/bad leaver, acuerdos sobre toma de decisiones y cómo se distribuyen los beneficios. Sin un buen pacto, cualquier conflicto puede paralizar la startup.' },
  { q:'¿Cuándo es el momento ideal para hacer la due diligence fiscal preventiva?', a:'Lo ideal es entre 6 y 12 meses antes de una ronda. Así tienes tiempo de identificar y resolver incidencias sin presión. Si la haces cuando ya estás negociando y aparece un problema, te pone en una posición de debilidad negociadora.' },
  { q:'¿Qué es un ESOP y por qué necesita mi startup uno?', a:'Un ESOP (Employee Stock Option Plan) permite a los empleados adquirir participaciones a un precio predeterminado. Es clave para retener y atraer talento cuando no puedes competir en salario. Su diseño fiscal correcto es fundamental para evitar facturas inesperadas.' },
  { q:'¿Qué ventajas fiscales tienen los inversores en startups españolas?', a:'Los business angels pueden deducirse el 50% de la inversión en el IRPF (base máxima de 100.000€ anuales). Además, si la startup es de nueva creación e innovadora, pueden aplicar exenciones sobre las ganancias obtenidas al vender.' },
  { q:'¿Necesito un holding para mi startup?', a:'Depende del momento y los objetivos. Una estructura holding tiene sentido cuando planeas tener varias sociedades participadas, cuando quieres optimizar la fiscalidad de los dividendos o cuando vas a expandirte internacionalmente. En early stage suele ser prematuro.' },
]

export default function StartupsPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.heroBg}>VC</div>
        <div className={styles.breadcrumb}>Inicio <span>/ Servicios / Start-Ups</span></div>
        <div className={styles.eyebrow}>Start-Ups</div>
        <h1 className={styles.heroTitle}>Asesoramiento legal<br />y fiscal para<br /><em>nuevas empresas</em></h1>
        <p className={styles.heroDesc}>Acompañamos a emprendedores y startups desde la idea hasta la ronda de inversión. Construimos la estructura legal y fiscal que tu empresa necesita para crecer de forma sólida, atraer capital y escalar sin riesgos legales.</p>
        <div className={styles.heroBtns}>
          <Link href="/contacto" className="btn-gold">Solicitar consulta</Link>
          <a href="#fases" className="btn-ghost">Ver servicios por fase</a>
        </div>
        <div className={styles.heroBadges}>
          {['Constitución de sociedades','Pactos de socios','ESOPs','Due diligence fiscal','Rondas de inversión','Fiscalidad de la startup'].map(b => (
            <div key={b} className={styles.badge}><div className={styles.badgeDot}></div>{b}</div>
          ))}
        </div>
      </section>

      <section className={styles.fasesSection} id="fases">
        <div className={styles.eyebrow}>Por fase de crecimiento</div>
        <h2 className={styles.sectionTitle}>Te acompañamos en<br /><em>cada etapa</em></h2>
        <p className={styles.sectionIntro}>Cada fase de una Start-Up tiene sus propias necesidades legales y fiscales. Adaptamos nuestro asesoramiento al momento exacto en el que se encuentra tu empresa, desde el día cero hasta el cierre de tu primera ronda.</p>
        <div className={styles.fasesGrid}>
          {fases.map(f => (
            <div key={f.n} className={styles.faseCard}>
              <div className={styles.faseNum}>{f.n}</div>
              <span className={styles.faseTag}>{f.tag}</span>
              <h3 className={styles.faseTitle}>{f.t}</h3>
              <p className={styles.faseDesc}>{f.d}</p>
              <ul className={styles.faseList}>{f.items.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.serviciosSection}>
        <div className={styles.eyebrow2}>Servicios específicos</div>
        <h2 className={styles.sectionTitleLight}>Todo lo que necesita<br /><em>tu Start-Up</em></h2>
        <p className={styles.heroServic}>Estos son los servicios concretos que más demandan nuestros clientes del ecosistema Start-Up. Todos están diseñados pensando en la velocidad, la escalabilidad y la seguridad jurídica.</p>
        <div className={styles.fasesGrid}>
        <div className={styles.sdGrid}>
          {servicios.map(s => (
            <div key={s.t} className={styles.sdCard}>
              <h3 className={styles.sdTitle}>{s.t}</h3>
              <p className={styles.sdDesc}>{s.d}</p>
              <div className={styles.sdTags}>{s.tags.map(t => <span key={t} className={styles.sdTag}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.porqueSection}>
        <div className={styles.porqueLeft}>
          <div className={styles.eyebrow}>Por qué IRM para tu startup</div>
          <h2 className={styles.sectionTitle}>No somos una gestoría.<br /><em>Somos tu socio legal</em></h2>
          <p className={styles.porqueDesc}>Entendemos el mundo startup. Sabemos que la velocidad importa, que los recursos son limitados y que los errores legales al principio pueden costar muy caro en las siguientes rondas.</p>
          <div className={styles.porqueItems}>
            {[{t:'Velocidad de respuesta',d:'Las startups no pueden esperar. Respondemos en 24 horas y actuamos con la agilidad que tu empresa necesita.'},{t:'Conocimiento del ecosistema',d:'Conocemos ESOPs, notas convertibles, SAFEs y rondas seed. Hablamos tu idioma.'},{t:'Honorarios flexibles',d:'Sabemos que en early stage los recursos son escasos. Adaptamos nuestra forma de trabajar a tu momento.'},{t:'Visión a largo plazo',d:'Las decisiones que tomes hoy condicionan lo que podrás hacer mañana. Te ayudamos a construir bien desde el principio.'}].map(i => (
              <div key={i.t} className={styles.porqueItem}>
                <div className={styles.porqueIcon}>✓</div>
                <div><div className={styles.porqueTit}>{i.t}</div><div className={styles.porqueDescItem}>{i.d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.porqueRight}>
          <div className={styles.testCard}>
            <div className={styles.testQuote}>"</div>
            <p className={styles.testText}>Gracias a IRM estructuramos correctamente el pacto de socios y el ESOP desde el principio. Cuando llegó la due diligence de los inversores, todo estaba en orden.</p>
            <div className={styles.testAuthor}>Fundador de startup tecnológica</div>
            <div className={styles.testRole}>Cliente desde la fase de constitución</div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>Deducción del 50% para business angels</div>
            <div className={styles.infoDesc}>Los inversores que invierten en tu startup pueden deducirse hasta el 50% de su inversión en el IRPF (base máx. 100.000€). Una ventaja fiscal enorme que debes conocer y comunicar a tus inversores potenciales.</div>
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.eyebrow}>Preguntas frecuentes</div>
        <h2 className={styles.sectionTitle}>Lo que nos preguntan<br /><em>los fundadores</em></h2>
        <div className={styles.faqGrid}>
          {faqs.map((f, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.faqQ}>{f.q}<span className={styles.faqIcon}>+</span></summary>
              <div className={styles.faqA}>{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaLeft}>
          <div className={styles.ctaEyebrow}>Primera consulta gratuita</div>
          <div className={styles.ctaTitle}>¿Tienes una idea o<br />acabas de lanzar<br />tu startup?</div>
          <p className={styles.ctaDesc}>Cuéntanos en qué fase estás y diseñamos la estructura legal y fiscal perfecta. Sin compromiso y sin coste en la primera consulta.</p>
          <div className={styles.ctaBtns}>
            <a href="mailto:correo@irmabogados.es" className="btn-navy">Enviar consulta</a>
            <a href="tel:+34614149465" className="btn-outline-navy">Llamar ahora</a>
          </div>
        </div>
        <div className={styles.ctaRight}>
          {[{icon:'📞',label:'Teléfono',value:'+34 614 149 465',href:'tel:+34614149465'},{icon:'💬',label:'WhatsApp',value:'Escríbenos directamente'},{icon:'✉️',label:'Email',value:'correo@irmabogados.es',href:'mailto:correo@irmabogados.es'}].map(c => (
            <div key={c.label} className={styles.ctaRow}>
              <div className={styles.ctaIcon}>
                {c.icon === '📞' && <Phone size={20} strokeWidth={1.5} color="#B8975A" />}
                {c.icon === '💬' && <MessageCircle size={20} strokeWidth={1.5} color="#B8975A" />}
                {c.icon === '✉️' && <Mail size={20} strokeWidth={1.5} color="#B8975A" />}
              </div> 
              <div><div className={styles.ctaLabel}>{c.label}</div><a href={c.href} className={styles.ctaValue}>{c.value}</a></div>
            </div>
          ))}
          <div className={styles.ctaBadge}><div className={styles.ctaBadgeDot}></div>Respondemos en menos de 24 horas · Consulta siempre gratuita</div>
        </div>
      </section>
    </>
  )
}
