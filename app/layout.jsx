import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: { default: 'IRM Abogados | Abogados Fiscalistas Madrid y Castellón', template: '%s | IRM Abogados' },
  description: 'Especialistas en derecho tributario. Asesoramiento para empresas y particulares en Madrid y Castellón. Primera consulta gratuita.',
  keywords: ['abogados fiscalistas', 'derecho tributario', 'asesoramiento fiscal Madrid', 'aplazar deuda Hacienda'],
  openGraph: { type: 'website', locale: 'es_ES', siteName: 'IRM Abogados' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
