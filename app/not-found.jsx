import Link from 'next/link'

export const metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
}

const enlaces = [
  { href: '/fiscal', t: 'Asesoramiento fiscal', d: 'IRPF, Sociedades, IVA, Patrimonio y defensa ante la AEAT.' },
  { href: '/garantias-deuda-aeat', t: 'Garantías tributarias', d: 'Aplazar, fraccionar o suspender una deuda con Hacienda.' },
  { href: '/derivaciones-responsabilidad-tributaria', t: 'Derivación de responsabilidad', d: 'Defensa frente a los artículos 42 y 43 LGT.' },
  { href: '/asesoramiento-start-ups', t: 'Start-Ups', d: 'Constitución, pacto de socios, ESOPs y rondas de inversión.' },
  { href: '/blog', t: 'Blog fiscal', d: 'Actualidad tributaria analizada por nuestros especialistas.' },
  { href: '/contacto', t: 'Contacto', d: 'Cuéntanos tu caso. Respondemos en menos de 24 horas.' },
]

export default function NotFound() {
  return (
    <section style={{ padding: '160px var(--gutter) 96px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ width: '60px', height: '2px', background: 'var(--gold)', marginBottom: '28px' }} />
      <div className="eyebrow">Error 404</div>
      <h1>Esta página<br /><em>no existe</em></h1>
      <p style={{ maxWidth: '620px', marginTop: '20px', color: 'var(--mid)' }}>
        Puede que el enlace esté anticuado o que la dirección se haya escrito mal.
        Estas son las secciones principales:
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '18px',
        marginTop: '48px',
      }}>
        {enlaces.map(e => (
          <Link key={e.href} href={e.href} style={{
            display: 'block',
            padding: '26px 24px',
            background: 'var(--white)',
            border: '1px solid var(--cream-dark)',
            textDecoration: 'none',
            color: 'inherit',
          }}>
            <div style={{ fontWeight: 500, marginBottom: '8px' }}>{e.t}</div>
            <div style={{ fontSize: '14px', color: 'var(--mid)', lineHeight: 1.6 }}>{e.d}</div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '52px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <Link href="/" className="btn-gold">Volver al inicio</Link>
        <a href="tel:+34614149465" className="btn-ghost">+34 614 149 465</a>
      </div>
    </section>
  )
}
