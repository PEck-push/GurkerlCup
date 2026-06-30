'use client';

import { motion } from 'framer-motion';

/**
 * Website-Headline-Stil ("So läuft der Cup"): Bebas-Kicker (grün) +
 * Fredoka-Titel (weiß) mit geschwungenem Pacifico-Gold-Akzent.
 */
export default function BeamerHeading({
  kicker,
  title,
  accent,
  className = '',
}: {
  kicker?: string;
  title: string;
  accent?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`text-center ${className}`}
    >
      {kicker && (
        <p className="font-bebas tracking-[0.35em] text-[#52B788] mb-1" style={{ fontSize: 'min(2vw, 1.2rem)' }}>
          {kicker}
        </p>
      )}
      <h1
        className="font-fredoka font-700 text-white leading-[0.95] text-shadow-glow"
        style={{ fontSize: 'min(5.8vw, 3.9rem)' }}
      >
        {title}
        {accent && (
          <>
            {' '}
            <span className="text-gold-gradient font-pacifico font-400">{accent}</span>
          </>
        )}
      </h1>
    </motion.div>
  );
}
