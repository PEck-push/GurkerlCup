'use client';

import { motion } from 'framer-motion';

// Feste Werte (kein Math.random → keine Hydration-Mismatches).
const STARS = [
  [6, 14], [12, 62], [18, 30], [24, 80], [31, 10], [38, 48], [44, 88], [52, 22],
  [58, 70], [64, 36], [71, 84], [77, 16], [83, 54], [89, 28], [94, 74], [9, 90],
  [16, 44], [27, 66], [35, 26], [42, 12], [49, 92], [56, 50], [68, 8], [74, 60],
  [81, 38], [87, 82], [92, 18], [3, 40], [21, 52], [60, 94],
];
const CUKES = [
  { left: '7%', top: '20%', size: 48, dur: 13, delay: 0, rot: -18 },
  { left: '85%', top: '14%', size: 62, dur: 16, delay: 1.5, rot: 22 },
  { left: '72%', top: '72%', size: 54, dur: 14, delay: 0.8, rot: -8 },
  { left: '12%', top: '76%', size: 42, dur: 17, delay: 2.2, rot: 14 },
  { left: '90%', top: '50%', size: 40, dur: 12, delay: 0.4, rot: -24 },
];

/** Verrückter Arcade-/Portal-Hintergrund in Gurkerl-Farben (Rick&Morty × SEGA). */
export default function BeamerBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grundvignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 38%, #11331f 0%, #0A1F12 55%, #060f09 100%)' }}
      />

      {/* Portal-Glow grün (Rick) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '46vw', height: '46vw', left: '50%', top: '34%', marginLeft: '-23vw', marginTop: '-23vw',
          background: 'radial-gradient(circle, rgba(82,183,136,0.30) 0%, rgba(82,183,136,0.06) 45%, transparent 68%)',
          filter: 'blur(30px)',
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Gold-Glow (SEGA) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '40vw', height: '40vw', right: '-8vw', top: '-10vw',
          background: 'radial-gradient(circle, rgba(212,175,55,0.20) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, -40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Starfield */}
      {STARS.map(([l, t], i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ left: `${l}%`, top: `${t}%`, width: i % 5 === 0 ? 4 : 2, height: i % 5 === 0 ? 4 : 2, background: i % 3 === 0 ? '#F0CE67' : '#9be7c4' }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: (i % 7) * 0.3, ease: 'easeInOut' }}
        />
      ))}

      {/* Synthwave-Grid unten (SEGA) */}
      <motion.div
        className="absolute"
        style={{
          left: '-30%', right: '-30%', bottom: '-2%', height: '42%',
          backgroundImage:
            'linear-gradient(rgba(82,183,136,0.18) 2px, transparent 2px), linear-gradient(90deg, rgba(212,175,55,0.12) 2px, transparent 2px)',
          backgroundSize: '70px 70px',
          transform: 'perspective(420px) rotateX(62deg)',
          transformOrigin: 'bottom',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 85%)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 85%)',
        }}
        animate={{ backgroundPositionY: ['0px', '70px'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Schwebende Gurkerl */}
      {CUKES.map((c, i) => (
        <motion.span
          key={`c${i}`}
          className="absolute select-none"
          style={{ left: c.left, top: c.top, fontSize: c.size, opacity: 0.1 }}
          animate={{ y: [0, -26, 0], rotate: [`${c.rot}deg`, `${c.rot + 14}deg`, `${c.rot}deg`] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          🥒
        </motion.span>
      ))}

      {/* Neon-Arcade-Rahmen */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: 'inset 0 0 120px rgba(82,183,136,0.18), inset 0 0 18px rgba(212,175,55,0.22)' }}
      />
    </div>
  );
}
