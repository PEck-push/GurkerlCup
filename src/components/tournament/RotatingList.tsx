'use client';

import { motion } from 'framer-motion';
import TeamAvatar from './TeamAvatar';

interface MiniTeam {
  id: string;
  team_name: string;
  color: string;
  emoji: string;
}

export interface ListEntry {
  team: MiniTeam;
  value: string;
  rank: number;
}

const ROW_H = 58;

function Row({ e, unit }: { e: ListEntry; unit: string }) {
  return (
    <div
      className="flex items-center gap-4 px-5 rounded-xl mx-1"
      style={{ height: ROW_H - 8, background: `${e.team.color}10`, border: `1px solid ${e.team.color}33` }}
    >
      <span className="font-bebas text-white/80 w-9 text-center" style={{ fontSize: 'min(2.4vw, 1.5rem)' }}>
        {e.rank}
      </span>
      <TeamAvatar color={e.team.color} emoji={e.team.emoji} size={40} glow={false} ring={2} />
      <span className="flex-1 font-fredoka font-600 text-white truncate" style={{ fontSize: 'min(2.4vw, 1.5rem)' }}>
        {e.team.team_name}
      </span>
      <span className="font-bebas tabular-nums text-[#D4AF37]" style={{ fontSize: 'min(2.6vw, 1.6rem)' }}>
        {e.value}
        <span className="text-white/40 text-[0.6em] ml-1">{unit}</span>
      </span>
    </div>
  );
}

/** Liste der unteren Ränge – rotiert endlos, wenn mehr Einträge als sichtbar. */
export default function RotatingList({
  entries,
  unit = 'Pkt',
  visible = 5,
}: {
  entries: ListEntry[];
  unit?: string;
  visible?: number;
}) {
  if (entries.length === 0) return null;

  const overflow = entries.length > visible;
  const viewH = Math.min(visible, entries.length) * ROW_H;

  if (!overflow) {
    return (
      <div className="w-full" style={{ maxWidth: 720 }}>
        {entries.map((e) => (
          <div key={e.team.id} style={{ height: ROW_H }} className="flex items-center">
            <div className="w-full">
              <Row e={e} unit={unit} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const loopHeight = entries.length * ROW_H;
  return (
    <div className="w-full overflow-hidden" style={{ height: viewH, maxWidth: 720 }}>
      <motion.div
        animate={{ y: [0, -loopHeight] }}
        transition={{ duration: entries.length * 1.8, repeat: Infinity, ease: 'linear' }}
      >
        {[...entries, ...entries].map((e, i) => (
          <div key={`${e.team.id}-${i}`} style={{ height: ROW_H }} className="flex items-center">
            <div className="w-full">
              <Row e={e} unit={unit} />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
