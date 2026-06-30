'use client';

import { motion } from 'framer-motion';
import { COMIC_OUTLINE, COMIC_CREAM } from '@/lib/comicStyles';

const STARS = [
  [8, 16], [15, 70], [30, 22], [42, 84], [60, 14], [70, 60], [88, 30], [92, 76], [50, 48], [80, 8],
  [22, 40], [64, 88], [36, 60], [76, 38], [12, 52], [48, 18], [58, 70], [84, 54], [26, 80], [68, 26],
];
const CUKES = [
  { left: '6%', top: '24%', size: 44, dur: 14, delay: 0, rot: -16 },
  { left: '93%', top: '18%', size: 50, dur: 16, delay: 1.2, rot: 20 },
  { left: '90%', top: '70%', size: 46, dur: 15, delay: 0.6, rot: -10 },
];

/** Cartoon-Meme-Hintergrund: tiefes Grün, Halftone, Sterne, Glow + Comic-Panel-Rahmen. */
export default function BeamerBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 36%, #11331f 0%, #0A1F12 55%, #04100a 100%)' }} />

      {/* Halftone */}
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(#52B788 1.4px, transparent 1.6px)', backgroundSize: '24px 24px' }} />

      {/* Soft center glow */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '60vw', height: '60vw', left: '50%', top: '40%', marginLeft: '-30vw', marginTop: '-30vw', background: 'radial-gradient(circle, rgba(82,183,136,0.20) 0%, transparent 65%)', filter: 'blur(40px)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Stars */}
      {STARS.map(([l, t], i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ left: `${l}%`, top: `${t}%`, width: i % 3 === 0 ? 6 : 3, height: i % 3 === 0 ? 6 : 3, background: i % 2 ? '#F0CE67' : '#9be7c4', boxShadow: '0 0 8px currentColor' }}
          animate={{ opacity: [0.2, 0.95, 0.2] }}
          transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: (i % 7) * 0.3, ease: 'easeInOut' }}
        />
      ))}

      {/* Schwebende Gurkerl */}
      {CUKES.map((c, i) => (
        <motion.span
          key={`c${i}`}
          className="absolute select-none"
          style={{ left: c.left, top: c.top, fontSize: c.size, opacity: 0.1 }}
          animate={{ y: [0, -22, 0], rotate: [`${c.rot}deg`, `${c.rot + 12}deg`, `${c.rot}deg`] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          🥒
        </motion.span>
      ))}

      {/* Comic-Panel-Rahmen */}
      <div
        className="absolute inset-[14px] rounded-[40px]"
        style={{ border: `6px solid ${COMIC_OUTLINE}`, boxShadow: `inset 0 0 0 5px ${COMIC_CREAM}, inset 0 0 90px rgba(82,183,136,0.18)` }}
      />
    </div>
  );
}
