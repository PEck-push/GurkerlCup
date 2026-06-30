'use client';

import { useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { liveStandings } from '@/lib/scoring';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';
import { playFanfare } from '@/lib/sounds';
import LeaderboardView, { type LbEntry } from './LeaderboardView';

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

  useEffect(() => {
    if (goldTie) return;
    const t = setTimeout(() => {
      playFanfare();
      const end = Date.now() + 2800;
      const frame = () => {
        confetti({ particleCount: 6, angle: 60, spread: 65, origin: { x: 0 }, colors: ['#D4AF37', '#F0CE67', '#52B788'] });
        confetti({ particleCount: 6, angle: 120, spread: 65, origin: { x: 1 }, colors: ['#D4AF37', '#F0CE67', '#52B788'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }, 700);
    return () => clearTimeout(t);
  }, [goldTie]);

  const entries: LbEntry[] = standings.rows.map((r) => ({
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
      <LeaderboardView entries={entries} unit="Pkt" title="Sieger" />
    </div>
  );
}
