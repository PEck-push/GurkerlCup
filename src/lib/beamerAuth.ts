import { cookies } from 'next/headers';
import { createHash } from 'crypto';

export const BEAMER_COOKIE = 'gc_beamer';

/** Deterministic session token derived from the beamer password. */
export function beamerSessionToken(): string {
  const pw = process.env.BEAMER_PASSWORD ?? '';
  return createHash('sha256').update(`gurkerl-cup-beamer::${pw}`).digest('hex');
}

/** True when the request carries a valid beamer session cookie. */
export async function isBeamerAuthed(): Promise<boolean> {
  const pw = process.env.BEAMER_PASSWORD;
  if (!pw) return false;
  const store = await cookies();
  const token = store.get(BEAMER_COOKIE)?.value;
  return !!token && token === beamerSessionToken();
}
