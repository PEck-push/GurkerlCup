'use client';

import { motion } from 'framer-motion';

// Feste Werte (kein Math.random → keine Hydration-Mismatches).
const CUKES = [
  { left: '8%', top: '18%', size: 46, dur: 13, delay: 0, rotate: -18 },
  { left: '82%', top: '12%', size: 60, dur: 16, delay: 1.5, rotate: 22 },
  { left: '70%', top: '70%', size: 52, dur: 14, delay: 0.8, rotate: -8 },
  { left: '15%', top: '74%', size: 40, dur: 17, delay: 2.2, rotate: 14 },
  { left: '46%', top: '8%', size: 34, dur: 15, delay: 1.1, rotate: 30 },
  { left: '90%', top: '46%', size: 38, dur: 12, delay: 0.4, rotate: -24 },
];

/** Belebter Beamer-Hintergrund: driftende Gold-/Grün-Blobs + schwebende Gurkerl. */
export default function BeamerBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '55vw',
          height: '55vw',
          left: '-12vw',
          top: '-10vw',
          background: 'radial-gradient(circle, rgba(212,175,55,0.16) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '50vw',
          height: '50vw',
          right: '-10vw',
          bottom: '-12vw',
          background: 'radial-gradient(circle, rgba(82,183,136,0.16) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      {CUKES.map((c, i) => (
        <motion.span
          key={i}
          className="absolute select-none"
          style={{ left: c.left, top: c.top, fontSize: c.size, opacity: 0.08, rotate: `${c.rotate}deg` }}
          animate={{ y: [0, -24, 0], rotate: [`${c.rotate}deg`, `${c.rotate + 12}deg`, `${c.rotate}deg`] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          🥒
        </motion.span>
      ))}
    </div>
  );
}
