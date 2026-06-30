'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { liveStandings } from '@/lib/scoring';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';
import BeamerHeading from './BeamerHeading';
import CharAvatar from './CharAvatar';
import { chunky, nameOutline, COMIC_OUTLINE } from '@/lib/comicStyles';

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

  return (
    <div className="w-full h-full flex flex-col px-[3vw] py-[2.5vh] overflow-hidden">
      <BeamerHeading variant="eyebrow" title="Zwischenstand" className="mb-[2vh]" />
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-[0.8vh] max-w-6xl w-full mx-auto">
        {ordered.map((row, i) => {
          const t = teamById.get(row.teamId);
          if (!t) return null;
          const val = metric(row);
          const pct = Math.max(8, Math.round((val / max) * 100));
          const isLead = i === 0;
          return (
            <motion.div
              key={row.teamId}
              layout
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              className="relative flex-1 min-h-[44px] max-h-[68px] rounded-2xl overflow-hidden flex items-center"
              style={{ boxShadow: `0 0 0 ${isLead ? 4 : 3}px ${isLead ? '#D4AF37' : COMIC_OUTLINE}` }}
            >
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{ background: `linear-gradient(90deg, ${t.color}, ${t.color}66)` }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="relative flex items-center gap-3 px-3 w-full">
                <span className="font-fredoka font-700 w-9 text-center" style={chunky('min(2.6vw, 1.6rem)', '#FDF6E3', 4)}>
                  {i + 1}
                </span>
                <CharAvatar startNumber={t.start_number} color={t.color} size={42} />
                <span className="flex-1 font-fredoka font-700 text-white truncate" style={{ fontSize: 'min(2.8vw, 1.8rem)', ...nameOutline }}>
                  {t.team_name}
                </span>
                <span className="font-fredoka font-700 tabular-nums" style={chunky('min(3.2vw, 2.1rem)', '#FDF6E3', 5)}>
                  {val}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
