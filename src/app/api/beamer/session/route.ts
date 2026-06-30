import { NextResponse } from 'next/server';
import { isBeamerAuthed } from '@/lib/beamerAuth';
import { isAuthed } from '@/lib/adminAuth';

export const runtime = 'nodejs';

/** Auth-Check für /beamer (Beamer-Passwort ODER Admin). */
export async function GET() {
  if (!((await isBeamerAuthed()) || (await isAuthed()))) {
    return NextResponse.json({ authed: false }, { status: 401 });
  }
  return NextResponse.json({ authed: true });
}
