/* =====================================================================
   HOJA DE ENCARGO · modelo del documento
   ---------------------------------------------------------------------
   Reproduce, párrafo a párrafo, el Word «PROPUESTA DE COLABORACIÓN
   PROFESIONAL» del despacho. De aquí salen las dos versiones:
     · docx.js      → el .docx (mismos estilos y formato que el original)
     · Documento.jsx → la vista previa paginada y el PDF
   Así las dos salidas son siempre el mismo documento.

   Cada bloque es uno de estos:
     { k:'titulo', lineas }                         cuadro azul de cabecera
     { k:'p', runs, jc, ls, ind, nota }             párrafo con texto
     { k:'blank', ls, jc, b }                       párrafo vacío (línea en blanco)
     { k:'tabla', cabecera, filas }                 tabla de honorarios fijos
   runs: [{ t, b, i, sup, link, tab }]
   ls: interlineado Word en 240avos (276 = múltiple 1,15 · 259 = 1,08)
   ===================================================================== */

export const LETRADO = {
  nombre: 'Iván Rojas Monfort',
  nif: '53.729.767-L',
  colegio: 'Abogado ICAM nº 142.327',
  email: 'ivanrojasmonfort@icam.es',
}

/* ---------- Textos fijos del modelo ---------- */

export const TXT = {
  intro: 'En respuesta a su amable petición y para reflejar el acuerdo al que hemos llegado, tengo el gusto de presentarle este documento que refleja nuestro acuerdo de colaboración profesional',
  alcance: 'En el presente documento se refleja el alcance de nuestra colaboración profesional en este caso, con indicación de los honorarios que irán vinculados a esta propuesta.',
  agradecimiento: 'Agradecido sinceramente por esta oportunidad que nos brindan de colaborar profesionalmente con Vd. y quiero manifestarle que pondré mi mayor empeño en atenderle.',
  confidencialidad: 'De conformidad con nuestras normas deontológicas, toda la información que nos suministre o aquélla a la que pudiéramos tener acceso, sería tratada de forma estrictamente confidencial. En este sentido, considero que nuestro procedimiento de control interno es adecuado para garantizar este extremo y para dar cumplimiento a la normativa vigente.',
  comunicaciones: 'Antes de exponer los pormenores de esta propuesta, quisiera indicarle que la firma de su aceptación a la misma implicará, mientras no exista manifestación o instrucción por su parte en sentido contrario, su expresa autorización para remitirle documentación y comunicaciones originadas durante la prestación de nuestros servicios profesionales, a través del correo electrónico o por internet, a aquellas direcciones que Vd. me facilite.',
  datos: 'Igualmente servirá de aceptación por Vd. al tratamiento de los datos confidenciales que será realizada cumpliendo con la legislación vigente en la materia y que incluye su derecho a conocer y en su caso ordenar la supresión de los datos confidenciales en los casos previstos por la Ley. La responsabilidad de la gestión de esa información corresponde al letrado abajo firmante, en la dirección de correo electrónico ',
  ajuste: 'Entiendo que esta propuesta se ajusta a los acuerdos que hemos alcanzado. Sin embargo, de no ser así, estoy a su disposición para estudiar las consideraciones que deseen plantearme.',
  asteriscos: '*   *   *   *   *',
  h1: 'I. ANTECEDENTES DE ESTA COLABORACIÓN PROFESIONAL',
  objetoTit: 'Objeto de este encargo profesional, y régimen jurídico del mismo.',
  soloJuridicos: 'La propuesta actual únicamente se refiere, como es lógico, a los trabajos propiamente jurídicos que se han indicado.',
  arrendamiento: 'La ejecución de los trabajos que ahora se ratifica con la firma de conformidad a esta propuesta se efectuará en régimen de arrendamiento de servicios, de conformidad con las normas deontológicas del Colegio de Abogados de Madrid, y las cláusulas previstas en esta propuesta.',
  h2: 'II. Honorarios y facturación.',
  determinacion: 'La determinación de los honorarios se realiza en función del tiempo que está previsto incurrir y de otros factores tales como la complejidad del trabajo, la experiencia necesaria para realizarlo o la cualificación de las personas intervinientes, en su caso.',
  politica: 'La política de facturación se basa en que los honorarios facturados guarden una adecuada relación con el valor del servicio que se presta y en que resulten previsibles.',
  h21: 'II.1.- Honorarios fijos.',
  notaIva: 'A las indicadas cantidades como honorarios de este despacho habrá que añadir el Impuesto sobre el Valor Añadido (I.V.A) al tipo vigente en la fecha de facturación.',
  gastos: 'Los gastos en los que sea necesario incurrir para desarrollar las prestaciones comprometidas (i.e. desplazamiento para reuniones, mensajería, …) serán por cuenta del Cliente, siendo los mismos facturables a la finalización de los trabajos.',
  facturas: 'Las facturas que emita el despacho serán pagaderas a la vista, por transferencia bancaria a la cuenta que se indicará en los propios documentos. Los gastos, en el caso de existir, se facturarán a la finalización de los trabajos.',
  h3: 'III. Limitación de responsabilidad.',
  limitacion1: 'La responsabilidad máxima asumida por el letrado Iván Rojas Monfort y los letrados intervinientes, ante el cliente o frente a terceros, por cualquier concepto, con relación a los servicios de la presente propuesta, no excederá del importe total de los honorarios fijos facturados por este trabajo.',
  limitacion2: 'El Letrado abajo firmante y sus eventuales colaboradores no serán responsables y se mantendrán indemnes por el Cliente ante cualquier pérdida, multa, daño, costas o gastos, ya sea ocasional, incidental o específico (incluyendo, a título meramente enunciativo, costes de oportunidad y lucro cesante), incluso si se hubiera advertido de su existencia, salvo que se demuestre, según las circunstancias del caso, su plena culpabilidad o grave negligencia profesional. Esta limitación de responsabilidad permanecerá en vigor incluso después de la realización del presente trabajo.',
  h4: 'IV. Protección de Datos.',
  proteccion: 'El cliente autoriza expresamente al letrado Iván Rojas Monfort para la inclusión en sus ficheros y el tratamiento de los datos de carácter personal respecto de toda la información y documentación que le fuera facilitada para el ejercicio de la prestación objeto de este encargo profesional. Dichos datos permanecerán en sus ficheros, pudiendo ejercer el Cliente sus derechos ARCO (Acceso, Rectificación, Cancelación u Olvido y/u Oposición), mediante solicitud escrita del interesado, de acuerdo con la legislación vigente.',
  aceptoTxt: 'Acepto,',
  rayaFirma: '_____________________________',
}

/* ---------- Textos por defecto de las partes editables ---------- */

export const DEFECTO = {
  referido: 'referido al asesoramiento jurídico en torno a ',
  sistemaConVariable: 'A estos efectos la Propuesta de honorarios que se presenta se articula a través de un sistema de honorarios fijos reducidos, y unos honorarios variables que se devengarían única y exclusivamente en el caso en que finalmente sean estimadas, total o parcialmente, las pretensiones del cliente. Seguidamente, se detallan los honorarios fijos y variables aplicables a todas las actuaciones que se realizarán.',
  sistemaSoloFijos: 'A estos efectos la Propuesta de honorarios que se presenta se articula a través de un sistema de honorarios fijos. Seguidamente, se detallan los honorarios fijos aplicables a todas las actuaciones que se realizarán.',
  devengoFijos: 'Los honorarios fijos previstos en el apartado II.1 se devengarán y serán exigibles el día en que quede presentado el escrito correspondiente a cada actuación. En dichas fechas, se emitirán las facturas que comprendan los honorarios fijos devengados a favor del letrado Iván Rojas Monfort.',
  devengoVariables: 'Los honorarios variables se devengarán y serán exigibles el día en que se notifique la resolución en la que se estimen total o parcialmente las pretensiones del cliente. En dicha fecha, se emitirá la factura que comprenda los honorarios variables devengados a favor del letrado Iván Rojas Monfort.',
  variableTitulo: 'en caso de estimación',
  variableBase: 'del importe derivado',
  variableCondicion: 'en caso de éxito total o parcial de las actuaciones objeto del presente encargo',
  tablaCabecera: 'Actuaciones profesionales',
}

export const hoyISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const encargoVacio = () => ({
  titulo: '',
  destTratamiento: 'Sr.',
  destNombre: '',
  destNif: '',
  saludo: 'Muy Sr. mío:',
  referido: DEFECTO.referido,
  antecedentes: '',
  intervencion: '',
  objeto: '',
  exclusiones: '',
  sistema: DEFECTO.sistemaSoloFijos,
  tablaCabecera: DEFECTO.tablaCabecera,
  fijos: [{ concepto: '', importe: '' }],
  devengoFijos: DEFECTO.devengoFijos,
  variableActivo: false,
  variableModo: 'porcentaje',          // porcentaje | importe
  variablePct: '',
  variableImporte: '',
  variableTitulo: DEFECTO.variableTitulo,
  variableBase: DEFECTO.variableBase,
  variableCondicion: DEFECTO.variableCondicion,
  devengoVariables: DEFECTO.devengoVariables,
  lugar: 'Madrid',
  fecha: hoyISO(),
})

/* ---------- Utilidades ---------- */

export const aNumero = (v) => {
  if (typeof v === 'number') return v
  const s = String(v ?? '').trim()
  if (!s) return NaN
  // 1.500,50 → 1500.50 · 1.500 → 1500 · 1500.5 → 1500.5 · 12,5 → 12.5
  let limpio = s.replace(/[€\s]/g, '')
  if (limpio.includes(',')) limpio = limpio.replace(/\./g, '').replace(',', '.')
  else if ((limpio.match(/\./g) || []).length > 1 || /^-?\d{1,3}\.\d{3}$/.test(limpio)) limpio = limpio.replace(/\./g, '')
  return parseFloat(limpio.replace(/[^\d.-]/g, ''))
}

// 1.500,00 (siempre agrupado y con dos decimales, como en el modelo)
export const importeTxt = (v) => {
  const n = aNumero(v)
  if (isNaN(n)) return String(v || '')
  return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' })
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
export const fechaLarga = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '')
  if (!m) return iso || ''
  return `${Number(m[3])} de ${MESES[Number(m[2]) - 1]} de ${m[1]}`
}

const UNIDADES = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte',
  'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve']
const DECENAS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']

const enteroALetras = (n) => {
  if (n < 30) return UNIDADES[n]
  if (n < 100) return DECENAS[Math.floor(n / 10)] + (n % 10 ? ' y ' + UNIDADES[n % 10] : '')
  if (n === 100) return 'cien'
  if (n < 200) return 'ciento ' + enteroALetras(n - 100)
  return String(n)
}

// 12 → «doce» · 12,5 → «doce coma cinco» (para «del doce por ciento (12%)»)
export const porcentajeALetras = (v) => {
  const n = aNumero(v)
  if (isNaN(n) || n < 0) return ''
  const [ent, dec] = String(Math.round(n * 100) / 100).split('.')
  let txt = enteroALetras(Number(ent))
  if (dec) {
    const ceros = dec.match(/^0*/)[0].length
    txt += ' coma ' + 'cero '.repeat(ceros) + enteroALetras(Number(dec.replace(/^0+/, '')))
  }
  return txt
}

export const porcentajeTxt = (v) => {
  const n = aNumero(v)
  return isNaN(n) ? '' : n.toLocaleString('es-ES', { maximumFractionDigits: 2 })
}

const conPunto = (t) => {
  const s = String(t || '').trim()
  if (!s) return ''
  return /[.:;!?…]$/.test(s) ? s : s + '.'
}

// Cada línea con texto es un párrafo; entre párrafos, una línea en blanco (como el modelo)
const parrafos = (t) => String(t || '').split(/\n+/).map(x => x.trim()).filter(Boolean)

export const lineasTitulo = (t) =>
  String(t || '').split('\n').map(x => x.trim()).filter(Boolean).map(x => x.toLocaleUpperCase('es-ES'))

export const fijosValidos = (d) => (d.fijos || []).filter(f => String(f.concepto || '').trim() || String(f.importe || '').trim())

export const destinatarioLinea = (d) => {
  const nombre = String(d.destNombre || '').trim().toLocaleUpperCase('es-ES')
  const trat = String(d.destTratamiento || '').trim()
  return [trat, nombre].filter(Boolean).join(' ')
}

/* ---------- Construcción del documento ---------- */

// Atajos de bloques con el formato exacto de cada tipo de párrafo del modelo
const P = (runs, o = {}) => ({ k: 'p', runs: typeof runs === 'string' ? [{ t: runs }] : runs, jc: 'both', ls: 276, ...o })
const B = (o = {}) => ({ k: 'blank', jc: 'both', ls: 276, ...o })
const negrita = (t) => [{ t, b: true }]

export function construirBloques(d) {
  const out = []
  const push = (...x) => out.push(...x)
  const fijos = fijosValidos(d)
  const conVariable = !!d.variableActivo

  // --- Cuadro de título + las 12 líneas en blanco que lo dejan libre ---
  push({ k: 'titulo', lineas: lineasTitulo(d.titulo) })
  for (let i = 0; i < 12; i++) push(B({ ls: 259, jc: 'left', b: true }))

  // --- Letrado ---
  push(P(negrita('IVÁN ROJAS MONFORT'), { ls: 259, jc: 'left' }))
  push(P(negrita('N.I.F ' + LETRADO.nif), { ls: 259, jc: 'left' }))
  push(P(negrita(LETRADO.colegio), { ls: 259, jc: 'left' }))
  push(B({ ls: 259, jc: 'left', b: true }), B({ ls: 259, jc: 'left', b: true }))

  // --- Destinatario (a la derecha) ---
  push(P(negrita(destinatarioLinea(d) || ' '), { ls: 259, jc: 'right' }))
  if (String(d.destNif || '').trim()) push(P(negrita('N.I.F ' + d.destNif.trim()), { ls: 259, jc: 'right' }))
  push(B({ ls: 259, jc: 'right', b: true }), B({ ls: 259, jc: 'right', b: true }))

  // --- Saludo y presentación ---
  push(P(d.saludo || 'Muy Sr. mío:'), B())
  const referido = String(d.referido || '').trim()
  push(P(referido ? `${TXT.intro} ${conPunto(referido)}` : TXT.intro + '.'), B())
  push(P(TXT.alcance), B())
  push(P(TXT.agradecimiento), B())
  push(P(TXT.confidencialidad), B())
  push(P(TXT.comunicaciones), B())
  push(P([{ t: TXT.datos }, { t: LETRADO.email, link: 'mailto:' + LETRADO.email }, { t: '.' }]), B())
  push(P(TXT.ajuste), B())
  push(P(TXT.asteriscos, { jc: 'center', pre: true }), B({ jc: 'center' }))

  // --- I. Antecedentes ---
  push(P(negrita(TXT.h1), { jc: 'center' }), B())
  const ante = parrafos(d.antecedentes)
  if (ante.length) ante.forEach(t => push(P(t), B()))
  else push(P(' '), B())
  push(P(negrita(TXT.objetoTit)), B())

  // En el modelo, intervención / objeto (en negrita) / exclusiones van a interlineado
  // sencillo (1,08), separados por una línea en blanco también sencilla
  const grupo = [
    ...parrafos(d.intervencion).map(t => P(t, { ls: 259 })),
    ...parrafos(d.objeto).map(t => P(negrita(t), { ls: 259 })),
    ...parrafos(d.exclusiones).map(t => P(t, { ls: 259 })),
  ]
  grupo.forEach((p, i) => push(p, ...(i < grupo.length - 1 ? [B({ ls: 259 })] : [])))
  if (grupo.length) push(B())

  push(P(TXT.soloJuridicos), B())
  push(P(TXT.arrendamiento), B())

  // --- II. Honorarios ---
  push(P(negrita(TXT.h2)), B())
  push(P(TXT.determinacion), B())
  push(P(TXT.politica))
  parrafos(d.sistema).forEach(t => push(P(t)))
  push(B())
  push(P(negrita(TXT.h21)), B())
  push({
    k: 'tabla',
    cabecera: [d.tablaCabecera || DEFECTO.tablaCabecera, 'Honorarios'],
    filas: (fijos.length ? fijos : [{ concepto: '', importe: '' }]).map((f, i) => ({
      concepto: `II.1.${i + 1}.- ${String(f.concepto || '').trim()}`,
      importe: String(f.importe || '').trim() ? `${importeTxt(f.importe)} € ` : '',
    })),
  })
  push(B())
  push(P([{ t: TXT.notaIva, i: true }], { nota: 1 }), B())
  parrafos(d.devengoFijos).forEach(t => push(P(t), B()))

  if (conVariable) {
    const tit = String(d.variableTitulo || '').trim()
    push(P(negrita(`II.2.- Honorarios variables${tit ? ' ' + tit.replace(/\.$/, '') : ''}.`)), B())
    const cond = String(d.variableCondicion || '').trim()
    const cola = (base) => conPunto([base, cond].filter(Boolean).join(', ')) || '.'
    if (d.variableModo === 'importe') {
      push(P([
        { t: `Una cantidad variable de ${importeTxt(d.variableImporte)} euros(` },
        { t: '2', sup: true },
        { t: ')' + (cond ? ', ' + conPunto(cond) : '.') },
      ]), B())
    } else {
      const pct = porcentajeTxt(d.variablePct)
      const base = String(d.variableBase || '').trim()
      push(P([
        { t: `Una cantidad variable del ${porcentajeALetras(d.variablePct)} por ciento (${pct}%)(` },
        { t: '2', sup: true },
        { t: ') ' + cola(base) },
      ]), B())
    }
    push(P([{ t: TXT.notaIva, i: true }], { nota: 2 }), B())
    parrafos(d.devengoVariables).forEach(t => push(P(t), B()))
  }

  push(P(TXT.gastos), B())
  push(P(TXT.facturas), B(), B())

  // --- III y IV ---
  push(P(negrita(TXT.h3)), B())
  push(P(TXT.limitacion1), B())
  push(P(TXT.limitacion2), B())
  push(P(negrita(TXT.h4)), B())
  push(P(TXT.proteccion), B())

  // --- Lugar, fecha y firmas ---
  push(P(negrita(`En ${d.lugar || 'Madrid'}, a ${fechaLarga(d.fecha)}.`)))
  for (let i = 0; i < 5; i++) push(B())
  push(P(negrita(TXT.rayaFirma)))
  push(P([{ t: LETRADO.nombre }, { tab: 4956 }, { t: TXT.aceptoTxt, b: true }]))
  push(B(), B(), B({ jc: 'right' }))
  // Línea de firma del cliente: igual que en el modelo (centrada, precedida de 83 espacios)
  push(P(negrita(' '.repeat(83) + TXT.rayaFirma), { jc: 'center', pre: true }))
  push(P(String(d.destNombre || '').trim() || ' ', { jc: 'left', ls: 259, ind: 4956 }))

  return out
}

// Nombre de archivo: «Hoja de encargo - Cliente - 2026-09-24»
export const nombreArchivo = (d, ext) => {
  const cli = String(d.destNombre || 'cliente').trim().replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ')
  return `Hoja de encargo - ${cli} - ${d.fecha || hoyISO()}.${ext}`
}
