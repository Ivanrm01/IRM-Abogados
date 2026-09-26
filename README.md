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

## 🛡️ Seguridad del panel y registro de consentimientos de cookies

### Puesta en marcha (una sola vez, en este orden)
1. **Supabase → SQL Editor:** pega `data/seguridad-schema.sql` y ejecútalo. Solo añade columnas y
   tablas, así que la web publicada sigue funcionando igual mientras tanto.
2. **Vercel → Settings → Environment Variables:** añade `CONSENT_SALT` con una cadena larga y
   aleatoria (40 caracteres o más). **No la cambies nunca** una vez puesta.
3. Sube el código a GitHub. Al publicarse, todo el equipo tendrá que volver a entrar una vez.

Si el panel dice *«Falta actualizar la base de datos»*, es que falta el paso 1.

### Qué protege el panel, sin hacer nada
- **Email + contraseña** de cada persona. Si fallan, el mensaje no dice cuál de los dos era.
- **Límite de intentos:** 8 fallos desde la misma conexión la bloquean 15 minutos; 20 fallos
  contra la misma cuenta desde cualquier sitio la bloquean 1 hora.
- **Sesión en cookie protegida** (`HttpOnly`, `Secure`, `SameSite=Strict`, prefijo `__Host-`).
  En la base de datos solo se guarda la huella del token, nunca el token.
- **Caducidad:** a los 30 minutos sin actividad y, en cualquier caso, a las 12 horas. Mientras
  trabajas, la sesión se renueva sola.
- Cambiar la contraseña de alguien, o desactivar su cuenta, **cierra sus sesiones abiertas**.
- **Registro de accesos:** en *Seguridad* ves los últimos intentos de entrada de todo el equipo,
  correctos y fallidos, con fecha, cuenta, IP y dispositivo, y los cambios de seguridad.

### Verificación en dos pasos (cada persona, en su cuenta)
1. Instala en el móvil Google Authenticator o Microsoft Authenticator.
2. En el panel, ve a **Seguridad**, escribe tu contraseña y pulsa **Activar**.
3. Escanea el código QR y escribe el código que aparece.
4. **Guarda los 8 códigos de recuperación** (*Descargar como .txt*) fuera del ordenador. Cada uno
   sirve una sola vez para entrar si pierdes el móvil.

Mientras alguien no la tenga activada, el panel le muestra un aviso para que lo haga.

**Si alguien pierde el móvil:**
- Con sus códigos de recuperación: en el acceso pulsa *Usar un código de recuperación*; luego, en
  *Seguridad*, desactiva la verificación y vuelve a activarla con el móvil nuevo.
- Sin los códigos: otra persona del despacho entra en **Accesos** y pulsa **Quitar 2 pasos** en su
  cuenta. Si eres la única cuenta, al final de `data/seguridad-schema.sql` está la línea de SQL
  que lo hace.

**Si sospechas algo raro:** *Seguridad → Cerrar sesión en todos los dispositivos*, cambia la
contraseña y, si no la tenías, activa la verificación en dos pasos.

### Registro de consentimientos de cookies
El artículo 7.1 del RGPD obliga a poder **demostrar** que se obtuvo el consentimiento, y la cookie
del navegador no sirve como prueba: si el visitante la borra, la prueba desaparece. Por eso cada
decisión del banner (aceptar, rechazar o guardar la selección) queda anotada en la tabla
`cookies_consentimientos` con la fecha, las finalidades, el botón pulsado, la página, el texto
literal mostrado y huellas irreversibles de la IP y del navegador. Ni nombre, ni email, ni la IP en
claro. Se conserva 4 años y se borra solo.

**Para sacarlo si te lo piden:** *Seguridad → Descargar registro (CSV para Excel)*. Con la sesión
abierta también sirven `/api/consentimiento` (JSON) y `/api/consentimiento?id=IDENTIFICADOR`
(historial de un visitante; el identificador está en su cookie `irm_consent`).

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
