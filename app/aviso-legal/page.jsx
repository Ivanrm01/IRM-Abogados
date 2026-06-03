import styles from './legal.module.css'

export const metadata = {
  title: 'Aviso Legal | IRM Abogados',
  description: 'Aviso legal de IRM Abogados. Información sobre el titular del sitio web, condiciones de uso y propiedad intelectual.',
}

export default function AvisoLegalPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.breadcrumb}>Inicio <span>/ Aviso legal</span></div>
        <div className={styles.eyebrow}>Información legal</div>
        <h1 className={styles.heroTitle}>Aviso <em>legal</em></h1>
        <p className={styles.heroDesc}>Información legal sobre el titular del sitio web y las condiciones de uso aplicables a la navegación en www.irmabogadosasesores.com</p>
        <div className={styles.heroBadge}>Última actualización: enero de 2025</div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>

          <div className={styles.block}>
            <h2>1. Datos identificativos del titular</h2>
            <p>En cumplimiento con el deber de información dispuesto en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), se facilitan a continuación los datos identificativos del titular del sitio web:</p>
            <div className={styles.dataTable}>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Denominación social</div><div className={styles.dataVal}>IRM Abogados</div></div>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Nombre comercial</div><div className={styles.dataVal}>IRM Tax & Legal</div></div>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Domicilio social</div><div className={styles.dataVal}>C/ En medio, 22 — 6º C, 12001 Castellón</div></div>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Teléfono</div><div className={styles.dataVal}>+34 614 149 465</div></div>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Email</div><div className={styles.dataVal}>correo@irmabogados.es</div></div>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Sitio web</div><div className={styles.dataVal}>www.irmabogadosasesores.com</div></div>
            </div>
          </div>

          <div className={styles.block}>
            <h2>2. Objeto y ámbito de aplicación</h2>
            <p>El presente Aviso Legal regula el acceso y uso del sitio web www.irmabogadosasesores.com (en adelante, el "Sitio Web"), del que es titular IRM Abogados. El acceso al Sitio Web y el uso de sus contenidos implica la aceptación expresa y sin reservas de los presentes términos y condiciones.</p>
            <p>IRM Abogados se reserva el derecho a modificar en cualquier momento el contenido del Sitio Web, las presentes condiciones de uso y las condiciones particulares que pudieran existir. Las modificaciones realizadas serán eficaces desde el momento de su publicación en el Sitio Web.</p>
          </div>

          <div className={styles.block}>
            <h2>3. Condiciones de acceso y uso</h2>
            <p>El acceso al Sitio Web es libre y gratuito. No obstante, determinados servicios y contenidos pueden estar condicionados a la previa suscripción o registro del usuario.</p>
            <p>El usuario se compromete a hacer un uso adecuado y lícito del Sitio Web y de los contenidos en él alojados, de conformidad con la legislación aplicable, las presentes condiciones y las exigencias de la buena fe, los usos generalmente aceptados y el orden público.</p>
            <p>Queda expresamente prohibido:</p>
            <ul>
              <li>Reproducir, distribuir o utilizar con fines comerciales los contenidos del Sitio Web sin autorización expresa de IRM Abogados.</li>
              <li>Utilizar el Sitio Web con fines ilícitos o contrarios a las presentes condiciones.</li>
              <li>Introducir programas, virus, macros, applets, controles ActiveX o cualquier otro dispositivo lógico o secuencia de caracteres que causen o sean susceptibles de causar cualquier tipo de alteración en los sistemas informáticos de IRM Abogados o de terceros.</li>
              <li>Vulnerar los derechos de propiedad intelectual o industrial pertenecientes a IRM Abogados o a terceros.</li>
            </ul>
          </div>

          <div className={styles.block}>
            <h2>4. Propiedad intelectual e industrial</h2>
            <p>Todos los contenidos del Sitio Web —incluyendo, sin carácter limitativo, textos, fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente— son propiedad intelectual de IRM Abogados o de terceros, sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotación reconocidos por la normativa vigente en materia de propiedad intelectual sobre los mismos.</p>
            <p>Las marcas, nombres comerciales o signos distintivos son titularidad de IRM Abogados o de terceros, sin que el acceso al Sitio Web pueda entenderse como atribución de derecho alguno sobre las citadas marcas, nombres comerciales o signos distintivos.</p>
          </div>

          <div className={styles.block}>
            <h2>5. Exclusión de garantías y responsabilidad</h2>
            <p>IRM Abogados no garantiza la disponibilidad y continuidad del funcionamiento del Sitio Web y de sus servicios. Cuando ello sea razonablemente posible, advertirá previamente las interrupciones en el funcionamiento del Sitio Web.</p>
            <p>La información publicada en el Sitio Web tiene carácter meramente informativo y general, y no constituye en ningún caso asesoramiento jurídico individualizado. IRM Abogados no asume responsabilidad alguna derivada del uso de dicha información o de las decisiones adoptadas por el usuario en base a la misma.</p>
            <p>IRM Abogados no controla ni garantiza la ausencia de virus ni de otros elementos en los contenidos que puedan producir alteraciones en su sistema informático, en los documentos electrónicos o en los ficheros almacenados en su sistema informático.</p>
          </div>

          <div className={styles.block}>
            <h2>6. Política de enlaces</h2>
            <p>El Sitio Web puede contener enlaces a páginas web de terceros. IRM Abogados no asume ninguna responsabilidad respecto a la información contenida en dichas páginas de terceros, incluyendo pero no limitando, la veracidad, exactitud y exhaustividad de la misma.</p>
            <p>Quien desee introducir en su página web un enlace que dirija al Sitio Web, deberá obtener previamente la autorización expresa de IRM Abogados.</p>
          </div>

          <div className={styles.block}>
            <h2>7. Jurisdicción y ley aplicable</h2>
            <p>Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia que pudiera surgir en relación con el Sitio Web o los servicios prestados a través del mismo, las partes se someten, con renuncia expresa a cualquier otro fuero que pudiera corresponderles, a los Juzgados y Tribunales de Madrid (España).</p>
          </div>

          <div className={styles.block}>
            <h2>8. Contacto</h2>
            <p>Para cualquier consulta relacionada con el presente Aviso Legal, el usuario puede contactar con IRM Abogados & Asesores a través de los siguientes medios:</p>
            <ul>
              <li>Email: <a href="mailto:correo@irmabogados.es">correo@irmabogados.es</a></li>
              <li>Teléfono: <a href="tel:+34614149465">+34 614 149 465</a></li>
              <li>Dirección: C/ En medio, 22 — 6º C, 12001 Castellón</li>
            </ul>
          </div>

        </div>

        <div className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>Documentos legales</div>
            <ul className={styles.sideLinks}>
              <li><a href="/aviso-legal">Aviso legal</a></li>
              <li><a href="/politica-de-privacidad">Política de privacidad</a></li>
              <li><a href="/politica-de-cookies">Política de cookies</a></li>
            </ul>
          </div>
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>¿Tienes alguna duda?</div>
            <p>Si necesitas aclaraciones sobre nuestra política legal, contacta con nosotros.</p>
            <a href="/contacto" className={styles.sideBtn}>Contactar</a>
          </div>
        </div>
      </section>
    </>
  )
}
