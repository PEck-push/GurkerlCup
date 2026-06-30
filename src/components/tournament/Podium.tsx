'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { liveStandings } from '@/lib/scoring';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';
import { playFanfare } from '@/lib/sounds';

const PODIUM = [
  { rank: 2, h: '34vh', color: '#C8CBD0', medal: '🥈', delay: 0.8 },
  { rank: 1, h: '46vh', color: '#D4AF37', medal: '🥇', delay: 1.8 },
  { rank: 3, h: '26vh', color: '#CD7F32', medal: '🥉', delay: 0.3 },
];

export default function Podium({
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

  const byRank = (r: number) => standings.rows.filter((x) => x.finalRank === r);
  const goldTie = standings.goldTie;

  useEffect(() => {
    if (goldTie) return;
    const t = setTimeout(() => {
      playFanfare();
      const end = Date.now() + 2500;
      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#D4AF37', '#F0CE67', '#52B788'] });
        confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#D4AF37', '#F0CE67', '#52B788'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }, 2000);
    return () => clearTimeout(t);
  }, [goldTie]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-end pb-[6vh] px-[3vw]">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-[6vh] font-fredoka font-700 text-center text-white"
        style={{ fontSize: 'min(6vw, 4rem)' }}
      >
        {goldTie ? '⚔️ Stechen!' : 'Goldene Gurke 🥒'}
      </motion.h1>

      <div className="flex items-end justify-center gap-[2vw] w-full max-w-5xl">
        {PODIUM.map((p) => {
          const winners = byRank(p.rank);
          const t = winners[0] ? teamById.get(winners[0].teamId) : null;
          const tieHere = p.rank === 1 && goldTie;
          return (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: p.delay, type: 'spring', stiffness: 120, damping: 16 }}
              className="flex flex-col items-center"
              style={{ width: '28%' }}
            >
              {/* Team-Kopf */}
              <div className="text-center mb-3">
                <div style={{ fontSize: 'min(7vw, 5rem)' }}>{tieHere ? '⚔️' : t?.emoji ?? '—'}</div>
                <p className="font-fredoka font-700 text-white" style={{ fontSize: 'min(2.6vw, 1.8rem)' }}>
                  {tieHere
                    ? winners.map((w) => teamById.get(w.teamId)?.team_name).filter(Boolean).join(' & ')
                    : t?.team_name ?? '—'}
                </p>
                {!tieHere && t && (
                  <p className="font-bebas tabular-nums" style={{ color: p.color, fontSize: 'min(2.4vw, 1.6rem)' }}>
                    {winners[0]?.total} Punkte
                  </p>
                )}
                {tieHere && (
                  <p className="font-nunito text-white/60 text-sm">Live-Stechen entscheidet</p>
                )}
              </div>
              {/* Sockel */}
              <div
                className="w-full rounded-t-2xl flex items-start justify-center pt-3"
                style={{
                  height: p.h,
                  background: `linear-gradient(180deg, ${p.color}cc, ${p.color}44)`,
                  boxShadow: `0 0 60px ${p.color}55`,
                }}
              >
                <span style={{ fontSize: 'min(5vw, 3.5rem)' }}>{p.medal}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
