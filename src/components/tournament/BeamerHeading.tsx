'use client';

import { motion } from 'framer-motion';

/**
 * Beamer-Headline.
 *  - variant 'gold'   : große goldene Schreibschrift (Pacifico) – z.B. Spritzerwertung, Eröffnung, Goldene Gurke
 *  - variant 'eyebrow': kleines grünes Label (z.B. "Zwischenstand") – Leaderboard & Phase B
 */
export default function BeamerHeading({
  title,
  accent,
  variant = 'gold',
  className = '',
}: {
  kicker?: string;
  title: string;
  accent?: string;
  variant?: 'gold' | 'eyebrow';
  className?: string;
}) {
  if (variant === 'eyebrow') {
    return (
      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`font-bebas tracking-[0.4em] text-[#52B788] text-center ${className}`}
        style={{ fontSize: 'min(2.8vw, 1.7rem)' }}
      >
        {title}
      </motion.p>
    );
  }

  return (
    <motion.h1
      initial={{ opacity: 0, y: -24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`font-pacifico font-400 text-gold-gradient text-center leading-[1.1] ${className}`}
      style={{ fontSize: 'min(7vw, 4.6rem)', filter: 'drop-shadow(0 0 28px rgba(212,175,55,0.35))' }}
    >
      {accent ? `${title} ${accent}` : title}
    </motion.h1>
  );
}
