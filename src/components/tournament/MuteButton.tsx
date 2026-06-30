'use client';

import { useEffect, useState } from 'react';
import { isMuted, setMuted, unlockAudio } from '@/lib/sounds';

/** Globaler Stummschalter für den Beamer (oben rechts). */
export default function MuteButton() {
  const [muted, setM] = useState(false);

  useEffect(() => {
    setM(isMuted());
    unlockAudio();
  }, []);

  return (
    <button
      onClick={() => {
        const next = !muted;
        setMuted(next);
        setM(next);
      }}
      className="fixed top-4 right-4 z-50 w-11 h-11 rounded-full bg-black/40 border border-white/15 backdrop-blur flex items-center justify-center text-xl hover:bg-black/60 transition-all"
      title={muted ? 'Ton einschalten' : 'Ton ausschalten'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
