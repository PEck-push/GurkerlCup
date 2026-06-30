'use client';

import { motion } from 'framer-motion';
import { chunky, COMIC_OUTLINE } from '@/lib/comicStyles';

/**
 * Beamer-Headline.
 *  - variant 'gold'   : große goldene Schreibschrift (Pacifico) – z.B. Spritzerwertung, Eröffnung
 *  - variant 'eyebrow': grünes Sticker-Label in den neuen Block-Buchstaben (Fredoka + Outline)
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
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 12 }}
          className="inline-block px-9 py-2 rounded-2xl"
          style={{ background: 'linear-gradient(120deg, #52B788, #9be7c4)', boxShadow: `0 0 0 5px ${COMIC_OUTLINE}` }}
        >
          <span className="font-fredoka font-700" style={chunky('min(3.4vw, 2.1rem)', COMIC_OUTLINE, 0)}>
            {title.toUpperCase()}
          </span>
        </motion.div>
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
