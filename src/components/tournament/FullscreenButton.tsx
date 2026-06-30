'use client';

import { useEffect, useState } from 'react';

/** Vollbild-Umschalter für den Beamer. */
export default function FullscreenButton() {
  const [fs, setFs] = useState(false);

  useEffect(() => {
    const handler = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  async function toggle() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-[68px] z-50 h-11 px-3 rounded-full bg-black/40 border border-white/15 backdrop-blur flex items-center gap-2 hover:bg-black/60 transition-all"
      title={fs ? 'Vollbild beenden' : 'Vollbild'}
    >
      <span className="text-lg leading-none">{fs ? '⤡' : '⛶'}</span>
      <span className="font-nunito text-xs text-white/70 hidden sm:inline">
        {fs ? 'Beenden' : 'Vollbild'}
      </span>
    </button>
  );
}
