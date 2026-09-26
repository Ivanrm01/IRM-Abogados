// ============================================================================
//  REGISTRO DE CONSENTIMIENTOS DE COOKIES  ·  IRM Abogados
//  ---------------------------------------------------------------------------
//  El artículo 7.1 del RGPD obliga a poder DEMOSTRAR que se obtuvo el
//  consentimiento. Guardarlo solo en la cookie del navegador no sirve como
//  prueba: si el visitante borra sus datos, la prueba desaparece.
//
//  Aquí se anota cada decisión (aceptar, rechazar o guardar la selección) con:
//   · un identificador aleatorio que genera el propio navegador,
//   · la fecha y hora exactas,
//   · la versión y el texto literal que se le mostró,
//   · qué finalidades aceptó y cuáles no,
//   · una huella irreversible de la IP y del navegador.
//
//  NUNCA se guarda la IP en claro: solo su huella. El registro es una prueba,
//  no un fichero de seguimiento, y no se cruza con los formularios de contacto.
//
//  Se conserva 4 años: los 12 meses de vigencia del consentimiento más el plazo
//  de prescripción de las infracciones de la LOPDGDD (arts. 72 a 74).
// ============================================================================
import crypto from 'crypto'
import { json, sbAuth, exigirSesion, salHuellas, ipDe, faltaEsquema, AVISO_ESQUEMA } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TABLA = 'cookies_consentimientos'
const AÑOS_CONSERVACION = 4
const MAX_EXPORTAR = 50000
const PAGINA = 1000   // Supabase entrega como mucho 1.000 filas por consulta

// Huella irreversible: sin la sal es imposible volver a la IP original.
// Define CONSENT_SALT en Vercel (una cadena larga y aleatoria) y no la cambies.
function huella(valor) {
  if (!valor) return ''
  return crypto.createHash('sha256').update(salHuellas() + '|' + valor).digest('hex').slice(0, 32)
}

const txt = (v, max) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max)

// El banner solo envía desde esta misma web
function origenPropio(req) {
  const sitio = req.headers.get('sec-fetch-site')
  if (sitio && sitio !== 'same-origin') return false
  const origen = req.headers.get('origin')
  if (!origen) return true   // las peticiones del mismo dominio no siempre la envían
  const hosts = [req.headers.get('host'), req.headers.get('x-forwarded-host')].filter(Boolean)
  try { return hosts.includes(new URL(origen).host) } catch { return false }
}

// Freno a envíos masivos desde una misma conexión (por instancia del servidor)
const envios = new Map()
function demasiados(clave) {
  const ahora = Date.now()
  const previos = (envios.get(clave) || []).filter((t) => ahora - t < 10 * 60 * 1000)
  if (previos.length >= 30) return true
  previos.push(ahora)
  envios.set(clave, previos)
  if (envios.size > 5000) envios.clear()
  return false
}

async function borrarCaducados() {
  const limite = new Date()
  limite.setFullYear(limite.getFullYear() - AÑOS_CONSERVACION)
  await sbAuth().from(TABLA).delete().lt('fecha', limite.toISOString())
}

/* ===========================================================================
   POST · anotar una decisión (lo llama el banner de cookies)
   =========================================================================== */
export async function POST(req) {
  if (!origenPropio(req)) return json({ error: 'Origen no permitido' }, 403)

  const ipHuella = huella(ipDe(req))
  if (demasiados(ipHuella)) return json({ error: 'Demasiados envíos' }, 429)

  let body
  try {
    const crudo = await req.text()
    if (crudo.length > 16000) return json({ error: 'Demasiado grande' }, 413)
    body = JSON.parse(crudo)
  } catch { return json({ error: 'Formato no válido' }, 400) }

  const { id, version, analitica, marketing, via, texto, pagina } = body || {}
  // Identificador válido: el que genera el navegador (UUID)
  if (!id || !/^[0-9a-f-]{16,40}$/i.test(String(id))) {
    return json({ error: 'Identificador no válido' }, 400)
  }

  const registro = {
    visitante: String(id).toLowerCase(),
    fecha: new Date().toISOString(),
    version: Number.isFinite(Number(version)) ? Number(version) : 0,
    analitica: analitica === true,
    marketing: marketing === true,
    via: txt(via, 40),                 // banner-aceptar, banner-rechazar, panel-aceptar, panel-rechazar, panel-guardar
    texto_mostrado: txt(texto, 4000),  // literal del aviso que vio el visitante
    pagina: txt(pagina, 300),
    ip_huella: ipHuella,
    navegador_huella: huella(req.headers.get('user-agent') || ''),
  }

  const { error } = await sbAuth().from(TABLA).insert(registro)
  if (error) {
    console.error('[consentimiento]', error.message)
    return json({ error: 'No se ha podido registrar' }, 500)
  }
  if (Math.random() < 0.01) await borrarCaducados().catch(() => {})
  return json({ ok: true })
}

/* ===========================================================================
   GET · exportar el registro (solo con sesión abierta en /admin)
     /api/consentimiento                  → JSON (últimos 1.000)
     /api/consentimiento?formato=csv      → CSV para abrir en Excel (todo)
     /api/consentimiento?id=xxxx          → historial de un visitante
   Lo más cómodo: /admin › Seguridad › «Descargar registro».
   =========================================================================== */
export async function GET(req) {
  const { res } = await exigirSesion(req)
  if (res) return res

  const params = new URL(req.url).searchParams
  const csv = params.get('formato') === 'csv'
  const id = String(params.get('id') || '').toLowerCase()
  const limite = Math.min(Number(params.get('limite')) || (csv ? MAX_EXPORTAR : 1000), MAX_EXPORTAR)

  await borrarCaducados().catch(() => {})

  const registros = []
  for (let desde = 0; desde < limite; desde += PAGINA) {
    let q = sbAuth().from(TABLA).select('*').order('fecha', { ascending: false })
      .range(desde, Math.min(desde + PAGINA, limite) - 1)
    if (id) q = q.eq('visitante', id)
    const { data, error } = await q
    if (error) return json({ error: faltaEsquema(error) ? AVISO_ESQUEMA : 'Error al leer el registro' }, 500)
    registros.push(...(data || []))
    if (!data || data.length < PAGINA) break
  }

  if (csv) {
    const celda = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"'
    const cab = 'fecha;identificador;version;analitica;marketing;via;pagina;huella_ip;huella_navegador;texto_mostrado'
    const filas = registros.map((r) => [
      r.fecha, r.visitante, r.version,
      r.analitica ? 'si' : 'no',
      r.marketing ? 'si' : 'no',
      r.via, celda(r.pagina), r.ip_huella, r.navegador_huella, celda(r.texto_mostrado),
    ].join(';'))
    const hoy = new Date().toISOString().slice(0, 10)
    return new Response('﻿' + [cab, ...filas].join('\r\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="consentimientos-cookies-${hoy}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  return json({
    total: registros.length,
    registros: registros.map((r) => ({
      id: r.visitante, fecha: r.fecha, version: r.version,
      finalidades: { necesarias: true, analitica: r.analitica, marketing: r.marketing },
      via: r.via, pagina: r.pagina, textoMostrado: r.texto_mostrado,
      ipHuella: r.ip_huella, navegadorHuella: r.navegador_huella,
    })),
  })
}
