import styles from './legal.module.css'
import CookieSettingsButton from '@/components/CookieSettingsButton'

export const metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de IRM Abogados: cookies utilizadas, finalidad, plazos, proveedores, transferencias internacionales y cómo aceptarlas o rechazarlas.',
  alternates: { canonical: '/politica-de-cookies' },
}

export default function CookiesPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.breadcrumb}>Inicio <span>/ Política de cookies</span></div>
        <div className={styles.eyebrow}>Cookies</div>
        <h1 className={styles.heroTitle}>Política de <em>cookies</em></h1>
        <p className={styles.heroDesc}>Qué cookies utiliza www.irmabogadosasesores.com, para qué sirven, quién las instala, cuánto duran y cómo puede aceptarlas, rechazarlas o cambiar de opinión en cualquier momento.</p>
        <div className={styles.heroBadge}>Última actualización: agosto de 2026</div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>

          <div className={styles.block}>
            <h2>1. Responsable de la instalación de cookies</h2>
            <p>El titular de este sitio web y responsable del tratamiento de los datos obtenidos mediante cookies es:</p>
            <div className={styles.dataTable}>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Titular</div><div className={styles.dataVal}>IRM Abogados (nombre comercial: IRM Tax &amp; Legal)</div></div>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Domicilio</div><div className={styles.dataVal}>C/ En medio, 22 — 6º, 12001 Castellón de la Plana</div></div>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Email</div><div className={styles.dataVal}>correo@irmabogados.es</div></div>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Teléfono</div><div className={styles.dataVal}>+34 614 149 465</div></div>
            </div>
            <p>Esta política desarrolla la información exigida por el artículo 22.2 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE) y por el Reglamento (UE) 2016/679 (RGPD), siguiendo los criterios de la Guía sobre el uso de las cookies de la Agencia Española de Protección de Datos (AEPD).</p>
          </div>

          <div className={styles.block}>
            <h2>2. Qué son las cookies y tecnologías similares</h2>
            <p>Una cookie es un pequeño archivo de texto que un sitio web almacena en su navegador y que puede leerse en visitas posteriores. Bajo el mismo régimen jurídico se incluyen otras técnicas que almacenan o recuperan información en su dispositivo, como los píxeles de seguimiento, el almacenamiento local del navegador (localStorage) o las etiquetas invisibles que utilizan las plataformas publicitarias. En esta política, el término «cookies» se refiere a todas ellas.</p>
            <p>Según quién las instale, las cookies son <strong>propias</strong> (gestionadas por IRM Abogados) o <strong>de terceros</strong> (gestionadas por un proveedor externo, que recibe los datos y los trata conforme a su propia política de privacidad). Según cuánto duren, son <strong>de sesión</strong> (se borran al cerrar el navegador) o <strong>persistentes</strong> (permanecen durante el plazo indicado en las tablas siguientes).</p>
          </div>

          <div className={styles.block}>
            <h2>3. Cookies utilizadas en este sitio web</h2>

            <h3>3.1 Cookies técnicas o necesarias</h3>
            <p>Son imprescindibles para prestar el servicio expresamente solicitado por el usuario. Están exceptuadas del deber de obtener consentimiento conforme al artículo 22.2 LSSI-CE, pero le informamos igualmente de ellas.</p>
            <div className={styles.ckTable}>
              <div className={styles.ckHeader}>
                <span>Cookie</span><span>Proveedor</span><span>Finalidad</span><span>Duración</span><span>Titularidad</span>
              </div>
              <div className={styles.ckRow}>
                <span>irm_consent</span>
                <span>IRM Abogados</span>
                <span>Almacena la decisión que usted toma en el panel de cookies (qué finalidades acepta o rechaza) y la fecha en que la tomó, para no volver a preguntárselo en cada página y para poder acreditar el consentimiento.</span>
                <span>12 meses</span>
                <span>Propia</span>
              </div>
            </div>
            <p className={styles.tableNote}>Este sitio web no instala ninguna otra cookie propia. No existen cookies de sesión ni de autenticación en la zona pública.</p>

            <h3>3.2 Cookies analíticas o de medición</h3>
            <p>Nos permiten conocer cuántas personas visitan el sitio, qué páginas consultan y por qué vía llegan, con el fin de mejorar los contenidos. <strong>Requieren su consentimiento previo</strong> y no se instalan si no lo presta.</p>
            <div className={styles.ckTable}>
              <div className={styles.ckHeader}>
                <span>Cookie</span><span>Proveedor</span><span>Finalidad</span><span>Duración</span><span>Titularidad</span>
              </div>
              <div className={styles.ckRow}>
                <span>_ga</span>
                <span>Google Analytics 4 — Google Ireland Ltd. / Google LLC</span>
                <span>Genera un identificador para distinguir navegadores y contabilizar usuarios únicos.</span>
                <span>2 años</span>
                <span>Terceros</span>
              </div>
              <div className={styles.ckRow}>
                <span>_ga_G-BQ057SC5B6</span>
                <span>Google Analytics 4 — Google Ireland Ltd. / Google LLC</span>
                <span>Mantiene el estado de la sesión de medición asociada a nuestra propiedad de Analytics.</span>
                <span>2 años</span>
                <span>Terceros</span>
              </div>
            </div>
            <div className={styles.callout}>
              <p>Los datos recogidos por Google Analytics <strong>no son anónimos</strong>: incluyen un identificador único de navegador y la dirección IP, que constituyen datos personales conforme al RGPD. Por ese motivo esta finalidad se somete a su consentimiento y no al interés legítimo.</p>
            </div>

            <h3>3.3 Cookies de publicidad comportamental y redes sociales</h3>
            <p>Permiten medir la eficacia de nuestras campañas en Facebook, Instagram y LinkedIn, construir audiencias y mostrarle anuncios de IRM Abogados en esas plataformas. Implican <strong>elaboración de perfiles</strong> con fines publicitarios. <strong>Requieren su consentimiento previo</strong> y no se instalan si no lo presta.</p>
            <div className={styles.ckTable}>
              <div className={styles.ckHeader}>
                <span>Cookie</span><span>Proveedor</span><span>Finalidad</span><span>Duración</span><span>Titularidad</span>
              </div>
              <div className={styles.ckRow}>
                <span>_fbp</span>
                <span>Meta Platforms Ireland Ltd.</span>
                <span>Identifica el navegador para atribuir visitas a campañas de Facebook e Instagram y crear audiencias personalizadas.</span>
                <span>3 meses</span>
                <span>Terceros</span>
              </div>
              <div className={styles.ckRow}>
                <span>_fbc</span>
                <span>Meta Platforms Ireland Ltd.</span>
                <span>Registra el identificador del anuncio por el que ha llegado al sitio, cuando procede de un enlace publicitario de Meta.</span>
                <span>3 meses</span>
                <span>Terceros</span>
              </div>
              <div className={styles.ckRow}>
                <span>fr</span>
                <span>Meta Platforms Ireland Ltd.</span>
                <span>Muestra y mide anuncios y evalúa su eficacia. Se aloja en el dominio facebook.com.</span>
                <span>3 meses</span>
                <span>Terceros</span>
              </div>
              <div className={styles.ckRow}>
                <span>li_sugr</span>
                <span>LinkedIn Ireland Unlimited Company</span>
                <span>Identificador probabilístico del navegador para segmentación publicitaria.</span>
                <span>3 meses</span>
                <span>Terceros</span>
              </div>
              <div className={styles.ckRow}>
                <span>bcookie</span>
                <span>LinkedIn Ireland Unlimited Company</span>
                <span>Identificador de navegador utilizado por LinkedIn para funciones de anuncios y análisis.</span>
                <span>1 año</span>
                <span>Terceros</span>
              </div>
              <div className={styles.ckRow}>
                <span>bscookie</span>
                <span>LinkedIn Ireland Unlimited Company</span>
                <span>Versión segura del identificador de navegador de LinkedIn.</span>
                <span>1 año</span>
                <span>Terceros</span>
              </div>
              <div className={styles.ckRow}>
                <span>UserMatchHistory</span>
                <span>LinkedIn Ireland Unlimited Company</span>
                <span>Sincroniza los identificadores publicitarios de LinkedIn.</span>
                <span>30 días</span>
                <span>Terceros</span>
              </div>
              <div className={styles.ckRow}>
                <span>AnalyticsSyncHistory</span>
                <span>LinkedIn Ireland Unlimited Company</span>
                <span>Registra el momento de la sincronización con otros servicios de LinkedIn.</span>
                <span>30 días</span>
                <span>Terceros</span>
              </div>
              <div className={styles.ckRow}>
                <span>li_gc</span>
                <span>LinkedIn Ireland Unlimited Company</span>
                <span>Almacena el consentimiento del usuario respecto de las cookies no esenciales de LinkedIn.</span>
                <span>6 meses</span>
                <span>Terceros</span>
              </div>
              <div className={styles.ckRow}>
                <span>lidc</span>
                <span>LinkedIn Ireland Unlimited Company</span>
                <span>Selecciona el centro de datos que atiende la petición.</span>
                <span>24 horas</span>
                <span>Terceros</span>
              </div>
            </div>
            <p className={styles.tableNote}>Los proveedores externos pueden modificar la denominación o el plazo de sus cookies sin previo aviso. Revisamos periódicamente este inventario y publicamos las actualizaciones en esta misma página.</p>
          </div>

          <div className={styles.block}>
            <h2>4. Base jurídica de cada finalidad</h2>
            <p><strong>Cookies técnicas.</strong> No requieren consentimiento por aplicación de la excepción del artículo 22.2 LSSI-CE, al ser estrictamente necesarias para prestar el servicio que usted solicita. El tratamiento de datos asociado se ampara en el interés legítimo del responsable en el funcionamiento seguro del sitio web (artículo 6.1.f) RGPD).</p>
            <p><strong>Cookies analíticas y de publicidad.</strong> Se instalan únicamente con su <strong>consentimiento previo, libre, específico, informado e inequívoco</strong> (artículos 6.1.a) y 7 RGPD, en relación con el artículo 22.2 LSSI-CE). Ni la continuación de la navegación, ni el desplazamiento por la página, ni el cierre del aviso equivalen a consentimiento.</p>
          </div>

          <div className={styles.block}>
            <h2>5. Cómo presta, modifica o retira su consentimiento</h2>
            <p>Al acceder por primera vez al sitio web verá un aviso con tres opciones presentadas al mismo nivel y con la misma facilidad de uso: <strong>Aceptar todas</strong>, <strong>Rechazar todas</strong> y <strong>Configurar</strong>. Desde «Configurar» puede aceptar unas finalidades y rechazar otras de forma independiente. Ninguna opción viene premarcada.</p>
            <p>Hasta que no realice una elección, <strong>no se instala ninguna cookie sujeta a consentimiento ni se carga ningún script de Google, Meta o LinkedIn</strong>.</p>
            <p>Puede cambiar su decisión en cualquier momento, con la misma facilidad con la que la prestó, desde el enlace «Configuración de cookies» disponible de forma permanente en el pie de página o desde el botón siguiente:</p>
            <CookieSettingsButton className={styles.prefsBtn} />
            <p>Su elección se conserva durante <strong>12 meses</strong>; transcurrido ese plazo volveremos a solicitarle el consentimiento. También le será solicitado de nuevo si incorporamos un proveedor o una finalidad nuevos. Al retirar el consentimiento eliminamos las cookies de nuestra propia titularidad correspondientes a la finalidad revocada; las alojadas en dominios de terceros (por ejemplo, facebook.com o linkedin.com) deberá eliminarlas desde su navegador conforme al apartado 7.</p>
            <p>Rechazar las cookies no limita en modo alguno el acceso a los contenidos ni al formulario de contacto: este sitio web no utiliza muros de cookies.</p>
          </div>

          <div className={styles.block}>
            <h2>6. Destinatarios y transferencias internacionales de datos</h2>
            <p>Si presta su consentimiento, los proveedores indicados en el apartado 3 acceden a los datos recogidos mediante sus cookies y los tratan conforme a sus propias políticas de privacidad:</p>
            <ul>
              <li><strong>Google:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></li>
              <li><strong>Meta Platforms (Facebook e Instagram):</strong> <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">facebook.com/privacy/policy</a></li>
              <li><strong>LinkedIn:</strong> <a href="https://es.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">linkedin.com/legal/privacy-policy</a></li>
            </ul>
            <p>Estos tratamientos implican <strong>transferencias internacionales de datos a Estados Unidos</strong> (Google LLC, Meta Platforms Inc. y LinkedIn Corporation). Dichas transferencias se amparan en la Decisión de Ejecución (UE) 2023/1795 de la Comisión Europea, que declaró el nivel adecuado de protección del Marco de Privacidad de Datos UE-EE. UU. (EU-U.S. Data Privacy Framework), al que las tres entidades están adheridas. Cuando un proveedor no esté certificado en dicho marco, la transferencia se ampara en las Cláusulas Contractuales Tipo aprobadas por la Comisión Europea, junto con las medidas complementarias que resulten necesarias.</p>
            <p>Puede consultar la vigencia de la certificación de cada entidad en <a href="https://www.dataprivacyframework.gov" target="_blank" rel="noopener noreferrer">dataprivacyframework.gov</a>. Si rechaza las cookies analíticas y publicitarias, no se produce ninguna de estas transferencias.</p>
          </div>

          <div className={styles.block}>
            <h2>7. Cómo gestionar las cookies desde su navegador</h2>
            <p>Con independencia del panel de configuración de este sitio, puede configurar su navegador para bloquear o eliminar cookies:</p>
            <ul>
              <li><strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies de terceros.</li>
              <li><strong>Mozilla Firefox:</strong> Ajustes → Privacidad y seguridad → Cookies y datos del sitio.</li>
              <li><strong>Safari:</strong> Ajustes → Privacidad → Gestionar datos de sitios web.</li>
              <li><strong>Microsoft Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies.</li>
            </ul>
            <p>Adicionalmente, Google ofrece un complemento de inhabilitación de Google Analytics para navegadores de escritorio en <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a>, y puede gestionar la publicidad personalizada de Meta y de LinkedIn desde la configuración de su cuenta en cada plataforma.</p>
            <p>El bloqueo indiscriminado de cookies desde el navegador puede afectar a otros sitios web, pero no impide la navegación en este.</p>
          </div>

          <div className={styles.block}>
            <h2>8. Elaboración de perfiles</h2>
            <p>Las cookies del apartado 3.3 permiten a Meta y a LinkedIn asociar su visita con su perfil en dichas plataformas y mostrarle publicidad segmentada. Esta elaboración de perfiles tiene finalidad exclusivamente publicitaria y <strong>no produce efectos jurídicos ni le afecta significativamente de modo similar</strong>, por lo que no constituye una decisión automatizada de las previstas en el artículo 22 RGPD. Puede oponerse a ella retirando su consentimiento en cualquier momento.</p>
          </div>

          <div className={styles.block}>
            <h2>9. Sus derechos</h2>
            <p>Puede ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar el consentimiento prestado, dirigiéndose a <a href="mailto:correo@irmabogados.es">correo@irmabogados.es</a> o a C/ En medio, 22 — 6º, 12001 Castellón de la Plana, acreditando su identidad. La retirada del consentimiento no afecta a la licitud del tratamiento realizado con anterioridad.</p>
            <p>Si considera que sus derechos no han sido debidamente atendidos, puede presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>), C/ Jorge Juan, 6, 28001 Madrid.</p>
          </div>

          <div className={styles.block}>
            <h2>10. Actualización de esta política</h2>
            <p>IRM Abogados puede modificar esta Política de Cookies para adaptarla a cambios normativos, a los criterios de la Agencia Española de Protección de Datos o a la incorporación de nuevos proveedores o finalidades. En este último caso, volveremos a solicitar su consentimiento antes de instalar las nuevas cookies. Le recomendamos consultar esta página periódicamente; la fecha de la última revisión figura al inicio del documento.</p>
          </div>

          <div className={styles.block}>
            <h2>11. Más información</h2>
            <p>Para conocer el resto de tratamientos de datos personales que realizamos, consulte nuestra <a href="/politica-de-privacidad">Política de Privacidad</a>. Para cualquier duda sobre esta política puede escribirnos a <a href="mailto:correo@irmabogados.es">correo@irmabogados.es</a>.</p>
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
            <div className={styles.sideTitle}>Sus preferencias</div>
            <p>Puede revisar o cambiar en cualquier momento qué cookies autoriza.</p>
            <CookieSettingsButton className={styles.prefsBtn} />
          </div>
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>¿Tienes alguna duda?</div>
            <p>Para cualquier consulta sobre cookies o privacidad, contáctanos directamente.</p>
            <a href="mailto:correo@irmabogados.es" className={styles.sideBtn}>correo@irmabogados.es</a>
          </div>
        </div>
      </section>
    </>
  )
}
