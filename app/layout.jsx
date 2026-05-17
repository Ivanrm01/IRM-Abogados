import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: { default: 'IRM Tax & Legal | Abogados Fiscalistas Madrid y Castellón', template: '%s | IRM Tax & Legal' },
  description: 'Especialistas en derecho fiscal, tributario y mercantil. Asesoramiento para empresas y particulares en Madrid y Castellón. Primera consulta gratuita.',
  keywords: ['abogados fiscalistas', 'derecho tributario', 'asesoramiento fiscal Madrid', 'aplazar deuda Hacienda'],
  openGraph: { type: 'website', locale: 'es_ES', siteName: 'IRM Tax & Legal' },
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
