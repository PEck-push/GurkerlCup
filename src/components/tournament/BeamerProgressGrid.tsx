'use client';

import { motion } from 'framer-motion';
import { disciplineIdsByPhase } from '@/lib/disciplines';
import type { GcScore, GcTeam } from '@/lib/tournamentTypes';

const STATION_IDS = [...disciplineIdsByPhase('opening'), ...disciplineIdsByPhase('a')];
const TOTAL = STATION_IDS.length;

/** Fortschritt je Team (erledigte Stationen) – OHNE Ranking. Reihenfolge = Startnummer. */
export default function BeamerProgressGrid({
  teams,
  scores,
}: {
  teams: GcTeam[];
  scores: GcScore[];
}) {
  const active = teams.filter((t) => t.checked_in).sort((a, b) => a.start_number - b.start_number);

  const finishedCount = (teamId: string) =>
    STATION_IDS.filter((d) =>
      scores.some((s) => s.team_id === teamId && s.discipline_id === d && s.finished)
    ).length;

  return (
    <div className="w-full h-full flex flex-col p-[3vw]">
      <p className="font-bebas tracking-[0.3em] text-[#52B788] text-3xl mb-[2vh] text-center">
        FORTSCHRITT · PHASE A
      </p>
      <div
        className="grid gap-3 flex-1 content-start"
        style={{ gridTemplateColumns: `repeat(${active.length > 8 ? 3 : 2}, minmax(0, 1fr))` }}
      >
        {active.map((t) => {
          const done = finishedCount(t.id);
          const pct = Math.round((done / TOTAL) * 100);
          return (
            <div
              key={t.id}
              className="rounded-2xl border border-[#1E4028] bg-[#0F1A0D]/80 px-5 py-3 flex items-center gap-4"
            >
              <span
                className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-2xl"
                style={{ background: `${t.color}22`, border: `2px solid ${t.color}` }}
              >
                {t.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-fredoka font-700 text-white text-xl md:text-2xl truncate">
                  {t.team_name}
                </p>
                <div className="mt-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: t.color }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
              <span className="font-bebas text-2xl text-white whitespace-nowrap">
                {done}/{TOTAL}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
