'use client';

import { motion } from 'framer-motion';
import BeamerHeading from './BeamerHeading';
import PodiumTop3, { type PodiumEntry } from './PodiumTop3';
import RotatingList, { type ListEntry } from './RotatingList';
import TeamAvatar from './TeamAvatar';

export interface LbEntry {
  team: { id: string; team_name: string; color: string; emoji: string };
  rank: number;
  value: string;
}

/**
 * Gestuftes Leaderboard, das immer in die Beamer-Größe passt:
 *  1) Top 3 als Podium  2) Plätze 4–10 als Liste  3) Rest dauerrotierend.
 */
export default function LeaderboardView({
  entries,
  unit = 'Pkt',
  kicker,
  title,
  accent,
}: {
  entries: LbEntry[];
  unit?: string;
  kicker?: string;
  title: string;
  accent?: string;
}) {
  const top3: PodiumEntry[] = entries.filter((e) => e.rank <= 3);
  const mid = entries.filter((e) => e.rank >= 4 && e.rank <= 10);
  const rest: ListEntry[] = entries.filter((e) => e.rank >= 11);

  return (
    <div className="w-full h-full flex flex-col items-center px-[3vw] py-[1.5vh] overflow-hidden">
      <BeamerHeading kicker={kicker} title={title} accent={accent} className="flex-none mb-[1vh]" />

      {/* 1) Top 3 */}
      <div className="flex-none mb-[1.2vh]">
        <PodiumTop3 entries={top3} unit={unit} />
      </div>

      {/* 2) Plätze 4–10 (flexibel – passt immer, schneidet nie ab) */}
      {mid.length > 0 && (
        <div className="flex-1 min-h-0 w-full max-w-3xl flex flex-col justify-start gap-[0.5vh]">
          {mid.map((e, i) => (
            <motion.div
              key={e.team.id}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="flex items-center gap-3 px-5 rounded-xl min-h-0"
              style={{
                flex: '1 1 0',
                maxHeight: 54,
                background: `${e.team.color}12`,
                border: `1px solid ${e.team.color}3a`,
              }}
            >
              <span className="font-bebas text-white/70 w-8 text-center" style={{ fontSize: 'min(2.4vw, 1.4rem)' }}>
                {e.rank}
              </span>
              <TeamAvatar color={e.team.color} emoji={e.team.emoji} size={34} glow={false} ring={2} />
              <span className="flex-1 font-fredoka font-600 text-white truncate" style={{ fontSize: 'min(2.4vw, 1.45rem)' }}>
                {e.team.team_name}
              </span>
              <span className="font-bebas tabular-nums text-[#D4AF37]" style={{ fontSize: 'min(2.6vw, 1.55rem)' }}>
                {e.value}
                <span className="text-white/40 text-[0.6em] ml-1">{unit}</span>
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* 3) Rest – rotierend */}
      {rest.length > 0 && (
        <div className="flex-none w-full max-w-3xl mt-[0.8vh] pt-[0.8vh] border-t border-white/10">
          <p className="font-bebas tracking-[0.25em] text-white/30 text-center mb-1" style={{ fontSize: 'min(1.6vw, 0.95rem)' }}>
            WEITERE PLÄTZE
          </p>
          <div className="flex justify-center">
            <RotatingList entries={rest} unit={unit} visible={2} />
          </div>
        </div>
      )}
    </div>
  );
}
