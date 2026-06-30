import { NextResponse } from 'next/server';
import { isScoreAuthed } from '@/lib/scoreAuth';
import { isAuthed } from '@/lib/adminAuth';

export const runtime = 'nodejs';

/** Auth-Check für /score (Koordinatoren ODER Admin). */
export async function GET() {
  if (!((await isScoreAuthed()) || (await isAuthed()))) {
    return NextResponse.json({ authed: false }, { status: 401 });
  }
  return NextResponse.json({ authed: true });
}
