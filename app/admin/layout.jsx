export const metadata = {
  title: 'Admin | IRM Abogados',
}

export default function AdminLayout({ children }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 10001,
      background: '#f4f5f7',
      overflowY: 'auto',
    }}>
      {children}
    </div>
  )
}
