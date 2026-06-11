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
      { source: '/garantias-inmobiliarias-aplazar-fraccionar-suspender-deuda-aeat', destination: '/garantias-deuda-aeat', permanent: true },

      // Política de privacidad / cookies (con y sin tilde codificada)
      { source: '/pol%C3%ADtica-de-privacidad', destination: '/politica-de-privacidad', permanent: true },
      { source: '/política-de-privacidad', destination: '/politica-de-privacidad', permanent: true },
      { source: '/pol%C3%ADtica-de-cookies', destination: '/politica-de-cookies', permanent: true },
      { source: '/política-de-cookies', destination: '/politica-de-cookies', permanent: true },

      // ===== Artículos del blog antiguos /post/... → /blog/... =====
      // Comodín: cualquier /post/loquesea redirige a /blog/loquesea (slugs sin tilde)
      { source: '/post/:slug*', destination: '/blog/:slug*', permanent: true },
    ]
  },
}

export default nextConfig
