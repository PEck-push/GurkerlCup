'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { spritzerRanking } from '@/lib/scoring';
import type { GcScore, GcTeam } from '@/lib/tournamentTypes';

const rankColor = (r: number) =>
  r === 1 ? '#D4AF37' : r === 2 ? '#C8CBD0' : r === 3 ? '#CD7F32' : '#52B788';

/** Overlay-Szene für die Spritzerwertung (Spaß-Sonderpreis). */
export default function SpritzerReveal({ teams, scores }: { teams: GcTeam[]; scores: GcScore[] }) {
  const active = useMemo(() => teams.filter((t) => t.checked_in), [teams]);
  const teamById = useMemo(() => new Map(active.map((t) => [t.id, t])), [active]);
  const ranked = useMemo(
    () => spritzerRanking(active, scores).filter((r) => r.rank != null).sort((a, b) => a.rank! - b.rank!),
    [active, scores]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0A1A0C]/95 backdrop-blur-sm px-[4vw]"
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center mb-[3vh]">
        <div style={{ fontSize: 'min(8vw, 5rem)' }}>🍷</div>
        <h1 className="font-fredoka font-700 text-white" style={{ fontSize: 'min(6vw, 4rem)' }}>
          Spritzerwertung
        </h1>
        <p className="font-nunito text-white/50 text-xl">Der inoffizielle Sonderpreis</p>
      </motion.div>

      <div className="w-full max-w-3xl flex flex-col gap-[1vh]">
        {ranked.length === 0 && (
          <p className="text-center font-nunito text-white/40 text-2xl">Noch keine Wertung.</p>
        )}
        {ranked.slice(0, 5).map((row, i) => {
          const t = teamById.get(row.teamId);
          if (!t) return null;
          const col = rankColor(row.rank!);
          return (
            <motion.div
              key={row.teamId}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-4 rounded-xl px-5 py-[1.4vh]"
              style={{ background: `${col}14`, border: `1px solid ${col}55` }}
            >
              <span className="font-bebas w-[44px] text-center" style={{ fontSize: 'min(3.5vw, 2.4rem)', color: col }}>
                {row.rank}
              </span>
              <span style={{ fontSize: 'min(3vw, 2rem)' }}>{t.emoji}</span>
              <span className="flex-1 font-fredoka font-700 text-white truncate" style={{ fontSize: 'min(3.4vw, 2.2rem)' }}>
                {t.team_name}
              </span>
              <span className="font-bebas tabular-nums" style={{ fontSize: 'min(3.2vw, 2.1rem)', color: col }}>
                {row.rawValue}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
