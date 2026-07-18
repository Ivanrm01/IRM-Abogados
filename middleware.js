// middleware.js
import { NextResponse } from 'next/server'

function quitarTildes(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  let decodificada
  try { decodificada = decodeURIComponent(pathname) } catch { decodificada = pathname }

  const normalizada = quitarTildes(decodificada)

  if (normalizada !== decodificada) {
    const url = request.nextUrl.clone()
    url.pathname = normalizada
    return NextResponse.redirect(url, 301)
  }
  return NextResponse.next()
}

export const config = {
  // No toca /api, recursos internos ni archivos con extensión (imágenes, etc.)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
