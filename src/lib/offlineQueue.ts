'use client';

/**
 * Outdoor-Absicherung für /score: Eingaben werden bei Verbindungsabbruch lokal
 * gepuffert (localStorage) und automatisch nachgesendet. Pro (Team×Disziplin)
 * wird nur der letzte Stand gehalten (full upsert), damit nichts Veraltetes nachläuft.
 */

export interface ScoreWriteBody {
  team_id: string;
  discipline_id: string;
  raw_value?: number | null;
  finished?: boolean;
  card_double?: boolean;
  card_second?: boolean;
  manual_rank?: number | null;
}

export type SaveResult =
  | { status: 'ok' }
  | { status: 'queued' }
  | { status: 'error'; message: string };

const KEY = 'gc_score_queue';
const keyOf = (b: ScoreWriteBody) => `${b.team_id}|${b.discipline_id}`;

function readQueue(): Record<string, ScoreWriteBody> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function writeQueue(map: Record<string, ScoreWriteBody>) {
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function pendingCount(): number {
  return Object.keys(readQueue()).length;
}

async function postScore(body: ScoreWriteBody): Promise<Response> {
  return fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** Speichert einen Score. Bei Netzfehler → puffern. Server-Validierungsfehler → durchreichen. */
export async function saveScore(body: ScoreWriteBody): Promise<SaveResult> {
  try {
    const res = await postScore(body);
    if (res.ok) return { status: 'ok' };
    // Server hat geantwortet → echte Validierung, nicht puffern.
    const data = await res.json().catch(() => ({}));
    return { status: 'error', message: data.error ?? 'Speichern fehlgeschlagen.' };
  } catch {
    // Netzfehler → puffern und später nachsenden.
    const map = readQueue();
    map[keyOf(body)] = body;
    writeQueue(map);
    return { status: 'queued' };
  }
}

/** Versucht, alle gepufferten Einträge nachzusenden. Gibt verbleibende Anzahl zurück. */
export async function flushQueue(): Promise<number> {
  const map = readQueue();
  const entries = Object.entries(map);
  for (const [k, body] of entries) {
    try {
      const res = await postScore(body);
      if (res.ok || (res.status >= 400 && res.status < 500)) {
        // Erfolg ODER definitive Ablehnung (z.B. ungültige Karte) → aus Queue nehmen.
        delete map[k];
      }
      // 5xx/Netz → drin lassen
    } catch {
      // Netzfehler → abbrechen, Rest bleibt gepuffert.
      break;
    }
  }
  writeQueue(map);
  return Object.keys(map).length;
}
