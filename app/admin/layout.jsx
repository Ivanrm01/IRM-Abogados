export const metadata = {
  title: 'Admin | IRM Tax & Legal',
}

export default function AdminLayout({ children }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 10001,
      background: '#f4f5f7',
    }}>
      {children}
    </div>
  )
}
