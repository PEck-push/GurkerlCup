import { NextResponse } from 'next/server';
import { SCORE_COOKIE } from '@/lib/scoreAuth';

export const runtime = 'nodejs';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SCORE_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
