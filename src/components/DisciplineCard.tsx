'use client';

import { useState, useRef } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import type { Discipline } from '@/lib/disciplines';
import DisciplineModal from './DisciplineModal';

interface Props {
  discipline: Discipline;
  index: number;
  totalCards: number;
  scrollProgress: MotionValue<number>;
}

const categoryBadgeColors: Record<string, string> = {
  gold: 'text-[#D4AF37] border-[#D4AF37]/50',
  green: 'text-[#52B788] border-[#52B788]/40',
  orange: 'text-orange-400 border-orange-400/40',
  red: 'text-red-400 border-red-400/40',
};

export default function DisciplineCard({ discipline, index, totalCards, scrollProgress }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const cardCenter = index / Math.max(totalCards - 1, 1);
  const spread = 1.8 / totalCards;

  const rotateY = useTransform(
    scrollProgress,
    [
      Math.max(0, cardCenter - spread * 2),
      Math.max(0, cardCenter - spread),
      cardCenter,
      Math.min(1, cardCenter + spread),
      Math.min(1, cardCenter + spread * 2),
    ],
    [28, 12, 0, -12, -28],
    { clamp: true }
  );

  const scale = useTransform(
    scrollProgress,
    [
      Math.max(0, cardCenter - spread),
      cardCenter,
      Math.min(1, cardCenter + spread),
    ],
    [0.87, 1, 0.87],
    { clamp: true }
  );

  const opacity = useTransform(
    scrollProgress,
    [
      Math.max(0, cardCenter - spread * 2),
      Math.max(0, cardCenter - spread),
      cardCenter,
      Math.min(1, cardCenter + spread),
      Math.min(1, cardCenter + spread * 2),
    ],
    [0.35, 0.7, 1, 0.7, 0.35],
    { clamp: true }
  );

  const badgeColor = categoryBadgeColors[discipline.categoryVariant] ?? categoryBadgeColors.green;

  return (
    <>
      <motion.div
        ref={cardRef}
        style={{ rotateY, scale, opacity }}
        className="flex-shrink-0 cursor-pointer select-none"
        onClick={() => setIsOpen(true)}
        whileHover={{ y: -10, transition: { duration: 0.25, ease: 'easeOut' } }}
        aria-label={`${discipline.name} – mehr erfahren`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(true)}
      >
        <div
          className="discipline-card relative overflow-hidden rounded-2xl"
          style={{
            width: 260,
            height: 380,
            background: `linear-gradient(160deg, ${discipline.bgFrom} 0%, ${discipline.bgTo} 100%)`,
          }}
        >
          {/* Glow halo */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse at 50% 70%, ${discipline.glowColor}, transparent 65%)`,
            }}
          />
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(ellipse at 50% 80%, ${discipline.glowColor}, transparent 65%)`,
              opacity: 0.18,
            }}
          />

          {/* Badge row */}
          <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-10">
            <span
              className={`font-bebas text-[10px] tracking-[0.18em] px-2.5 py-1 rounded-full border ${badgeColor} bg-black/20 backdrop-blur-sm`}
            >
              {discipline.category}
            </span>
            {discipline.badge && (
              <span className="font-bebas text-[10px] tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]">
                {discipline.badge}
              </span>
            )}
          </div>

          {/* Character image / emoji */}
          <div className="absolute inset-0 flex items-center justify-center pt-8">
            {discipline.image ? (
              <div className="relative w-[200px] h-[200px]">
                <Image
                  src={discipline.image}
                  alt={discipline.name}
                  fill
                  className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                  sizes="200px"
                />
              </div>
            ) : (
              <motion.div
                className="text-[90px] leading-none select-none"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3 + index * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.2,
                }}
                style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.5))' }}
              >
                {discipline.emoji}
              </motion.div>
            )}
          </div>

          {/* Bottom info panel */}
          <div
            className="absolute bottom-0 left-0 right-0 p-5"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
            }}
          >
            <p className="font-fredoka font-700 text-white text-lg leading-tight">
              {discipline.name}
            </p>
            {discipline.subtitle && (
              <p className="font-nunito text-xs text-white/50 mt-0.5">{discipline.subtitle}</p>
            )}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs text-white/40 font-nunito">Klick für Details</span>
              <span className="text-[#D4AF37]/60 text-xs">→</span>
            </div>
          </div>

          {/* Hover border glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
            style={{
              boxShadow: `inset 0 0 0 1px rgba(212,175,55,0)`,
            }}
          />
        </div>
      </motion.div>

      <DisciplineModal discipline={isOpen ? discipline : null} onClose={() => setIsOpen(false)} />
    </>
  );
}
