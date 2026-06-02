import Link from 'next/link'
import styles from './fiscal.module.css'

export const metadata = {
  title: 'Asesoramiento Fiscal para Empresas y Particulares',
  description: 'Especialistas en IRPF, Impuesto sobre Sociedades, IVA, Patrimonio, Sucesiones y defensa ante la AEAT. Madrid y Castellón. Primera consulta gratuita.',
}

const serviciosFiscales = [
  { n:'01', t:'IRPF — Personas físicas', d:'Declaraciones de renta de cualquier complejidad. Actividades económicas, alquileres, ganancias patrimoniales y rendimientos del capital.', items:['Declaración de la Renta','Estimación directa y módulos','Ganancias y pérdidas patrimoniales','Rendimientos del capital mobiliario','Deducciones autonómicas y estatales'] },
  { n:'02', t:'Impuesto sobre Sociedades', d:'Gestión integral del IS para empresas. Optimización del resultado fiscal, deducciones y cumplimiento de todas las obligaciones.', items:['Presentación del modelo 200','Grupos fiscales y consolidación','Ajustes extracontables','Planificación fiscal estratégica para optimización de beneficios'] },
  { n:'03', t:'IVA e impuestos indirectos', d:'Liquidaciones periódicas, gestión de deducciones, operaciones intracomunitarias y cumplimiento de todas las obligaciones formales.', items:['Modelos 303, 390, 322, 353 y 349','Operaciones intracomunitarias','Prorrata y sectores diferenciados','Devoluciones de IVA','Regímenes especiales de IVA'] },
  { n:'04', t:'Patrimonio, Sucesiones y Donaciones', d:'Planificación y liquidación de los impuestos que afectan a la transmisión y titularidad del patrimonio personal y familiar.', items:['Impuesto sobre el Patrimonio','Liquidación de herencias','Donaciones entre particulares','Planificación sucesoria','Optimización por comunidades autónomas'] },
  { n:'05', t:'Defensa ante la AEAT', d:'Representación y defensa en inspecciones, comprobaciones, procedimientos sancionadores y reclamaciones económico-administrativas.', items:['Inspecciones tributarias','Recursos de reposición','Reclamaciones ante el TEAR/TEAC','Reducción y anulación de sanciones','Recursos contencioso-administrativos'] },
  { n:'06', t:'Planificación y optimización fiscal', d:'Estrategia fiscal preventiva para reducir legalmente tu carga impositiva. Estructuración de operaciones y aprovechamiento de todos los incentivos disponibles.', items:['Planificación fiscal anual','Reestructuraciones empresariales','Fiscalidad internacional — IRNR','Convenios de doble imposición','Régimen de impatriados'] },
]

const faqs = [
  { q:'¿Cuándo es obligatorio presentar la declaración de la Renta?', a:'Con carácter general, están obligados a declarar quienes obtengan rendimientos del trabajo superiores a 22.000€ anuales de un único pagador (o 15.876€ si hay más de un pagador). Existen otras causas de obligación: rendimientos del capital, actividades económicas, ganancias patrimoniales, etc. Si tienes dudas sobre tu obligación, consúltanos.' },
  { q:'¿Cuáles son los gastos deducibles para autónomos?', a:'Los autónomos pueden deducir los gastos vinculados a su actividad económica: suministros del local afecto, material de trabajo, cuotas de la Seguridad Social, seguros profesionales, formación, amortizaciones y gastos de difícil justificación (hasta el 5% del rendimiento). La correcta justificación documental es clave para que la AEAT acepte las deducciones.' },
  { q:'¿Qué hago si recibo una carta o requerimiento de Hacienda?', a:'Lo más importante es no ignorarla y actuar dentro del plazo indicado (generalmente 10 días hábiles). Antes de responder, conviene analizar qué pide exactamente la AEAT y qué documentación hay que aportar. Una respuesta incorrecta o incompleta puede agravar la situación. Contáctanos en cuanto la recibas.' },
  { q:'¿Puedo reducir el Impuesto sobre Sociedades legalmente?', a:'Sí. Existen deducciones y beneficios fiscales que muchas empresas no aprovechan: deducciones por I+D+i, por creación de empleo, por donaciones, por aplicación de la reserva de capitalización, etc. Una planificación fiscal adecuada puede reducir significativamente la carga tributaria de tu empresa dentro del marco legal.' },
  { q:'¿Es posible recurrir una sanción de la AEAT?', a:'Sí. Las sanciones tributarias son recurribles mediante recurso de reposición (en el propio órgano que la dictó) o reclamación económico-administrativa ante el TEAR. Si la sanción no tiene suficiente fundamento legal o el procedimiento no se ha seguido correctamente, puede reducirse o anularse. El plazo para recurrir es generalmente de un mes desde la notificación.' },
  { q:'¿Cómo tributan las criptomonedas en España?', a:'Las ganancias o pérdidas derivadas de la venta de criptomonedas se integran en la base del ahorro del IRPF y tributan al tipo del ahorro (19%-28%). Además, si operas con criptos habitualmente, puede considerarse actividad económica. Las obligaciones informativas también han aumentado: modelo 721 para criptoactivos en el extranjero y la nueva casilla específica en la Renta.' },
]

export default function FiscalPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.heroBg}>TAX</div>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.breadcrumb}>Inicio <span>/ Servicios / Fiscal</span></div>
            <div className={styles.eyebrow}>Asesoramiento fiscal</div>
            <h1 className={styles.heroTitle}>Especialistas en derecho<br />tributario para <em>empresas<br />y personas</em></h1>
            <p className={styles.heroDesc}>Optimizamos tu carga fiscal, planificamos tu patrimonio y te defendemos ante cualquier procedimiento de la AEAT. Todo con rigor técnico, transparencia total y resultados medibles.</p>
            <div className={styles.heroBtns}>
              <Link href="/contacto" className="btn-gold">Solicitar Consulta</Link>
              <a href="#servicios" className="btn-ghost">Ver servicios</a>
            </div>
          </div>
          <div className={styles.urgencyCard}>
            <div className={styles.urgencyTitle}>¿Te identificas con alguna de estas situaciones?</div>
            <ul className={styles.urgencyList}>
              <li>Has recibido una notificación o carta de Hacienda</li>
              <li>Tu declaración de la Renta es compleja</li>
              <li>Tienes una empresa y necesitas asesoramiento fiscal</li>
              <li>Vas a vender, heredar o donar un bien</li>
              <li className={styles.urgencyOk}>Podemos ayudarte. Consulta gratuita.</li>
            </ul>
            <Link href="/contacto" className={styles.urgencyCta}>Hablar con un especialista</Link>
          </div>
        </div>
      </section>

      <section className={styles.serviciosSection} id="servicios">
        <div className={styles.eyebrow}>Qué hacemos</div>
        <h2 className={styles.sectionTitle}>Servicios fiscales <em>especializados</em></h2>
        <p className={styles.sectionIntro}>Cubrimos todos los impuestos y procedimientos que pueden afectar a tu economía personal o empresarial. Nuestro enfoque combina cumplimiento normativo con optimización fiscal legítima.</p>
        <div className={styles.sfGrid}>
          {serviciosFiscales.map(s => (
            <div key={s.n} className={styles.sfCard}>
              <div className={styles.sfNum}>{s.n}</div>
              <h3 className={styles.sfTitle}>{s.t}</h3>
              <p className={styles.sfDesc}>{s.d}</p>
              <ul className={styles.sfList}>{s.items.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.enfoqueSection}>
        <div className={styles.enfoqueLeft}>
          <div className={styles.eyebrow}>Nuestro enfoque</div>
          <h2 className={styles.sectionTitle}>Fiscalidad <em>proactiva</em>,<br />no reactiva</h2>
          <p className={styles.enfoqueDesc}>La mayoría de los problemas fiscales son evitables con una buena planificación previa. Nuestro trabajo empieza antes de que surja el problema, no después.</p>
          <div className={styles.enfoqueSteps}>
            {[{n:'01',t:'Diagnóstico fiscal inicial',d:'Analizamos tu situación actual e identificamos riesgos y oportunidades de mejora.'},{n:'02',t:'Estrategia personalizada',d:'Diseñamos la hoja de ruta fiscal más eficiente y segura para tu caso concreto.'},{n:'03',t:'Ejecución y cumplimiento',d:'Gestionamos todas las obligaciones fiscales con rigor y puntualidad.'},{n:'04',t:'Seguimiento y actualización',d:'Te avisamos de cambios normativos que puedan afectar a tu situación.'}].map(e => (
              <div key={e.n} className={styles.enfoqueStep}>
                <div className={styles.enfoqueNum}>{e.n}</div>
                <div><div className={styles.enfoqueStepT}>{e.t}</div><div className={styles.enfoqueStepD}>{e.d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.enfoqueRight}>
          {[{label:'Para autónomos',t:'Gestión fiscal completa',d:'IRPF, IVA trimestral, declaraciones anuales y optimización de gastos deducibles.'},{label:'Para empresas',t:'Asesoramiento corporativo continuo',d:'Sociedades, grupos fiscales, operaciones vinculadas y cumplimiento en tiempo.'},{label:'Para particulares',t:'Fiscalidad de patrimonio e inversión',d:'Inversiones, rentas del capital, herencias y planificación sucesoria a largo plazo.'},{label:'Para no residentes',t:'Fiscalidad internacional',d:'IRNR, convenios de doble imposición, impatriados y activos en el extranjero.'}].map(p => (
            <div key={p.label} className={styles.perfilCard}>
              <div className={styles.perfilLabel}>{p.label}</div>
              <div className={styles.perfilTitle}>{p.t}</div>
              <div className={styles.perfilDesc}>{p.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.eyebrow}>Preguntas frecuentes</div>
        <h2 className={styles.sectionTitle}>Lo que más nos <em>preguntan</em></h2>
        <p className={styles.pqIntro}>Resolvemos las deudas más habituales antes de la primera consulta.</p>
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
          <div className={styles.ctaTitle}>¿Tienes dudas sobre<br />tu situación fiscal?</div>
          <p className={styles.ctaDesc}>Analizamos tu caso sin coste y sin compromiso. Te decimos exactamente qué podemos hacer por ti. Respondemos en menos de 24 horas.</p>
          <div className={styles.ctaBtns}>
            <a href="mailto:correo@irmabogados.es" className="btn-navy">Solicitar consulta</a>
            <a href="tel:+34614149465" className="btn-outline-navy">Llamar ahora</a>
          </div>
        </div>
        <div className={styles.ctaRight}>
          {[{icon:'📞',label:'Teléfono',value:'+34 614 149 465',href:'tel:+34614149465'},{icon:'✉️',label:'Email',value:'correo@irmabogados.es',href:'mailto:correo@irmabogados.es'},{icon:'📍',label:'Sedes',value:'Madrid · Castellón · Online',href:'/contacto'}].map(c => (
            <div key={c.label} className={styles.ctaRow}>
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
