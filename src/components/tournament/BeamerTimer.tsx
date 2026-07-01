'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getDiscipline } from '@/lib/disciplines';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';
import BeamerHeading from './BeamerHeading';
import CharAvatar from './CharAvatar';
import { chunky, nameOutline, COMIC_OUTLINE, COMIC_CREAM } from '@/lib/comicStyles';

function fmtBig(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  if (sec < 60) return sec.toFixed(1);
  const m = Math.floor(sec / 60);
  const r = sec - m * 60;
  return `${m}:${r.toFixed(1).padStart(4, '0')}`;
}

const MEDAL = ['🥇', '🥈', '🥉'];

/** Beamer-Szene für den Auftakt-Timer: eine große, gemeinsame Uhr + Live-Zieleinläufe. */
export default function BeamerTimer({
  teams,
  scores,
  config,
}: {
  teams: GcTeam[];
  scores: GcScore[];
  config: GcConfig;
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 70);
    return () => clearInterval(id);
  }, []);

  const disciplineId = config.timer_discipline_id;
  const disc = disciplineId ? getDiscipline(disciplineId) : undefined;
  const startMs = config.timer_start_at ? new Date(config.timer_start_at).getTime() : null;
  const state = config.timer_state;

  const active = useMemo(() => teams.filter((t) => t.checked_in), [teams]);
  const finishers = useMemo(() => {
    const rows = scores
      .filter((s) => s.discipline_id === disciplineId && s.finished && s.raw_value != null)
      .map((s) => ({ team: active.find((t) => t.id === s.team_id), sec: Number(s.raw_value) }))
      .filter((r) => r.team) as { team: GcTeam; sec: number }[];
    return rows.sort((a, b) => a.sec - b.sec);
  }, [scores, disciplineId, active]);

  if (now === null) return null;

  const preStart = state === 'running' && startMs !== null && now < startMs;
  const secsToGo = preStart ? Math.ceil((startMs! - now) / 1000) : 0;
  const elapsed = state === 'running' && startMs !== null ? (now - startMs) / 1000 : 0;

  return (
    <div className="w-full h-full flex flex-col px-[4vw] pt-[3vh] pb-[4vh] overflow-hidden">
      <BeamerHeading variant="gold" title={disc?.name ?? 'Auftakt'} className="flex-none" />

      <div className="flex-1 min-h-0 flex gap-[3vw] items-stretch">
        {/* LINKS: große Uhr */}
        <div className="flex flex-col items-center justify-center gap-[2.5vh]" style={{ width: '54%' }}>
          <motion.div
            initial={{ rotate: -3, scale: 0.9 }}
            animate={{ rotate: -2, scale: 1 }}
            className="px-8 py-2 rounded-2xl"
            style={{ background: 'linear-gradient(120deg,#52B788,#9be7c4)', boxShadow: `0 0 0 5px ${COMIC_OUTLINE}` }}
          >
            <span className="font-fredoka font-700" style={chunky('min(2.6vw,1.6rem)', COMIC_OUTLINE, 0)}>
              TEAMS STOPPEN SELBST
            </span>
          </motion.div>

          {state === 'armed' ? (
            <div className="text-center">
              <div className="text-[9vw] leading-none mb-[1vh]">📱</div>
              <p className="font-fredoka font-700 text-white" style={chunky('min(6vw,4rem)', '#F0CE67', 8)}>
                MACHT EUCH BEREIT
              </p>
            </div>
          ) : preStart ? (
            <motion.div
              key={secsToGo}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-fredoka font-700 tabular-nums"
              style={chunky('min(26vw,26rem)', '#F0CE67', 18)}
            >
              {secsToGo}
            </motion.div>
          ) : state === 'running' ? (
            <motion.div
              className="font-fredoka font-700 tabular-nums whitespace-nowrap max-w-full"
              style={chunky('min(16vw,15rem)', '#FFFFFF', 15)}
            >
              {fmtBig(elapsed)}
            </motion.div>
          ) : (
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="font-fredoka font-700"
              style={chunky('min(14vw,12rem)', '#EF4444', 14)}
            >
              ZIEL! 🏁
            </motion.div>
          )}

          <p className="font-fredoka font-700 text-white" style={{ ...chunky('min(3vw,1.9rem)', '#fff', 4) }}>
            {finishers.length} / {active.length} im Ziel
          </p>
        </div>

        {/* RECHTS: Zieleinläufe live */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-none mb-[1.2vh]">
            <span className="font-fredoka font-700" style={chunky('min(2.8vw,1.8rem)', COMIC_CREAM, 5)}>
              🏁 ZIELEINLÄUFE
            </span>
          </div>
          <div className="flex-1 min-h-0 flex flex-col gap-[1vh] overflow-hidden">
            <AnimatePresence>
              {finishers.length === 0 ? (
                <p className="font-nunito text-white/40 text-[min(2vw,1.2rem)]">Noch niemand fertig…</p>
              ) : (
                finishers.map((r, i) => (
                  <motion.div
                    key={r.team.id}
                    layout
                    initial={{ opacity: 0, x: 40, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 26 }}
                    className="flex-1 min-h-0 max-h-[74px] flex items-center gap-3 rounded-2xl pr-4"
                    style={{
                      background: `linear-gradient(90deg, ${r.team.color}33, rgba(255,255,255,0.03) 82%)`,
                      boxShadow: `0 0 0 ${i === 0 ? 4 : 3}px ${i === 0 ? '#D4AF37' : COMIC_OUTLINE}`,
                    }}
                  >
                    <span className="w-12 text-center flex-shrink-0 font-fredoka font-700" style={i < 3 ? { fontSize: 'min(3vw,2rem)' } : chunky('min(2.4vw,1.5rem)', COMIC_CREAM, 4)}>
                      {i < 3 ? MEDAL[i] : i + 1}
                    </span>
                    <CharAvatar startNumber={r.team.start_number} img={r.team.avatar ?? undefined} color={r.team.color} size={44} />
                    <span className="flex-1 font-fredoka font-700 text-white truncate" style={{ fontSize: 'min(2.6vw,1.7rem)', ...nameOutline }}>
                      {r.team.team_name}
                    </span>
                    <span className="font-fredoka font-700 tabular-nums" style={chunky('min(2.8vw,1.8rem)', '#F0CE67', 4)}>
                      {fmtBig(r.sec)}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
