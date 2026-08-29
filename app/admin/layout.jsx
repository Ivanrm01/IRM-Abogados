export const metadata = {
  title: 'Admin | IRM Abogados',
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '100dvh',
      zIndex: 10001,
      background: '#f4f5f7',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'contain',
    }}>
      {children}
    </div>
  )
}
