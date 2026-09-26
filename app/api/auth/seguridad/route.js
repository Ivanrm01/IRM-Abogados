// ============================================================================
//  SEGURIDAD DEL PANEL  ·  IRM Abogados
//  ---------------------------------------------------------------------------
//  Todo con sesión abierta, y siempre sobre la cuenta de quien la usa:
//    GET                                    → estado 2FA, últimos accesos y
//                                             resumen del registro de cookies
//    POST { accion: '2fa-iniciar', pass }    → genera el código QR
//    POST { accion: '2fa-confirmar', codigo }→ activa la verificación en dos pasos
//    POST { accion: '2fa-desactivar', pass, codigo } → la desactiva
//    POST { accion: 'cerrar-todas' }         → cierra tus sesiones en todos los dispositivos
// ============================================================================
import QRCode from 'qrcode'
import {
  json, exigirSesion, sbAuth, comprobarPassword, ipDe, bloqueoActivo,
  anotarAcceso, anotarFallo, ultimosAccesos, cerrarSesionesDe, borrarCookie,
  tiene2FA, nuevoSecreto2FA, comprobarTOTP, uriOtpauth, nuevosCodigosRecuperacion,
  verificarSegundoPaso, SIN_2FA, faltaEsquema, AVISO_ESQUEMA,
} from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MINUTOS_QR = 10

export async function GET(req) {
  const { s, res } = await exigirSesion(req)
  if (res) return res
  const u = s.usuario

  let accesos = []
  try { accesos = await ultimosAccesos(40) }
  catch (e) { return json({ error: faltaEsquema(e) ? AVISO_ESQUEMA : 'No se ha podido leer el registro de accesos' }, 500) }

  // Nombre de cada cuenta para la tabla de accesos
  const { data: cuentas } = await sbAuth().from('admin_usuarios').select('id,nombre')
  const nombres = Object.fromEntries((cuentas || []).map((c) => [c.id, c.nombre]))

  // Resumen del registro de consentimientos de cookies
  const sb = sbAuth()
  const [{ count, error: errC }, { data: ultimo }] = await Promise.all([
    sb.from('cookies_consentimientos').select('id', { count: 'exact', head: true }),
    sb.from('cookies_consentimientos').select('fecha').order('fecha', { ascending: false }).limit(1),
  ])

  return json({
    dosPasos: tiene2FA(u)
      ? { activo: true, desde: u.totp_desde, codigosRestantes: (u.totp_rec || []).length }
      : { activo: false },
    accesos: accesos.map((a) => ({ ...a, nombre: nombres[a.usuario_id] || '' })),
    tuIP: ipDe(req),
    consentimientos: errC ? null : { total: count || 0, ultimo: ultimo?.[0]?.fecha || null },
  })
}

export async function POST(req) {
  const { s, res } = await exigirSesion(req)
  if (res) return res
  const u = s.usuario
  const body = await req.json().catch(() => ({}))
  const accion = String(body.accion || '')
  const sb = sbAuth()

  // Las acciones que piden la contraseña están sujetas al mismo límite de intentos que la entrada
  const conPass = ['2fa-iniciar', '2fa-desactivar']
  if (conPass.includes(accion)) {
    const minutos = await bloqueoActivo(ipDe(req), u.email)
    if (minutos) return json({ error: `Demasiados intentos fallidos. Espera ${minutos} min.` }, 429)
  }

  /* ---------- Activar · paso 1: comprobar la contraseña y generar el QR ---------- */
  if (accion === '2fa-iniciar') {
    if (!comprobarPassword(body.pass, u.password_hash)) {
      await anotarFallo(req, { motivo: 'Contraseña incorrecta al activar la verificación', email: u.email, usuarioId: u.id })
      return json({ error: 'La contraseña no es correcta.' }, 401)
    }
    if (tiene2FA(u)) return json({ error: 'La verificación en dos pasos ya está activada.' }, 400)

    const secreto = nuevoSecreto2FA()
    // Se guarda en esta sesión durante 10 minutos, hasta que confirmes el código
    const { error } = await sb.from('admin_sesiones').update({
      totp_pendiente: secreto,
      totp_pendiente_caduca: new Date(Date.now() + MINUTOS_QR * 60000).toISOString(),
    }).eq('token_hash', s.tokenHash)
    if (error) return json({ error: faltaEsquema(error) ? AVISO_ESQUEMA : error.message }, 500)

    const uri = uriOtpauth(secreto, u.email)
    const qr = await QRCode.toString(uri, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' })
    return json({ secreto: secreto.replace(/(.{4})/g, '$1 ').trim(), uri, qr })
  }

  /* ---------- Activar · paso 2: comprobar el primer código ---------- */
  if (accion === '2fa-confirmar') {
    const ses = s.sesion
    const secreto = ses.totp_pendiente
    if (!secreto || Date.parse(ses.totp_pendiente_caduca) < Date.now()) {
      return json({ error: 'El código QR ha caducado. Vuelve a empezar.' }, 400)
    }
    const contador = comprobarTOTP(secreto, body.codigo)
    if (contador < 0) {
      return json({ error: 'El código no es correcto. Comprueba que la hora del móvil es automática.' }, 400)
    }
    const { codigos, sal, hashes } = nuevosCodigosRecuperacion()
    const { error } = await sb.from('admin_usuarios').update({
      totp_secreto: secreto,
      totp_desde: new Date().toISOString(),
      totp_ultimo: contador,
      totp_rec_sal: sal,
      totp_rec: hashes,
    }).eq('id', u.id)
    if (error) return json({ error: error.message }, 500)

    await sb.from('admin_sesiones').update({ totp_pendiente: null, totp_pendiente_caduca: null }).eq('token_hash', s.tokenHash)
    // Con la verificación recién activada, se cierran tus otras sesiones
    // (las abiertas antes solo con contraseña). Esta sigue abierta.
    await cerrarSesionesDe(u.id, { excepto: s.tokenHash })
    await anotarAcceso(req, { motivo: 'Verificación en dos pasos activada', email: u.email, usuarioId: u.id })
    return json({ ok: true, codigos })
  }

  /* ---------- Desactivar: contraseña + código de la app o de recuperación ---------- */
  if (accion === '2fa-desactivar') {
    if (!tiene2FA(u)) return json({ error: 'La verificación en dos pasos no está activada.' }, 400)
    const passOK = comprobarPassword(body.pass, u.password_hash)
    const codOK = passOK ? (await verificarSegundoPaso(u, String(body.codigo || '').slice(0, 20))).ok : false
    if (!passOK || !codOK) {
      await anotarFallo(req, { motivo: 'Datos incorrectos al desactivar la verificación', email: u.email, usuarioId: u.id })
      return json({ error: 'La contraseña o el código no son correctos.' }, 401)
    }
    const { error } = await sb.from('admin_usuarios').update(SIN_2FA).eq('id', u.id)
    if (error) return json({ error: error.message }, 500)
    await anotarAcceso(req, { motivo: 'Verificación en dos pasos desactivada', email: u.email, usuarioId: u.id })
    return json({ ok: true })
  }

  /* ---------- Cerrar sesión en todos los dispositivos (incluido este) ---------- */
  if (accion === 'cerrar-todas') {
    await cerrarSesionesDe(u.id)
    await anotarAcceso(req, { motivo: 'Sesiones cerradas en todos los dispositivos', email: u.email, usuarioId: u.id })
    return borrarCookie(json({ ok: true }))
  }

  return json({ error: 'Acción no reconocida.' }, 400)
}
