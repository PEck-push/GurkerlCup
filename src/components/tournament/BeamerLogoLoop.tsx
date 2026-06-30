'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

/** Neutraler Hingucker für Setup/Phase A: Logo + Gold-Shine + Fest-Hinweis. */
export default function BeamerLogoLoop() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute"
        style={{
          width: '60vw',
          height: '60vw',
          background:
            'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0.12) 35%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <Image
          src="/images/gurkerlcup.webp"
          alt="Gurkerl Cup 2026"
          width={900}
          height={472}
          priority
          unoptimized
          className="w-[60vw] max-w-[900px] h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative mt-8 font-bebas tracking-[0.3em] text-[#52B788] text-2xl md:text-3xl"
      >
        SOMMERFEST PÖTTSCHING · 18. JULI 2026 · DJ 1ER
      </motion.p>
    </div>
  );
}
