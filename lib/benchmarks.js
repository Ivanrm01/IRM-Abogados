/**
 * Bandas de referencia sectorial.
 *
 * Formato: [p20, valor central, p80] por división CNAE y tramo de tamaño
 * (a = 1-9 ocupados, b = 10-49, c = 50 o más).
 *
 * FUENTE: INE, Estadística Estructural de Empresas — tablas de principales
 * indicadores por CNAE y tamaño (por personal ocupado). Para el ratio `rai`,
 * AEAT — Cuentas anuales no consolidadas del Impuesto sobre Sociedades.
 *
 * La banda se construye con la dispersión entre los grupos CNAE de 3 dígitos
 * que cuelgan de cada división, dentro del mismo estrato de tamaño. Es
 * dispersión ENTRE SUBACTIVIDADES, no entre empresas individuales.
 *
 * ⚠️ Estos valores son provisionales. Sustituir por la salida de
 * build_benchmarks.py, que los genera desde los CSV del INE.
 * La sección F (construcción, CNAE 41-43) no está cubierta por la EEE.
 */

export const SECTORES = {
  '25': { n: 'Fabricación de productos metálicos',
    a: { tva:[28,35,43], tgp:[38,50,63], ebe:[8,14,21], cno:[78,105,145], gpo:[24,29,34], ccn:[57,65,72], rai:[1.8,5.4,11] },
    b: { tva:[30,37,45], tgp:[55,66,77], ebe:[6,12,18], cno:[110,148,195], gpo:[29,34,40], ccn:[55,63,70], rai:[1.5,4.9,10.2] },
    c: { tva:[29,36,44], tgp:[60,71,81], ebe:[5,10,16], cno:[145,192,255], gpo:[33,39,46], ccn:[56,64,71], rai:[1.4,4.6,9.6] } },
  '45': { n: 'Venta y reparación de vehículos',
    a: { tva:[14,21,30], tgp:[38,52,66], ebe:[4,8,14], cno:[125,180,265], gpo:[21,26,31], ccn:[70,79,86], rai:[1.2,3.8,8.4] },
    b: { tva:[13,19,27], tgp:[56,69,80], ebe:[2,5,10], cno:[185,265,380], gpo:[25,30,36], ccn:[73,81,87], rai:[0.9,2.9,6.6] },
    c: { tva:[12,18,26], tgp:[60,73,83], ebe:[2,4,8],  cno:[240,340,480], gpo:[28,34,41], ccn:[74,82,88], rai:[0.8,2.5,5.8] } },
  '46': { n: 'Comercio al por mayor',
    a: { tva:[11,17,26], tgp:[34,48,62], ebe:[4,8,15], cno:[190,285,430], gpo:[24,30,36], ccn:[74,83,89], rai:[1.4,4.2,9.5] },
    b: { tva:[12,18,27], tgp:[52,65,77], ebe:[3,6,12], cno:[275,395,570], gpo:[29,35,42], ccn:[73,82,88], rai:[1.1,3.5,8] },
    c: { tva:[11,17,25], tgp:[57,70,81], ebe:[2,5,10], cno:[350,500,720], gpo:[33,40,48], ccn:[75,83,89], rai:[1,3.1,7.2] } },
  '47': { n: 'Comercio al por menor',
    a: { tva:[16,24,34], tgp:[36,50,64], ebe:[4,9,16], cno:[85,125,180], gpo:[18,22,27], ccn:[66,76,84], rai:[1,3.4,8] },
    b: { tva:[17,25,35], tgp:[55,68,79], ebe:[3,6,11], cno:[110,158,225], gpo:[21,26,31], ccn:[65,75,83], rai:[0.8,2.7,6.5] },
    c: { tva:[18,26,36], tgp:[60,72,82], ebe:[2,5,10], cno:[130,185,265], gpo:[23,28,34], ccn:[64,74,82], rai:[0.7,2.4,5.9] } },
  '49': { n: 'Transporte terrestre',
    a: { tva:[32,42,53], tgp:[30,44,59], ebe:[10,18,28], cno:[58,82,118], gpo:[21,26,31], ccn:[47,58,68], rai:[2.2,6.5,13.5] },
    b: { tva:[34,44,55], tgp:[55,68,79], ebe:[6,12,19], cno:[78,108,150], gpo:[26,31,37], ccn:[45,56,66], rai:[1.6,5,10.8] },
    c: { tva:[33,43,54], tgp:[62,74,84], ebe:[4,9,15], cno:[95,132,185], gpo:[29,35,42], ccn:[46,57,67], rai:[1.3,4.1,9] } },
  '56': { n: 'Servicios de comidas y bebidas',
    a: { tva:[38,48,58], tgp:[28,42,57], ebe:[12,21,32], cno:[32,46,66], gpo:[16,20,24], ccn:[42,52,62], rai:[2.5,7.8,16] },
    b: { tva:[40,50,60], tgp:[54,67,79], ebe:[7,14,22], cno:[42,60,84], gpo:[18,22,27], ccn:[40,50,60], rai:[1.7,5.4,11.5] },
    c: { tva:[41,51,61], tgp:[60,73,84], ebe:[5,11,17], cno:[48,68,96], gpo:[20,25,30], ccn:[39,49,59], rai:[1.4,4.4,9.6] } },
  '62': { n: 'Programación y consultoría informática',
    a: { tva:[48,60,72], tgp:[32,47,62], ebe:[16,28,42], cno:[52,74,105], gpo:[28,36,45], ccn:[28,40,52], rai:[3.5,11,22] },
    b: { tva:[50,62,74], tgp:[58,71,83], ebe:[8,16,26], cno:[68,95,132], gpo:[34,43,53], ccn:[26,38,50], rai:[2.4,7.6,15.5] },
    c: { tva:[49,61,73], tgp:[64,77,87], ebe:[6,12,20], cno:[82,115,160], gpo:[39,49,60], ccn:[27,39,51], rai:[2,6.3,13] } },
  '68': { n: 'Actividades inmobiliarias',
    a: { tva:[42,56,70], tgp:[18,32,48], ebe:[18,32,50], cno:[70,110,175], gpo:[24,31,39], ccn:[30,44,58], rai:[4,13,28] },
    b: { tva:[44,58,72], tgp:[42,57,72], ebe:[12,24,38], cno:[95,145,225], gpo:[29,37,46], ccn:[28,42,56], rai:[3,10,21] },
    c: { tva:[43,57,71], tgp:[50,65,79], ebe:[9,19,31], cno:[115,175,270], gpo:[34,43,53], ccn:[29,43,57], rai:[2.5,8.2,17.5] } },
  '69': { n: 'Actividades jurídicas y de contabilidad',
    a: { tva:[52,64,76], tgp:[26,41,57], ebe:[18,31,45], cno:[45,64,90], gpo:[24,30,37], ccn:[24,36,48], rai:[4,12,24] },
    b: { tva:[54,66,78], tgp:[55,69,82], ebe:[8,17,27], cno:[58,82,115], gpo:[30,38,47], ccn:[22,34,46], rai:[2.6,8.4,17] },
    c: { tva:[53,65,77], tgp:[62,75,86], ebe:[6,13,21], cno:[70,98,138], gpo:[35,44,54], ccn:[23,35,47], rai:[2.2,7,14.2] } },
  '71': { n: 'Servicios técnicos de arquitectura e ingeniería',
    a: { tva:[46,58,70], tgp:[30,45,60], ebe:[14,26,40], cno:[42,60,85], gpo:[23,29,36], ccn:[30,42,54], rai:[3.2,10,20.5] },
    b: { tva:[48,60,72], tgp:[57,70,82], ebe:[7,15,24], cno:[56,78,110], gpo:[29,36,45], ccn:[28,40,52], rai:[2.2,7,14.5] },
    c: { tva:[47,59,71], tgp:[63,76,86], ebe:[5,11,18], cno:[66,92,130], gpo:[33,42,51], ccn:[29,41,53], rai:[1.8,5.8,12] } },
  '81': { n: 'Servicios a edificios y jardinería',
    a: { tva:[52,64,76], tgp:[38,53,68], ebe:[10,20,32], cno:[26,38,55], gpo:[15,19,23], ccn:[24,36,48], rai:[2,6.8,14] },
    b: { tva:[56,68,80], tgp:[66,78,88], ebe:[4,10,17], cno:[32,45,64], gpo:[17,21,26], ccn:[20,32,44], rai:[1.3,4.4,9.5] },
    c: { tva:[58,70,82], tgp:[72,84,92], ebe:[2,6,11],  cno:[35,50,70], gpo:[18,23,28], ccn:[18,30,42], rai:[1,3.4,7.4] } },
  '86': { n: 'Actividades sanitarias',
    a: { tva:[48,60,72], tgp:[24,38,54], ebe:[18,32,46], cno:[48,70,100], gpo:[22,29,37], ccn:[28,40,52], rai:[4.5,13.5,26] },
    b: { tva:[50,62,74], tgp:[52,66,79], ebe:[9,19,30], cno:[62,88,124], gpo:[28,36,45], ccn:[26,38,50], rai:[2.8,9,18] },
    c: { tva:[49,61,73], tgp:[60,73,84], ebe:[6,13,21], cno:[72,102,145], gpo:[32,41,51], ccn:[27,39,51], rai:[2.2,7.2,14.8] } },
  '96': { n: 'Otros servicios personales',
    a: { tva:[50,62,74], tgp:[26,40,56], ebe:[16,29,44], cno:[26,38,56], gpo:[14,18,22], ccn:[26,38,50], rai:[3,9.5,20] },
    b: { tva:[52,64,76], tgp:[56,70,82], ebe:[7,15,24], cno:[32,46,66], gpo:[16,20,25], ccn:[24,36,48], rai:[1.8,6,12.8] },
    c: { tva:[51,63,75], tgp:[62,75,86], ebe:[5,11,18], cno:[36,52,74], gpo:[18,22,28], ccn:[25,37,49], rai:[1.5,4.9,10.5] } },
}

const F_INE = 'Fuente · INE, Estadística Estructural de Empresas'
const F_AEAT = 'Fuente · AEAT, Cuentas anuales del Impuesto sobre Sociedades'

/**
 * cola: 'baja'  → sólo preocupa quedarse corto
 *       'alta'  → sólo preocupa pasarse
 *       'ambas' → preocupa en los dos sentidos
 */
export const RATIOS = [
  { id:'tva', nom:'Tasa de valor añadido', u:'%', d:1, cola:'baja', p:1.3, f:F_INE,
    calc: x => (x.vab / x.cn) * 100,
    txt:'Cuánto queda de cada 100 € facturados después de pagar a proveedores y servicios exteriores. Por debajo de tu actividad, la lectura habitual es que hay ingresos que no llegan a la facturación o compras que no corresponden al negocio. Es el primer ratio que se mira porque resume la empresa en un número.' },

  { id:'ccn', nom:'Compras y consumos sobre cifra de negocios', u:'%', d:1, cola:'alta', p:1.2, f:F_INE,
    calc: x => ((x.apro + x.otros) / x.cn) * 100,
    txt:'El espejo del anterior, y el que de verdad pesa en IVA: cada punto de más aquí son cuotas soportadas que te deduces. Por encima de tu actividad se revisa si todas esas compras son del negocio o si hay gasto particular, vehículos, suministros de la vivienda o proveedores que no aguantan un cruce.' },

  { id:'tgp', nom:'Gastos de personal sobre valor añadido', u:'%', d:1, cola:'ambas', p:1.0, f:F_INE,
    calc: x => x.vab > 0 ? (x.pers / x.vab) * 100 : null,
    txt:'Cuánto del valor generado se va en nóminas. Muy por encima suele indicar plantilla infrautilizada o retribuciones que en realidad son reparto de resultado. Muy por debajo, en una actividad que necesita manos, apunta a horas no declaradas o a facturación de terceros que las cubre.' },

  { id:'gpo', nom:'Coste de personal por empleado remunerado', u:' k€', d:1, cola:'baja', p:1.1, f:F_INE,
    calc: x => x.remun > 0 ? x.pers / x.remun / 1000 : null,
    txt:'Coste medio anual por persona en nómina, cotizaciones incluidas. Quedarse claramente por debajo de tu actividad y tamaño describe plantilla declarada a media jornada que trabaja a jornada completa, o complementos que salen por otra vía. Es el ratio que más cruza la Inspección de Trabajo con Hacienda.' },

  { id:'cno', nom:'Cifra de negocios por persona ocupada', u:' k€', d:0, cola:'baja', p:0.9, f:F_INE,
    calc: x => x.emp > 0 ? x.cn / x.emp / 1000 : null,
    txt:'Ventas entre personal ocupado. Se lee junto al coste por empleado: facturar poco por cabeza y pagar poco por cabeza a la vez describe una estructura que declara menos actividad de la que sostiene. Ojo si el socio administrador no está contado, porque el denominador queda corto y el ratio sale inflado.' },

  { id:'ebe', nom:'Excedente bruto de explotación sobre ventas', u:'%', d:1, cola:'baja', p:1.2, f:F_INE,
    calc: x => ((x.vab - x.pers) / x.cn) * 100,
    txt:'El resultado de explotación antes de amortizar, sobre ventas. Una empresa que lleva años ganando poco pero sigue abierta y mantiene a una familia es la contradicción que más comprobaciones dispara: si el margen no da para vivir, se pregunta de dónde sale lo que se vive.' },

  { id:'rai', nom:'Resultado antes de impuestos sobre ventas', u:'%', d:1, cola:'baja', p:1.0, f:F_AEAT,
    calc: x => (x.rai / x.cn) * 100,
    txt:'La rentabilidad final que llega al modelo 200. Aislada dice poco; junto a un excedente de explotación también bajo, confirma la lectura. Si la distancia entre ambos es grande, el problema está en gastos financieros o en partidas ajenas a la explotación, y eso se explica en una línea.' },
]

export const CAMPOS = [
  { id:'cn',     l:'Importe neto de la cifra de negocios', c:'70' },
  { id:'apro',   l:'Aprovisionamientos', c:'60' },
  { id:'otros',  l:'Otros gastos de explotación', c:'62' },
  { id:'pers',   l:'Gastos de personal', c:'64' },
  { id:'rai',    l:'Resultado antes de impuestos', pista:'Admite negativo.' },
  { id:'emp',    l:'Personal ocupado medio', pista:'Incluye al socio que trabaja, esté o no en nómina.' },
  { id:'remun',  l:'De ellos, remunerados por nómina' },
  { id:'ivasop', l:'IVA soportado deducido', c:'472', pista:'Suma de las cuotas deducidas de los cuatro 303.' },
  { id:'ivarep', l:'IVA devengado del ejercicio', c:'477' },
  { id:'caja',   l:'Cobros en efectivo', pista:'Opcional. No se compara, se contextualiza.' },
]

export const TRAMOS = [
  { v:'a', l:'De 1 a 9 ocupados' },
  { v:'b', l:'De 10 a 49 ocupados' },
  { v:'c', l:'50 o más ocupados' },
]

/** Desviación medida en anchos de banda. 0 = dentro. */
export function desviacion(valor, q, cola) {
  const ancho = Math.max(q[2] - q[0], 1e-6)
  if (valor < q[0] && cola !== 'alta') return { d:(q[0]-valor)/ancho, lado:'por debajo' }
  if (valor > q[2] && cola !== 'baja') return { d:(valor-q[2])/ancho, lado:'por encima' }
  return { d:0, lado:'en banda' }
}

export const nivel = d => d === 0 ? 'verde' : (d < 0.85 ? 'ambar' : 'alerta')
