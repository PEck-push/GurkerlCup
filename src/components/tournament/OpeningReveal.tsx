'use client';

import { useMemo } from 'react';
import { rankDisciplines } from '@/lib/scoring';
import { formatSeconds } from '@/lib/timeFormat';
import type { GcConfig, GcScore, GcTeam } from '@/lib/tournamentTypes';
import LeaderboardView, { type LbEntry } from './LeaderboardView';

const OPENING_ID = 'mutter-stapeln';

export default function OpeningReveal({
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

  const entries: LbEntry[] = useMemo(() => {
    const ranked = rankDisciplines(active, scores, config.points_table, [OPENING_ID])[OPENING_ID] ?? [];
    return ranked
      .filter((x) => x.rank != null)
      .sort((a, b) => a.rank! - b.rank!)
      .map((r) => ({ team: teamById.get(r.teamId)!, rank: r.rank!, value: formatSeconds(r.rawValue) }))
      .filter((e) => e.team);
  }, [active, scores, config.points_table, teamById]);

  if (entries.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="font-fredoka font-700 text-white/40 text-3xl">Eröffnung läuft …</p>
      </div>
    );
  }

  return <LeaderboardView entries={entries} unit="" title="Bleib" accent="ruhig!" />;
}
