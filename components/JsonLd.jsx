const BASE = 'https://www.irmabogadosasesores.com'

export function JsonLdOrganizacion() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${BASE}/#organizacion`,
    name: 'IRM Abogados',
    url: BASE,
    logo: `${BASE}/logo-irm.png`,
    image: `${BASE}/og-default.jpg`,
    description: 'Despacho especializado en derecho fiscal y tributario. Planificación fiscal, defensa ante la AEAT, aplazamiento y suspensión de deudas, derivaciones de responsabilidad y asesoramiento a Start-Ups.',
    email: 'correo@irmabogados.es',
    telephone: '+34614149465',
    priceRange: '$$',
    areaServed: { '@type': 'Country', name: 'España' },
    sameAs: [
      'https://www.linkedin.com/company/irm-abogados-asesores',
      'https://www.instagram.com/irmabogados/',
      'https://www.facebook.com/irmabogados/',
    ],
    location: [
      {
        '@type': 'LegalService',
        name: 'IRM Abogados — Madrid',
        telephone: '+34614149465',
        email: 'correo@irmabogados.es',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'C/ José Ortega y Gasset, 84 — 2º C',
          addressLocality: 'Madrid',
          postalCode: '28006',
          addressRegion: 'Madrid',
          addressCountry: 'ES',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 40.4295449, longitude: -3.6728827 },
        hasMap: 'https://www.google.com/maps/place/?q=place_id:ChIJKUiFqZgpQg0RV-I-ac1bG4s',
        openingHoursSpecification: [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
          opens: '08:00',
          closes: '19:00',
        }],
      },
      {
        '@type': 'LegalService',
        name: 'IRM Abogados — Castellón',
        telephone: '+34614149465',
        email: 'correo@irmabogados.es',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'C/ En Medio, 22 — 6º',
          addressLocality: 'Castellón de la Plana',
          postalCode: '12001',
          addressRegion: 'Castellón',
          addressCountry: 'ES',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 39.9851349, longitude: -0.0386878 },
        hasMap: 'https://www.google.com/maps/place/?q=place_id:ChIJtwgvmzv_Xw0RswyxvCi2JAs',
        openingHoursSpecification: [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
          opens: '08:00',
          closes: '19:00',
        }],
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function JsonLdFaq({ faqs }) {
  if (!faqs?.length) return null
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
