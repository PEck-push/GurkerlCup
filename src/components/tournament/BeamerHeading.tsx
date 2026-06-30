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
      <div className={`text-center ${className}`}>
        <motion.span
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 12 }}
          className="inline-block font-bebas tracking-[0.35em] text-[#0A1F12] rounded-full px-7 py-1"
          style={{
            fontSize: 'min(2.8vw, 1.7rem)',
            background: 'linear-gradient(120deg, #52B788, #9be7c4)',
            border: '2px solid #d6f5e4',
            boxShadow: '0 0 26px rgba(82,183,136,0.65), 0 4px 0 rgba(6,15,9,0.4)',
          }}
        >
          {title}
        </motion.span>
      </div>
    );
  }

  return (
    <motion.h1
      initial={{ opacity: 0, y: -24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`font-pacifico font-400 text-gold-gradient text-center leading-[1.45] ${className}`}
      style={{ fontSize: 'min(7vw, 4.6rem)', paddingBottom: '0.22em', paddingTop: '0.08em', filter: 'drop-shadow(0 0 28px rgba(212,175,55,0.35))' }}
    >
      {accent ? `${title} ${accent}` : title}
    </motion.h1>
  );
}
