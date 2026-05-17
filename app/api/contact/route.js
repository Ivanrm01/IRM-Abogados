import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { nombre, apellidos, email, telefono, servicio, mensaje, como } = body

    if (!nombre || !email || !servicio || !mensaje) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Aquí puedes conectar con Resend, Nodemailer, EmailJS, etc.
    // Por ahora solo devuelve OK para que el formulario funcione
    console.log('Nuevo contacto:', { nombre, apellidos, email, telefono, servicio, mensaje, como })

    return NextResponse.json({ ok: true, message: 'Consulta recibida correctamente' })
  } catch (err) {
    return NextResponse.json({ error: 'Error al procesar la consulta' }, { status: 500 })
  }
}
