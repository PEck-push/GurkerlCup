'use client';

import { useMemo, useState } from 'react';
import type { GcScore, GcTeam } from '@/lib/tournamentTypes';
import { getDiscipline, SCORING_META } from '@/lib/disciplines';
import { saveScore } from '@/lib/offlineQueue';
import TeamBadge from '../admin/TeamBadge';

const DISCIPLINE_ID = 'riesen-ringerl';
type Round = 1 | 2 | 3;

function roundField(round: Round): 'p1' | 'p2' | 'p3' {
  return round === 1 ? 'p1' : round === 2 ? 'p2' : 'p3';
}
function roundValue(s: GcScore | undefined, round: Round): number | null {
  if (!s) return null;
  return (round === 1 ? s.p1 : round === 2 ? s.p2 : s.p3) ?? null;
}

/**
 * Riesen-Ringerl: 3 Durchgänge, je Durchgang Teams in der Reihenfolge ihres
 * Ausscheidens antippen (Erster Ausgeschiedener = letzter Platz). Die
 * Durchgangs-Plätze landen in p1/p2/p3; die Scoring-Engine bildet daraus den
 * Durchschnitts-Platz für die Punktevergabe.
 */
export default function EliminationInput({
  teams,
  scores,
  onBack,
  onMutate,
}: {
  teams: GcTeam[];
  scores: GcScore[];
  onBack: () => void;
  onMutate?: () => void;
}) {
  const disc = getDiscipline(DISCIPLINE_ID);
  const rounds = SCORING_META[DISCIPLINE_ID]?.roundsAveraged ?? 3;
  const [round, setRound] = useState<Round>(1);
  const [busy, setBusy] = useState<string | null>(null);

  const scoreByTeam = new Map<string, GcScore>();
  for (const s of scores) {
    if (s.discipline_id === DISCIPLINE_ID) scoreByTeam.set(s.team_id, s);
  }

  const rankOf = new Map<string, number>();
  for (const t of teams) {
    const v = roundValue(scoreByTeam.get(t.id), round);
    if (v != null) rankOf.set(t.id, v);
  }

  const placed = teams
    .filter((t) => rankOf.has(t.id))
    .sort((a, b) => (rankOf.get(a.id)! - rankOf.get(b.id)!)); // 1. Platz oben
  const stillIn = teams.filter((t) => !rankOf.has(t.id));
  const nextRank = teams.length - placed.length; // Platz, den der nächste Ausgeschiedene bekommt

  const summary = useMemo(() => {
    return teams
      .map((t) => {
        const s = scoreByTeam.get(t.id);
        const vals = [1, 2, 3].slice(0, rounds).map((r) => roundValue(s, r as Round));
        const present = vals.filter((v): v is number => v != null);
        const avg = present.length ? present.reduce((a, b) => a + b, 0) / present.length : null;
        return { team: t, vals, avg, doneCount: present.length };
      })
      .filter((r) => r.doneCount > 0)
      .sort((a, b) => (a.avg ?? 999) - (b.avg ?? 999));
  }, [teams, scoreByTeam, rounds]);

  async function eliminate(team: GcTeam) {
    setBusy(team.id);
    await saveScore({ team_id: team.id, discipline_id: DISCIPLINE_ID, [roundField(round)]: nextRank });
    onMutate?.();
    setBusy(null);
  }

  async function undoLast() {
    // zuletzt ausgeschieden = kleinster Rang unter den platzierten (dieser Runde)
    const last = placed.reduce<GcTeam | null>((acc, t) => {
      if (!acc) return t;
      return rankOf.get(t.id)! < rankOf.get(acc.id)! ? t : acc;
    }, null);
    if (!last) return;
    setBusy(last.id);
    await saveScore({ team_id: last.id, discipline_id: DISCIPLINE_ID, [roundField(round)]: null });
    onMutate?.();
    setBusy(null);
  }

  async function resetAll() {
    setBusy('reset');
    for (const t of placed) {
      await saveScore({ team_id: t.id, discipline_id: DISCIPLINE_ID, [roundField(round)]: null });
    }
    onMutate?.();
    setBusy(null);
  }

  const lastOneLeft = stillIn.length === 1;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="font-nunito text-sm text-[#52B788] hover:text-white">
        ← Zurück
      </button>

      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{disc?.emoji}</span>
          <p className="font-bebas text-xs tracking-[0.2em] text-[#FB923C]">{disc?.category}</p>
        </div>
        <h2 className="font-fredoka font-700 text-2xl text-white">{disc?.name}</h2>
        <p className="font-nunito text-sm text-white/50 mt-1">
          Runde {round}: Teams beim Ausscheiden antippen. Nächster bekommt{' '}
          <b className="text-white">Platz {nextRank}</b>.
        </p>
      </div>

      {/* Runden-Auswahl */}
      <div className="flex gap-2">
        {Array.from({ length: rounds }, (_, i) => (i + 1) as Round).map((r) => (
          <button
            key={r}
            onClick={() => setRound(r)}
            className={`flex-1 rounded-xl border py-2.5 font-bebas text-sm tracking-wide transition-all ${
              round === r
                ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#F0CE67]'
                : 'border-[#1E4028] text-white/60 hover:text-white'
            }`}
          >
            RUNDE {r}
          </button>
        ))}
      </div>

      {/* Noch im Spiel */}
      <div>
        <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788] mb-3">
          NOCH IM SPIEL ({stillIn.length})
        </h3>
        {stillIn.length === 0 ? (
          <p className="font-nunito text-white/40 text-sm">Alle platziert. 🏆</p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {stillIn.map((t) => (
              <button
                key={t.id}
                onClick={() => eliminate(t)}
                disabled={busy === t.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all disabled:opacity-50 ${
                  lastOneLeft
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-[#1E4028] bg-[#0F1A0D] hover:border-red-500/50'
                }`}
              >
                <TeamBadge color={t.color} emoji={t.emoji} name={t.team_name} startNumber={t.start_number} />
                <span
                  className={`font-bebas text-sm tracking-wide whitespace-nowrap ${
                    lastOneLeft ? 'text-[#F0CE67]' : 'text-red-400/80'
                  }`}
                >
                  {lastOneLeft ? '👑 Platz 1' : `→ Platz ${nextRank}`}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Platziert */}
      {placed.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788]">
              PLATZIERT ({placed.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={undoLast}
                disabled={!!busy}
                className="font-nunito text-xs text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-full px-3 py-1.5"
              >
                ↶ Letzte rückgängig
              </button>
              <button
                onClick={resetAll}
                disabled={!!busy}
                className="font-nunito text-xs text-red-400/70 hover:text-red-400 border border-red-500/20 hover:border-red-500/50 rounded-full px-3 py-1.5"
              >
                Alle zurücksetzen
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {placed.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-3"
              >
                <TeamBadge color={t.color} emoji={t.emoji} name={t.team_name} startNumber={t.start_number} />
                <span className="font-bebas text-xl text-[#D4AF37] whitespace-nowrap">
                  Platz {rankOf.get(t.id)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Durchschnitt über alle Runden */}
      {summary.length > 0 && (
        <div>
          <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788] mb-3">
            Ø ÜBER ALLE RUNDEN ({summary.filter((r) => r.doneCount === rounds).length}/{teams.length} komplett)
          </h3>
          <div className="space-y-1.5">
            {summary.map(({ team: t, vals, avg, doneCount }) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-2.5"
              >
                <TeamBadge color={t.color} emoji={t.emoji} name={t.team_name} startNumber={t.start_number} />
                <span className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-nunito text-xs text-white/40 whitespace-nowrap">
                    {vals.map((v, i) => (
                      <span key={i} className="inline-block w-6 text-center">
                        {v ?? '–'}
                      </span>
                    ))}
                  </span>
                  <span
                    className={`font-bebas text-lg whitespace-nowrap ${
                      doneCount === rounds ? 'text-[#F0CE67]' : 'text-white/40'
                    }`}
                  >
                    Ø {avg != null ? avg.toFixed(2) : '–'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
