'use client'
import { useState, useEffect } from 'react'
import s from './crm.module.css'

const api = async (url, opts = {}) => {
  const res = await fetch(url, {
    cache: 'no-store', credentials: 'same-origin', ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  })
  if (res.status === 401) { window.location.reload(); throw new Error('Sesión caducada') }
  const d = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(d.error || 'No se pudo completar la operación')
  return d
}

const fecha = (v) => {
  if (!v) return 'Nunca'
  const d = new Date(v)
  return isNaN(d) ? '—' : d.toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const NUEVO = { nombre: '', email: '', password: '' }

export default function Usuarios({ usuario }) {
  const [lista, setLista] = useState([])
  const [yo, setYo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [aviso, setAviso] = useState('')
  const [error, setError] = useState('')

  const [alta, setAlta] = useState(null)          // formulario de nueva cuenta
  const [guardando, setGuardando] = useState(false)
  const [cambio, setCambio] = useState({ actual: '', nueva: '', repetir: '' })
  const [cambiando, setCambiando] = useState(false)

  const flash = (t) => { setAviso(t); setError(''); setTimeout(() => setAviso(''), 4000) }

  const cargar = async () => {
    setCargando(true)
    try { const d = await api('/api/auth/usuarios'); setLista(d.usuarios); setYo(d.yo) }
    catch (e) { setError(e.message) }
    setCargando(false)
  }
  useEffect(() => { cargar() }, [])

  const crear = async () => {
    setGuardando(true); setError('')
    try {
      const d = await api('/api/auth/usuarios', { method: 'POST', body: JSON.stringify(alta) })
      setLista(l => [...l, d.usuario])
      setAlta(null)
      flash(`Cuenta creada para ${d.usuario.email}. Pásale la contraseña por un canal seguro.`)
    } catch (e) { setError(e.message) }
    setGuardando(false)
  }

  const alternar = async (u) => {
    try {
      const d = await api('/api/auth/usuarios', { method: 'PATCH', body: JSON.stringify({ id: u.id, activo: !u.activo }) })
      setLista(l => l.map(x => x.id === d.usuario.id ? d.usuario : x))
      flash(d.usuario.activo ? 'Cuenta reactivada' : 'Cuenta desactivada: ya no puede entrar')
    } catch (e) { setError(e.message) }
  }

  const reiniciarClave = async (u) => {
    const nueva = prompt(`Nueva contraseña para ${u.email}\n(mínimo 10 caracteres, con letras y números)`)
    if (!nueva) return
    try {
      await api('/api/auth/usuarios', { method: 'PATCH', body: JSON.stringify({ id: u.id, password: nueva }) })
      flash('Contraseña cambiada. Pásasela por un canal seguro.')
    } catch (e) { setError(e.message) }
  }

  const eliminar = async (u) => {
    if (!confirm(`¿Eliminar la cuenta de ${u.email}?`)) return
    try {
      await api('/api/auth/usuarios?id=' + encodeURIComponent(u.id), { method: 'DELETE' })
      setLista(l => l.filter(x => x.id !== u.id))
      flash('Cuenta eliminada')
    } catch (e) { setError(e.message) }
  }

  const cambiarMiClave = async () => {
    if (cambio.nueva !== cambio.repetir) { setError('Las contraseñas nuevas no coinciden'); return }
    setCambiando(true); setError('')
    try {
      await api('/api/auth/password', { method: 'POST', body: JSON.stringify({ actual: cambio.actual, nueva: cambio.nueva }) })
      setCambio({ actual: '', nueva: '', repetir: '' })
      flash('Contraseña actualizada')
    } catch (e) { setError(e.message) }
    setCambiando(false)
  }

  return (
    <div className={s.crm}>
      <div className={s.subnav}>
        <span className={`${s.subnavBtn} ${s.subnavOn}`}>Cuentas del panel<span className={s.subnavCount}>{lista.length}</span></span>
        <div className={s.subnavRight}>
          <button className={`${s.btn} ${s.btnDark}`} onClick={() => { setAlta({ ...NUEVO }); setError('') }}>+ Nueva cuenta</button>
        </div>
      </div>

      <div className={s.body}>
        {error && <div className={s.error}>{error}</div>}
        {aviso && <div className={s.error} style={{ background: '#E8F5EE', color: '#1A6B4A' }}>{aviso}</div>}

        {cargando ? (
          <div className={s.loading}><span className={s.spin} /> Cargando cuentas...</div>
        ) : (
          <>
            <div className={s.tableWrap} style={{ marginBottom: 16 }}>
              <table className={s.table}>
                <thead><tr><th>Nombre</th><th>Email</th><th>Estado</th><th>Último acceso</th><th className={s.right}>Acciones</th></tr></thead>
                <tbody>
                  {lista.map(u => (
                    <tr key={u.id}>
                      <td className={s.strong}>{u.nombre}{u.id === yo && <span className={s.muted} style={{ fontWeight: 300 }}> · tú</span>}</td>
                      <td className={s.muted}>{u.email}</td>
                      <td><span className={`${s.tag} ${u.activo ? s.tagGreen : s.tagGrey}`}>{u.activo ? 'Activa' : 'Desactivada'}</span></td>
                      <td className={`${s.muted} ${s.num}`}>{fecha(u.ultimo_acceso)}</td>
                      <td className={s.right}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <button className={`${s.btn} ${s.btnMini}`} onClick={() => reiniciarClave(u)}>Cambiar contraseña</button>
                          {u.id !== yo && <button className={`${s.btn} ${s.btnMini}`} onClick={() => alternar(u)}>{u.activo ? 'Desactivar' : 'Reactivar'}</button>}
                          {u.id !== yo && <button className={`${s.btn} ${s.btnMini} ${s.btnDanger}`} onClick={() => eliminar(u)}>Eliminar</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={s.split}>
              <div className={s.card}>
                <div className={s.cardHead}><div className={s.cardTitle}>Cambiar mi contraseña</div></div>
                <div style={{ padding: '16px 18px' }}>
                  <div className={s.field}>
                    <label className={s.label}>Contraseña actual</label>
                    <input type="password" className={s.input} value={cambio.actual} autoComplete="current-password"
                      onChange={e => setCambio(c => ({ ...c, actual: e.target.value }))} />
                  </div>
                  <div className={s.row2}>
                    <div className={s.field}>
                      <label className={s.label}>Nueva contraseña</label>
                      <input type="password" className={s.input} value={cambio.nueva} autoComplete="new-password"
                        onChange={e => setCambio(c => ({ ...c, nueva: e.target.value }))} />
                    </div>
                    <div className={s.field}>
                      <label className={s.label}>Repítela</label>
                      <input type="password" className={s.input} value={cambio.repetir} autoComplete="new-password"
                        onChange={e => setCambio(c => ({ ...c, repetir: e.target.value }))} />
                    </div>
                  </div>
                  <div className={s.hint} style={{ marginBottom: 12 }}>Mínimo 10 caracteres, con letras y números.</div>
                  <button className={`${s.btn} ${s.btnDark}`} disabled={cambiando || !cambio.actual || !cambio.nueva}
                    onClick={cambiarMiClave}>{cambiando ? 'Guardando...' : 'Guardar contraseña'}</button>
                </div>
              </div>

              <div className={s.card}>
                <div className={s.cardHead}><div className={s.cardTitle}>Cómo funciona el acceso</div></div>
                <div style={{ padding: '14px 18px', fontSize: 13, lineHeight: 1.6, color: '#4A5568', fontWeight: 300 }}>
                  <p style={{ margin: '0 0 10px' }}>
                    Cada persona entra con su email y su contraseña. La sesión dura ocho horas y se
                    guarda en una cookie que el navegador no deja leer a ningún script.
                  </p>
                  <p style={{ margin: '0 0 10px' }}>
                    Las contraseñas se guardan cifradas: ni tú ni yo podemos verlas. Si alguien la
                    olvida, le pones una nueva desde aquí y que la cambie al entrar.
                  </p>
                  <p style={{ margin: 0 }}>
                    Cuando alguien deja el despacho, desactiva su cuenta: conservas el rastro de sus
                    accesos, pero deja de poder entrar de inmediato.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {alta && (
        <div className={s.overlay} onMouseDown={e => e.target === e.currentTarget && setAlta(null)}>
          <div className={s.drawer}>
            <div className={s.drawerHead}>
              <div className={s.drawerTitle}>Nueva cuenta</div>
              <button className={s.closeX} onClick={() => setAlta(null)} aria-label="Cerrar">✕</button>
            </div>
            <div className={s.drawerBody}>
              {error && <div className={s.error}>{error}</div>}
              <div className={s.field}>
                <label className={s.label}>Nombre y apellidos</label>
                <input className={s.input} value={alta.nombre} onChange={e => setAlta(a => ({ ...a, nombre: e.target.value }))} autoFocus />
              </div>
              <div className={s.field}>
                <label className={s.label}>Email</label>
                <input type="email" className={s.input} value={alta.email} onChange={e => setAlta(a => ({ ...a, email: e.target.value }))} />
              </div>
              <div className={s.field}>
                <label className={s.label}>Contraseña inicial</label>
                <input className={s.input} value={alta.password} onChange={e => setAlta(a => ({ ...a, password: e.target.value }))} />
                <div className={s.hint}>Mínimo 10 caracteres, con letras y números. Pásasela en persona o por un canal seguro, y que la cambie al entrar.</div>
              </div>
            </div>
            <div className={s.drawerFoot}>
              <button className={s.btn} onClick={() => setAlta(null)}>Cancelar</button>
              <button className={`${s.btn} ${s.btnDark}`} disabled={guardando} onClick={crear}>
                {guardando ? 'Creando...' : 'Crear cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
