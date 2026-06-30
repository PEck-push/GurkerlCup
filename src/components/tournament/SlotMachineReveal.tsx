'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { phaseAStandings } from '@/lib/scoring';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';
import { playDrumroll, playDing, playFanfare } from '@/lib/sounds';
import SlotName from './SlotName';

const rankColor = (r: number) =>
  r === 1 ? '#D4AF37' : r === 2 ? '#C8CBD0' : r === 3 ? '#CD7F32' : '#52B788';

export default function SlotMachineReveal({
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
    () => phaseAStandings(active, scores, config.points_table),
    [active, scores, config.points_table]
  );
  const rows = standings.rows; // sortiert nach finalRank
  const teamCount = rows.length;
  const step = Math.min(config.reveal_step, teamCount);

  // Trommelwirbel bei jedem Reveal-Schritt
  useEffect(() => {
    if (step > 0) playDrumroll(1100);
  }, [step]);

  const isRevealed = (rank: number) => rank > teamCount - step;

  return (
    <div className="w-full h-full flex flex-col items-center px-[3vw] py-[3vh]">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-fredoka font-700 text-white text-center mb-[2vh]"
        style={{ fontSize: 'min(5vw, 3.2rem)' }}
      >
        Zwischenstand nach{' '}
        <span className="text-gold-gradient font-pacifico font-400">Phase A</span>
      </motion.h1>

      <div className="flex-1 w-full max-w-5xl flex flex-col justify-center gap-[0.9vh]">
        {rows.map((row) => {
          const t = teamById.get(row.teamId);
          if (!t) return null;
          const revealed = isRevealed(row.finalRank);
          const col = rankColor(row.finalRank);
          return (
            <div
              key={row.teamId}
              className="flex items-center gap-4 rounded-xl px-4 py-[1vh]"
              style={{
                background: revealed ? `${col}14` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${revealed ? `${col}55` : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {/* Rang */}
              <span
                className="font-bebas flex-shrink-0 w-[3.5vw] min-w-[44px] text-center"
                style={{ fontSize: 'min(3.5vw, 2.4rem)', color: col }}
              >
                {row.finalRank}
              </span>

              {/* Name */}
              <span
                className="flex-1 font-fredoka font-700 text-white truncate"
                style={{ fontSize: 'min(3.4vw, 2.2rem)' }}
              >
                {revealed ? (
                  <span className="inline-flex items-center gap-3">
                    <span style={{ fontSize: 'min(3vw, 2rem)' }}>{t.emoji}</span>
                    <SlotName
                      text={t.team_name.toUpperCase()}
                      onComplete={row.finalRank === 1 ? playFanfare : playDing}
                    />
                  </span>
                ) : (
                  <motion.span
                    animate={{ opacity: [0.25, 0.6, 0.25] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="inline-block rounded-md bg-white/15"
                    style={{ width: '40%', height: '1em' }}
                  />
                )}
              </span>

              {/* Punkte (immer sichtbar) */}
              <span
                className="font-bebas flex-shrink-0 tabular-nums"
                style={{ fontSize: 'min(3.4vw, 2.3rem)', color: revealed ? col : '#ffffff' }}
              >
                {row.total}
              </span>
            </div>
          );
        })}
      </div>

      {step === 0 && (
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-bebas tracking-[0.3em] text-[#52B788] text-2xl mt-[2vh]"
        >
          BEREIT FÜR DIE ENTHÜLLUNG …
        </motion.p>
      )}
    </div>
  );
}
