'use client'
// ============================================================================
//  SEGURIDAD · verificación en dos pasos, sesiones, últimos accesos y
//  registro de consentimientos de cookies
// ============================================================================
import { useState, useEffect, useRef } from 'react'
import s from './crm.module.css'
import g from './seguridad.module.css'

const api = async (url, opts = {}) => {
  const res = await fetch(url, {
    cache: 'no-store', credentials: 'same-origin', ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  })
  const d = await res.json().catch(() => ({}))
  if (res.status === 401 && d.sesion === false) { window.location.replace('/admin?sesion=caducada'); throw new Error('Sesión caducada') }
  if (!res.ok) throw new Error(d.error || 'No se pudo completar la operación')
  return d
}
const post = (cuerpo) => api('/api/auth/seguridad', { method: 'POST', body: JSON.stringify(cuerpo) })

const fechaHora = (v) => {
  if (!v) return '—'
  const d = new Date(v)
  return isNaN(d) ? '—' : d.toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function dispositivo(ua = '') {
  const so = /iPhone|iPad/.test(ua) ? 'iPhone/iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows'
    : /Macintosh|Mac OS X/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : ''
  const nav = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\/|FxiOS/.test(ua) ? 'Firefox'
    : /Chrome\/|CriOS/.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : ''
  if (nav && so) return `${nav} en ${so}`
  return nav || so || (ua ? 'Otro' : '—')
}

export default function Seguridad({ usuario, onCambio2FA, onSesionesCerradas }) {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Verificación en dos pasos: estado · qr · codigos · desactivar
  const [fase, setFase] = useState('estado')
  const [pass, setPass] = useState('')
  const [codigo, setCodigo] = useState('')
  const [qr, setQr] = useState(null)
  const [codigos, setCodigos] = useState(null)
  const [copiados, setCopiados] = useState(false)
  const [ocupado, setOcupado] = useState(false)
  const [err2fa, setErr2fa] = useState('')
  const codigoRef = useRef()

  const cargar = async () => {
    setCargando(true); setError('')
    try {
      const d = await api('/api/auth/seguridad')
      setDatos(d)
      onCambio2FA?.(d.dosPasos.activo)
    } catch (e) { setError(e.message) }
    setCargando(false)
  }
  useEffect(() => { cargar() }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  const reiniciar = () => { setFase('estado'); setPass(''); setCodigo(''); setQr(null); setErr2fa('') }

  const iniciar = async (e) => {
    e.preventDefault()
    if (!pass) { setErr2fa('Escribe tu contraseña.'); return }
    setOcupado(true); setErr2fa('')
    try {
      const d = await post({ accion: '2fa-iniciar', pass })
      setQr(d); setPass(''); setCodigo(''); setFase('qr')
      setTimeout(() => codigoRef.current?.focus(), 0)
    } catch (e2) { setErr2fa(e2.message); setPass('') }
    setOcupado(false)
  }

  const confirmar = async (e) => {
    e.preventDefault()
    const c = codigo.replace(/\D/g, '')
    if (c.length !== 6) { setErr2fa('El código tiene 6 cifras.'); return }
    setOcupado(true); setErr2fa('')
    try {
      const d = await post({ accion: '2fa-confirmar', codigo: c })
      setCodigos(d.codigos); setQr(null); setCodigo(''); setFase('codigos'); setCopiados(false)
      onCambio2FA?.(true)
    } catch (e2) { setErr2fa(e2.message); setCodigo(''); codigoRef.current?.focus() }
    setOcupado(false)
  }

  const desactivar = async (e) => {
    e.preventDefault()
    if (!pass || !codigo.trim()) { setErr2fa('Escribe la contraseña y el código.'); return }
    setOcupado(true); setErr2fa('')
    try {
      await post({ accion: '2fa-desactivar', pass, codigo: codigo.trim() })
      reiniciar()
      onCambio2FA?.(false)
      await cargar()
    } catch (e2) { setErr2fa(e2.message); setCodigo('') }
    setOcupado(false)
  }

  const cerrarTodas = async () => {
    if (!confirm('Se cerrará tu sesión en todos los ordenadores y móviles, incluido este. ¿Continuar?')) return
    try { await post({ accion: 'cerrar-todas' }); onSesionesCerradas?.() }
    catch (e) { setError(e.message) }
  }

  const textoCodigos = () =>
    `Códigos de recuperación · Panel IRM Abogados\n` +
    `Cuenta: ${usuario?.email || ''}\n` +
    `Generados el ${fechaHora(new Date().toISOString())}\n` +
    `Cada código sirve una sola vez.\n\n${(codigos || []).join('\n')}\n`

  const descargarCodigos = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([textoCodigos()], { type: 'text/plain' }))
    a.download = 'codigos-recuperacion-panel-irm.txt'
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
  const copiarCodigos = async () => {
    try { await navigator.clipboard.writeText(textoCodigos()); setCopiados(true) }
    catch { alert('No se han podido copiar. Usa «Descargar como .txt».') }
  }

  const d2 = datos?.dosPasos

  return (
    <div className={s.crm}>
      <div className={s.subnav}>
        <span className={`${s.subnavBtn} ${s.subnavOn}`}>Seguridad del panel</span>
        <div className={s.subnavRight}>
          <button className={s.btn} onClick={cargar} disabled={cargando}>Actualizar</button>
        </div>
      </div>

      <div className={s.body}>
        {error && <div className={s.error}>{error}</div>}

        {cargando && !datos ? (
          <div className={s.loading}><span className={s.spin} /> Cargando...</div>
        ) : datos && (
          <>
            <div className={g.rejilla}>
              {/* ===== VERIFICACIÓN EN DOS PASOS ===== */}
              <section className={`${s.card} ${g.ancha}`}>
                <div className={s.cardHead}>
                  <div className={s.cardTitle}>Verificación en dos pasos</div>
                  <span className={`${s.tag} ${d2.activo || fase === 'codigos' ? s.tagGreen : g.tagRojo}`}>
                    {d2.activo || fase === 'codigos' ? 'Activada' : 'Desactivada'}
                  </span>
                </div>
                <div className={g.cuerpo}>
                  {fase === 'codigos' ? (
                    <>
                      <div className={g.ok}>
                        Verificación en dos pasos activada. A partir de ahora te pediremos el código al entrar.
                        Hemos cerrado tus sesiones abiertas en otros dispositivos.
                      </div>
                      <p><strong>Guarda ahora estos códigos de recuperación.</strong> Cada uno sirve una sola vez
                        para entrar si pierdes o cambias de móvil. No se volverán a mostrar.</p>
                      <div className={g.codigos}>{codigos.map((c) => <span key={c}>{c}</span>)}</div>
                      <div className={g.fila}>
                        <button className={s.btn} onClick={descargarCodigos}>Descargar como .txt</button>
                        <button className={s.btn} onClick={copiarCodigos}>{copiados ? 'Copiados' : 'Copiar'}</button>
                        <button className={`${s.btn} ${s.btnDark}`} onClick={() => { setCodigos(null); reiniciar(); cargar() }}>
                          Ya los he guardado
                        </button>
                      </div>
                    </>
                  ) : fase === 'qr' && qr ? (
                    <>
                      <p><strong>1.</strong> Abre la app de autenticación en tu móvil, pulsa «Añadir» y escanea este código.</p>
                      <div className={g.qr}>
                        <img src={'data:image/svg+xml;base64,' + btoa(qr.qr)} alt="Código QR para añadir el panel a tu app de autenticación" />
                        <div>
                          <p className={s.muted} style={{ fontSize: 13, margin: '0 0 6px' }}>¿No puedes escanearlo? Añade la cuenta a mano con esta clave:</p>
                          <div className={g.clave}>{qr.secreto}</div>
                          <p style={{ fontSize: 13, marginTop: 10 }}>Si estás en el móvil: <a href={qr.uri} className={g.enlace}>abrir en la app</a></p>
                        </div>
                      </div>
                      <p><strong>2.</strong> Escribe el código de 6 cifras que aparece en la app.</p>
                      <form className={g.fila} onSubmit={confirmar}>
                        <div className={g.campo}>
                          <label className={s.label} htmlFor="seg-codigo">Código</label>
                          <input id="seg-codigo" ref={codigoRef} className={`${s.input} ${g.inputCodigo}`} value={codigo}
                            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            inputMode="numeric" autoComplete="one-time-code" maxLength={6} />
                        </div>
                        <button className={`${s.btn} ${s.btnDark}`} disabled={ocupado}>{ocupado ? 'Comprobando...' : 'Confirmar y activar'}</button>
                        <button type="button" className={s.btn} onClick={reiniciar}>Cancelar</button>
                      </form>
                      {err2fa && <div className={g.err} role="alert">{err2fa}</div>}
                    </>
                  ) : d2.activo ? (
                    <>
                      <p>Activada desde el {fechaHora(d2.desde)}. Para entrar hace falta tu contraseña y el código que muestra tu app.
                        Te quedan <strong>{d2.codigosRestantes}</strong> códigos de recuperación.
                        {d2.codigosRestantes < 3 && ' Son pocos: desactívala y vuelve a activarla para tener códigos nuevos.'}</p>
                      {fase === 'desactivar' ? (
                        <>
                          <p className={s.muted}>Para desactivarla, confirma que eres tú.</p>
                          <form className={g.fila} onSubmit={desactivar}>
                            <div className={g.campo}>
                              <label className={s.label} htmlFor="seg-pass">Contraseña</label>
                              <input id="seg-pass" type="password" className={s.input} value={pass}
                                onChange={(e) => setPass(e.target.value)} autoComplete="current-password" autoFocus />
                            </div>
                            <div className={g.campo}>
                              <label className={s.label} htmlFor="seg-cod">Código de la app o de recuperación</label>
                              <input id="seg-cod" className={s.input} value={codigo} maxLength={11}
                                onChange={(e) => setCodigo(e.target.value)} autoComplete="one-time-code" />
                            </div>
                            <button className={`${s.btn} ${g.btnRojo}`} disabled={ocupado}>{ocupado ? 'Comprobando...' : 'Desactivar'}</button>
                            <button type="button" className={s.btn} onClick={reiniciar}>Cancelar</button>
                          </form>
                          {err2fa && <div className={g.err} role="alert">{err2fa}</div>}
                        </>
                      ) : (
                        <button className={s.btn} onClick={() => { setFase('desactivar'); setErr2fa('') }}>Desactivar</button>
                      )}
                    </>
                  ) : (
                    <>
                      <p>Con la verificación en dos pasos, para entrar hace falta tu contraseña <strong>y</strong> un código de
                        6 cifras que cambia cada 30 segundos en tu móvil. Aunque alguien averigüe la contraseña, no podrá entrar.</p>
                      <p className={s.muted}>Necesitas una app de autenticación gratuita en el móvil: Google Authenticator,
                        Microsoft Authenticator o similar. Cada persona del despacho la activa en su propia cuenta.</p>
                      <form className={g.fila} onSubmit={iniciar}>
                        <div className={g.campo}>
                          <label className={s.label} htmlFor="seg-pass">Tu contraseña actual</label>
                          <input id="seg-pass" type="password" className={s.input} value={pass}
                            onChange={(e) => setPass(e.target.value)} autoComplete="current-password" />
                        </div>
                        <button className={`${s.btn} ${s.btnDark}`} disabled={ocupado}>{ocupado ? 'Preparando...' : 'Activar'}</button>
                      </form>
                      {err2fa && <div className={g.err} role="alert">{err2fa}</div>}
                    </>
                  )}
                </div>
              </section>

              {/* ===== SESIONES ===== */}
              <section className={s.card}>
                <div className={s.cardHead}><div className={s.cardTitle}>Sesiones</div></div>
                <div className={g.cuerpo}>
                  <p className={s.muted}>La sesión se cierra sola tras 30 minutos sin actividad y, como máximo, a las 12 horas.
                    Si has entrado desde un ordenador que no es tuyo o sospechas algo raro, ciérrala en todas partes.</p>
                  <button className={s.btn} onClick={cerrarTodas}>Cerrar sesión en todos los dispositivos</button>
                </div>
              </section>

              {/* ===== REGISTRO DE CONSENTIMIENTOS ===== */}
              <section className={s.card}>
                <div className={s.cardHead}><div className={s.cardTitle}>Registro de consentimientos de cookies</div></div>
                <div className={g.cuerpo}>
                  <p className={s.muted}>La prueba de consentimiento que exige el RGPD, por si te la pide la AEPD:
                    cada vez que un visitante acepta, rechaza o elige cookies queda anotado con la fecha, lo que decidió
                    y el texto que se le mostró. No se guarda su IP, solo una huella irreversible.</p>
                  {datos.consentimientos ? (
                    <p style={{ fontSize: 13 }}>
                      <strong>{datos.consentimientos.total.toLocaleString('es-ES')}</strong> decisiones registradas
                      {datos.consentimientos.ultimo && <> · la última, el {fechaHora(datos.consentimientos.ultimo)}</>}
                    </p>
                  ) : (
                    <p className={g.err}>No se puede leer el registro. Comprueba que has ejecutado data/seguridad-schema.sql.</p>
                  )}
                  <a className={s.btn} href="/api/consentimiento?formato=csv" download>Descargar registro (CSV para Excel)</a>
                </div>
              </section>
            </div>

            {/* ===== ÚLTIMOS ACCESOS ===== */}
            <section className={s.card} style={{ marginTop: 16 }}>
              <div className={s.cardHead}>
                <div className={s.cardTitle}>Últimos accesos</div>
              </div>
              <div className={g.cuerpo} style={{ paddingBottom: 6 }}>
                <p className={s.muted} style={{ margin: 0 }}>Entradas al panel de todo el equipo, correctas y fallidas, y los cambios
                  de seguridad. Si ves muchos fallos que no son vuestros, cambiad las contraseñas.</p>
              </div>
              {datos.accesos.length === 0 ? (
                <div className={s.empty} style={{ border: 'none' }}><div className={s.emptyText}>Todavía no hay accesos registrados.</div></div>
              ) : (
                <div className={s.tableWrap} style={{ border: 'none', borderTop: '1px solid #f0f1f3' }}>
                  <table className={s.table}>
                    <thead><tr><th>Fecha</th><th>Resultado</th><th>Detalle</th><th>Cuenta</th><th>IP</th><th>Dispositivo</th></tr></thead>
                    <tbody>
                      {datos.accesos.map((a, i) => (
                        <tr key={i} className={a.ok ? '' : g.fallo}>
                          <td className={s.num} style={{ whiteSpace: 'nowrap' }}>{fechaHora(a.fecha)}</td>
                          <td>
                            <span className={`${s.tag} ${a.tipo === 'entrada' ? s.tagGreen : a.ok ? s.tagGrey : g.tagRojo}`}>
                              {a.tipo === 'entrada' ? 'Correcto' : a.tipo === 'fallo' ? 'Fallido' : a.tipo === 'bloqueo' ? 'Bloqueado' : 'Cambio'}
                            </span>
                          </td>
                          <td>{a.motivo}</td>
                          <td className={s.muted}>{a.nombre || a.email || '—'}
                            {!a.ok && a.email && !a.nombre && <div style={{ fontSize: 11 }}>email escrito</div>}</td>
                          <td className={s.num} style={{ whiteSpace: 'nowrap' }}>{a.ip}{a.ip === datos.tuIP && <span className={s.muted}> (tú)</span>}</td>
                          <td className={s.muted}>{dispositivo(a.navegador)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
