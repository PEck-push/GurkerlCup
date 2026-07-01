'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { liveStandings } from '@/lib/scoring';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';
import BeamerHeading from './BeamerHeading';
import CharAvatar from './CharAvatar';
import { chunky, nameOutline, COMIC_OUTLINE, COMIC_CREAM } from '@/lib/comicStyles';

export default function PhaseBBars({
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
  const standings = useMemo(
    () => liveStandings(active, scores, config.points_table),
    [active, scores, config.points_table]
  );

  const finaleView = config.beamer_view === 'finale';
  const metric = (row: (typeof standings.rows)[number]) =>
    finaleView
      ? (row.perDiscipline['riesen-ringerl'] ?? 0) + (row.perDiscipline['baelle-chaos'] ?? 0)
      : row.total;

  const ordered = [...standings.rows].sort((a, b) => metric(b) - metric(a));
  const max = Math.max(1, ...ordered.map(metric));
  const top5 = ordered.slice(0, 5);
  const rest = ordered.slice(5);

  return (
    <div className="w-full h-full flex flex-col px-[4vw] pt-[3vh] pb-[5vh] overflow-hidden">
      <BeamerHeading variant="eyebrow" title={finaleView ? 'Finale' : 'Zwischenstand'} className="flex-none mb-[2vh]" />

      <div className="flex-1 min-h-0 flex gap-[2.5vw]">
        {/* LINKS: Top 5 Highlight */}
        <div className="flex flex-col gap-[1.4vh] min-h-0" style={{ width: '54%' }}>
          {top5.map((row, i) => {
            const t = teamById.get(row.teamId);
            if (!t) return null;
            const val = metric(row);
            const pct = Math.max(10, Math.round((val / max) * 100));
            const lead = i === 0;
            return (
              <motion.div
                key={row.teamId}
                layout
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                className="relative flex-1 min-h-0 rounded-2xl overflow-hidden flex items-center"
                style={{ boxShadow: `0 0 0 ${lead ? 5 : 3}px ${lead ? '#D4AF37' : COMIC_OUTLINE}${lead ? ', 0 0 40px rgba(212,175,55,0.4)' : ''}` }}
              >
                <motion.div className="absolute inset-y-0 left-0" style={{ background: `linear-gradient(90deg, ${t.color}, ${t.color}55)` }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />
                <div className="relative flex items-center gap-3 px-4 w-full">
                  <span className="font-fredoka font-700 w-10 text-center" style={chunky('min(3vw,2rem)', COMIC_CREAM, 5)}>{i + 1}</span>
                  <CharAvatar startNumber={t.start_number} img={t.avatar ?? undefined} color={t.color} size={54} />
                  <span className="flex-1 font-fredoka font-700 text-white truncate" style={{ fontSize: 'min(3vw,2rem)', ...nameOutline }}>{t.team_name}</span>
                  <span className="font-fredoka font-700 tabular-nums" style={chunky('min(3.6vw,2.4rem)', COMIC_CREAM, 5)}>{val}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* RECHTS: Rest eingepasst */}
        <div className="flex-1 min-h-0 flex flex-col gap-[1vh]">
          {rest.map((row, i) => {
            const t = teamById.get(row.teamId);
            if (!t) return null;
            const val = metric(row);
            return (
              <motion.div
                key={row.teamId}
                layout
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                className="flex-1 min-h-0 max-h-[68px] flex items-center gap-3 rounded-2xl pr-4"
                style={{ background: `linear-gradient(90deg, ${t.color}2e, rgba(255,255,255,0.03) 80%)`, boxShadow: `0 0 0 3px ${COMIC_OUTLINE}` }}
              >
                <span className="font-fredoka font-700 w-9 text-center flex-shrink-0" style={chunky('min(2.4vw,1.5rem)', COMIC_CREAM, 4)}>{i + 6}</span>
                <CharAvatar startNumber={t.start_number} img={t.avatar ?? undefined} color={t.color} size={38} />
                <span className="flex-1 font-fredoka font-700 text-white truncate" style={{ fontSize: 'min(2.4vw,1.5rem)', ...nameOutline }}>{t.team_name}</span>
                <span className="font-fredoka font-700 tabular-nums" style={chunky('min(2.6vw,1.7rem)', '#F0CE67', 4)}>{val}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
