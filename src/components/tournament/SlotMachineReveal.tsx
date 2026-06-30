'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { phaseAStandings } from '@/lib/scoring';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';
import { playDrumroll, playFanfare } from '@/lib/sounds';
import SlotName from './SlotName';
import TeamAvatar from './TeamAvatar';
import BeamerHeading from './BeamerHeading';
import LeaderboardView, { type LbEntry } from './LeaderboardView';

const ROW_H = 76;
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
  const done = step >= teamCount && teamCount > 0;

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewH, setViewH] = useState(600);

  useEffect(() => {
    const measure = () => setViewH(viewportRef.current?.clientHeight ?? 600);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (step > 0 && !done) playDrumroll(1600);
    if (done) playFanfare();
  }, [step, done]);

  // ── Finale: gestuftes Podium-Leaderboard ──
  if (done) {
    const entries: LbEntry[] = rows.map((r) => ({
      team: teamById.get(r.teamId)!,
      rank: r.finalRank,
      value: String(r.total),
    }));
    return <LeaderboardView entries={entries} unit="Pkt" variant="eyebrow" title="Zwischenstand" />;
  }

  // ── Reveal-Lauf: von unten nach oben, mitscrollend ──
  const focusIndex = teamCount - Math.max(step, 1); // 0-basiert von oben
  const translateY = viewH / 2 - (focusIndex + 0.5) * ROW_H;
  const isRevealed = (rank: number) => rank > teamCount - step;

  return (
    <div className="w-full h-full flex flex-col items-center px-[3vw] py-[2.5vh]">
      <BeamerHeading variant="eyebrow" title="Zwischenstand" className="mb-[1.5vh]" />

      <div ref={viewportRef} className="relative flex-1 min-h-0 w-full max-w-3xl overflow-hidden">
        <motion.div animate={{ y: translateY }} transition={{ type: 'spring', stiffness: 90, damping: 20 }}>
          {rows.map((row) => {
            const t = teamById.get(row.teamId);
            if (!t) return null;
            const revealed = isRevealed(row.finalRank);
            const col = rankColor(row.finalRank);
            return (
              <div key={row.teamId} style={{ height: ROW_H }} className="flex items-center px-3">
                <div
                  className="flex items-center gap-4 w-full rounded-2xl px-4 py-2 transition-all"
                  style={{
                    background: revealed ? `linear-gradient(90deg, ${col}2e, transparent 85%)` : 'transparent',
                    border: `1px solid ${revealed ? `${col}66` : 'transparent'}`,
                    boxShadow: revealed ? `0 0 24px ${col}33` : 'none',
                    opacity: revealed ? 1 : 0.5,
                  }}
                >
                  <span
                    className="font-bebas w-[3.5vw] min-w-[52px] text-center"
                    style={{ fontSize: 'min(3.8vw, 2.6rem)', WebkitTextStroke: '2px rgba(6,15,9,0.75)', color: col, textShadow: `0 0 16px ${col}88` }}
                  >
                    {row.finalRank}
                  </span>
                  {revealed ? (
                    <TeamAvatar color={t.color} emoji={t.emoji} size={54} />
                  ) : (
                    <span className="w-[54px] h-[54px] rounded-full bg-white/10 flex-shrink-0" />
                  )}
                  <span className="flex-1 font-fredoka font-700 text-white truncate" style={{ fontSize: 'min(3.4vw, 2.1rem)' }}>
                    {revealed ? (
                      <SlotName text={t.team_name.toUpperCase()} perChar={170} />
                    ) : (
                      <motion.span
                        animate={{ opacity: [0.25, 0.55, 0.25] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="inline-block rounded-md bg-white/15"
                        style={{ width: '45%', height: '1em' }}
                      />
                    )}
                  </span>
                  <span
                    className="font-bebas tabular-nums"
                    style={{ fontSize: 'min(3.6vw, 2.4rem)', WebkitTextStroke: revealed ? '2px rgba(6,15,9,0.7)' : '0', color: revealed ? '#F0CE67' : '#fff', textShadow: revealed ? '0 0 16px rgba(240,206,103,0.5)' : 'none' }}
                  >
                    {row.total}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex-none font-bebas tracking-[0.3em] text-[#52B788] mt-[1.5vh]"
        style={{ fontSize: 'min(2.2vw, 1.3rem)' }}
      >
        {step === 0 ? 'BEREIT FÜR DIE ENTHÜLLUNG …' : `PLATZ ${teamCount - step + 1} VON ${teamCount}`}
      </motion.p>
    </div>
  );
}
