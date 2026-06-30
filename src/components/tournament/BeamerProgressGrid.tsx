'use client';

import { motion } from 'framer-motion';
import { disciplineIdsByPhase } from '@/lib/disciplines';
import type { GcScore, GcTeam } from '@/lib/tournamentTypes';
import BeamerHeading from './BeamerHeading';
import CharAvatar from './CharAvatar';
import { chunky, nameOutline, COMIC_OUTLINE } from '@/lib/comicStyles';

const STATION_IDS = [...disciplineIdsByPhase('opening'), ...disciplineIdsByPhase('a')];
const TOTAL = STATION_IDS.length;

/** Fortschritt je Team (erledigte Stationen) – Cartoon-Look, OHNE Ranking. */
export default function BeamerProgressGrid({ teams, scores }: { teams: GcTeam[]; scores: GcScore[] }) {
  const active = teams.filter((t) => t.checked_in).sort((a, b) => a.start_number - b.start_number);
  const finishedCount = (teamId: string) =>
    STATION_IDS.filter((d) => scores.some((s) => s.team_id === teamId && s.discipline_id === d && s.finished)).length;

  return (
    <div className="w-full h-full flex flex-col px-[4vw] pt-[3vh] pb-[5vh] overflow-hidden">
      <BeamerHeading variant="eyebrow" title="Fortschritt" className="flex-none mb-[2vh]" />
      <div
        className="grid gap-3 flex-1 min-h-0 auto-rows-fr"
        style={{ gridTemplateColumns: `repeat(${active.length > 8 ? 3 : 2}, minmax(0, 1fr))` }}
      >
        {active.map((t) => {
          const done = finishedCount(t.id);
          const pct = Math.round((done / TOTAL) * 100);
          return (
            <div
              key={t.id}
              className="rounded-2xl px-4 py-2 flex items-center gap-3"
              style={{ background: `linear-gradient(90deg, ${t.color}26, rgba(255,255,255,0.03) 85%)`, boxShadow: `0 0 0 3px ${COMIC_OUTLINE}` }}
            >
              <CharAvatar startNumber={t.start_number} color={t.color} size={44} />
              <div className="flex-1 min-w-0">
                <p className="font-fredoka font-700 text-white truncate" style={{ fontSize: 'min(2vw,1.4rem)', ...nameOutline }}>
                  {t.team_name}
                </p>
                <div className="mt-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.35)', boxShadow: `inset 0 0 0 2px ${COMIC_OUTLINE}` }}>
                  <motion.div className="h-full rounded-full" style={{ background: t.color }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
                </div>
              </div>
              <span className="font-fredoka font-700 whitespace-nowrap" style={chunky('min(2.2vw,1.5rem)', '#F0CE67', 4)}>
                {done}/{TOTAL}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
