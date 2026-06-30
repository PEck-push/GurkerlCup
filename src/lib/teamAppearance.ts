/**
 * Automatische Team-Optik: Farbe + Emoji nach Startnummer, plus Self-Code-Generierung.
 * Server-seitig genutzt (API-Routen). Farben kontraststark auf dunkelgrünem Grund.
 */
import { randomInt } from 'crypto';

export const TEAM_COLORS = [
  '#D4AF37', '#52B788', '#38BDF8', '#FB923C',
  '#EF4444', '#A855F7', '#84CC16', '#F0CE67',
  '#2DD4BF', '#F472B6', '#FBBF24', '#60A5FA',
  '#34D399', '#FB7185', '#C084FC', '#4ADE80',
];

export const TEAM_EMOJIS = [
  '🥒', '🦊', '🐢', '🐝',
  '🦉', '🐙', '🦔', '🦁',
  '🐸', '🦄', '🐧', '🐬',
  '🌶️', '🍋', '🦒', '🐲',
];

/** Deterministische Optik aus der Startnummer (1-basiert). */
export function assignAppearance(startNumber: number): { color: string; emoji: string } {
  const i = Math.max(0, startNumber - 1);
  return {
    color: TEAM_COLORS[i % TEAM_COLORS.length],
    emoji: TEAM_EMOJIS[i % TEAM_EMOJIS.length],
  };
}

// Ohne verwechselbare Zeichen (kein 0/O/1/I/L).
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Kurzer, gut tippbarer Self-Code für /team/[code] (QR). Uniqueness via DB-Retry. */
export function generateSelfCode(length = 6): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return out;
}
