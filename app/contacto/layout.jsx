export const metadata = {
  title: 'Contacto | Consulta Fiscal Gratuita',
  description: 'Primera consulta gratuita, respuesta en menos de 24 horas. Sedes en Madrid y Castellón y atención online en toda España.',
  alternates: { canonical: '/contacto' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'IRM Abogados',
    url: '/contacto',
    title: 'Contacto | Consulta fiscal gratuita',
    description: 'Primera consulta gratuita y respuesta en menos de 24 horas. Sedes en Madrid y Castellón y atención online en toda España.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'IRM Abogados' }],
  },
}

export default function ContactoLayout({ children }) {
  return children
}
