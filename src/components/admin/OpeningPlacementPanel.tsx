'use client';

import { useState } from 'react';
import type { GcScore, GcTeam } from '@/lib/tournamentTypes';
import { getDiscipline } from '@/lib/disciplines';
import { saveScore } from '@/lib/offlineQueue';
import TeamBadge from './TeamBadge';

const DISCIPLINE_ID = 'mutter-stapeln';

/**
 * Auftakt „Bleib ruhig!": Teams sprinten zur Station, ziehen ein Fähnchen mit
 * ihrer Platzierung und melden sich bei der Turnierleitung. Die Reihenfolge
 * der Meldung entspricht nicht zwingend der Platz-Reihenfolge – deshalb wird
 * hier ein konkreter Platz pro Team gewählt, statt nur „nächster dran".
 */
export default function OpeningPlacementPanel({
  teams,
  scores,
  onMutate,
}: {
  teams: GcTeam[];
  scores: GcScore[];
  onMutate?: () => void;
}) {
  const disc = getDiscipline(DISCIPLINE_ID);
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const rankOf = new Map<string, number>();
  for (const s of scores) {
    if (s.discipline_id === DISCIPLINE_ID && s.manual_rank != null) rankOf.set(s.team_id, s.manual_rank);
  }
  const usedRanks = new Set(rankOf.values());

  const placed = teams
    .filter((t) => rankOf.has(t.id))
    .sort((a, b) => rankOf.get(a.id)! - rankOf.get(b.id)!);
  const unplaced = teams.filter((t) => !rankOf.has(t.id));

  async function assign(teamId: string, place: number) {
    setBusy(teamId);
    await saveScore({ team_id: teamId, discipline_id: DISCIPLINE_ID, manual_rank: place, finished: true });
    onMutate?.();
    setBusy(null);
    setPickerFor(null);
  }

  async function clear(teamId: string) {
    setBusy(teamId);
    await saveScore({ team_id: teamId, discipline_id: DISCIPLINE_ID, manual_rank: null, finished: false });
    onMutate?.();
    setBusy(null);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{disc?.emoji}</span>
          <p className="font-bebas text-xs tracking-[0.2em] text-[#D4AF37]">{disc?.category}</p>
        </div>
        <h2 className="font-fredoka font-700 text-2xl text-white">{disc?.name}</h2>
        <p className="font-nunito text-sm text-white/50 mt-1">
          Team meldet sich mit der gezogenen Zahl → Team antippen → gemeldeten Platz auswählen.
        </p>
        <p className="font-nunito text-xs text-white/40 mt-2">
          {placed.length} / {teams.length} gemeldet
        </p>
      </div>

      {/* Noch nicht gemeldet */}
      <div>
        <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788] mb-3">
          NOCH NICHT GEMELDET ({unplaced.length})
        </h3>
        {unplaced.length === 0 ? (
          <p className="font-nunito text-white/40 text-sm">Alle Teams gemeldet. 🏁</p>
        ) : (
          <div className="space-y-2">
            {unplaced.map((t) => (
              <div key={t.id} className="rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-3">
                <button
                  onClick={() => setPickerFor(pickerFor === t.id ? null : t.id)}
                  className="w-full flex items-center justify-between"
                >
                  <TeamBadge color={t.color} emoji={t.emoji} name={t.team_name} startNumber={t.start_number} />
                  <span className="font-nunito text-xs text-[#D4AF37] whitespace-nowrap">
                    {pickerFor === t.id ? 'Zuklappen ▲' : 'Platz eintragen ▼'}
                  </span>
                </button>
                {pickerFor === t.id && (
                  <div className="mt-3 pt-3 border-t border-[#1E4028]">
                    <p className="font-nunito text-xs text-white/40 mb-2">Gemeldeter Platz:</p>
                    <div className="grid grid-cols-5 gap-1.5">
                      {Array.from({ length: teams.length }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => assign(t.id, n)}
                          disabled={usedRanks.has(n) || busy === t.id}
                          className={`rounded-lg py-2 font-bebas text-sm border transition-all disabled:cursor-not-allowed ${
                            usedRanks.has(n)
                              ? 'border-white/5 text-white/15'
                              : 'border-[#1E4028] text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gemeldet */}
      {placed.length > 0 && (
        <div>
          <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788] mb-3">
            GEMELDET ({placed.length})
          </h3>
          <div className="space-y-2">
            {placed.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-3"
              >
                <TeamBadge color={t.color} emoji={t.emoji} name={t.team_name} startNumber={t.start_number} />
                <span className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-bebas text-xl text-[#D4AF37] whitespace-nowrap">
                    Platz {rankOf.get(t.id)}
                  </span>
                  <button
                    onClick={() => clear(t.id)}
                    disabled={busy === t.id}
                    className="font-nunito text-xs text-white/40 hover:text-red-400 disabled:opacity-50"
                  >
                    ✕
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
