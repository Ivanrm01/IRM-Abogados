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
