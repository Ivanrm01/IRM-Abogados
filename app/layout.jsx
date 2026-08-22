import './globals.css'
import Script from 'next/script'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import CookieConsent from '@/components/CookieConsent'
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
      <head>
        {/*
          Google Consent Mode v2. Se ejecuta antes que cualquier etiqueta y deja
          todo denegado por defecto: sin consentimiento no se carga ni Google
          Analytics, ni Meta Pixel, ni LinkedIn Insight Tag (art. 22.2 LSSI-CE).
        */}
        <Script id="consent-mode-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              personalization_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              wait_for_update: 500
            });
          `}
        </Script>
      </head>
      <body>
        <JsonLdOrganizacion />
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  )
}
