'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { spritzerRanking } from '@/lib/scoring';
import type { GcScore, GcTeam } from '@/lib/tournamentTypes';
import CharAvatar from './CharAvatar';
import BeamerHeading from './BeamerHeading';
import { COMIC_OUTLINE, nameOutline } from '@/lib/comicStyles';

const rankColor = (r: number) =>
  r === 1 ? '#D4AF37' : r === 2 ? '#C8CBD0' : r === 3 ? '#CD7F32' : '#52B788';

/** Spritzerwertung als eigene Szene (läuft mit, blockt nicht). Bild seitlich. */
export default function SpritzerReveal({ teams, scores }: { teams: GcTeam[]; scores: GcScore[] }) {
  const active = useMemo(() => teams.filter((t) => t.checked_in), [teams]);
  const teamById = useMemo(() => new Map(active.map((t) => [t.id, t])), [active]);
  const ranked = useMemo(
    () =>
      spritzerRanking(active, scores)
        .filter((r) => r.rank != null)
        .sort((a, b) => a.rank! - b.rank!)
        .slice(0, 6),
    [active, scores]
  );

  return (
    <div className="w-full h-full flex items-center justify-center gap-[3vw] px-[5vw] overflow-hidden">
      {/* Bild seitlich */}
      <motion.div
        initial={{ opacity: 0, x: -40, rotate: -4 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex-none"
      >
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.35), transparent 70%)' }}
        />
        <Image
          src="/images/spritzer.webp"
          alt="Spritzerwertung"
          width={460}
          height={460}
          unoptimized
          className="relative w-[34vw] max-w-[460px] h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        />
      </motion.div>

      {/* Wertung */}
      <div className="flex-1 max-w-2xl">
        <BeamerHeading title="Spritzerwertung" className="!text-left mb-[2vh]" />
        <div className="flex flex-col gap-[1vh]">
          {ranked.length === 0 && (
            <p className="font-nunito text-white/40 text-2xl">Noch keine Wertung.</p>
          )}
          {ranked.map((row, i) => {
            const t = teamById.get(row.teamId);
            if (!t) return null;
            const col = rankColor(row.rank!);
            return (
              <motion.div
                key={row.teamId}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-4 rounded-2xl px-4"
                style={{ background: `linear-gradient(90deg, ${col}33, rgba(255,255,255,0.03) 80%)`, boxShadow: `0 0 0 3px ${COMIC_OUTLINE}`, height: 'min(8vh, 62px)' }}
              >
                <span className="font-fredoka font-700 w-[44px] text-center" style={{ fontSize: 'min(3vw, 2rem)', color: col, WebkitTextStroke: `4px ${COMIC_OUTLINE}`, paintOrder: 'stroke fill' }}>
                  {row.rank}
                </span>
                <CharAvatar startNumber={t.start_number} color={t.color} size={46} />
                <span className="flex-1 font-fredoka font-700 text-white truncate" style={{ fontSize: 'min(3vw, 1.9rem)', ...nameOutline }}>
                  {t.team_name}
                </span>
                <span className="text-right leading-none" style={{ color: col }}>
                  <span className="font-bebas tabular-nums" style={{ fontSize: 'min(3vw, 1.9rem)' }}>
                    {row.rawValue} m
                  </span>
                  <span className="block font-nunito text-white/40" style={{ fontSize: 'min(1.5vw, 0.9rem)' }}>
                    {Math.round((row.rawValue ?? 0) * 10)} 🍷
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
