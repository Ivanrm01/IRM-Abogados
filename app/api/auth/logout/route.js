import { NextResponse } from 'next/server'
import { borrarCookie } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST() {
  return borrarCookie(NextResponse.json({ ok: true }))
}
