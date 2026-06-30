import { NextResponse } from 'next/server';
import { BEAMER_COOKIE } from '@/lib/beamerAuth';

export const runtime = 'nodejs';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(BEAMER_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
