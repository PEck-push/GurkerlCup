'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGcConfig, useGcScores, useGcTeams } from '@/lib/useRealtime';
import BeamerLogoLoop from './BeamerLogoLoop';
import BeamerCountdown from './BeamerCountdown';
import BeamerProgressGrid from './BeamerProgressGrid';

/**
 * Zentrale Beamer-Bühne: wählt die Szene anhand von gc_config (Realtime).
 * Reveal / Phase B / Podest / Spritzer werden in Task #8 ergänzt.
 */
export default function BeamerStage() {
  const { config } = useGcConfig();
  const { data: teams } = useGcTeams();
  const { data: scores } = useGcScores();
  const [rotIdx, setRotIdx] = useState(0);

  const rotating = config?.beamer_rotation === 'auto' && (config.phase === 'setup' || config.phase === 'phase_a');

  useEffect(() => {
    if (!rotating) return;
    const id = setInterval(() => setRotIdx((i) => i + 1), 12000);
    return () => clearInterval(id);
  }, [rotating]);

  const sceneKey = useMemo(() => {
    if (!config) return 'loading';
    if (config.phase === 'setup' || config.phase === 'phase_a') {
      if (config.beamer_rotation === 'logo') return 'logo';
      if (config.beamer_rotation === 'progress') return 'progress';
      if (config.beamer_rotation === 'countdown') return 'countdown';
      // auto
      const scenes = ['logo', 'progress', ...(config.countdown_target ? ['countdown'] : [])];
      return scenes[rotIdx % scenes.length];
    }
    return config.phase; // opening | reveal | phase_b | podium
  }, [config, rotIdx]);

  if (!config) {
    return <div className="w-full h-full flex items-center justify-center text-white/30 font-nunito">Lädt…</div>;
  }

  function renderScene() {
    switch (sceneKey) {
      case 'logo':
        return <BeamerLogoLoop />;
      case 'progress':
        return <BeamerProgressGrid teams={teams} scores={scores} />;
      case 'countdown':
        return <BeamerCountdown target={config!.countdown_target} />;
      // Platzhalter bis Task #8:
      case 'opening':
      case 'reveal':
      case 'phase_b':
      case 'podium':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <p className="font-fredoka font-700 text-white/40 text-4xl">
              {sceneKey} – Szene folgt …
            </p>
          </div>
        );
      default:
        return <BeamerLogoLoop />;
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sceneKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0"
      >
        {renderScene()}
      </motion.div>
    </AnimatePresence>
  );
}
