import Link from 'next/link'
import styles from './landing.module.css'

export const metadata = {
  title: 'Derivación de Responsabilidad Tributaria | Art. 42 y 43 LGT | IRM Tax & Legal',
  description: 'Especialistas en impugnar y paralizar derivaciones de responsabilidad tributaria solidaria (art. 42 LGT) y subsidiaria (art. 43 LGT). Defendemos a administradores y terceros ante la AEAT.',
  keywords: 'derivación responsabilidad tributaria, artículo 42 LGT, artículo 43 LGT, responsabilidad subsidiaria administradores, responsabilidad solidaria, AEAT responsabilidad tributaria',
}

const riesgosArt42 = [
  'Colaborar en la realización de infracciones tributarias',
  'Ser causante o colaborador en la ocultación de bienes del deudor principal',
  'Participar en actos o negocios con ánimo de impedir la actuación de la AEAT',
  'Adquirir bienes del deudor cuando haya indicios de defraudación tributaria',
  'Responsables solidarios en supuestos de sucesión de empresa',
]

const riesgosArt43 = [
  'Administradores de hecho o de derecho de personas jurídicas',
  'Integrantes de la administración concursal',
  'Adquirentes de explotaciones económicas',
  'Agentes y comisionistas de aduanas',
  'Contratistas o subcontratistas de obras y servicios',
]

const fases = [
  {
    n: '01',
    t: 'Análisis del expediente',
    d: 'Revisamos el acuerdo de derivación, el expediente del deudor principal y la fundamentación jurídica de la AEAT para identificar todos los defectos formales y materiales.'
  },
  {
    n: '02',
    t: 'Recurso de reposición o reclamación económico-administrativa',
    d: 'Presentamos el recurso ante la AEAT o el TEAR en plazo, argumentando la improcedencia de la derivación y solicitando la suspensión de la ejecución sin garantía o con garantía reducida.'
  },
  {
    n: '03',
    t: 'Suspensión de la ejecución',
    d: 'Paralizamos el cobro coactivo mientras se resuelve la impugnación, evitando embargos sobre el patrimonio personal del derivado.'
  },
  {
    n: '04',
    t: 'Defensa en vía contencioso-administrativa',
    d: 'Si el TEAR o TEAC no estiman la reclamación, recurrimos ante el Tribunal Superior de Justicia o la Audiencia Nacional con argumentación basada en la doctrina más reciente del Tribunal Supremo.'
  },
]

const argumentos = [
  {
    t: 'Prescripción de la acción',
    d: 'La AEAT tiene un plazo limitado para derivar la responsabilidad. Analizamos si la derivación se ha realizado fuera de plazo y si el expediente del deudor principal estaba prescrito.'
  },
  {
    t: 'Falta de culpabilidad del administrador',
    d: 'El Tribunal Supremo exige acreditar la conducta activa del administrador. No basta con ser administrador — la AEAT debe probar la participación directa en el incumplimiento.'
  },
  {
    t: 'Cese efectivo en el cargo',
    d: 'La responsabilidad del art. 43.1.a) LGT requiere que el administrador estuviera en el cargo cuando se produjeron las infracciones. El cese previo excluye la derivación.'
  },
  {
    t: 'Defectos formales del procedimiento',
    d: 'El procedimiento de declaración de responsabilidad debe seguir un iter procedimental estricto. Cualquier irregularidad puede determinar la nulidad del acuerdo de derivación.'
  },
  {
    t: 'Deuda del principal anulada o reducida',
    d: 'Si la liquidación del deudor principal fue impugnada con éxito, la derivación queda sin base. Revisamos el expediente del deudor para detectar estas situaciones.'
  },
  {
    t: 'Ausencia de insolvencia del deudor principal',
    d: 'En la responsabilidad subsidiaria (art. 43 LGT), la AEAT debe acreditar la insolvencia total del deudor principal antes de poder derivar. Si no lo hace correctamente, la derivación es impugnable.'
  },
]

export default function DerivacionesPage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.heroLeft}>
          <div className={styles.eyebrow}>Especialistas en responsabilidad tributaria</div>
          <h1 className={styles.heroTitle}>
            Te han derivado<br />la deuda de<br /><em>otra persona</em>
          </h1>
          <p className={styles.heroDesc}>
            La AEAT puede reclamar a administradores y terceros las deudas tributarias de otros. 
            Tenemos una tasa de éxito muy alta impugnando derivaciones de responsabilidad del 
            artículo 42 y 43 de la LGT. <strong>Primera consulta gratuita.</strong>
          </p>
          <div className={styles.heroBtns}>
            <Link href="/contacto" className="btn-gold">Consulta gratuita urgente</Link>
            <a href="tel:+34614149465" className={styles.btnPhone}>+34 614 149 465</a>
          </div>
          <div className={styles.heroAlert}>
            <span className={styles.alertDot}></span>
            Los plazos para impugnar son muy cortos — actúa antes de que venzan
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroCards}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardLabel}>Art. 42 LGT</div>
              <div className={styles.heroCardTitle}>Responsabilidad solidaria</div>
              <div className={styles.heroCardDesc}>El derivado responde de la misma deuda que el deudor principal, de forma simultánea.</div>
            </div>
            <div className={styles.heroCard}>
              <div className={styles.heroCardLabel}>Art. 43 LGT</div>
              <div className={styles.heroCardTitle}>Responsabilidad subsidiaria</div>
              <div className={styles.heroCardDesc}>La AEAT solo puede derivar cuando haya agotado las posibilidades de cobro frente al deudor principal.</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ ES */}
      <section className={styles.queEs}>
        <div className={styles.queEsLeft}>
          <div className={styles.eyebrowDark}>¿Qué es una derivación de responsabilidad?</div>
          <h2 className={styles.sectionTitle}>La AEAT te reclama<br />una deuda que <em>no es tuya</em></h2>
          <p className={styles.sectionDesc}>
            La derivación de responsabilidad es el mecanismo que permite a la AEAT extender el cobro 
            de una deuda tributaria a personas distintas del deudor principal — normalmente administradores 
            de sociedades, socios o terceros que han participado en ciertas operaciones.
          </p>
          <p className={styles.sectionDesc}>
            Recibir un acuerdo de derivación es una situación grave que puede comprometer tu patrimonio 
            personal. Sin embargo, <strong>muchas derivaciones son impugnables y pueden anularse</strong> si 
            se actúa con rapidez y con la argumentación jurídica correcta.
          </p>
          <Link href="/contacto" className="btn-gold" style={{display:'inline-block',marginTop:'16px'}}>
            Analizar mi caso gratuitamente
          </Link>
        </div>
        <div className={styles.queEsRight}>
          <div className={styles.alertBox}>
            <div className={styles.alertBoxTitle}>⚠️ Plazos críticos</div>
            <div className={styles.alertBoxItem}>
              <strong>1 mes</strong>
              <span>Para interponer recurso de reposición ante la AEAT</span>
            </div>
            <div className={styles.alertBoxItem}>
              <strong>1 mes</strong>
              <span>Para presentar reclamación económico-administrativa ante el TEAR</span>
            </div>
            <div className={styles.alertBoxItem}>
              <strong>Inmediato</strong>
              <span>Solicitar la suspensión de la ejecución para evitar embargos</span>
            </div>
            <div className={styles.alertBoxNote}>
              Los plazos se cuentan desde la notificación del acuerdo de derivación.
            </div>
          </div>
        </div>
      </section>

      {/* ART 42 Y 43 */}
      <section className={styles.articulos}>
        <div className={styles.articulosGrid}>
          <div className={styles.articuloCard}>
            <div className={styles.articuloNum}>Art. 42</div>
            <h2 className={styles.articuloTitle}>Responsabilidad solidaria</h2>
            <p className={styles.articuloDesc}>
              La responsabilidad solidaria permite a la AEAT dirigirse directamente contra el 
              responsable sin necesidad de agotar la vía de cobro frente al deudor principal. 
              Los supuestos más habituales son:
            </p>
            <ul className={styles.articuloList}>
              {riesgosArt42.map(r => (
                <li key={r}>
                  <span className={styles.listDash}>—</span>
                  {r}
                </li>
              ))}
            </ul>
            <div className={styles.articuloNote}>
              La AEAT puede embargar directamente sin declaración previa de insolvencia del deudor principal.
            </div>
          </div>
          <div className={styles.articuloCard}>
            <div className={styles.articuloNum}>Art. 43</div>
            <h2 className={styles.articuloTitle}>Responsabilidad subsidiaria</h2>
            <p className={styles.articuloDesc}>
              La responsabilidad subsidiaria requiere que la AEAT haya agotado las posibilidades 
              de cobro frente al deudor principal mediante la declaración de fallido. 
              Los supuestos más frecuentes afectan a:
            </p>
            <ul className={styles.articuloList}>
              {riesgosArt43.map(r => (
                <li key={r}>
                  <span className={styles.listDash}>—</span>
                  {r}
                </li>
              ))}
            </ul>
            <div className={styles.articuloNote}>
              El supuesto más habitual: administradores de sociedades con deudas tributarias pendientes al tiempo del cese o disolución.
            </div>
          </div>
        </div>
      </section>

      {/* ARGUMENTOS */}
      <section className={styles.argumentos}>
        <div className="eyebrow" style={{color:'var(--gold)'}}>Por qué muchas derivaciones son anulables</div>
        <h2 className={styles.sectionTitleLight}>Argumentos que utilizamos<br />para <em>ganar el recurso</em></h2>
        <div className={styles.argumentosGrid}>
          {argumentos.map((a, i) => (
            <div key={i} className={styles.argumentoCard}>
              <div className={styles.argumentoNum}>0{i + 1}</div>
              <h3 className={styles.argumentoTitle}>{a.t}</h3>
              <p className={styles.argumentoDesc}>{a.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESO */}
      <section className={styles.proceso}>
        <div className="eyebrow">Cómo trabajamos</div>
        <h2 className={styles.sectionTitle}>Nuestro proceso de <em>defensa</em></h2>
        <div className={styles.fasesGrid}>
          {fases.map(f => (
            <div key={f.n} className={styles.faseCard}>
              <div className={styles.faseNum}>{f.n}</div>
              <h3 className={styles.faseTitle}>{f.t}</h3>
              <p className={styles.faseDesc}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JURISPRUDENCIA */}
      <section className={styles.juris}>
        <div className={styles.jurisInner}>
          <div className="eyebrow" style={{color:'var(--gold)'}}>Doctrina del Tribunal Supremo</div>
          <h2 className={styles.sectionTitleLight}>Jurisprudencia que<br /><em>protege al responsable</em></h2>
          <div className={styles.jurisGrid}>
            <div className={styles.jurisCard}>
              <div className={styles.jurisCita}>STS 5016/2024</div>
              <p>El TS exige que la AEAT acredite la conducta activa y culpable del administrador. No basta con la condición formal de administrador para derivar la responsabilidad subsidiaria.</p>
            </div>
            <div className={styles.jurisCard}>
              <div className={styles.jurisCita}>STS 1093/2023</div>
              <p>La declaración de responsabilidad solidaria del art. 42.2.a) LGT tiene carácter tendencial: requiere que el acto sea idóneo para impedir la actuación recaudatoria.</p>
            </div>
            <div className={styles.jurisCard}>
              <div className={styles.jurisCita}>STS 2876/2022</div>
              <p>El procedimiento de derivación debe respetar todas las garantías del procedimiento sancionador cuando la responsabilidad derive de infracciones tributarias.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaLeft}>
          <h2 className={styles.ctaTitle}>¿Has recibido un acuerdo<br />de derivación de responsabilidad?</h2>
          <p className={styles.ctaDesc}>Actúa ahora. Los plazos son muy cortos y cada día cuenta. En IRM Tax & Legal analizamos tu caso de forma gratuita y te decimos si la derivación es impugnable.</p>
        </div>
        <div className={styles.ctaBtns}>
          <Link href="/contacto" className="btn-navy">Consulta gratuita urgente</Link>
          <a href="tel:+34614149465" className="btn-outline-navy">+34 614 149 465</a>
        </div>
      </section>
    </>
  )
}
