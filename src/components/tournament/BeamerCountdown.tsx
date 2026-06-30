'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/** Großer Countdown bis zum Ziel (z.B. Deadline 19:30). */
export default function BeamerCountdown({ target }: { target: string | null }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  if (!target) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="font-nunito text-white/40 text-2xl">Kein Countdown-Ziel gesetzt.</p>
      </div>
    );
  }

  const diff = new Date(target).getTime() - now;
  const over = diff <= 0;
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  const s = Math.floor((abs % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="font-bebas tracking-[0.3em] text-[#52B788] text-3xl mb-6">
        {over ? 'PHASE A BEENDET' : 'PHASE A ENDET IN'}
      </p>
      <motion.div
        key={over ? 'over' : 'run'}
        animate={over ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="font-bebas tabular-nums leading-none"
        style={{
          fontSize: 'min(28vw, 22rem)',
          color: over ? '#EF4444' : '#D4AF37',
          textShadow: '0 0 60px rgba(212,175,55,0.4)',
        }}
      >
        {h > 0 ? `${pad(h)}:` : ''}
        {pad(m)}:{pad(s)}
      </motion.div>
      {over && (
        <p className="font-fredoka font-700 text-white/80 text-3xl mt-6">Keine Nachzügler!</p>
      )}
    </div>
  );
}
