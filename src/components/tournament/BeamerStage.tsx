'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGcConfig, useGcScores, useGcTeams } from '@/lib/useRealtime';
import BeamerLogoLoop from './BeamerLogoLoop';
import BeamerCountdown from './BeamerCountdown';
import BeamerProgressGrid from './BeamerProgressGrid';
import OpeningReveal from './OpeningReveal';
import SlotMachineReveal from './SlotMachineReveal';
import PhaseBBars from './PhaseBBars';
import Podium from './Podium';
import SpritzerReveal from './SpritzerReveal';
import BeamerBackground from './BeamerBackground';

/** Zentrale Beamer-Bühne: wählt die Szene anhand von gc_config (Realtime). */
export default function BeamerStage() {
  const { config } = useGcConfig();
  const { data: teams } = useGcTeams();
  const { data: scores } = useGcScores();
  const [rotIdx, setRotIdx] = useState(0);

  const rotating =
    config?.beamer_rotation === 'auto' && (config.phase === 'setup' || config.phase === 'phase_a');
  const slideMs = Math.max(3, config?.slide_seconds ?? 12) * 1000;

  useEffect(() => {
    if (!rotating) return;
    const id = setInterval(() => setRotIdx((i) => i + 1), slideMs);
    return () => clearInterval(id);
  }, [rotating, slideMs]);

  const sceneKey = useMemo(() => {
    if (!config) return 'loading';
    if (config.phase === 'setup' || config.phase === 'phase_a') {
      // Feste Beamer-Ansicht (Pin) – inkl. Spritzer.
      if (config.beamer_rotation === 'logo') return 'logo';
      if (config.beamer_rotation === 'progress') return 'progress';
      if (config.beamer_rotation === 'countdown') return 'countdown';
      if (config.beamer_rotation === 'spritzer') return 'spritzer';
      // auto: rotiert durch alle aktiven Slides (Spritzer mit, wenn aktiviert)
      const scenes = [
        'logo',
        'progress',
        ...(config.countdown_target ? ['countdown'] : []),
        ...(config.spritzer_revealed ? ['spritzer'] : []),
      ];
      return scenes[rotIdx % scenes.length];
    }
    if (config.phase === 'opening') return config.opening_revealed ? 'opening' : 'logo';
    return config.phase; // reveal | phase_b | podium
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
      case 'opening':
        return <OpeningReveal teams={teams} scores={scores} config={config!} />;
      case 'reveal':
        return <SlotMachineReveal teams={teams} scores={scores} config={config!} />;
      case 'phase_b':
        return <PhaseBBars teams={teams} scores={scores} config={config!} />;
      case 'podium':
        return <Podium teams={teams} scores={scores} config={config!} />;
      case 'spritzer':
        return <SpritzerReveal teams={teams} scores={scores} />;
      default:
        return <BeamerLogoLoop />;
    }
  }

  // Spritzer kann in Reveal/Phase-B/Podest/Eröffnung als Overlay eingeblendet werden
  // (in Setup/Phase A läuft er stattdessen in der Rotation mit).
  const spritzerOverlay =
    config.spritzer_revealed &&
    (config.phase === 'reveal' || config.phase === 'phase_b' || config.phase === 'podium' || config.phase === 'opening');

  return (
    <>
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

      <AnimatePresence>
        {spritzerOverlay && (
          <motion.div
            key="spritzer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-40"
          >
            <BeamerBackground />
            <div className="absolute inset-0">
              <SpritzerReveal teams={teams} scores={scores} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
