'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { SCORED_DISCIPLINE_IDS, SCORING_META, getDiscipline } from '@/lib/disciplines';
import { SPRITZER_ID, type GcScore } from '@/lib/tournamentTypes';
import { formatSeconds } from '@/lib/timeFormat';
import { useGcScores, useGcTeams } from '@/lib/useRealtime';

export default function TeamSelfView() {
  const params = useParams<{ code: string }>();
  const code = (params?.code ?? '').toString();

  const { data: teams, loading: teamsLoading } = useGcTeams();
  const { data: scores } = useGcScores();

  const team = useMemo(
    () => teams.find((t) => t.self_code?.toLowerCase() === code.toLowerCase()),
    [teams, code]
  );

  const myScores = useMemo(
    () => (team ? scores.filter((s) => s.team_id === team.id) : []),
    [scores, team]
  );

  function valueLabel(disciplineId: string, s?: GcScore): string {
    const meta = SCORING_META[disciplineId];
    if (!s || (s.raw_value == null && s.manual_rank == null)) return '—';
    if (disciplineId === SPRITZER_ID) return `${s.raw_value} m`;
    if (meta?.inputMode === 'elimination') return s.manual_rank ? `Platz ${s.manual_rank}` : '—';
    if (meta?.inputMode === 'time') return formatSeconds(s.raw_value);
    return `${s.raw_value} ${meta?.inputUnit ?? ''}`.trim();
  }

  if (teamsLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A1A0C]">
        <div className="font-nunito text-white/40 text-sm animate-pulse">Lädt…</div>
      </main>
    );
  }

  if (!team) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#0A1A0C] px-6 text-center">
        <div className="text-5xl mb-4">🥒❓</div>
        <h1 className="font-fredoka font-700 text-2xl text-white mb-2">Team nicht gefunden</h1>
        <p className="font-nunito text-sm text-white/50">
          Der Code <span className="font-bebas tracking-widest text-white">{code}</span> gehört zu keinem Team.
        </p>
      </main>
    );
  }

  const stationIds = [...SCORED_DISCIPLINE_IDS, SPRITZER_ID];
  const sFor = (id: string) => myScores.find((s) => s.discipline_id === id);

  return (
    <main className="min-h-screen bg-[#0A1A0C] px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Team-Kopf */}
        <div
          className="rounded-3xl p-6 mb-6 text-center"
          style={{ background: `${team.color}14`, border: `2px solid ${team.color}` }}
        >
          <div className="text-6xl mb-2">{team.emoji}</div>
          <p className="font-bebas tracking-[0.2em] text-sm" style={{ color: team.color }}>
            STARTNUMMER {team.start_number}
          </p>
          <h1 className="font-fredoka font-700 text-3xl text-white">{team.team_name}</h1>
        </div>

        <p className="font-nunito text-sm text-white/50 text-center mb-4">
          Deine Stationsergebnisse – live aktualisiert. Die Gesamtwertung gibt&apos;s beim großen Reveal! 🤫
        </p>

        {/* Stationen */}
        <div className="space-y-2">
          {stationIds.map((id) => {
            const disc = id === SPRITZER_ID ? null : getDiscipline(id);
            const s = sFor(id);
            const done = s?.finished;
            const label = id === SPRITZER_ID ? 'Spritzerwertung' : disc?.name;
            const emoji = id === SPRITZER_ID ? '🍷' : disc?.emoji;
            const cat = id === SPRITZER_ID ? 'Sonderwertung' : disc?.category;
            return (
              <div
                key={id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">{emoji}</span>
                  <div className="min-w-0">
                    <p className="font-fredoka font-600 text-white truncate">{label}</p>
                    <p className="font-nunito text-xs text-white/40">{cat}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {done && <span className="text-[#52B788] text-sm" title="erledigt">✓</span>}
                  <span className="font-bebas text-xl text-white whitespace-nowrap">
                    {valueLabel(id, s)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Karten-Hinweis */}
        {(team.card_double_used || team.card_second_used) && (
          <div className="mt-5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 py-3">
            <p className="font-bebas text-xs tracking-[0.15em] text-[#F0CE67] mb-1">🃏 EINGESETZTE KARTEN</p>
            <ul className="font-nunito text-sm text-white/70 space-y-0.5">
              {team.card_double_used && (
                <li>Doppel Gurkerl: {getDiscipline(team.card_double_used)?.name ?? team.card_double_used}</li>
              )}
              {team.card_second_used && (
                <li>2nd Chance: {getDiscipline(team.card_second_used)?.name ?? team.card_second_used}</li>
              )}
            </ul>
          </div>
        )}

        <p className="font-nunito text-xs text-white/20 mt-8 text-center">Gurkerl Cup 2026 🥒</p>
      </div>
    </main>
  );
}
