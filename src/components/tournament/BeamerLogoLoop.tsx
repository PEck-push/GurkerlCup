'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { chunky, COMIC_OUTLINE } from '@/lib/comicStyles';

/** Phase-A-Holding: großes Logo + Sticker-Tagline + Charaktere (Cartoon-Look). */
export default function BeamerLogoLoop() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute"
        style={{ width: '60vw', height: '60vw', background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0.1) 38%, transparent 66%)', filter: 'blur(40px)' }}
        animate={{ scale: [1, 1.16, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Charaktere links/rechts */}
      <motion.img
        // eslint-disable-next-line @next/next/no-img-element
        src="/images/simon.webp" alt="" className="absolute bottom-[6vh] left-[5vw] h-[34vh] w-auto"
        style={{ filter: 'drop-shadow(6px 8px 0 rgba(10,31,18,0.7))' }}
        animate={{ rotate: [-3, 3, -3], y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.img
        // eslint-disable-next-line @next/next/no-img-element
        src="/images/wasserbomben.webp" alt="" className="absolute bottom-[6vh] right-[5vw] h-[36vh] w-auto"
        style={{ filter: 'drop-shadow(-6px 8px 0 rgba(10,31,18,0.7))' }}
        animate={{ rotate: [3, -3, 3], y: [0, -12, 0] }} transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="relative">
        <Image
          src="/images/gurkerlcup.webp"
          alt="Gurkerl Cup 2026"
          width={900}
          height={472}
          priority
          unoptimized
          className="w-[52vw] max-w-[840px] h-auto"
          style={{ filter: 'drop-shadow(8px 10px 0 rgba(10,31,18,0.55))' }}
        />
      </motion.div>

      <motion.div
        initial={{ rotate: -3, scale: 0.9, opacity: 0 }}
        animate={{ rotate: -2, scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 160, damping: 12 }}
        className="relative mt-[3vh] px-8 py-2 rounded-2xl"
        style={{ background: 'linear-gradient(120deg,#52B788,#9be7c4)', boxShadow: `0 0 0 5px ${COMIC_OUTLINE}` }}
      >
        <span className="font-fredoka font-700" style={chunky('min(2.6vw,1.7rem)', COMIC_OUTLINE, 0)}>
          18. JULI 2026 · SOMMERFEST PÖTTSCHING · DJ 1ER
        </span>
      </motion.div>
    </div>
  );
}
