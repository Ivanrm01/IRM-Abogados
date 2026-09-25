/* =====================================================================
   HOJA DE ENCARGO · generador del .docx
   ---------------------------------------------------------------------
   Construye el Word a partir de los bloques de modelo.js usando las
   piezas literales del .docx original (estilos, numeración, tema y
   ajustes) y el mismo XML de párrafo que tiene el modelo: Garamond 11,
   interlineado múltiple 1,15 / 1,08, espaciado posterior 0, márgenes
   3 cm laterales y 2,5 cm superior e inferior, cuadro azul del título,
   tabla «Tabla con cuadrícula» y notas (1), (2) con la lista original.
   No usa dependencias: el .zip se escribe aquí mismo.
   ===================================================================== */

import { construirBloques, LETRADO, destinatarioLinea } from './modelo'
import {
  CONTENT_TYPES, ROOT_RELS, STYLES, NUMBERING, SETTINGS, FONT_TABLE, WEB_SETTINGS, THEME, DOC_OPEN,
} from './plantilla-docx'

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  // caracteres de control que invalidarían el XML
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')

const G = '<w:rFonts w:ascii="Garamond" w:hAnsi="Garamond"/>'
const BOLD = '<w:b/><w:bCs/>'
const ITAL = '<w:i/><w:iCs/>'
const BLANCO = '<w:color w:val="FFFFFF" w:themeColor="background1"/>'

const rPr = ({ b, i, sup, color, sz, style } = {}) =>
  `<w:rPr>${style ? `<w:rStyle w:val="${style}"/>` : ''}${G}${b ? BOLD : ''}${i ? ITAL : ''}${color || ''}${sz ? `<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>` : ''}${sup ? '<w:vertAlign w:val="superscript"/>' : ''}</w:rPr>`

const tRun = (t, o) => `<w:r>${rPr(o)}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`

function runs(lista) {
  return lista.map(r => {
    if (r.tab) return `<w:r>${rPr()}<w:tab/></w:r>`
    if (r.link) return `<w:hyperlink r:id="rIdMail" w:history="1"><w:r>${rPr({ style: 'Hipervnculo' })}<w:t xml:space="preserve">${esc(r.t)}</w:t></w:r></w:hyperlink>`
    return tRun(r.t, r)
  }).join('')
}

// Propiedades de párrafo idénticas a las del modelo
function pPr({ ls = 276, jc = 'both', ind, b, nota, tab }) {
  let x = ''
  if (nota) x += '<w:pStyle w:val="Prrafodelista"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>'
  if (tab) x += `<w:tabs><w:tab w:val="left" w:pos="${tab}"/></w:tabs>`
  x += ls === 276 ? '<w:spacing w:after="0" w:line="276" w:lineRule="auto"/>' : '<w:spacing w:after="0"/>'
  if (ind) x += `<w:ind w:left="${ind}"/>`
  if (jc && jc !== 'left') x += `<w:jc w:val="${jc}"/>`
  x += rPr({ b, i: !!nota })
  return `<w:pPr>${x}</w:pPr>`
}

/* ---------- Cuadro azul del título (copiado del modelo) ---------- */

const A_NS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"'

function titulo(lineas) {
  const texto = (lineas.length ? lineas : [' ']).map(l =>
    `<w:p><w:pPr><w:spacing w:after="0"/><w:jc w:val="center"/>${rPr({ b: 1, color: BLANCO, sz: 24 })}</w:pPr>${tRun(l, { b: 1, color: BLANCO, sz: 24 })}</w:p>`
  ).join('')
  const anclaPPr = `<w:pPr><w:spacing w:after="0"/><w:jc w:val="center"/>${rPr({ b: 1, sz: 26 })}</w:pPr>`
  const anclaRPr = `<w:rPr>${G}${BOLD}<w:noProof/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr>`

  const rect = `<w:p>${anclaPPr}<w:r>${anclaRPr}<mc:AlternateContent><mc:Choice Requires="wps"><w:drawing><wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0" relativeHeight="251659264" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1"><wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="margin"><wp:posOffset>130598</wp:posOffset></wp:positionH><wp:positionV relativeFrom="paragraph"><wp:posOffset>-2328</wp:posOffset></wp:positionV><wp:extent cx="5105400" cy="1972733"/><wp:effectExtent l="0" t="0" r="19050" b="27940"/><wp:wrapNone/><wp:docPr id="1" name="Rectángulo 1"/><wp:cNvGraphicFramePr/><a:graphic ${A_NS}><a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"><wps:wsp><wps:cNvSpPr/><wps:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="5105400" cy="1972733"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></wps:spPr><wps:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="50000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></wps:style><wps:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow" horzOverflow="overflow" vert="horz" wrap="square" lIns="91440" tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0" rtlCol="0" fromWordArt="0" anchor="ctr" anchorCtr="0" forceAA="0" compatLnSpc="1"><a:prstTxWarp prst="textNoShape"><a:avLst/></a:prstTxWarp><a:noAutofit/></wps:bodyPr></wps:wsp></a:graphicData></a:graphic><wp14:sizeRelV relativeFrom="margin"><wp14:pctHeight>0</wp14:pctHeight></wp14:sizeRelV></wp:anchor></w:drawing></mc:Choice><mc:Fallback><w:pict><v:rect id="Rectángulo 1" o:spid="_x0000_s1026" style="position:absolute;margin-left:10.3pt;margin-top:-.2pt;width:402pt;height:155.35pt;z-index:251659264;visibility:visible;mso-wrap-style:square;mso-height-percent:0;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;mso-position-horizontal:absolute;mso-position-horizontal-relative:margin;mso-position-vertical:absolute;mso-position-vertical-relative:text;mso-height-percent:0;mso-height-relative:margin;v-text-anchor:middle" fillcolor="#4472c4 [3204]" strokecolor="#1f3763 [1604]" strokeweight="1pt"><w10:wrap anchorx="margin"/></v:rect></w:pict></mc:Fallback></mc:AlternateContent></w:r></w:p>`

  const caja = `<w:p>${anclaPPr}<w:r>${anclaRPr}<mc:AlternateContent><mc:Choice Requires="wps"><w:drawing><wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0" relativeHeight="251660288" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1"><wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="margin"><wp:align>center</wp:align></wp:positionH><wp:positionV relativeFrom="paragraph"><wp:posOffset>13970</wp:posOffset></wp:positionV><wp:extent cx="5048250" cy="1625600"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:wrapNone/><wp:docPr id="2" name="Cuadro de texto 2"/><wp:cNvGraphicFramePr/><a:graphic ${A_NS}><a:graphicData uri="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"><wps:wsp><wps:cNvSpPr txBox="1"/><wps:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="5048250" cy="1625600"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln w="6350"><a:noFill/></a:ln></wps:spPr><wps:txbx><w:txbxContent>${texto}</w:txbxContent></wps:txbx><wps:bodyPr rot="0" spcFirstLastPara="0" vertOverflow="overflow" horzOverflow="overflow" vert="horz" wrap="square" lIns="91440" tIns="45720" rIns="91440" bIns="45720" numCol="1" spcCol="0" rtlCol="0" fromWordArt="0" anchor="t" anchorCtr="0" forceAA="0" compatLnSpc="1"><a:prstTxWarp prst="textNoShape"><a:avLst/></a:prstTxWarp><a:noAutofit/></wps:bodyPr></wps:wsp></a:graphicData></a:graphic><wp14:sizeRelH relativeFrom="margin"><wp14:pctWidth>0</wp14:pctWidth></wp14:sizeRelH><wp14:sizeRelV relativeFrom="margin"><wp14:pctHeight>0</wp14:pctHeight></wp14:sizeRelV></wp:anchor></w:drawing></mc:Choice><mc:Fallback><w:pict><v:shapetype id="_x0000_t202" coordsize="21600,21600" o:spt="202" path="m,l,21600r21600,l21600,xe"><v:stroke joinstyle="miter"/><v:path gradientshapeok="t" o:connecttype="rect"/></v:shapetype><v:shape id="Cuadro de texto 2" o:spid="_x0000_s1027" type="#_x0000_t202" style="position:absolute;left:0;text-align:left;margin-left:0;margin-top:1.1pt;width:397.5pt;height:128pt;z-index:251660288;visibility:visible;mso-wrap-style:square;mso-width-percent:0;mso-height-percent:0;mso-wrap-distance-left:9pt;mso-wrap-distance-top:0;mso-wrap-distance-right:9pt;mso-wrap-distance-bottom:0;mso-position-horizontal:center;mso-position-horizontal-relative:margin;mso-position-vertical:absolute;mso-position-vertical-relative:text;mso-width-percent:0;mso-height-percent:0;mso-width-relative:margin;mso-height-relative:margin;v-text-anchor:top" filled="f" stroked="f" strokeweight=".5pt"><v:textbox><w:txbxContent>${texto}</w:txbxContent></v:textbox><w10:wrap anchorx="margin"/></v:shape></w:pict></mc:Fallback></mc:AlternateContent></w:r></w:p>`

  return rect + caja
}

/* ---------- Tabla de honorarios fijos (Tabla con cuadrícula, como el modelo) ---------- */

function tabla({ cabecera, filas }) {
  const celda = (w, jc, contenido, cab) =>
    `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${cab ? '<w:shd w:val="clear" w:color="auto" w:fill="4472C4" w:themeFill="accent1"/>' : ''}</w:tcPr>` +
    `<w:p><w:pPr><w:spacing w:line="276" w:lineRule="auto"/><w:jc w:val="${jc}"/>${rPr(cab ? { b: 1, color: BLANCO } : {})}</w:pPr>${contenido}</w:p></w:tc>`
  const cab = `<w:tr>${celda(6658, 'both', tRun(cabecera[0], { b: 1, color: BLANCO }), true)}${celda(1836, 'center', tRun(cabecera[1], { b: 1, color: BLANCO }), true)}</w:tr>`
  const cuerpo = filas.map(f =>
    `<w:tr>${celda(6658, 'both', tRun(f.concepto))}${celda(1836, 'center', f.importe ? tRun(f.importe) + tRun('(1)', { sup: 1 }) : '')}</w:tr>`
  ).join('')
  return `<w:tbl><w:tblPr><w:tblStyle w:val="Tablaconcuadrcula"/><w:tblW w:w="0" w:type="auto"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid><w:gridCol w:w="6658"/><w:gridCol w:w="1836"/></w:tblGrid>${cab}${cuerpo}</w:tbl>`
}

/* ---------- document.xml ---------- */

export function documentXml(d) {
  const bloques = construirBloques(d)
  const cuerpo = bloques.map(b => {
    if (b.k === 'titulo') return titulo(b.lineas)
    if (b.k === 'tabla') return tabla(b)
    if (b.k === 'blank') return `<w:p>${pPr({ ls: b.ls, jc: b.jc, b: b.b })}</w:p>`
    const tab = b.runs.find(r => r.tab)?.tab
    const soloNegrita = b.runs.every(r => r.b || r.tab)
    return `<w:p>${pPr({ ls: b.ls, jc: b.jc, ind: b.ind, nota: b.nota, tab, b: soloNegrita })}${runs(b.runs)}</w:p>`
  }).join('')

  const sect = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1701" w:bottom="1417" w:left="1701" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr>'
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${DOC_OPEN}<w:body>${cuerpo}${sect}</w:body></w:document>`
}

const DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/><Relationship Id="rIdMail" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="mailto:${LETRADO.email}" TargetMode="External"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings" Target="webSettings.xml"/></Relationships>`

function coreXml(d) {
  const ahora = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
  const titulo = `Propuesta de colaboración profesional${d.destNombre ? ' · ' + d.destNombre : ''}`
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${esc(titulo)}</dc:title><dc:subject>${esc(destinatarioLinea(d))}</dc:subject><dc:creator>${esc(LETRADO.nombre)}</dc:creator><cp:lastModifiedBy>${esc(LETRADO.nombre)}</cp:lastModifiedBy><cp:revision>1</cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">${ahora}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${ahora}</dcterms:modified></cp:coreProperties>`
}

const APP_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Template>Normal</Template><Application>Microsoft Office Word</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><Company></Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0000</AppVersion></Properties>`

/* ---------- ZIP mínimo (método «store», sin compresión) ---------- */

const CRC_TABLA = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

const crc32 = (buf) => {
  let c = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) c = CRC_TABLA[(c ^ buf[i]) & 0xFF] ^ (c >>> 8)
  return (c ^ 0xFFFFFFFF) >>> 0
}

function zip(ficheros) {
  const enc = new TextEncoder()
  const ahora = new Date()
  const hora = (ahora.getHours() << 11) | (ahora.getMinutes() << 5) | (ahora.getSeconds() >> 1)
  const dia = ((ahora.getFullYear() - 1980) << 9) | ((ahora.getMonth() + 1) << 5) | ahora.getDate()
  const partes = [], central = []
  let offset = 0
  for (const f of ficheros) {
    const nombre = enc.encode(f.nombre)
    const datos = typeof f.datos === 'string' ? enc.encode(f.datos) : f.datos
    const crc = crc32(datos)
    const lh = new DataView(new ArrayBuffer(30))
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true)
    lh.setUint16(8, 0, true); lh.setUint16(10, hora, true); lh.setUint16(12, dia, true)
    lh.setUint32(14, crc, true); lh.setUint32(18, datos.length, true); lh.setUint32(22, datos.length, true)
    lh.setUint16(26, nombre.length, true); lh.setUint16(28, 0, true)
    partes.push(new Uint8Array(lh.buffer), nombre, datos)

    const ch = new DataView(new ArrayBuffer(46))
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true)
    ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true); ch.setUint16(12, hora, true); ch.setUint16(14, dia, true)
    ch.setUint32(16, crc, true); ch.setUint32(20, datos.length, true); ch.setUint32(24, datos.length, true)
    ch.setUint16(28, nombre.length, true); ch.setUint32(42, offset, true)
    central.push(new Uint8Array(ch.buffer), nombre)
    offset += 30 + nombre.length + datos.length
  }
  const tamCentral = central.reduce((t, c) => t + c.length, 0)
  const fin = new DataView(new ArrayBuffer(22))
  fin.setUint32(0, 0x06054b50, true); fin.setUint16(8, ficheros.length, true); fin.setUint16(10, ficheros.length, true)
  fin.setUint32(12, tamCentral, true); fin.setUint32(16, offset, true)

  const todo = [...partes, ...central, new Uint8Array(fin.buffer)]
  const out = new Uint8Array(todo.reduce((t, c) => t + c.length, 0))
  let p = 0
  for (const c of todo) { out.set(c, p); p += c.length }
  return out
}

/* ---------- API ---------- */

export function generarDocx(d) {
  return zip([
    { nombre: '[Content_Types].xml', datos: CONTENT_TYPES },
    { nombre: '_rels/.rels', datos: ROOT_RELS },
    { nombre: 'word/document.xml', datos: documentXml(d) },
    { nombre: 'word/_rels/document.xml.rels', datos: DOC_RELS },
    { nombre: 'word/styles.xml', datos: STYLES },
    { nombre: 'word/numbering.xml', datos: NUMBERING },
    { nombre: 'word/settings.xml', datos: SETTINGS },
    { nombre: 'word/webSettings.xml', datos: WEB_SETTINGS },
    { nombre: 'word/fontTable.xml', datos: FONT_TABLE },
    { nombre: 'word/theme/theme1.xml', datos: THEME },
    { nombre: 'docProps/core.xml', datos: coreXml(d) },
    { nombre: 'docProps/app.xml', datos: APP_XML },
  ])
}

export const MIME_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
