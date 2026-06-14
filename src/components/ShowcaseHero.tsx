'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
  const [logoErr, setLogoErr] = useState(false);

  return (
    <section
      id="disziplinen"
      className="relative min-h-screen flex flex-col overflow-hidden pt-20 md:pt-24 pb-10"
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

          {/* headline – logo image primary, text fallback */}
          {!logoErr && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[408px] md:w-[525px] lg:w-[650px] h-48 md:h-64 lg:h-80 mx-auto mb-1 md:mb-0"
            >
              <Image
                src="/images/gurkerlcup.webp"
                alt="Gurkerl Cup 2026"
                fill
                className="object-contain"
                priority
                onError={() => setLogoErr(true)}
              />
            </motion.div>
          )}
          <h1 className={`text-shadow-glow${!logoErr ? ' sr-only' : ''}`}>
            <motion.span
              custom={0}
              variants={word}
              initial="hidden"
              animate={logoErr ? 'show' : 'hidden'}
              className="block font-pacifico text-5xl md:text-7xl lg:text-8xl text-gold-gradient leading-[1.05]"
            >
              Gurkerl Cup
            </motion.span>
            <motion.span
              custom={1}
              variants={word}
              initial="hidden"
              animate={logoErr ? 'show' : 'hidden'}
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
            className="font-nunito text-sm md:text-lg text-white/55 max-w-xl mx-auto mt-4 md:mt-8 mb-2 md:mb-4"
          >
            10 Disziplinen. 3er-Teams.{' '}
            <span className="text-[#F0CE67] font-700">Ein Sieger.</span>
          </motion.p>
        </div>

        {/* Coverflow */}
        <div className="flex-1 flex items-center justify-center mt-2">
          <CoverflowCarousel disciplines={disciplines} onOpen={setActive} entranceDelay={0.55} />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex justify-center pb-10 md:pb-12 mt-6 md:mt-4"
        >
          <a
            href="#anmeldung"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('anmeldung')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bebas text-lg tracking-[0.15em] text-[#0A1F12] transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #F0CE67)',
              boxShadow: '0 8px 32px rgba(212,175,55,0.35)',
            }}
          >
            Jetzt anmelden
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>

      <DisciplineModal discipline={active} onClose={() => setActive(null)} />
    </section>
  );
}
