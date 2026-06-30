'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { phaseAStandings } from '@/lib/scoring';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';
import { playDrumroll, playFanfare } from '@/lib/sounds';
import SlotName from './SlotName';
import CharAvatar from './CharAvatar';
import BeamerHeading from './BeamerHeading';
import LeaderboardView, { type LbEntry } from './LeaderboardView';
import { chunky, nameOutline, COMIC_OUTLINE, COMIC_CREAM } from '@/lib/comicStyles';

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
                    background: revealed ? `linear-gradient(90deg, ${col}3a, rgba(255,255,255,0.03) 80%)` : 'transparent',
                    boxShadow: revealed ? `0 0 0 3px ${COMIC_OUTLINE}` : 'none',
                    opacity: revealed ? 1 : 0.45,
                  }}
                >
                  <span className="font-fredoka font-700 w-[3.5vw] min-w-[56px] text-center" style={chunky('min(3.8vw, 2.6rem)', col, 5)}>
                    {row.finalRank}
                  </span>
                  {revealed ? (
                    <CharAvatar startNumber={t.start_number} color={t.color} size={56} />
                  ) : (
                    <span className="w-[56px] h-[56px] rounded-full bg-white/10 flex-shrink-0" style={{ boxShadow: `0 0 0 4px ${COMIC_CREAM}33` }} />
                  )}
                  <span className="flex-1 font-fredoka font-700 text-white truncate" style={{ fontSize: 'min(3.4vw, 2.1rem)', ...(revealed ? nameOutline : {}) }}>
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
                  <span className="font-fredoka font-700" style={revealed ? chunky('min(3.6vw, 2.4rem)', '#F0CE67', 5) : { fontSize: 'min(3.6vw, 2.4rem)', color: '#fff' }}>
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
