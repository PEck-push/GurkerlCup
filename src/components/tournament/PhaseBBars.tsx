'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { liveStandings } from '@/lib/scoring';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';

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
    <div className="w-full h-full flex flex-col px-[3vw] py-[3vh]">
      <div className="text-center mb-[2vh]">
        <p className="font-bebas tracking-[0.3em] text-[#FB923C] text-2xl">PHASE B · LIVE</p>
        <h1 className="font-fredoka font-700 text-white" style={{ fontSize: 'min(5vw, 3.4rem)' }}>
          {finaleView ? 'Finale-Wertung' : 'Gesamtwertung'}
        </h1>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-[1vh] max-w-6xl w-full mx-auto">
        {ordered.map((row, i) => {
          const t = teamById.get(row.teamId);
          if (!t) return null;
          const val = metric(row);
          const pct = Math.max(6, Math.round((val / max) * 100));
          return (
            <motion.div
              key={row.teamId}
              layout
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              className="relative h-[7vh] min-h-[48px] rounded-xl overflow-hidden bg-white/[0.04] border border-white/10 flex items-center"
            >
              {/* Balken */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-xl"
                style={{ background: `linear-gradient(90deg, ${t.color}cc, ${t.color}77)` }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Inhalt */}
              <div className="relative flex items-center gap-3 px-4 w-full">
                <span className="font-bebas text-white/90 w-8 text-center" style={{ fontSize: 'min(2.6vw, 1.6rem)' }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 'min(3vw, 2rem)' }}>{t.emoji}</span>
                <span
                  className="flex-1 font-fredoka font-700 text-white truncate drop-shadow"
                  style={{ fontSize: 'min(3vw, 2rem)' }}
                >
                  {t.team_name}
                </span>
                <span
                  className="font-bebas text-white tabular-nums drop-shadow"
                  style={{ fontSize: 'min(3.4vw, 2.3rem)' }}
                >
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
