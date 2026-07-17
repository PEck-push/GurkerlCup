'use client';

import { useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { liveStandings } from '@/lib/scoring';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';
import { playDrumroll, playFanfare } from '@/lib/sounds';
import LeaderboardView, { type LbEntry } from './LeaderboardView';

/**
 * Siegerehrung mit gesteuerter Enthüllung (config.reveal_step in Phase 'podium'):
 *  Stufe 0: Plätze 4+ sichtbar, Podium verdeckt · 1: +Platz 3 · 2: +Platz 2 ·
 *  Stufe 3: Sieger enthüllt + Konfetti/Fanfare. Steuerung im Admin → Steuerung.
 */
export default function Podium({
  teams,
  scores,
  config,
}: {
  teams: GcTeam[];
  scores: GcScore[];
  config: GcConfig;
}) {
  const active = useMemo(() => teams.filter((t) => t.checked_in), [teams]);
  const teamById = useMemo(() => new Map(active.map((t) => [t.id, t])), [active]);
  const standings = useMemo(
    () => liveStandings(active, scores, config.points_table),
    [active, scores, config.points_table]
  );
  const goldTie = standings.goldTie;
  const step = Math.max(0, Math.min(3, config.reveal_step));
  const done = step >= 3;

  useEffect(() => {
    if (step === 1 || step === 2) playDrumroll(1400);
  }, [step]);

  useEffect(() => {
    if (!done || goldTie) return;
    const t = setTimeout(() => {
      playFanfare();
      const end = Date.now() + 2800;
      const frame = () => {
        confetti({ particleCount: 6, angle: 60, spread: 65, origin: { x: 0 }, colors: ['#D4AF37', '#F0CE67', '#52B788'] });
        confetti({ particleCount: 6, angle: 120, spread: 65, origin: { x: 1 }, colors: ['#D4AF37', '#F0CE67', '#52B788'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }, 500);
    return () => clearTimeout(t);
  }, [done, goldTie]);

  // Verdeckte Podiumsplätze werden weggelassen → LeaderboardView zeigt dort '—'-Platzhalter.
  const revealedFromRank = 4 - step; // Stufe 0 → ab 4 sichtbar, 1 → ab 3, 2 → ab 2, 3 → alle
  const entries: LbEntry[] = standings.rows
    .filter((r) => r.finalRank >= revealedFromRank)
    .map((r) => ({
      team: teamById.get(r.teamId)!,
      rank: r.finalRank,
      value: String(r.total),
    }));

  return (
    <div className="relative w-full h-full">
      {goldTie && (
        <div className="absolute top-[2vh] left-1/2 -translate-x-1/2 z-20 rounded-full border border-[#D4AF37]/50 bg-[#0A1F12]/80 px-5 py-2">
          <p className="font-fredoka font-700 text-[#F0CE67] text-center" style={{ fontSize: 'min(2.4vw, 1.5rem)' }}>
            ⚔️ Stechen um Platz 1:{' '}
            {standings.goldTieTeamIds.map((id) => teamById.get(id)?.team_name).filter(Boolean).join(' & ')}
          </p>
        </div>
      )}
      {!done && !goldTie && (
        <div className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 z-20">
          <p
            className="font-bebas tracking-[0.3em] text-[#52B788] animate-pulse"
            style={{ fontSize: 'min(2vw, 1.2rem)' }}
          >
            {step === 0 ? 'GLEICH GEHTS LOS …' : step === 1 ? 'PLATZ 3 STEHT FEST …' : 'WER HOLT DIE GOLDENE GURKE?'}
          </p>
        </div>
      )}
      <LeaderboardView entries={entries} unit="Pkt" title="Sieger" />
    </div>
  );
}
