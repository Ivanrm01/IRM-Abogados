/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  async redirects() {
    return [
      // ===== Páginas estáticas antiguas (Wix) → nuevas =====
      { source: '/abogados-tributarios-fiscales', destination: '/fiscal', permanent: true },
      { source: '/abogados-fiscalistas-madrid-castellon', destination: '/sobre-nosotros', permanent: true },
      { source: '/abogados-fiscalistas-en-madrid-castellón', destination: '/sobre-nosotros', permanent: true },
      { source: '/abogados-fiscalistas-en-madrid-castell%C3%B3n', destination: '/sobre-nosotros', permanent: true },
      { source: '/garantias-inmobiliarias-aplazar-fraccionar-suspender-deuda-aeat', destination: '/garantias-deuda-aeat', permanent: true },
      { source: '/abogados-tributarios', destination: '/fiscal', permanent: true },
      { source: '/despacho-de-abogados-en-castellón', destination: '/sobre-nosotros', permanent: true },
      { source: '/despacho-de-abogados-en-castell%C3%B3n', destination: '/sobre-nosotros', permanent: true },


      // Política de privacidad / cookies (con y sin tilde codificada)
      { source: '/pol%C3%ADtica-de-privacidad', destination: '/politica-de-privacidad', permanent: true },
      { source: '/política-de-privacidad', destination: '/politica-de-privacidad', permanent: true },
      { source: '/pol%C3%ADtica-de-cookies', destination: '/politica-de-cookies', permanent: true },
      { source: '/política-de-cookies', destination: '/politica-de-cookies', permanent: true },

      // ===== Artículos del blog con TILDE en el slug viejo → slug nuevo SIN tilde =====
      { source: '/blog/deducibilidad-iva-veh%C3%ADculos-alta-gama', destination: '/blog/deducibilidad-iva-vehiculos-alta-gama', permanent: true },
      { source: '/blog/suspensi%C3%B3n-ejecuci%C3%B3n-acto-impugnado-v%C3%ADa-econ%C3%B3mico-administrativa', destination: '/blog/suspension-ejecucion-acto-impugnado-via-economico-administrativa', permanent: true },
      { source: '/blog/tsjcv-anulaci%C3%B3n-declaraci%C3%B3n-responsabilidad-subsidiaria-43-1-b-lgt', destination: '/blog/tsjcv-anulacion-declaracion-responsabilidad-subsidiaria-43-1-b-lgt', permanent: true },
      { source: '/blog/cambio-residencia-criptomonedas-exit-tax-art%C3%ADculo-95-bis-lirpf', destination: '/blog/cambio-residencia-criptomonedas-exit-tax-articulo-95-bis-lirpf', permanent: true },
      { source: '/blog/tear-comunidad-valenciana-anulaci%C3%B3n-declaraci%C3%B3n-responsabilidad-43-1-a-lgt', destination: '/blog/tear-comunidad-valenciana-anulacion-declaracion-responsabilidad-43-1-a-lgt', permanent: true },
      { source: '/blog/categories/:path*', destination: '/blog', permanent: true },


      // ===== Artículos del blog antiguos /post/... → /blog/... (slugs sin tilde) =====
      { source: '/post/:slug*', destination: '/blog/:slug*', permanent: true },
    ]
  },
}

export default nextConfig
