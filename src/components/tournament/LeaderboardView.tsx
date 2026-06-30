'use client';

import { motion } from 'framer-motion';
import BeamerHeading from './BeamerHeading';
import TeamAvatar from './TeamAvatar';
import FillList from './FillList';

export interface LbEntry {
  team: { id: string; team_name: string; color: string; emoji: string };
  rank: number;
  value: string;
}

const ROW_H = 72;

const numberStroke = (color: string) => ({
  WebkitTextStroke: '2px rgba(6,15,9,0.75)',
  color,
  textShadow: `0 0 16px ${color}88`,
});

/** 2-Spalten-Arcade-Leaderboard: links Top-3-Pills, rechts Liste 4..N (höhen-adaptiv). */
export default function LeaderboardView({
  entries,
  unit = 'Pkt',
  title,
  accent,
  variant = 'gold',
}: {
  entries: LbEntry[];
  unit?: string;
  title: string;
  accent?: string;
  variant?: 'gold' | 'eyebrow';
}) {
  const top3 = entries.filter((e) => e.rank <= 3);
  const rest = entries.filter((e) => e.rank >= 4);

  const SLOT = {
    1: { c: '#D4AF37', medal: '👑', av: 104 },
    2: { c: '#C8CBD0', medal: '🥈', av: 84 },
    3: { c: '#CD7F32', medal: '🥉', av: 80 },
  } as const;

  const restRows = rest.map((e) => (
    <div
      key={e.team.id}
      className="flex items-center gap-3 h-full pr-3 rounded-2xl"
      style={{ background: `linear-gradient(90deg, ${e.team.color}1f, transparent 80%)`, border: `1px solid ${e.team.color}33` }}
    >
      <span
        className="flex-none w-[58px] h-[58px] ml-1 rounded-xl flex items-center justify-center font-bebas"
        style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${e.team.color}44`, fontSize: 'min(3vw,2rem)', ...numberStroke('#ffffff') }}
      >
        {e.rank}
      </span>
      <TeamAvatar color={e.team.color} emoji={e.team.emoji} size={44} glow={false} ring={2} />
      <span className="flex-1 font-fredoka font-700 text-white truncate" style={{ fontSize: 'min(2.6vw,1.7rem)' }}>
        {e.team.team_name}
      </span>
      <span className="font-bebas tabular-nums" style={{ fontSize: 'min(3vw,2rem)', ...numberStroke('#F0CE67') }}>
        {e.value}
        <span className="text-white/40 text-[0.5em] ml-1" style={{ WebkitTextStroke: '0', textShadow: 'none' }}>{unit}</span>
      </span>
    </div>
  ));

  return (
    <div className="w-full h-full flex flex-col px-[3vw] py-[2vh] overflow-hidden">
      <BeamerHeading title={title} accent={accent} variant={variant} className="flex-none mb-[2vh]" />

      <div className="flex-1 min-h-0 flex gap-[2.5vw]">
        {/* LINKS: Top 3 */}
        <div className="flex flex-col justify-center gap-[2vh]" style={{ width: '42%' }}>
          {[1, 2, 3].map((r) => {
            const e = top3.find((x) => x.rank === r);
            const s = SLOT[r as 1 | 2 | 3];
            const first = r === 1;
            return (
              <motion.div
                key={r}
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.15 * (3 - r), type: 'spring', stiffness: 140, damping: 15 }}
                className="relative flex items-center gap-4 rounded-[2rem] pl-3 pr-5"
                style={{
                  marginLeft: `${(r - 1) * 3}%`,
                  height: first ? 'min(22vh,170px)' : 'min(17vh,128px)',
                  background: `linear-gradient(120deg, ${s.c}33, ${s.c}0d 70%)`,
                  border: `2px solid ${s.c}`,
                  boxShadow: `0 0 ${first ? 60 : 34}px ${s.c}66, inset 0 0 30px ${s.c}1a`,
                }}
              >
                {first && (
                  <motion.span
                    className="absolute -top-[3.2vh] left-1/2 -translate-x-1/2 leading-none"
                    style={{ fontSize: 'min(5vw,3.4rem)' }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    👑
                  </motion.span>
                )}
                <TeamAvatar
                  color={e?.team.color ?? s.c}
                  emoji={e?.team.emoji ?? '❓'}
                  size={s.av}
                  ring={first ? 5 : 4}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className="font-bebas leading-none block"
                    style={{ fontSize: first ? 'min(4vw,2.6rem)' : 'min(3vw,2rem)', ...numberStroke(s.c) }}
                  >
                    {s.medal} {r}.
                  </span>
                  <span
                    className="font-fredoka font-700 text-white block truncate"
                    style={{ fontSize: first ? 'min(3vw,2rem)' : 'min(2.4vw,1.6rem)' }}
                  >
                    {e?.team.team_name ?? '—'}
                  </span>
                </div>
                <span
                  className="flex-none font-bebas tabular-nums leading-none"
                  style={{ fontSize: first ? 'min(4.5vw,3rem)' : 'min(3.4vw,2.3rem)', ...numberStroke('#F0CE67') }}
                >
                  {e?.value ?? '—'}
                  <span className="text-white/40 block text-center" style={{ fontSize: '0.4em', WebkitTextStroke: '0', textShadow: 'none' }}>
                    {unit}
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* RECHTS: Plätze 4..N */}
        <div className="flex-1 min-h-0">
          {rest.length > 0 ? (
            <FillList rows={restRows} rowH={ROW_H} />
          ) : (
            <div className="h-full flex items-center justify-center text-white/30 font-nunito text-xl">
              Nur drei Teams am Start 🥒
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
