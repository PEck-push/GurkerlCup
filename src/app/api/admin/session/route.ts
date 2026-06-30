import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';

export const runtime = 'nodejs';

/** Leichtgewichtiger Auth-Check für den Admin-Client (Tab-Gate). */
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ authed: false }, { status: 401 });
  }
  return NextResponse.json({ authed: true });
}
