import { NextRequest, NextResponse } from 'next/server';
import { BEAMER_COOKIE, beamerSessionToken } from '@/lib/beamerAuth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const expected = process.env.BEAMER_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: 'Beamer-Bereich ist nicht konfiguriert (BEAMER_PASSWORD fehlt).' },
      { status: 500 }
    );
  }

  let password: string | undefined;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  if (!password || password !== expected) {
    return NextResponse.json({ error: 'Falsches Passwort.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(BEAMER_COOKIE, beamerSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 16, // 16 Stunden (deckt den Eventtag ab)
  });
  return res;
}
