'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { Discipline } from '@/lib/disciplines';

interface Props {
  discipline: Discipline | null;
  onClose: () => void;
}

const variantColors: Record<string, string> = {
  gold: 'text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10',
  green: 'text-[#52B788] border-[#52B788]/30 bg-[#52B788]/10',
  orange: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  red: 'text-red-400 border-red-400/30 bg-red-400/10',
};

export default function DisciplineModal({ discipline, onClose }: Props) {
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    setImgErr(false); // reset fallback when a new discipline opens
    if (discipline) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [discipline]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const colorClass = discipline ? variantColors[discipline.categoryVariant] : variantColors.green;

  return (
    <AnimatePresence>
      {discipline && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md pointer-events-auto rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${discipline.bgFrom}, ${discipline.bgTo})`,
                border: '1px solid rgba(45,106,79,0.4)',
                boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 40px ${discipline.glowColor}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/50 transition-all"
                aria-label="Schließen"
              >
                ✕
              </button>

              {/* Image / emoji area */}
              <div className="relative h-56 flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `radial-gradient(ellipse at 50% 60%, ${discipline.glowColor}, transparent 70%)`,
                  }}
                />
                {discipline.image && !imgErr ? (
                  <div className="relative w-48 h-48 z-10">
                    <Image
                      src={discipline.image}
                      alt={discipline.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      onError={() => setImgErr(true)}
                    />
                  </div>
                ) : (
                  <div className="text-8xl z-10 select-none drop-shadow-2xl filter saturate-150">
                    {discipline.emoji}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 pt-4">
                {/* Category + badge */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`font-bebas text-xs tracking-[0.2em] px-3 py-1 rounded-full border ${colorClass}`}
                  >
                    {discipline.category}
                  </span>
                  {discipline.badge && (
                    <span className="font-bebas text-xs tracking-[0.15em] px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
                      {discipline.badge}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h2 className="font-fredoka font-700 text-2xl text-white mb-1">
                  {discipline.name}
                </h2>
                {discipline.subtitle && (
                  <p className="font-nunito text-sm text-[#52B788]/70 mb-3">{discipline.subtitle}</p>
                )}

                {/* Teaser */}
                <p className="font-nunito text-[#F5F0E8]/80 text-sm leading-relaxed mb-5">
                  {discipline.teaser}
                </p>

                {/* Info chips */}
                <div className="flex gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-base">⏱</span>
                    <div>
                      <p className="font-bebas text-xs text-[#52B788]/60 tracking-widest">ZEIT</p>
                      <p className="font-fredoka font-500 text-sm text-white">{discipline.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-base">🏆</span>
                    <div>
                      <p className="font-bebas text-xs text-[#52B788]/60 tracking-widest">WERTUNG</p>
                      <p className="font-fredoka font-500 text-sm text-white">{discipline.scoring}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
