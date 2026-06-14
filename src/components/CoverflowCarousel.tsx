'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import type { Discipline } from '@/lib/disciplines';

interface Props {
  disciplines: Discipline[];
  onOpen: (d: Discipline) => void;
  /** delay (s) before the assemble entrance starts */
  entranceDelay?: number;
}

const variantText: Record<string, string> = {
  gold: 'text-[#F0CE67]',
  green: 'text-[#52B788]',
  orange: 'text-orange-400',
  red: 'text-red-400',
};

interface Slot {
  x: number;
  y: number;
  scale: number;
  rotateY: number;
  z: number;
  opacity: number;
  blur: number;
  pointer: boolean;
}

function getSlot(offset: number, compact: boolean): Slot {
  const dir = Math.sign(offset);
  const a = Math.abs(offset);

  const X = compact ? [0, 126, 214] : [0, 286, 512];
  const Y = compact ? [-4, 14, 30] : [-34, 18, 50];
  const S = [1, 0.78, 0.6];
  const R = [0, 42, 50];
  const O = [1, 0.92, 0.5];
  const B = [0, 0.4, 2];

  if (a > 2) {
    return {
      x: dir * (compact ? 320 : 700),
      y: 64,
      scale: 0.46,
      rotateY: -dir * 54,
      z: 0,
      opacity: 0,
      blur: 6,
      pointer: false,
    };
  }
  return {
    x: dir * X[a],
    y: Y[a],
    scale: S[a],
    rotateY: -dir * R[a],
    z: 50 - a * 10,
    opacity: O[a],
    blur: B[a],
    pointer: true,
  };
}

export default function CoverflowCarousel({ disciplines, onOpen, entranceDelay = 0.5 }: Props) {
  const n = disciplines.length;
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(false);
  const [moving, setMoving] = useState(false);
  const movingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stageX = useMotionValue(0);
  const dragged = useRef(false);

  useEffect(() => {
    const update = () => setCompact(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const pulseMotion = useCallback(() => {
    setMoving(true);
    if (movingTimer.current) clearTimeout(movingTimer.current);
    movingTimer.current = setTimeout(() => setMoving(false), 260);
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      setActive(((idx % n) + n) % n);
      pulseMotion();
    },
    [n, pulseMotion]
  );
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const handleCardClick = (i: number) => {
    if (dragged.current) return;
    if (i === active) onOpen(disciplines[i]);
    else goTo(i);
  };

  const activeDisc = disciplines[active];

  return (
    <div className="w-full select-none-all">
      {/* Stage – Framer Motion drag handles all touch/pointer physics */}
      <motion.div
        initial={{ opacity: 0, y: 120, scale: 0.9, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, delay: entranceDelay, ease: [0.16, 1, 0.3, 1] }}
        className="relative coverflow-stage w-full"
        style={{ x: stageX, height: compact ? 295 : 480, touchAction: 'pan-y' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 340, bounceDamping: 34 }}
        onDragStart={() => { dragged.current = true; }}
        onDragEnd={(_, info) => {
          // FM auto-springs back to 0 via dragConstraints – no manual animate needed
          const swipeLeft  = info.offset.x < -35 || info.velocity.x < -400;
          const swipeRight = info.offset.x >  35 || info.velocity.x >  400;
          if (swipeLeft)  next();
          else if (swipeRight) prev();
          setTimeout(() => { dragged.current = false; }, 300);
        }}
      >
        {/* moving blur veil */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[60]"
          animate={{ opacity: moving ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            background:
              'linear-gradient(90deg, rgba(10,31,18,0.4) 0%, transparent 18%, transparent 82%, rgba(10,31,18,0.4) 100%)',
          }}
        />

        {disciplines.map((disc, i) => {
            let offset = i - active;
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;
            const slot = getSlot(offset, compact);
            const isCenter = offset === 0;
            const cardW = compact ? 174 : 276;
            const cardH = compact ? 254 : 396;

            return (
              <motion.div
                key={disc.id}
                className={`absolute left-1/2 top-1/2 ${isCenter ? 'cf-card-active' : ''}`}
                style={{
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  marginTop: -cardH / 2,
                  transformStyle: 'preserve-3d',
                  cursor: slot.pointer ? 'pointer' : 'default',
                  pointerEvents: slot.pointer ? 'auto' : 'none',
                }}
                initial={{ opacity: 0, x: 0, y: 80, scale: 0.7 }}
                animate={{
                  x: slot.x,
                  y: slot.y,
                  scale: slot.scale,
                  rotateY: slot.rotateY,
                  opacity: slot.opacity,
                  filter: `blur(${slot.blur}px)`,
                  zIndex: slot.z,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 30,
                  opacity: { duration: 0.4 },
                }}
                onClick={() => handleCardClick(i)}
              >
                <CardFace disc={disc} isCenter={isCenter} compact={compact} cardH={cardH} />
              </motion.div>
            );
          })}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: entranceDelay + 0.8, duration: 0.6 }}
        className="flex flex-col items-center gap-3 md:gap-5 mt-2 md:mt-4"
      >
        {/* active title + details – hidden on mobile, card footer already shows this */}
        <div className="hidden md:flex text-center min-h-[64px] flex-col items-center justify-center">
          <motion.div
            key={activeDisc.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p className={`font-bebas text-sm tracking-[0.25em] ${variantText[activeDisc.categoryVariant]}`}>
              {activeDisc.category}
            </p>
            <button
              onClick={() => onOpen(activeDisc)}
              className="font-fredoka font-700 text-2xl md:text-3xl text-white hover:text-gold-gradient transition-colors"
            >
              {activeDisc.name}
            </button>
          </motion.div>
        </div>

        {/* arrows + dots – hidden on mobile, swipe is the gesture */}
        <div className="hidden md:flex items-center gap-5">
          <button
            onClick={prev}
            aria-label="Vorherige Disziplin"
            className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:border-[#D4AF37]/50 transition-all hover:scale-110 active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {disciplines.map((d, i) => (
              <button
                key={d.id}
                onClick={() => goTo(i)}
                aria-label={`Gehe zu ${d.name}`}
                className="group p-1"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === active
                      ? 'w-6 h-1.5 bg-[#D4AF37]'
                      : 'w-1.5 h-1.5 bg-white/25 group-hover:bg-white/50'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Nächste Disziplin"
            className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:border-[#D4AF37]/50 transition-all hover:scale-110 active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p className="hidden md:block font-nunito text-xs text-white/30 text-center">
          Klicke eine Karte oder nutze die Pfeile · Karte in der Mitte öffnet die Details
        </p>
      </motion.div>
    </div>
  );
}

/* ─────────────── Card face ─────────────── */
function CardFace({
  disc,
  isCenter,
  compact,
  cardH,
}: {
  disc: Discipline;
  isCenter: boolean;
  compact: boolean;
  cardH: number;
}) {
  // Character dimensions relative to the card. Centered cards are larger and
  // positioned so the figure breaks above the card's top edge (pop-out effect).
  const imgH = isCenter ? cardH * 0.81 : cardH * 0.57;
  const bottomPct = isCenter ? 0.30 : 0.24; // higher = pops further out the top
  const extraOffsetY = disc.id === 'gurkerl-biathlon' ? 30 : 0; // landscape image needs downward nudge

  // Fall back to the emoji if the (optional) image is missing / fails to load.
  const [imgErr, setImgErr] = useState(false);
  const showImg = disc.image && !imgErr;

  return (
    <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
      {/* glass body */}
      <div
        className="cf-card-glass absolute inset-0 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${disc.bgFrom} 0%, ${disc.bgTo} 100%)`,
        }}
      >
        {/* inner glow */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 78%, ${disc.glowColor}, transparent 62%)`,
            opacity: isCenter ? 0.55 : 0.22,
          }}
        />
        {/* top sheen */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.06] to-transparent" />
        {/* badge */}
        {disc.badge && (
          <div className="absolute top-3.5 right-3.5 z-20">
            <span className="font-bebas text-[10px] tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F0CE67]">
              {disc.badge}
            </span>
          </div>
        )}
      </div>

      {/* character – breaks above the top edge when centered */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10 flex items-end justify-center"
        style={{
          bottom: `${bottomPct * 100}%`,
          height: imgH,
          width: imgH,
          transform: extraOffsetY ? `translateX(-50%) translateY(${extraOffsetY}px)` : undefined,
          transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {showImg ? (
          <Image
            src={disc.image as string}
            alt={disc.name}
            width={Math.round(imgH)}
            height={Math.round(imgH)}
            className="object-contain w-full h-full"
            style={{
              filter: `drop-shadow(0 18px 28px rgba(0,0,0,0.6))${isCenter ? ` drop-shadow(0 0 34px ${disc.glowColor})` : ''}`,
            }}
            draggable={false}
            unoptimized
            priority={isCenter}
            onError={() => setImgErr(true)}
          />
        ) : (
          <motion.div
            className="leading-none select-none"
            style={{
              fontSize: imgH * 0.78,
              filter: `drop-shadow(0 14px 22px rgba(0,0,0,0.55))${isCenter ? ` drop-shadow(0 0 28px ${disc.glowColor})` : ''}`,
            }}
            animate={isCenter ? { y: [0, -9, 0] } : { y: 0 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {disc.emoji}
          </motion.div>
        )}
      </div>

      {/* info footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-20 rounded-b-3xl"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 10%, rgba(0,0,0,0.55) 60%, transparent 100%)',
        }}
      >
        <p className={`font-bebas tracking-[0.18em] mb-0.5 ${variantText[disc.categoryVariant]} ${compact ? 'text-[10px]' : 'text-xs'}`}>
          {disc.category}
        </p>
        <p className={`font-fredoka font-700 text-white leading-tight ${compact ? 'text-base' : 'text-xl'}`}>
          {disc.name}
        </p>
        {disc.subtitle && !compact && (
          <p className="font-nunito text-xs text-white/45 mt-0.5">{disc.subtitle}</p>
        )}
      </div>
    </div>
  );
}
