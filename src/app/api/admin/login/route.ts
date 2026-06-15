import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, sessionToken } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: 'Admin-Bereich ist nicht konfiguriert (ADMIN_PASSWORD fehlt).' },
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
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
