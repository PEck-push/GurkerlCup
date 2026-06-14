'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  const scrollToAnmeldung = () => {
    document.getElementById('anmeldung')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDisziplinen = () => {
    document.getElementById('disziplinen')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden noise-overlay">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#0D2818]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(45,106,79,0.35)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(212,175,55,0.08)_0%,transparent_50%)]" />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? 'rgba(212,175,55,0.6)' : 'rgba(82,183,136,0.4)',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="animate-float mb-8"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 drop-shadow-[0_0_60px_rgba(212,175,55,0.3)]">
            <Image
              src="/images/logo.webp"
              alt="Gurkerl Cup 2026"
              fill
              className="object-contain"
              priority
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = 'none';
              }}
            />
            {/* Fallback logo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
              <span className="text-8xl md:text-9xl select-none">🥒</span>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-pacifico text-5xl md:text-7xl lg:text-8xl text-gold-gradient leading-none mb-3">
            Gurkerl Cup
          </h1>
          <p className="font-bebas text-4xl md:text-6xl text-white tracking-widest">2026</p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-fredoka text-lg md:text-xl text-[#52B788] tracking-wide mt-4 mb-10"
        >
          Fun Games Pöttsching · 18. Juli 2026 · ab 15:00 Uhr
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={scrollToAnmeldung}
            className="btn-gold px-10 py-4 rounded-full text-lg shadow-lg"
          >
            Jetzt anmelden →
          </button>
          <button
            onClick={scrollToDisziplinen}
            className="font-fredoka font-600 px-10 py-4 rounded-full text-lg border border-[rgba(82,183,136,0.4)] text-[#52B788] hover:border-[#52B788] hover:bg-[rgba(82,183,136,0.1)] transition-all duration-300"
          >
            Die Disziplinen
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex gap-8 md:gap-16 mt-14"
        >
          {[
            { num: '10', label: 'Disziplinen' },
            { num: '3', label: 'Spieler/Team' },
            { num: '1', label: 'Goldene Gurke' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <p className="font-bebas text-3xl md:text-4xl text-gold">{num}</p>
              <p className="font-nunito text-sm text-[#52B788]/70 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <p className="font-nunito text-xs text-[#2D6A4F] tracking-widest uppercase">Scroll</p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-[#2D6A4F] flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-[#2D6A4F]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
