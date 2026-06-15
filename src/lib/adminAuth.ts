import { cookies } from 'next/headers';
import { createHash } from 'crypto';

export const ADMIN_COOKIE = 'gc_admin';

/** Deterministic session token derived from the admin password. */
export function sessionToken(): string {
  const pw = process.env.ADMIN_PASSWORD ?? '';
  return createHash('sha256').update(`gurkerl-cup::${pw}`).digest('hex');
}

/** True when the request carries a valid admin session cookie. */
export async function isAuthed(): Promise<boolean> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return !!token && token === sessionToken();
}
