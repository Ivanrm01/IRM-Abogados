import styles from './legal.module.css'

export const metadata = {
  title: 'Política de Cookies | IRM Tax & Legal',
  description: 'Política de cookies de IRM Abogados & Asesores. Información sobre los tipos de cookies utilizadas y cómo gestionarlas.',
}

export default function CookiesPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.breadcrumb}>Inicio <span>/ Política de cookies</span></div>
        <div className={styles.eyebrow}>Cookies</div>
        <h1 className={styles.heroTitle}>Política de <em>cookies</em></h1>
        <p className={styles.heroDesc}>Información sobre las cookies que utiliza www.irmabogadosasesores.com, su finalidad y cómo puede gestionarlas o desactivarlas.</p>
        <div className={styles.heroBadge}>Última actualización: enero de 2025</div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>

          <div className={styles.block}>
            <h2>1. ¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que los sitios web envían al navegador del usuario y que quedan almacenados en su dispositivo (ordenador, tablet, smartphone, etc.). Las cookies permiten que el sitio web recuerde información sobre su visita, lo que facilita la navegación y hace que el sitio sea más útil.</p>
            <p>Las cookies no dañan su equipo ni contienen virus. Son simplemente datos que el sitio web almacena en su navegador para poder recordar información entre páginas o entre sesiones.</p>
          </div>

          <div className={styles.block}>
            <h2>2. Tipos de cookies que utilizamos</h2>

            <h3>2.1 Cookies técnicas o necesarias</h3>
            <p>Son aquellas que permiten al usuario la navegación a través del sitio web y la utilización de las diferentes opciones o servicios que en él existen. Son estrictamente necesarias para el funcionamiento del sitio y no pueden desactivarse sin afectar a la usabilidad.</p>
            <div className={styles.cookieTable}>
              <div className={styles.cookieHeader}>
                <span>Cookie</span><span>Finalidad</span><span>Duración</span><span>Tipo</span>
              </div>
              <div className={styles.cookieRow}><span>session_id</span><span>Mantener la sesión del usuario activa durante la navegación</span><span>Sesión</span><span>Propia</span></div>
              <div className={styles.cookieRow}><span>csrf_token</span><span>Protección frente a ataques de falsificación de solicitudes</span><span>Sesión</span><span>Propia</span></div>
            </div>

            <h3>2.2 Cookies analíticas</h3>
            <p>Permiten cuantificar el número de usuarios y analizar cómo interactúan con el sitio web. La información recogida es estadística y anónima, y se utiliza para mejorar el sitio y la experiencia del usuario.</p>
            <div className={styles.cookieTable}>
              <div className={styles.cookieHeader}>
                <span>Cookie</span><span>Finalidad</span><span>Duración</span><span>Tipo</span>
              </div>
              <div className={styles.cookieRow}><span>_ga</span><span>Google Analytics: distingue usuarios únicos</span><span>2 años</span><span>Terceros</span></div>
              <div className={styles.cookieRow}><span>_ga_*</span><span>Google Analytics: mantiene el estado de la sesión</span><span>2 años</span><span>Terceros</span></div>
              <div className={styles.cookieRow}><span>_gid</span><span>Google Analytics: distingue usuarios</span><span>24 horas</span><span>Terceros</span></div>
            </div>

            <h3>2.3 Cookies de preferencias o personalización</h3>
            <p>Permiten al sitio web recordar información que cambia el comportamiento o aspecto del mismo, como el idioma preferido o la región en la que se encuentra el usuario.</p>
            <div className={styles.cookieTable}>
              <div className={styles.cookieHeader}>
                <span>Cookie</span><span>Finalidad</span><span>Duración</span><span>Tipo</span>
              </div>
              <div className={styles.cookieRow}><span>cookie_consent</span><span>Recuerda las preferencias de cookies del usuario</span><span>1 año</span><span>Propia</span></div>
            </div>
          </div>

          <div className={styles.block}>
            <h2>3. Cookies de terceros</h2>
            <p>Nuestro sitio web puede utilizar servicios de terceros que, a su vez, instalan cookies en su dispositivo. Los principales servicios de terceros utilizados son:</p>
            <ul>
              <li><strong>Google Analytics (Google LLC):</strong> Herramienta de análisis web que permite medir el tráfico y el comportamiento de los usuarios. Google puede utilizar los datos recopilados para contextualizar y personalizar los anuncios de su propia red publicitaria. Puede consultar la política de privacidad de Google en <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.</li>
            </ul>
          </div>

          <div className={styles.block}>
            <h2>4. Base legal para el uso de cookies</h2>
            <p>El uso de cookies técnicas o estrictamente necesarias tiene como base jurídica el interés legítimo del responsable del tratamiento para garantizar el correcto funcionamiento del sitio web.</p>
            <p>El uso de cookies analíticas y de preferencias requiere el consentimiento previo del usuario, conforme a lo establecido en el artículo 22.2 de la Ley 34/2002 (LSSICE) y en el Reglamento (UE) 2016/679 (RGPD). Dicho consentimiento se recaba a través del panel de gestión de cookies que aparece en la primera visita al sitio web.</p>
          </div>

          <div className={styles.block}>
            <h2>5. Cómo gestionar y desactivar las cookies</h2>
            <p>El usuario puede gestionar sus preferencias de cookies en cualquier momento a través del panel de configuración de cookies disponible en el pie de página del sitio web.</p>
            <p>Adicionalmente, el usuario puede configurar su navegador para aceptar o rechazar todas las cookies, o para recibir un aviso cuando un sitio web intente instalar una cookie. Cada navegador tiene su propio método para gestionar las cookies:</p>
            <ul>
              <li><strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios.</li>
              <li><strong>Mozilla Firefox:</strong> Opciones → Privacidad & Seguridad → Cookies y datos del sitio.</li>
              <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitio web.</li>
              <li><strong>Microsoft Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies.</li>
            </ul>
            <p>Tenga en cuenta que la desactivación de algunas cookies puede afectar al funcionamiento correcto del sitio web y a la experiencia de navegación.</p>
          </div>

          <div className={styles.block}>
            <h2>6. Transferencias internacionales de datos</h2>
            <p>Algunos de los terceros que utilizan cookies en nuestro sitio web pueden transferir datos a países fuera del Espacio Económico Europeo. En particular, Google LLC está sujeto al marco de privacidad de datos UE-EE.UU. (EU-US Data Privacy Framework), que proporciona las garantías adecuadas para dichas transferencias.</p>
          </div>

          <div className={styles.block}>
            <h2>7. Actualización de la política de cookies</h2>
            <p>IRM Abogados & Asesores puede modificar la presente Política de Cookies en función de exigencias legislativas, reglamentarias, o con la finalidad de adaptar dicha política a las instrucciones dictadas por la Agencia Española de Protección de Datos. Cuando se produzcan cambios significativos, el usuario será informado mediante un aviso visible en el sitio web.</p>
          </div>

          <div className={styles.block}>
            <h2>8. Más información</h2>
            <p>Para más información sobre el tratamiento de sus datos personales, le rogamos consulte nuestra <a href="/politica-de-privacidad">Política de Privacidad</a>. Si tiene alguna duda sobre nuestra política de cookies, puede contactar con nosotros en <a href="mailto:correo@irmabogados.es">correo@irmabogados.es</a>.</p>
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
            <p>Para cualquier consulta sobre cookies o privacidad, contáctanos directamente.</p>
            <a href="mailto:correo@irmabogados.es" className={styles.sideBtn}>correo@irmabogados.es</a>
          </div>
        </div>
      </section>
    </>
  )
}
