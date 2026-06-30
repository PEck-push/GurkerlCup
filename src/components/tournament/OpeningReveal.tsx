'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { rankDisciplines } from '@/lib/scoring';
import { getDiscipline } from '@/lib/disciplines';
import { formatSeconds } from '@/lib/timeFormat';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';

const OPENING_ID = 'mutter-stapeln';
const rankColor = (r: number) =>
  r === 1 ? '#D4AF37' : r === 2 ? '#C8CBD0' : r === 3 ? '#CD7F32' : '#52B788';

export default function OpeningReveal({
  teams,
  scores,
  config,
}: {
  teams: GcTeam[];
  scores: GcScore[];
  config: GcConfig;
}) {
  const active = useMemo(() => teams.filter((t) => t.checked_in), [teams]);
  const teamById = useMemo(() => new Map(active.map((t) => [t.id, t])), [active]);
  const disc = getDiscipline(OPENING_ID);

  const ranked = useMemo(() => {
    const r = rankDisciplines(active, scores, config.points_table, [OPENING_ID])[OPENING_ID] ?? [];
    return r.filter((x) => x.rank != null).sort((a, b) => (a.rank! - b.rank!));
  }, [active, scores, config.points_table]);

  return (
    <div className="w-full h-full flex flex-col items-center px-[3vw] py-[4vh]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-[3vh]"
      >
        <p className="font-bebas tracking-[0.3em] text-[#D4AF37] text-2xl">ERÖFFNUNG · {disc?.emoji}</p>
        <h1 className="font-fredoka font-700 text-white" style={{ fontSize: 'min(6vw, 4rem)' }}>
          {disc?.name}
        </h1>
      </motion.div>

      <div className="flex-1 w-full max-w-4xl flex flex-col justify-center gap-[1vh]">
        {ranked.length === 0 && (
          <p className="text-center font-nunito text-white/40 text-2xl">Noch keine Ergebnisse.</p>
        )}
        {ranked.map((row, i) => {
          const t = teamById.get(row.teamId);
          if (!t) return null;
          const col = rankColor(row.rank!);
          return (
            <motion.div
              key={row.teamId}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 rounded-xl px-5 py-[1.2vh]"
              style={{ background: `${col}14`, border: `1px solid ${col}55` }}
            >
              <span className="font-bebas w-[44px] text-center" style={{ fontSize: 'min(3.5vw, 2.4rem)', color: col }}>
                {row.rank}
              </span>
              <span style={{ fontSize: 'min(3vw, 2rem)' }}>{t.emoji}</span>
              <span
                className="flex-1 font-fredoka font-700 text-white truncate"
                style={{ fontSize: 'min(3.4vw, 2.2rem)' }}
              >
                {t.team_name}
              </span>
              <span className="font-bebas text-white/70 tabular-nums" style={{ fontSize: 'min(2.6vw, 1.6rem)' }}>
                {formatSeconds(row.rawValue)}
              </span>
              <span className="font-bebas tabular-nums" style={{ fontSize: 'min(3.2vw, 2.1rem)', color: col }}>
                +{row.points}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
