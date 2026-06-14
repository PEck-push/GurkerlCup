'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AuroraBackground from './AuroraBackground';
import CoverflowCarousel from './CoverflowCarousel';
import DisciplineModal from './DisciplineModal';
import { disciplines, type Discipline } from '@/lib/disciplines';

const word = {
  hidden: { opacity: 0, y: 24, filter: 'blur(12px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function ShowcaseHero() {
  const [active, setActive] = useState<Discipline | null>(null);

  return (
    <section
      id="disziplinen"
      className="relative min-h-screen flex flex-col overflow-hidden pt-24 md:pt-28 pb-10"
    >
      <AuroraBackground />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Heading block */}
        <div className="text-center px-5 mb-2 md:mb-4">
          {/* kicker */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-3 md:mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-bebas text-xs md:text-sm tracking-[0.3em] text-[#F0CE67]">
              18. JULI 2026 · PÖTTSCHING
            </span>
          </motion.div>

          {/* headline */}
          <h1 className="text-shadow-glow">
            <motion.span
              custom={0}
              variants={word}
              initial="hidden"
              animate="show"
              className="block font-pacifico text-5xl md:text-7xl lg:text-8xl text-gold-gradient leading-[1.05]"
            >
              Gurkerl Cup
            </motion.span>
            <motion.span
              custom={1}
              variants={word}
              initial="hidden"
              animate="show"
              className="block font-bebas text-5xl md:text-7xl lg:text-8xl text-white tracking-[0.08em] mt-1"
            >
              2026
            </motion.span>
          </h1>

          {/* subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="font-nunito text-sm md:text-lg text-white/55 max-w-xl mx-auto mt-2 md:mt-4"
          >
            10 Disziplinen. 3er-Teams.{' '}
            <span className="text-[#F0CE67] font-700">Ein Sieger.</span>
          </motion.p>
        </div>

        {/* Coverflow */}
        <div className="flex-1 flex items-center justify-center mt-2">
          <CoverflowCarousel disciplines={disciplines} onOpen={setActive} entranceDelay={0.55} />
        </div>
      </div>

      <DisciplineModal discipline={active} onClose={() => setActive(null)} />
    </section>
  );
}
