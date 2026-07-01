'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { chunky, COMIC_OUTLINE } from '@/lib/comicStyles';

/** Großer Countdown im Cartoon-Look (Outline-Zahlen, Sticker-Label). */
export default function BeamerCountdown({ target }: { target: string | null }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null; // erster Frame: vermeidet SSR/Client-Mismatch

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
    <div className="w-full h-full flex flex-col items-center justify-center gap-[3vh] px-[4vw]">
      <motion.div
        initial={{ rotate: -3, scale: 0.9 }}
        animate={{ rotate: -2, scale: 1 }}
        className="px-9 py-2 rounded-2xl"
        style={{ background: over ? 'linear-gradient(120deg,#EF4444,#fb7185)' : 'linear-gradient(120deg,#52B788,#9be7c4)', boxShadow: `0 0 0 5px ${COMIC_OUTLINE}` }}
      >
        <span className="font-fredoka font-700" style={chunky('min(3vw,1.9rem)', COMIC_OUTLINE, 0)}>
          {over ? 'PHASE A BEENDET' : 'PHASE A ENDET IN'}
        </span>
      </motion.div>

      <motion.div
        animate={over ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="font-fredoka font-700 tabular-nums whitespace-nowrap max-w-full"
        style={chunky('min(17vw, 19rem)', over ? '#EF4444' : '#F0CE67', 16)}
      >
        {h > 0 ? `${pad(h)}:` : ''}{pad(m)}:{pad(s)}
      </motion.div>

      {over && (
        <p className="font-fredoka font-700 text-white" style={{ fontSize: 'min(4vw,2.4rem)', ...chunky('min(4vw,2.4rem)', '#fff', 4) }}>
          Keine Nachzügler!
        </p>
      )}
    </div>
  );
}
