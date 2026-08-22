'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { readConsent, CONSENT_EVENT } from '@/lib/consent'

// IDs en variables de entorno. Si no están definidas, el script no se carga.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID

/**
 * Ninguna etiqueta de terceros se inyecta hasta que el usuario consiente
 * la finalidad correspondiente (art. 22.2 LSSI-CE). Al revocar, se actualiza
 * el Consent Mode y se eliminan las cookies de primera parte (lib/consent.js).
 */
export default function Analytics() {
  const [consent, setConsent] = useState(null)

  useEffect(() => {
    setConsent(readConsent())
    const onChange = (e) => setConsent(e.detail ?? null)
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  const analytics = consent?.analytics === true
  const marketing = consent?.marketing === true

  // Consent Mode v2: comunica el estado a Google en cada cambio.
  useEffect(() => {
    if (typeof window.gtag !== 'function') return
    window.gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
      personalization_storage: marketing ? 'granted' : 'denied',
    })
  }, [analytics, marketing])

  // Meta Pixel: revoca el seguimiento si el usuario retira el consentimiento.
  useEffect(() => {
    if (typeof window.fbq !== 'function') return
    window.fbq('consent', marketing ? 'grant' : 'revoke')
  }, [marketing])

  return (
    <>
      {analytics && GA_ID && (
        <>
          <Script
            id="ga-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {marketing && META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', 'grant');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {marketing && LINKEDIN_PARTNER_ID && (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`
            window._linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
            (function(l){
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript"; b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
      )}
    </>
  )
}
