'use client';

import { motion } from 'framer-motion';
import TeamAvatar from './TeamAvatar';

interface MiniTeam {
  id: string;
  team_name: string;
  color: string;
  emoji: string;
}

export interface PodiumEntry {
  team: MiniTeam;
  value: string; // formatierte Hauptkennzahl (z.B. "84 Pkt" oder Zeit)
  rank: number;
}

const SLOTS = [
  { rank: 2, color: '#C8CBD0', medal: '🥈', size: 92, lift: 0, delay: 0.15 },
  { rank: 1, color: '#D4AF37', medal: '👑', size: 120, lift: -28, delay: 0.35 },
  { rank: 3, color: '#CD7F32', medal: '🥉', size: 82, lift: 12, delay: 0 },
];

/** Top-3 als Podium mit Avatar-Kreisen, Medaillen & Punkte-Badge (Leaderboard-Stil). */
export default function PodiumTop3({
  entries,
  unit = 'Pkt',
}: {
  entries: PodiumEntry[];
  unit?: string;
}) {
  const byRank = (r: number) => entries.find((e) => e.rank === r);

  return (
    <div className="flex items-end justify-center gap-[3vw]">
      {SLOTS.map((slot) => {
        const e = byRank(slot.rank);
        const isFirst = slot.rank === 1;
        return (
          <motion.div
            key={slot.rank}
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, y: slot.lift, scale: 1 }}
            transition={{ delay: slot.delay, type: 'spring', stiffness: 140, damping: 15 }}
            className="flex flex-col items-center"
            style={{ width: slot.size + 40 }}
          >
            {isFirst && (
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: slot.size * 0.42 }}
                className="leading-none mb-1"
              >
                {slot.medal}
              </motion.div>
            )}
            <div className="relative">
              <TeamAvatar
                color={e?.team.color ?? '#444'}
                emoji={e?.team.emoji ?? '❓'}
                size={slot.size}
                ring={isFirst ? 5 : 4}
              />
              {!isFirst && (
                <span
                  className="absolute -top-2 -right-1 leading-none"
                  style={{ fontSize: slot.size * 0.3 }}
                >
                  {slot.medal}
                </span>
              )}
              {/* Rang-Badge */}
              <span
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-bebas rounded-full px-3 leading-tight"
                style={{
                  background: slot.color,
                  color: '#0A1F12',
                  fontSize: slot.size * 0.2,
                  boxShadow: `0 0 18px ${slot.color}88`,
                }}
              >
                {slot.rank}
              </span>
            </div>

            <p
              className="font-fredoka font-700 text-white text-center mt-4 truncate max-w-full"
              style={{ fontSize: isFirst ? 'min(2.8vw, 1.9rem)' : 'min(2.2vw, 1.5rem)' }}
            >
              {e?.team.team_name ?? '—'}
            </p>
            <span
              className="mt-1 font-bebas tabular-nums rounded-full px-3 py-0.5"
              style={{
                background: `${slot.color}22`,
                border: `1px solid ${slot.color}`,
                color: slot.color,
                fontSize: isFirst ? 'min(2.4vw, 1.6rem)' : 'min(2vw, 1.3rem)',
              }}
            >
              {e ? `${e.value} ${unit}`.trim() : '—'}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
