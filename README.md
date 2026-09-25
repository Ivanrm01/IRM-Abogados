# IRM Abogados — Web Oficial

Web completa de IRM Abogados construida con Next.js 14, lista para desplegar en Vercel.

## 🚀 Instalación local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env.local

# 3. Editar .env.local con tu contraseña de admin
# ADMIN_KEY=tu-contraseña-segura
# NEXT_PUBLIC_ADMIN_KEY=tu-contraseña-segura

# 4. Arrancar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del proyecto

```
irm-web/
├── app/
│   ├── page.jsx              → Inicio
│   ├── sobre-nosotros/       → Sobre nosotros
│   ├── servicios/            → Servicios
│   ├── fiscal/               → Asesoramiento Fiscal
│   ├── asesoramiento-start-ups/ → Start-Ups
│   ├── garantias-deuda-aeat/ → Garantías tributarias
│   ├── contacto/             → Contacto
│   ├── blog/                 → Blog (listado)
│   ├── blog/[slug]/          → Post individual
│   ├── admin/                → Panel de administración
│   └── api/
│       ├── posts/            → API del blog
│       └── contact/          → API del formulario
├── components/
│   ├── Nav.jsx               → Navegación
│   └── Footer.jsx            → Pie de página
├── data/
│   └── posts.json            → Artículos del blog
└── lib/
    └── posts.js              → Helper del blog
```

---

## 📝 Panel de administración del blog

Accede en: `/admin`

**Contraseña por defecto:** `irm-admin-2025`

⚠️ Cámbiala en `.env.local` antes de publicar en producción.

Funcionalidades:
- ✅ Crear artículos con editor HTML
- ✅ Editar artículos existentes
- ✅ Vista previa en tiempo real
- ✅ Publicar / despublicar
- ✅ Eliminar artículos
- ✅ Auto-generación de slug (URL)

---

## ⚖️ Despacho: CRM, hojas de encargo y honorarios

### Puesta en marcha de Honorarios (una sola vez)
Abre Supabase → SQL Editor, pega `data/honorarios-schema.sql` y ejecútalo. Crea la tabla
`crm_honorarios`; si el resto del CRM ya tiene RLS activado, la nueva tabla se cierra igual.
Hasta que no exista, el panel de Honorarios muestra este mismo aviso y el CRM sigue funcionando.

### Hojas de encargo
- Reproducen el Word «Propuesta de colaboración profesional»: A4, márgenes 3 cm / 2,5 cm,
  Garamond 11, interlineado 1,15 / 1,08, cuadro azul del título, tabla de honorarios y notas (1), (2).
- **Word (.docx)**: se genera con los estilos, numeración y tema del Word original
  (`app/admin/encargo/plantilla-docx.js`, extraídos del modelo).
- **PDF**: «Imprimir / Guardar PDF» abre el diálogo de impresión con las mismas páginas de la
  vista previa; elige «Guardar como PDF».
- Si el equipo no tiene la fuente Garamond de Office, la vista previa y el PDF usan EB Garamond
  (su equivalente libre); el Word siempre usa Garamond.
- Los textos fijos del modelo están en `app/admin/encargo/modelo.js` (`TXT` y `DEFECTO`).

### Honorarios
Conceptos fijos o variables (% de la cuantía) por expediente, con estados
«por devengar / en expectativa → pendiente de facturar → facturado → cobrado» (o «no devengado»).
Se pueden generar desde los importes que ya tienen los expedientes o registrar desde una hoja de encargo.

---

## 🌐 Despliegue en Vercel

### Paso 1 — Subir a GitHub
```bash
git init
git add .
git commit -m "IRM Abogados — primera versión"
git remote add origin https://github.com/TU_USUARIO/irm-web.git
git push -u origin main
```

### Paso 2 — Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Clic en **"Add New Project"**
3. Importa el repositorio `irm-web`
4. En **Environment Variables** añade:
   - `ADMIN_KEY` → tu contraseña segura
   - `NEXT_PUBLIC_ADMIN_KEY` → la misma contraseña
5. Clic en **Deploy**

### Paso 3 — Dominio personalizado
En el panel de Vercel → Settings → Domains → Añade `irmabogadosasesores.com`

---

## 📧 Configurar envío de emails (formulario de contacto)

El formulario de contacto está preparado para conectar con **Resend** (gratis hasta 3.000 emails/mes):

1. Crea cuenta en [resend.com](https://resend.com)
2. Obtén tu API Key
3. Añade en `.env.local`:
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_TO=correo@irmabogados.es
```
4. Actualiza `app/api/contact/route.js` descomentando el código de Resend

---

## ✏️ Cómo añadir nuevas páginas

Para páginas de servicio adicionales, simplemente crea una carpeta en `app/` con un archivo `page.jsx`.

---

## 🎨 Sistema de diseño

| Variable CSS | Valor | Uso |
|---|---|---|
| `--navy` | `#0D1B2A` | Fondos oscuros principales |
| `--navy-mid` | `#1A2E45` | Tarjetas y fondos secundarios |
| `--gold` | `#B8975A` | Color de marca, acentos |
| `--gold-pale` | `#F5EDD8` | Fondos de elementos resaltados |
| `--cream` | `#F8F4EE` | Fondo general de la web |
| `--white` | `#FFFFFF` | Fondos de secciones blancas |

**Tipografías:**
- Títulos: Cormorant Garamond
- Texto: Outfit

---

Desarrollado para IRM Abogados · Madrid & Castellón
