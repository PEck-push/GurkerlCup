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
