'use client';

import { motion } from 'framer-motion';
import CharAvatar from './CharAvatar';
import { chunky, nameOutline, COMIC_OUTLINE, COMIC_CREAM } from '@/lib/comicStyles';

export interface LbEntry {
  team: { id: string; team_name: string; color: string; emoji: string; start_number: number };
  rank: number;
  value: string;
}

const ROW_H = 84;

const TOP = [
  { rank: 2, c: '#C8CBD0', medal: '🥈', z: 20, rot: -2 },
  { rank: 1, c: '#D4AF37', medal: '', z: 30, rot: -1 }, // Krone schwebt bereits über der Card
  { rank: 3, c: '#CD7F32', medal: '🥉', z: 10, rot: 2 },
];

function Row({ e, unit }: { e: LbEntry; unit: string }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl pr-5"
      style={{ height: ROW_H - 8, background: `linear-gradient(90deg, ${e.team.color}33, rgba(255,255,255,0.03) 75%)`, boxShadow: `0 0 0 3px ${COMIC_OUTLINE}` }}
    >
      <div
        className="flex items-center justify-center font-fredoka font-700 flex-shrink-0 ml-[-3px] rounded-2xl"
        style={{ width: 62, height: ROW_H - 8, background: e.team.color, boxShadow: `inset 0 0 0 4px ${COMIC_OUTLINE}`, ...chunky(32, COMIC_CREAM, 0) }}
      >
        {e.rank}
      </div>
      <CharAvatar startNumber={e.team.start_number} color={e.team.color} size={54} />
      <span className="flex-1 font-fredoka font-700 text-white truncate" style={{ fontSize: 26, ...nameOutline }}>
        {e.team.team_name}
      </span>
      <span className="font-fredoka font-700" style={chunky(38, '#F0CE67', 5)}>
        {e.value}
        {unit && <span className="font-bebas align-top ml-1" style={{ fontSize: 16, WebkitTextStroke: '0', color: '#ffffff80' }}>{unit}</span>}
      </span>
    </div>
  );
}

/** Cartoon-Meme-Leaderboard: Header-Sticker + Top-3-Cards + Liste (4–8 starr, ab 9 rotierend). */
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
  const label = (accent ? `${title} ${accent}` : title).toUpperCase();
  const headBg = variant === 'eyebrow' ? 'linear-gradient(120deg,#52B788,#9be7c4)' : 'linear-gradient(120deg,#D4AF37,#F0CE67)';
  const byRank = (r: number) => entries.find((e) => e.rank === r);
  const mid = entries.filter((e) => e.rank >= 4 && e.rank <= 6);
  const rot = entries.filter((e) => e.rank >= 7);

  return (
    <div className="relative w-full h-full flex flex-col px-[4vw] pt-[3.5vh] pb-[6vh]">
      {/* Header-Sticker */}
      <div className="flex-none flex justify-center mb-[2vh]">
        <motion.div
          initial={{ rotate: -5, scale: 0.85, opacity: 0 }}
          animate={{ rotate: -3, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 12 }}
          className="px-9 py-2 rounded-2xl"
          style={{ background: headBg, boxShadow: `0 0 0 5px ${COMIC_OUTLINE}` }}
        >
          <span className="font-fredoka font-700" style={chunky('min(4vw,2.4rem)', COMIC_OUTLINE, 0)}>
            {label}
          </span>
        </motion.div>
      </div>

      <div className="flex-1 min-h-0 flex gap-[2.5vw]">
        {/* LINKS: Top 3 */}
        <div className="relative flex flex-col justify-center gap-[2vh]" style={{ width: '44%' }}>
          {/* Burst – langsam rotierend, hinter Rang 1 */}
          <motion.div
            className="absolute left-1/2 top-1/2 -z-0 pointer-events-none"
            style={{ width: 820, height: 820, marginLeft: -410, marginTop: -410, background: 'repeating-conic-gradient(from 0deg, rgba(212,175,55,0.14) 0deg 10deg, transparent 10deg 20deg)', borderRadius: '50%' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
          />
          {TOP.map((s, idx) => {
            const e = byRank(s.rank);
            const first = s.rank === 1;
            return (
              <motion.div
                key={s.rank}
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1, rotate: s.rot, scale: first ? [1, 1.035, 1] : 1 }}
                transition={{
                  delay: 0.12 * idx,
                  type: 'spring',
                  stiffness: 130,
                  damping: 13,
                  ...(first ? { scale: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } } : {}),
                }}
                className="relative flex items-center gap-5 rounded-[2.2rem] pl-4 pr-6"
                style={{ zIndex: s.z, height: first ? '23vh' : '17vh', background: `linear-gradient(125deg, ${s.c}, ${s.c}aa)`, boxShadow: `0 0 0 5px ${COMIC_OUTLINE}, 0 0 0 9px ${COMIC_CREAM}${first ? ', 0 0 50px rgba(212,175,55,0.5)' : ''}` }}
              >
                <CharAvatar startNumber={e?.team.start_number} color={e?.team.color ?? s.c} size={first ? 150 : 110} />
                <div className="flex-1 min-w-0">
                  <div className="font-fredoka font-700" style={chunky(first ? 44 : 32, COMIC_CREAM, first ? 5 : 4)}>
                    {s.medal}{s.rank}
                  </div>
                  <div className="font-fredoka font-700 text-white truncate mt-1" style={{ fontSize: first ? '3vh' : '2.3vh', ...nameOutline }}>
                    {e?.team.team_name ?? '—'}
                  </div>
                </div>
                <div className="text-right flex-none">
                  <div className="font-fredoka font-700" style={chunky(first ? 56 : 42, '#F0CE67', first ? 7 : 6)}>
                    {e?.value ?? '—'}
                  </div>
                  {unit && <div className="font-bebas tracking-widest text-white/90" style={{ fontSize: '1.6vh' }}>{unit}</div>}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* RECHTS: 4–8 starr, ab 9 rotierend */}
        <div className="flex-1 min-h-0 flex flex-col gap-2">
          {mid.map((e) => (
            <Row key={e.team.id} e={e} unit={unit} />
          ))}
          {rot.length > 0 && (
            <div className="flex-1 min-h-0 mt-3 pt-3 flex flex-col" style={{ borderTop: `2px dashed ${COMIC_OUTLINE}` }}>
              <div
                className="flex-1 min-h-0 overflow-hidden"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 16%, #000 84%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, transparent 0, #000 16%, #000 84%, transparent 100%)',
                }}
              >
                <motion.div
                  animate={{ y: [0, -(rot.length * ROW_H)] }}
                  transition={{ duration: rot.length * 3.4, repeat: Infinity, ease: 'linear' }}
                >
                  {[...rot, ...rot].map((e, i) => (
                    <div key={i} style={{ height: ROW_H, paddingTop: 4, paddingBottom: 4 }}>
                      <Row e={e} unit={unit} />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
