import styles from './legal.module.css'

export const metadata = {
  title: 'Política de Privacidad | IRM Abogados',
  description: 'Política de privacidad de IRM Abogados. Información sobre el tratamiento de datos personales conforme al RGPD y la LOPDGDD.',
}

export default function PrivacidadPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroLine}></div>
        <div className={styles.breadcrumb}>Inicio <span>/ Política de privacidad</span></div>
        <div className={styles.eyebrow}>Protección de datos</div>
        <h1 className={styles.heroTitle}>Política de <em>privacidad</em></h1>
        <p className={styles.heroDesc}>Información sobre el tratamiento de sus datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).</p>
        <div className={styles.heroBadge}>Última actualización: enero de 2025</div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>

          <div className={styles.block}>
            <h2>1. Responsable del tratamiento</h2>
            <div className={styles.dataTable}>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Responsable</div><div className={styles.dataVal}>IRM Abogados</div></div>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Domicilio</div><div className={styles.dataVal}>C/ En medio, 22 — 6º, 12001 Castellón</div></div>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Email</div><div className={styles.dataVal}>correo@irmabogados.es</div></div>
              <div className={styles.dataRow}><div className={styles.dataLabel}>Teléfono</div><div className={styles.dataVal}>+34 614 149 465</div></div>
            </div>
          </div>

          <div className={styles.block}>
            <h2>2. Datos que tratamos y finalidades</h2>
            <p>En función de los servicios que el usuario solicite o utilice, IRM Abogados puede tratar las siguientes categorías de datos personales:</p>

            <h3>2.1 Formulario de contacto</h3>
            <ul>
              <li><strong>Datos:</strong> Nombre, apellidos, email, teléfono, motivo de la consulta y mensaje.</li>
              <li><strong>Finalidad:</strong> Atender la consulta del usuario y proporcionar la información solicitada sobre nuestros servicios.</li>
              <li><strong>Base jurídica:</strong> Consentimiento del interesado (art. 6.1.a RGPD).</li>
              <li><strong>Conservación:</strong> Hasta la resolución de la consulta y durante el plazo máximo de 1 año adicional.</li>
            </ul>

            <h3>2.2 Relación contractual con clientes</h3>
            <ul>
              <li><strong>Datos:</strong> Datos identificativos, de contacto, económicos y fiscales necesarios para la prestación del servicio.</li>
              <li><strong>Finalidad:</strong> Gestión, mantenimiento y control de la relación contractual; prestación de servicios de asesoramiento jurídico-tributario; cumplimiento de obligaciones legales.</li>
              <li><strong>Base jurídica:</strong> Ejecución de contrato (art. 6.1.b RGPD) y cumplimiento de obligaciones legales (art. 6.1.c RGPD).</li>
              <li><strong>Conservación:</strong> Durante la vigencia de la relación contractual y, una vez finalizada, durante los plazos de prescripción legalmente establecidos (con carácter general, 6 años según la legislación mercantil y tributaria).</li>
            </ul>

            <h3>2.3 Comunicaciones comerciales y newsletter</h3>
            <ul>
              <li><strong>Datos:</strong> Email y nombre.</li>
              <li><strong>Finalidad:</strong> Envío de información sobre novedades fiscales, tributarias y servicios del despacho.</li>
              <li><strong>Base jurídica:</strong> Consentimiento del interesado (art. 6.1.a RGPD).</li>
              <li><strong>Conservación:</strong> Hasta que el usuario retire su consentimiento.</li>
            </ul>
          </div>

          <div className={styles.block}>
            <h2>3. Destinatarios de los datos</h2>
            <p>IRM Abogados no cede ni comunica datos personales a terceros, salvo en los siguientes supuestos:</p>
            <ul>
              <li>Proveedores de servicios tecnológicos necesarios para el funcionamiento del Sitio Web y la prestación de servicios (hosting, email, etc.), con los que se mantienen los contratos de encargo de tratamiento exigidos por la normativa.</li>
              <li>Administraciones Públicas y Organismos Reguladores cuando sea legalmente exigible (Agencia Tributaria, Tribunales, etc.).</li>
              <li>Entidades bancarias para la gestión de pagos.</li>
            </ul>
            <p>No se realizan transferencias internacionales de datos a países fuera del Espacio Económico Europeo, salvo que se cuente con las garantías adecuadas previstas en el RGPD.</p>
          </div>

          <div className={styles.block}>
            <h2>4. Derechos del interesado</h2>
            <p>En virtud de lo establecido en el RGPD y la LOPDGDD, el interesado puede ejercer en cualquier momento los siguientes derechos:</p>
            <ul>
              <li><strong>Acceso:</strong> Conocer qué datos personales trata IRM Abogados sobre usted.</li>
              <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos.</li>
              <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos cuando, entre otros motivos, ya no sean necesarios para los fines para los que fueron recogidos.</li>
              <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos en determinadas circunstancias.</li>
              <li><strong>Limitación del tratamiento:</strong> Solicitar la restricción del tratamiento de sus datos en determinados supuestos.</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado, de uso común y lectura mecánica.</li>
              <li><strong>Retirada del consentimiento:</strong> Retirar en cualquier momento el consentimiento prestado, sin que ello afecte a la licitud del tratamiento previo a su retirada.</li>
            </ul>
            <p>Para ejercer estos derechos, el interesado puede dirigirse a IRM Abogados mediante escrito a la dirección postal indicada o al email <a href="mailto:correo@irmabogados.es">correo@irmabogados.es</a>, adjuntando copia de su DNI o documento identificativo equivalente.</p>
            <p>Asimismo, el interesado tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) si considera que el tratamiento de sus datos no es conforme a la normativa vigente. Puede hacerlo a través de la sede electrónica de la AEPD en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.</p>
          </div>

          <div className={styles.block}>
            <h2>5. Confidencialidad y secreto profesional</h2>
            <p>En virtud de la relación de asesoramiento jurídico, IRM Abogados está sujeto al deber de secreto profesional respecto de toda la información y documentación que el cliente le facilite con ocasión de la prestación de los servicios contratados. Dicho deber se mantiene con carácter indefinido, incluso tras la finalización de la relación profesional.</p>
          </div>

          <div className={styles.block}>
            <h2>6. Medidas de seguridad</h2>
            <p>IRM Abogados ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado, teniendo en cuenta el estado de la tecnología, la naturaleza de los datos almacenados y los riesgos a los que están expuestos, según lo establecido en la normativa vigente en materia de protección de datos.</p>
          </div>

          <div className={styles.block}>
            <h2>7. Actualización de la política</h2>
            <p>IRM Abogados & Asesores se reserva el derecho a modificar la presente Política de Privacidad para adaptarla a cambios normativos o jurisprudenciales. En todo caso, las modificaciones realizadas serán notificadas a los usuarios con suficiente antelación y publicadas en el Sitio Web.</p>
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
            <div className={styles.sideTitle}>Ejercer tus derechos</div>
            <p>Para cualquier consulta sobre el tratamiento de tus datos personales, contacta con nosotros.</p>
            <a href="mailto:correo@irmabogados.es" className={styles.sideBtn}>Contactar</a>
          </div>
        </div>
      </section>
    </>
  )
}
