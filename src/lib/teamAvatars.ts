/**
 * Charakter-Avatare pro Team. Aktuell als Platzhalter die vorhandenen Gurkerl-Charaktere.
 * Sobald der Charakter-Pack da ist: Dateien nach /public/images/teams/ legen und diese
 * Liste auf z.B. '/images/teams/team-01.webp' umstellen – sonst ändert sich nichts.
 */
export const TEAM_AVATARS = [
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
