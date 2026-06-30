import { cookies } from 'next/headers';
import { createHash } from 'crypto';

export const SCORE_COOKIE = 'gc_score';

/** Deterministic session token derived from the score password. */
export function scoreSessionToken(): string {
  const pw = process.env.SCORE_PASSWORD ?? '';
  return createHash('sha256').update(`gurkerl-cup-score::${pw}`).digest('hex');
}

/** True when the request carries a valid score (coordinator) session cookie. */
export async function isScoreAuthed(): Promise<boolean> {
  const pw = process.env.SCORE_PASSWORD;
  if (!pw) return false;
  const store = await cookies();
  const token = store.get(SCORE_COOKIE)?.value;
  return !!token && token === scoreSessionToken();
}
