/**
 * Zeit-Hilfen für Zeitwertungen (Eröffnung, Gurkerl Biathlon).
 * Intern wird in Sekunden (numeric, mit Hundertstel) gespeichert.
 */

/** "m:ss", "m:ss.cs", "ss" oder "ss.cs" → Sekunden (Zahl) oder null bei ungültig. */
export function parseTimeToSeconds(input: string): number | null {
  const s = input.trim().replace(',', '.');
  if (!s) return null;

  if (s.includes(':')) {
    const parts = s.split(':');
    if (parts.length !== 2) return null;
    const min = Number(parts[0]);
    const sec = Number(parts[1]);
    if (!Number.isFinite(min) || !Number.isFinite(sec) || sec < 0 || sec >= 60) return null;
    return Math.round((min * 60 + sec) * 100) / 100;
  }

  const sec = Number(s);
  if (!Number.isFinite(sec) || sec < 0) return null;
  return Math.round(sec * 100) / 100;
}

/** Sekunden → "m:ss" bzw. "m:ss.cs" (Hundertstel nur wenn vorhanden). */
export function formatSeconds(total: number | null | undefined): string {
  if (total == null || !Number.isFinite(total)) return '–';
  const min = Math.floor(total / 60);
  const rest = total - min * 60;
  const whole = Math.floor(rest);
  const cs = Math.round((rest - whole) * 100);
  const base = `${min}:${String(whole).padStart(2, '0')}`;
  return cs > 0 ? `${base}.${String(cs).padStart(2, '0')}` : base;
}
