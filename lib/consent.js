// lib/consent.js
// Gestión del consentimiento de cookies (art. 22.2 LSSI-CE + RGPD)
// Guía de la AEPD sobre el uso de las cookies (versión vigente).

export const CONSENT_COOKIE = 'irm_consent'

// Subir esta versión obliga a volver a solicitar el consentimiento
// (por ejemplo, al añadir un nuevo proveedor o finalidad).
export const CONSENT_VERSION = 1

// La AEPD fija un máximo de 24 meses. Usamos 12 por prudencia.
export const CONSENT_MAX_AGE_DAYS = 365

export const CONSENT_EVENT = 'irm:consent-change'

export const CATEGORIES = ['analytics', 'marketing']

export const DENY_ALL = { analytics: false, marketing: false }
export const ALLOW_ALL = { analytics: true, marketing: true }

/** Lee el consentimiento almacenado. Devuelve null si no hay o si caducó la versión. */
export function readConsent() {
  if (typeof document === 'undefined') return null
  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
  if (!raw) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(raw.slice(CONSENT_COOKIE.length + 1)))
    if (parsed.v !== CONSENT_VERSION) return null
    return {
      v: parsed.v,
      ts: parsed.ts,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    }
  } catch {
    return null
  }
}

/** Guarda el consentimiento y notifica al resto de la aplicación. */
export function writeConsent(prefs) {
  const value = {
    v: CONSENT_VERSION,
    ts: new Date().toISOString(), // prueba del consentimiento (accountability, art. 7.1 RGPD)
    analytics: prefs.analytics === true,
    marketing: prefs.marketing === true,
  }
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : ''
  document.cookie =
    `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}` +
    `; path=/; max-age=${CONSENT_MAX_AGE_DAYS * 24 * 60 * 60}; SameSite=Lax${secure}`

  if (!value.analytics || !value.marketing) {
    clearNonEssentialCookies(value)
  }

  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
  return value
}

/** Borra la propia cookie de consentimiento (el banner volverá a mostrarse). */
export function resetConsent() {
  document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0; SameSite=Lax`
  clearNonEssentialCookies(DENY_ALL)
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }))
}

const ANALYTICS_COOKIES = [/^_ga$/, /^_ga_/, /^_gid$/, /^_gat/]
const MARKETING_COOKIES = [/^_fbp$/, /^_fbc$/, /^li_sugr$/, /^_gcl_/]

/**
 * Elimina las cookies de primera parte de las categorías revocadas.
 * Las cookies alojadas en dominios de terceros (.linkedin.com, .facebook.com)
 * no son accesibles desde aquí; se informa de ello en la política de cookies.
 */
function clearNonEssentialCookies(consent) {
  if (typeof document === 'undefined') return
  const patterns = [
    ...(consent.analytics ? [] : ANALYTICS_COOKIES),
    ...(consent.marketing ? [] : MARKETING_COOKIES),
  ]
  if (!patterns.length) return

  const host = location.hostname
  const parts = host.split('.')
  const domains = ['', host]
  if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'))
  else if (parts.length === 2) domains.push('.' + host)

  document.cookie.split('; ').forEach((entry) => {
    const name = entry.split('=')[0]
    if (!patterns.some((re) => re.test(name))) return
    domains.forEach((domain) => {
      document.cookie =
        `${name}=; path=/; max-age=0` + (domain ? `; domain=${domain}` : '')
    })
  })
}
