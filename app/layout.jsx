import './globals.css'
import Script from 'next/script'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { JsonLdOrganizacion } from '@/components/JsonLd'

export const metadata = {
  title: { default: 'IRM Abogados | Abogados Fiscalistas Madrid y Castellón', template: '%s | IRM Abogados' },
  description: 'Especialistas en derecho tributario. Asesoramiento para empresas y particulares en Madrid y Castellón. Primera consulta gratuita.',
  keywords: ['abogados fiscalistas', 'derecho tributario', 'asesoramiento fiscal Madrid', 'aplazar deuda Hacienda'],
  metadataBase: new URL('https://www.irmabogadosasesores.com'),
  openGraph: {
  type: 'website',
  locale: 'es_ES',
  siteName: 'IRM Abogados',
  url: 'https://www.irmabogadosasesores.com',
  title: 'IRM Abogados | Abogados Fiscalistas Madrid y Castellón',
  description: 'Especialistas en derecho tributario. Planificación fiscal, defensa ante la AEAT y asesoramiento a Start-Ups.',
  images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'IRM Abogados' }],
},
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BQ057SC5B6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BQ057SC5B6');
          `}
        </Script>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
