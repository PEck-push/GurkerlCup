/**
 * Charakter-Avatare pro Team: zuerst der Charakter-Pack (/images/teams/),
 * danach die Stations-Charaktere als zusätzliche Auswahl.
 */
export const TEAM_AVATARS = [
  '/images/teams/pirat.webp',
  '/images/teams/wurf.webp',
  '/images/teams/alien.webp',
  '/images/teams/cowboy.webp',
  '/images/teams/god.webp',
  '/images/teams/hippie1.webp',
  '/images/teams/ninja.webp',
  '/images/teams/aperol.webp',
  '/images/teams/astro.webp',
  '/images/teams/baby.webp',
  '/images/teams/bier.webp',
  '/images/teams/kasperl.webp',
  '/images/teams/pensi.webp',
  '/images/teams/sauna.webp',
  '/images/teams/senf.webp',
  '/images/teams/spice.webp',
  '/images/teams/kick1.webp',
  '/images/teams/kick2.webp',
  '/images/teams/pobsch.webp',
  '/images/teams/pobsch2.webp',
  '/images/simon.webp',
  '/images/wasserbomben.webp',
  '/images/cornhole.webp',
  '/images/kazzoomeister.webp',
  '/images/mutter-stapeln.webp',
  '/images/jar.webp',
  '/images/riesen-ringerl.webp',
  '/images/baelle-chaos.webp',
  '/images/schwammstaffel.webp',
];

/** Deterministischer Avatar aus der Startnummer (1-basiert). */
export function avatarFor(startNumber: number | undefined): string {
  const i = Math.max(0, (startNumber ?? 1) - 1);
  return TEAM_AVATARS[i % TEAM_AVATARS.length];
}

/**
 * Ausschnitt je Avatar: Standard ist der enge Gesichts-Crop (Zoom 230 %,
 * Fokus oben). Motive ohne Gesicht (die beiden Po-Charaktere) bekommen
 * weniger Zoom, damit das ganze Motiv im Kreis sichtbar ist.
 */
const DEFAULT_CROP = { size: '230%', position: '50% 14%' };
const AVATAR_CROPS: Record<string, { size: string; position: string }> = {
  '/images/teams/pobsch.webp': { size: '170%', position: '50% 28%' },
  '/images/teams/pobsch2.webp': { size: '170%', position: '50% 28%' },
};

export function avatarCrop(src?: string): { size: string; position: string } {
  return (src && AVATAR_CROPS[src]) || DEFAULT_CROP;
}
