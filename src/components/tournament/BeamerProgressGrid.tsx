'use client';

import { motion } from 'framer-motion';
import { disciplineIdsByPhase } from '@/lib/disciplines';
import type { GcScore, GcTeam } from '@/lib/tournamentTypes';
import BeamerHeading from './BeamerHeading';
import CharAvatar from './CharAvatar';
import { chunky, nameOutline, COMIC_OUTLINE } from '@/lib/comicStyles';

// Fortschritt zählt NUR die Phase-A-Stationen (die Eröffnung läuft einmalig zu Beginn
// und ist keine Station, die die Teams abarbeiten) → Anzeige X/7.
const STATION_IDS = disciplineIdsByPhase('a');
const TOTAL = STATION_IDS.length;

/** Fortschritt je Team (erledigte Stationen) – Cartoon-Look, OHNE Ranking. Skaliert bis ~30 Teams. */
export default function BeamerProgressGrid({
  teams,
  scores,
  skipMode = false,
  skipKeep = 6,
}: {
  teams: GcTeam[];
  scores: GcScore[];
  skipMode?: boolean;
  skipKeep?: number;
}) {
  const active = teams.filter((t) => t.checked_in).sort((a, b) => a.start_number - b.start_number);
  // Ziel = alle Phase-A-Stationen (7/7), in Modus B nur K Pflicht-Stationen (z. B. 6).
  const target = skipMode ? Math.min(TOTAL, skipKeep) : TOTAL;
  const finishedCount = (teamId: string) =>
    STATION_IDS.filter((d) => scores.some((s) => s.team_id === teamId && s.discipline_id === d && s.finished)).length;

  // Spalten & Kompaktheit nach Teamzahl (bis 30): 2 → 3 → 4 Spalten.
  const n = active.length;
  const cols = n <= 8 ? 2 : n <= 18 ? 3 : 4;
  const compact = n > 18;
  const avatar = compact ? 34 : 44;
  const nameFs = compact ? 'min(1.5vw,1rem)' : 'min(2vw,1.4rem)';
  const countFs = compact ? 'min(1.7vw,1.15rem)' : 'min(2.2vw,1.5rem)';

  return (
    <div className="w-full h-full flex flex-col px-[4vw] pt-[3vh] pb-[5vh] overflow-hidden">
      <BeamerHeading variant="eyebrow" title="Fortschritt" className="flex-none mb-[2vh]" />
      <div
        className={`grid ${compact ? 'gap-2' : 'gap-3'} flex-1 min-h-0 auto-rows-fr`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {active.map((t) => {
          const done = Math.min(finishedCount(t.id), target);
          const pct = Math.round((done / target) * 100);
          return (
            <div
              key={t.id}
              className={`rounded-2xl ${compact ? 'px-3 py-1.5' : 'px-4 py-2'} flex items-center ${compact ? 'gap-2' : 'gap-3'}`}
              style={{ background: `linear-gradient(90deg, ${t.color}26, rgba(255,255,255,0.03) 85%)`, boxShadow: `0 0 0 3px ${COMIC_OUTLINE}` }}
            >
              <CharAvatar startNumber={t.start_number} img={t.avatar ?? undefined} color={t.color} size={avatar} />
              <div className="flex-1 min-w-0">
                <p className="font-fredoka font-700 text-white truncate" style={{ fontSize: nameFs, ...nameOutline }}>
                  {t.team_name}
                </p>
                <div className={`mt-1 ${compact ? 'h-2' : 'h-3'} rounded-full overflow-hidden`} style={{ background: 'rgba(0,0,0,0.35)', boxShadow: `inset 0 0 0 2px ${COMIC_OUTLINE}` }}>
                  <motion.div className="h-full rounded-full" style={{ background: t.color }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
                </div>
              </div>
              <span className="font-fredoka font-700 whitespace-nowrap" style={chunky(countFs, '#F0CE67', compact ? 3 : 4)}>
                {done}/{target}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
