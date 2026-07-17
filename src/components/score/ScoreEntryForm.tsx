'use client';

import { useState } from 'react';
import { getDiscipline, SCORING_META } from '@/lib/disciplines';
import type { GcScore, GcTeam } from '@/lib/tournamentTypes';
import { parseTimeToSeconds, formatSeconds } from '@/lib/timeFormat';
import { saveScore } from '@/lib/offlineQueue';
import TeamBadge from '../admin/TeamBadge';

export default function ScoreEntryForm({
  team,
  disciplineId,
  existing,
  onBack,
  onSaved,
}: {
  team: GcTeam;
  disciplineId: string;
  existing?: GcScore;
  onBack: () => void;
  onSaved: () => void;
}) {
  const disc = getDiscipline(disciplineId);
  const meta = SCORING_META[disciplineId];
  const isTime = meta?.inputMode === 'time';
  const perPlayer = !!meta?.perPlayer;
  const attemptsN = meta?.attemptsPerPlayer ?? 1;

  const [value, setValue] = useState(() => {
    if (existing?.raw_value == null) return '';
    return isTime ? formatSeconds(existing.raw_value) : String(existing.raw_value);
  });

  // attempts[player][attempt] – bei attemptsN===1 verhält sich das wie ein einzelnes Feld pro Spieler.
  const [attempts, setAttempts] = useState<string[][]>(() =>
    [existing?.p1, existing?.p2, existing?.p3].map((v) => {
      const row = new Array(attemptsN).fill('');
      if (v != null) row[0] = String(v);
      return row;
    })
  );

  function attemptNums(i: number): number[] {
    return attempts[i]
      .map((v) => (v.trim() === '' ? null : Number(v.replace(',', '.'))))
      .filter((n): n is number => n !== null && Number.isFinite(n));
  }
  function playerTotal(i: number): number {
    return attemptNums(i).reduce((a, b) => a + b, 0);
  }
  const playerSum = [0, 1, 2].reduce((a, i) => a + playerTotal(i), 0);
  const [finished, setFinished] = useState(existing?.finished ?? false);
  const [dbl, setDbl] = useState(existing?.card_double ?? false);
  const [second, setSecond] = useState(existing?.card_second ?? false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'queued'>('idle');
  const [error, setError] = useState('');

  const doubleLockedElsewhere = !!team.card_double_used && team.card_double_used !== disciplineId;
  const secondLockedElsewhere = !!team.card_second_used && team.card_second_used !== disciplineId;

  async function save() {
    setError('');
    const body: Parameters<typeof saveScore>[0] = {
      team_id: team.id,
      discipline_id: disciplineId,
      finished,
      card_double: dbl,
      card_second: second,
    };

    if (perPlayer) {
      // Ungültige (nicht-numerische) Eingaben abfangen, bevor summiert wird.
      const hasInvalid = attempts.some((row) =>
        row.some((v) => v.trim() !== '' && !Number.isFinite(Number(v.replace(',', '.'))))
      );
      if (hasInvalid) {
        setError('Zahl ungültig.');
        return;
      }
      // Spieler-Summe = Summe seiner Versuche; kein Versuch eingetragen → null (noch offen).
      const totals = [0, 1, 2].map((i) => (attemptNums(i).length > 0 ? playerTotal(i) : null));
      body.p1 = totals[0];
      body.p2 = totals[1];
      body.p3 = totals[2];
    } else {
      let raw: number | null = null;
      if (value.trim() !== '') {
        raw = isTime ? parseTimeToSeconds(value) : Number(value.replace(',', '.'));
        if (raw == null || !Number.isFinite(raw)) {
          setError(isTime ? 'Zeit ungültig (z.B. 4:32 oder 4:32.50).' : 'Zahl ungültig.');
          return;
        }
      }
      body.raw_value = raw;
    }

    setStatus('saving');
    const res = await saveScore(body);
    if (res.status === 'ok') {
      setStatus('saved');
      setTimeout(onSaved, 600);
    } else if (res.status === 'queued') {
      setStatus('queued');
      setTimeout(onSaved, 800);
    } else {
      setStatus('idle');
      setError(res.message);
    }
  }

  function toggleDouble() {
    setDbl((d) => {
      const next = !d;
      if (next) setSecond(false);
      return next;
    });
  }
  function toggleSecond() {
    setSecond((s) => {
      const next = !s;
      if (next) setDbl(false);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="font-nunito text-sm text-[#52B788] hover:text-white">
        ← Zurück
      </button>

      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{disc?.emoji}</span>
          <p className="font-bebas text-xs tracking-[0.2em] text-[#52B788]">{disc?.category}</p>
        </div>
        <h2 className="font-fredoka font-700 text-2xl text-white mb-4">{disc?.name}</h2>
        <TeamBadge color={team.color} emoji={team.emoji} name={team.team_name} startNumber={team.start_number} size="lg" />
      </div>

      {/* Wert */}
      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        {perPlayer ? (
          <>
            <label className="block font-bebas text-xs tracking-[0.2em] text-[#52B788] mb-2">
              {meta?.inputUnit?.toUpperCase() ?? 'WERT'} PRO SPIELER
              {attemptsN > 1 && ` · ${attemptsN} VERSUCHE (werden addiert)`}
            </label>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-nunito text-sm text-white/60 w-24 flex-shrink-0">Spieler {i + 1}</span>
                  {attemptsN > 1 ? (
                    <>
                      {Array.from({ length: attemptsN }, (_, a) => (
                        <input
                          key={a}
                          inputMode="decimal"
                          value={attempts[i][a] ?? ''}
                          onChange={(e) =>
                            setAttempts((prev) =>
                              prev.map((row, j) => (j === i ? row.map((v, k) => (k === a ? e.target.value : v)) : row))
                            )
                          }
                          placeholder="0"
                          title={`Versuch ${a + 1}`}
                          className="w-0 flex-1 rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-2 py-3 font-bebas text-xl text-white outline-none focus:border-[#D4AF37]/60 text-center"
                        />
                      ))}
                      <span className="font-bebas text-lg text-[#F0CE67] w-12 text-right flex-shrink-0">
                        {playerTotal(i)}
                      </span>
                    </>
                  ) : (
                    <input
                      inputMode="decimal"
                      value={attempts[i][0] ?? ''}
                      onChange={(e) =>
                        setAttempts((prev) => prev.map((row, j) => (j === i ? [e.target.value] : row)))
                      }
                      placeholder="0"
                      className="flex-1 rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-4 py-3 font-bebas text-2xl text-white outline-none focus:border-[#D4AF37]/60 text-center"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#0A1A0C] border border-[#D4AF37]/30 px-4 py-3">
              <span className="font-bebas text-xs tracking-[0.2em] text-[#52B788]">GESAMT (automatisch)</span>
              <span className="font-bebas text-2xl text-[#F0CE67]">
                {playerSum} <span className="text-sm text-white/40">{meta?.inputUnit}</span>
              </span>
            </div>
          </>
        ) : (
          <>
            <label className="block font-bebas text-xs tracking-[0.2em] text-[#52B788] mb-2">
              {meta?.inputUnit?.toUpperCase() ?? 'WERT'} {isTime && '(z.B. 4:32.50)'}
            </label>
            <input
              inputMode={isTime ? 'text' : 'decimal'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={isTime ? 'm:ss.cs' : '0'}
              className="w-full rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-4 py-4 font-bebas text-3xl tracking-wide text-white outline-none focus:border-[#D4AF37]/60 text-center"
            />
          </>
        )}

        {/* Gurkerl-Karten */}
        {meta?.cardsAllowed && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <CardToggle
              label="Doppel Gurkerl"
              hint="Punkte ×2"
              active={dbl}
              disabled={doubleLockedElsewhere}
              lockedHint={doubleLockedElsewhere ? 'an anderer Station' : undefined}
              onClick={toggleDouble}
            />
            <CardToggle
              label="2nd Chance"
              hint="2. Versuch zählt"
              active={second}
              disabled={secondLockedElsewhere}
              lockedHint={secondLockedElsewhere ? 'an anderer Station' : undefined}
              onClick={toggleSecond}
            />
          </div>
        )}

        {/* Fertig */}
        <label className="mt-4 flex items-center gap-3 cursor-pointer select-none">
          <span
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
              finished ? 'bg-[#52B788] border-[#52B788]' : 'border-[#2D6A4F]'
            }`}
            onClick={() => setFinished((f) => !f)}
          >
            {finished && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#0A1F12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="font-nunito text-sm text-white/80" onClick={() => setFinished((f) => !f)}>
            Station für dieses Team erledigt
          </span>
        </label>
      </div>

      {error && <p className="font-nunito text-sm text-red-400/90">{error}</p>}

      <button
        onClick={save}
        disabled={status === 'saving'}
        className="btn-gold w-full py-4 rounded-full text-lg disabled:opacity-60"
      >
        {status === 'saving'
          ? 'Speichert…'
          : status === 'saved'
            ? '✓ Gespeichert'
            : status === 'queued'
              ? '✓ Offline gespeichert'
              : 'Speichern'}
      </button>
    </div>
  );
}

function CardToggle({
  label,
  hint,
  active,
  disabled,
  lockedHint,
  onClick,
}: {
  label: string;
  hint: string;
  active: boolean;
  disabled?: boolean;
  lockedHint?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border p-3 text-left transition-all ${
        active
          ? 'border-[#D4AF37] bg-[#D4AF37]/10'
          : disabled
            ? 'border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed'
            : 'border-[#1E4028] bg-[#0A1A0C] hover:border-[#D4AF37]/40'
      }`}
    >
      <span className="text-base">🃏</span>
      <p className={`font-bebas text-sm tracking-wide mt-1 ${active ? 'text-[#F0CE67]' : 'text-white'}`}>
        {label}
      </p>
      <p className="font-nunito text-[11px] text-white/50">{lockedHint ?? hint}</p>
    </button>
  );
}
