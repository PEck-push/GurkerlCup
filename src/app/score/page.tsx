'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  disciplines,
  SCORING_META,
  disciplineIdsByPhase,
  getDiscipline,
} from '@/lib/disciplines';
import { SPRITZER_ID, type GcScore, type GcTeam } from '@/lib/tournamentTypes';
import { formatSeconds } from '@/lib/timeFormat';
import { useGcTeams, useGcScores, useGcConfig } from '@/lib/useRealtime';
import ScoreLogin from '@/components/score/ScoreLogin';
import OfflineBanner from '@/components/score/OfflineBanner';
import ScoreEntryForm from '@/components/score/ScoreEntryForm';
import EliminationInput from '@/components/score/EliminationInput';
import SpritzerEntry from '@/components/score/SpritzerEntry';
import TeamBadge from '@/components/admin/TeamBadge';

type View = 'pick' | 'teams' | 'entry' | 'elim' | 'spritzer';

const PHASE_LABEL: Record<string, string> = {
  setup: 'Setup',
  opening: 'Eröffnung',
  phase_a: 'Phase A',
  reveal: 'Zwischenstand',
  phase_b: 'Phase B – Finale',
  podium: 'Siegerehrung',
};

export default function ScorePage() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  const [view, setView] = useState<View>('pick');
  const [selDisc, setSelDisc] = useState<string | null>(null);
  const [selTeam, setSelTeam] = useState<GcTeam | null>(null);

  const { data: teams } = useGcTeams();
  const { data: scores, refetch: refetchScores } = useGcScores();
  const { config } = useGcConfig();

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/score/session');
      setAuthed(res.ok);
    } catch {
      setAuthed(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // gewählte Station auf dem Gerät merken
  useEffect(() => {
    if (selDisc) localStorage.setItem('gc_score_station', selDisc);
  }, [selDisc]);

  const activeTeams = useMemo(
    () => teams.filter((t) => t.checked_in).sort((a, b) => a.start_number - b.start_number),
    [teams]
  );

  const scoreFor = useCallback(
    (teamId: string, disciplineId: string): GcScore | undefined =>
      scores.find((s) => s.team_id === teamId && s.discipline_id === disciplineId),
    [scores]
  );

  function fmtValue(disciplineId: string, s?: GcScore): string {
    const meta = SCORING_META[disciplineId];
    if (!s) return '–';
    if (meta?.inputMode === 'elimination') return s.manual_rank ? `Platz ${s.manual_rank}` : '–';
    if (s.raw_value == null) return s.finished ? '✓' : '–';
    if (meta?.inputMode === 'time') return formatSeconds(s.raw_value);
    return `${s.raw_value} ${meta?.inputUnit ?? ''}`.trim();
  }

  function openDiscipline(id: string) {
    setSelDisc(id);
    const meta = SCORING_META[id];
    if (id === SPRITZER_ID) setView('spritzer');
    else if (meta?.inputMode === 'elimination') setView('elim');
    else setView('teams');
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A1A0C]">
        <div className="font-nunito text-white/40 text-sm animate-pulse">Lädt…</div>
      </main>
    );
  }
  if (!authed) return <ScoreLogin onSuccess={() => setAuthed(true)} />;

  return (
    <main className="min-h-screen bg-[#0A1A0C] px-4 py-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-fredoka font-700 text-xl text-white">
              Eingabe <span className="text-[#D4AF37]">🥒</span>
            </h1>
            {config && (
              <p className="font-bebas text-xs tracking-[0.15em] text-[#52B788]">
                AKTUELL: {PHASE_LABEL[config.phase] ?? config.phase}
              </p>
            )}
          </div>
          <span className="font-nunito text-xs text-white/40">{activeTeams.length} Teams</span>
        </div>

        <OfflineBanner />

        {activeTeams.length === 0 && view === 'pick' && (
          <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 py-3 mb-4">
            <p className="font-nunito text-sm text-[#F0CE67]">
              Noch keine Teams eingecheckt. Bitte zuerst im Admin-Bereich einchecken.
            </p>
          </div>
        )}

        {/* Disziplin-Auswahl */}
        {view === 'pick' && (
          <div className="space-y-6">
            <DisciplineGroup
              title="ERÖFFNUNG"
              ids={disciplineIdsByPhase('opening')}
              teams={activeTeams}
              scores={scores}
              onPick={openDiscipline}
            />
            <DisciplineGroup
              title="PHASE A – STATIONEN"
              ids={disciplineIdsByPhase('a')}
              teams={activeTeams}
              scores={scores}
              onPick={openDiscipline}
            />
            <DisciplineGroup
              title="PHASE B – FINALE"
              ids={disciplineIdsByPhase('b')}
              teams={activeTeams}
              scores={scores}
              onPick={openDiscipline}
            />
            {/* Spritzer */}
            <button
              onClick={() => openDiscipline(SPRITZER_ID)}
              className="w-full rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-4 flex items-center gap-3 hover:border-[#D4AF37]/40 transition-all"
            >
              <span className="text-2xl">🍷</span>
              <div className="text-left">
                <p className="font-fredoka font-600 text-white">Spritzerwertung</p>
                <p className="font-nunito text-xs text-white/40">Spaß-Sonderwertung</p>
              </div>
            </button>
          </div>
        )}

        {/* Team-Auswahl */}
        {view === 'teams' && selDisc && (
          <div className="space-y-4">
            <button
              onClick={() => setView('pick')}
              className="font-nunito text-sm text-[#52B788] hover:text-white"
            >
              ← Alle Stationen
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getDiscipline(selDisc)?.emoji}</span>
              <h2 className="font-fredoka font-700 text-xl text-white">{getDiscipline(selDisc)?.name}</h2>
            </div>
            <div className="space-y-2">
              {activeTeams.map((t) => {
                const s = scoreFor(t.id, selDisc);
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelTeam(t);
                      setView('entry');
                    }}
                    className="w-full flex items-center justify-between gap-3 rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-3 hover:border-[#D4AF37]/40 transition-all"
                  >
                    <TeamBadge color={t.color} emoji={t.emoji} name={t.team_name} startNumber={t.start_number} />
                    <span className="flex items-center gap-2 flex-shrink-0">
                      {s?.finished && <span className="text-[#52B788] text-sm">✓</span>}
                      <span className="font-bebas text-lg text-white">{fmtValue(selDisc, s)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Eingabe */}
        {view === 'entry' && selDisc && selTeam && (
          <ScoreEntryForm
            team={selTeam}
            disciplineId={selDisc}
            existing={scoreFor(selTeam.id, selDisc)}
            onBack={() => setView('teams')}
            onSaved={() => {
              refetchScores();
              setView('teams');
            }}
          />
        )}

        {/* Riesen-Ringerl */}
        {view === 'elim' && (
          <EliminationInput
            teams={activeTeams}
            scores={scores}
            onBack={() => setView('pick')}
            onMutate={refetchScores}
          />
        )}

        {/* Spritzer */}
        {view === 'spritzer' && (
          <SpritzerEntry
            teams={activeTeams}
            scores={scores}
            onBack={() => setView('pick')}
            onMutate={refetchScores}
          />
        )}
      </div>
    </main>
  );
}

function DisciplineGroup({
  title,
  ids,
  teams,
  scores,
  onPick,
}: {
  title: string;
  ids: string[];
  teams: GcTeam[];
  scores: GcScore[];
  onPick: (id: string) => void;
}) {
  if (ids.length === 0) return null;
  return (
    <div>
      <h3 className="font-bebas text-xs tracking-[0.2em] text-[#52B788] mb-2">{title}</h3>
      <div className="space-y-2">
        {ids.map((id) => {
          const disc = disciplines.find((d) => d.id === id);
          if (!disc) return null;
          const finishedCount = scores.filter(
            (s) => s.discipline_id === id && s.finished
          ).length;
          return (
            <button
              key={id}
              onClick={() => onPick(id)}
              className="w-full rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-3.5 flex items-center gap-3 hover:border-[#D4AF37]/40 transition-all"
            >
              <span className="text-2xl flex-shrink-0">{disc.emoji}</span>
              <div className="text-left flex-1 min-w-0">
                <p className="font-fredoka font-600 text-white truncate">{disc.name}</p>
                <p className="font-nunito text-xs text-white/40">{disc.category}</p>
              </div>
              <span className="font-bebas text-sm text-[#52B788] whitespace-nowrap">
                {finishedCount}/{teams.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
