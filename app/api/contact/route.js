import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const body = await req.json()
    const { nombre, apellidos, email, telefono, servicio, mensaje, como } = body

    if (!nombre || !email || !servicio || !mensaje) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Configuración SMTP de IONOS (credenciales en variables de entorno de Vercel)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ionos.es',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // 587 usa STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const destino = process.env.CONTACT_TO || 'correo@irmabogados.es'
    const nombreCompleto = [nombre, apellidos].filter(Boolean).join(' ')

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#262626">
        <div style="background:#0D1B2A;color:#fff;padding:20px 24px">
          <h2 style="margin:0;font-size:18px">Nueva consulta desde la web</h2>
        </div>
        <div style="padding:24px;border:1px solid #eee;border-top:none">
          <p style="margin:0 0 14px"><strong>Nombre:</strong> ${nombreCompleto}</p>
          <p style="margin:0 0 14px"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p style="margin:0 0 14px"><strong>Teléfono:</strong> ${telefono || '—'}</p>
          <p style="margin:0 0 14px"><strong>Servicio de interés:</strong> ${servicio}</p>
          <p style="margin:0 0 14px"><strong>Cómo nos conoció:</strong> ${como || '—'}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:18px 0">
          <p style="margin:0 0 6px"><strong>Mensaje:</strong></p>
          <p style="margin:0;white-space:pre-wrap;background:#f8f6f0;padding:14px;border-radius:6px">${mensaje}</p>
        </div>
        <div style="padding:14px 24px;background:#f4f5f7;font-size:12px;color:#888">
          Enviado automáticamente desde el formulario de irmabogadosasesores.com
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"Web IRM Abogados" <${process.env.SMTP_USER}>`,
      to: destino,
      replyTo: email, // al responder, contestas directamente al cliente
      subject: `Nueva consulta web — ${servicio} — ${nombreCompleto}`,
      html,
      text: `Nueva consulta desde la web\n\nNombre: ${nombreCompleto}\nEmail: ${email}\nTeléfono: ${telefono || '—'}\nServicio: ${servicio}\nCómo nos conoció: ${como || '—'}\n\nMensaje:\n${mensaje}`,
    })

    return NextResponse.json({ ok: true, message: 'Consulta recibida correctamente' })
  } catch (err) {
    console.error('Error al enviar email de contacto:', err)
    return NextResponse.json({ error: 'Error al enviar la consulta' }, { status: 500 })
  }
}
