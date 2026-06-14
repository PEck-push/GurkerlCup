'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import DisciplineCard from './DisciplineCard';
import DisciplineModal from './DisciplineModal';
import { disciplines, type Discipline } from '@/lib/disciplines';

const CARD_W = 260;
const CARD_GAP = 24;
const SIDE_PADDING = 80;

export default function DisciplinesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(1440);
  const [activeMobile, setActiveMobile] = useState<Discipline | null>(null);

  useEffect(() => {
    const update = () => setViewportW(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const totalTrackW = disciplines.length * (CARD_W + CARD_GAP) - CARD_GAP;
  const startX = (viewportW - CARD_W) / 2;
  const endX = startX - (totalTrackW - CARD_W);

  const x = useTransform(scrollYProgress, [0, 1], [startX, endX]);

  // Progress indicator
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const SECTION_HEIGHT = `${disciplines.length * 120 + 200}vh`;

  return (
    <section id="disziplinen">
      {/* ─── Desktop: sticky scroll showcase ─── */}
      <div
        ref={sectionRef}
        className="relative hidden md:block"
        style={{ height: SECTION_HEIGHT }}
      >
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 pt-16 pb-10 px-16 flex items-end justify-between">
            <div>
              <p className="font-bebas text-xs tracking-[0.3em] text-[#52B788]/60 mb-2">
                WAS EUCH ERWARTET
              </p>
              <h2 className="font-fredoka font-700 text-5xl text-white">
                Die{' '}
                <span className="text-gold-gradient font-pacifico font-400 text-6xl">
                  Disziplinen
                </span>
              </h2>
            </div>
            <p className="font-nunito text-sm text-white/40 max-w-xs text-right">
              Scrolle, um alle 10 Herausforderungen zu entdecken.
              <br />
              Klicke auf eine Karte für Details.
            </p>
          </div>

          {/* Cards track */}
          <div className="flex-1 flex items-center overflow-hidden perspective-container">
            <motion.div
              className="flex items-center"
              style={{ x, gap: CARD_GAP }}
            >
              {disciplines.map((disc, i) => (
                <DisciplineCard
                  key={disc.id}
                  discipline={disc}
                  index={i}
                  totalCards={disciplines.length}
                  scrollProgress={scrollYProgress}
                />
              ))}
            </motion.div>
          </div>

          {/* Progress bar + counter */}
          <div className="flex-shrink-0 pb-10 px-16 flex items-center gap-5">
            <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#2D6A4F] via-[#D4AF37] to-[#D4AF37]"
                style={{ width: progressWidth }}
              />
            </div>
            <motion.p
              className="font-bebas text-sm text-white/40 tracking-widest w-16 text-right"
            >
              {disciplines.length} / {disciplines.length}
            </motion.p>
          </div>
        </div>
      </div>

      {/* ─── Mobile: native snap carousel ─── */}
      <div className="md:hidden py-16">
        <div className="px-6 mb-10">
          <p className="font-bebas text-xs tracking-[0.3em] text-[#52B788]/60 mb-2">
            WAS EUCH ERWARTET
          </p>
          <h2 className="font-fredoka font-700 text-4xl text-white">
            Die{' '}
            <span className="text-gold-gradient font-pacifico font-400 text-4xl">
              Disziplinen
            </span>
          </h2>
          <p className="font-nunito text-sm text-white/40 mt-2">
            Wische, um alle Herausforderungen zu sehen.
          </p>
        </div>

        {/* Snap scroll container */}
        <div className="snap-scroll-container">
          {disciplines.map((disc, i) => (
            <MobileCard
              key={disc.id}
              discipline={disc}
              index={i}
              onOpen={() => setActiveMobile(disc)}
            />
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-5">
          {disciplines.map((d, i) => (
            <div
              key={d.id}
              className="w-1.5 h-1.5 rounded-full bg-white/20"
            />
          ))}
        </div>
      </div>

      <DisciplineModal discipline={activeMobile} onClose={() => setActiveMobile(null)} />
    </section>
  );
}

function MobileCard({
  discipline,
  index,
  onOpen,
}: {
  discipline: Discipline;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const badgeText = discipline.categoryVariant === 'gold' ? 'text-[#D4AF37]' : 'text-[#52B788]';

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.intersectionRatio > 0.6),
      { threshold: [0.6] }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="snap-scroll-item"
      style={{ width: '78vw', maxWidth: 300 }}
    >
      <motion.div
        animate={{
          rotateY: active ? 0 : index % 2 === 0 ? 8 : -8,
          scale: active ? 1 : 0.92,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={onOpen}
        className="cursor-pointer"
        style={{ transformOrigin: 'center center' }}
      >
        <div
          className="discipline-card rounded-2xl overflow-hidden"
          style={{
            height: 360,
            background: `linear-gradient(160deg, ${discipline.bgFrom} 0%, ${discipline.bgTo} 100%)`,
          }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(ellipse at 50% 80%, ${discipline.glowColor}, transparent 65%)`,
              opacity: 0.2,
            }}
          />

          {/* Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className={`font-bebas text-[10px] tracking-[0.18em] ${badgeText}`}>
              {discipline.category}
            </span>
          </div>

          {/* Emoji / Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            {discipline.image ? (
              <div className="relative w-44 h-44">
                <img
                  src={discipline.image}
                  alt={discipline.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            ) : (
              <div className="text-[80px] select-none" style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))' }}>
                {discipline.emoji}
              </div>
            )}
          </div>

          {/* Bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 p-5"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
            }}
          >
            <p className="font-fredoka font-700 text-white text-lg">{discipline.name}</p>
            <p className="font-nunito text-xs text-white/40 mt-1">Tippe für Details →</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
