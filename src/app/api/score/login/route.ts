import { NextRequest, NextResponse } from 'next/server';
import { SCORE_COOKIE, scoreSessionToken } from '@/lib/scoreAuth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const expected = process.env.SCORE_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: 'Eingabe-Bereich ist nicht konfiguriert (SCORE_PASSWORD fehlt).' },
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
  res.cookies.set(SCORE_COOKIE, scoreSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 16, // 16 Stunden (deckt den Eventtag ab)
  });
  return res;
}
