import Diagnostico from './Diagnostico'

export const metadata = {
  title: 'Diagnóstico de desviación sectorial | Compara tu empresa con tu CNAE',
  description: 'Herramienta gratuita: compara los ratios de tu empresa con los de tu actividad y tamaño según datos públicos del INE y la AEAT. Sin registro y sin enviar tus cifras a ningún servidor.',
  keywords: 'ratios sectoriales, riesgo inspección Hacienda, auditoría fiscal empresa, comparativa CNAE, desviación sectorial AEAT, revisión fiscal pyme',
  alternates: { canonical: '/diagnostico-fiscal' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'IRM Abogados',
    url: '/diagnostico-fiscal',
    title: 'Dónde se separa tu empresa de su sector',
    description: 'Diez cifras de tu cuenta de resultados y sabrás por dónde asomas frente a las empresas de tu misma actividad y tamaño.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'IRM Abogados' }],
  },
}

export default function DiagnosticoPage() {
  return <Diagnostico />
}
