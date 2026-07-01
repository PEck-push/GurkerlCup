'use client';

import { useEffect, useState } from 'react';
import { useGcConfig, useGcScores, useGcTeams } from '@/lib/useRealtime';
import { getDiscipline } from '@/lib/disciplines';
import type { GcConfig, GcScore, GcTeam, Phase } from '@/lib/tournamentTypes';

const PHASES: { id: Phase; label: string; hint: string }[] = [
  { id: 'setup', label: 'Setup', hint: 'Vor dem Start · Beamer zeigt Logo' },
  { id: 'opening', label: 'Eröffnung', hint: 'Bleib ruhig! · Ergebnis sofort zeigen' },
  { id: 'phase_a', label: 'Phase A', hint: '7 Stationen · Fortschritt am Beamer' },
  { id: 'reveal', label: 'Zwischenstand-Reveal', hint: '19:45 · Plätze einzeln enthüllen' },
  { id: 'phase_b', label: 'Phase B (Finale)', hint: 'Live-Aufholjagd · Balken' },
  { id: 'podium', label: 'Siegerehrung', hint: 'Top-3-Podest' },
];

export default function PresenterPanel() {
  const { config } = useGcConfig();
  const { data: teams } = useGcTeams();
  const { data: scores } = useGcScores();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const teamCount = teams.filter((t) => t.checked_in).length;

  async function post(patch: Record<string, unknown>) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? 'Fehler.');
      }
    } catch {
      setError('Netzwerkfehler.');
    } finally {
      setBusy(false);
    }
  }

  if (!config) {
    return <p className="font-nunito text-white/40 text-sm py-10 text-center">Lädt…</p>;
  }

  return (
    <div className="space-y-7">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-900/15 px-4 py-3">
          <p className="font-nunito text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Master-Phasen-Schalter */}
      <div>
        <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788] mb-3">TURNIER-PHASE</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {PHASES.map((p) => {
            const active = config.phase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => post({ phase: p.id })}
                disabled={busy}
                className={`text-left rounded-xl border p-4 transition-all ${
                  active
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-[#1E4028] bg-[#0F1A0D] hover:border-[#D4AF37]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`font-fredoka font-700 ${active ? 'text-[#F0CE67]' : 'text-white'}`}>
                    {p.label}
                  </p>
                  {active && <span className="text-[#D4AF37] text-sm">● live</span>}
                </div>
                <p className="font-nunito text-xs text-white/40 mt-0.5">{p.hint}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kontext-Steuerung je Phase */}
      {config.phase === 'opening' && (
        <ControlCard title="ERÖFFNUNG">
          <div className="mb-4">
            <p className="font-nunito text-xs text-white/50 mb-2">
              ⏱ <b className="text-white/80">Auftakt-Timer</b> – zentraler Start, jedes Team stoppt selbst am eigenen
              Handy (auf seiner Team-Seite). Zeiten laufen automatisch in die Wertung.
            </p>
            <TimerControls config={config} teams={teams} scores={scores} post={post} busy={busy} />
          </div>
          <div className="border-t border-[#1E4028] pt-4">
            <Toggle
              label="Eröffnungs-Ergebnis am Beamer zeigen (nach dem Timer)"
              on={config.opening_revealed}
              onClick={() => post({ opening_revealed: !config.opening_revealed })}
            />
          </div>
        </ControlCard>
      )}

      {config.phase === 'phase_a' && (
        <ControlCard title="BEAMER PHASE A">
          <div className="flex flex-wrap gap-2 mb-4">
            {(['auto', 'logo', 'progress', 'countdown', 'spritzer'] as const).map((r) => (
              <button
                key={r}
                onClick={() => post({ beamer_rotation: r })}
                className={`font-nunito text-sm px-4 py-2 rounded-full border transition-all ${
                  config.beamer_rotation === r
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#F0CE67]'
                    : 'border-[#1E4028] text-white/60 hover:text-white'
                }`}
              >
                {r === 'auto' ? 'Rotierend' : r === 'logo' ? 'Logo' : r === 'progress' ? 'Fortschritt' : r === 'countdown' ? 'Countdown' : '🍷 Spritzer'}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <label className="block font-nunito text-xs text-white/50 mb-2">
              Slide-Dauer beim Rotieren: <b className="text-white">{config.slide_seconds}s</b>
            </label>
            <div className="flex items-center gap-2">
              {[6, 10, 15, 20, 30].map((sec) => (
                <button
                  key={sec}
                  onClick={() => post({ slide_seconds: sec })}
                  className={`font-nunito text-sm px-3 py-1.5 rounded-full border transition-all ${
                    config.slide_seconds === sec
                      ? 'border-[#52B788] bg-[#52B788]/10 text-[#52B788]'
                      : 'border-[#1E4028] text-white/60 hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
          <CountdownSetter
            current={config.countdown_target}
            onSet={(iso) => post({ countdown_target: iso })}
          />
        </ControlCard>
      )}

      {config.phase === 'reveal' && (
        <ControlCard title="ZWISCHENSTAND-REVEAL">
          <p className="font-nunito text-sm text-white/60 mb-3">
            Enthüllt: <b className="text-white">{Math.min(config.reveal_step, teamCount)}</b> / {teamCount}
            {' '}Plätze (von hinten)
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => post({ reveal_step: Math.max(0, config.reveal_step - 1) })}
              disabled={busy || config.reveal_step <= 0}
              className="font-nunito text-sm px-4 py-2.5 rounded-full border border-white/10 text-white/70 hover:text-white disabled:opacity-40"
            >
              − Zurück
            </button>
            <button
              onClick={() => post({ reveal_step: Math.min(teamCount, config.reveal_step + 1), reveal_running: true })}
              disabled={busy || config.reveal_step >= teamCount}
              className="btn-gold px-6 py-2.5 rounded-full text-sm disabled:opacity-40"
            >
              Nächstes Team enthüllen ▶
            </button>
            <button
              onClick={() => post({ reveal_step: teamCount, reveal_running: true })}
              disabled={busy}
              className="font-nunito text-sm px-4 py-2.5 rounded-full border border-[#D4AF37]/40 text-[#F0CE67] hover:bg-[#D4AF37]/10"
            >
              🏆 Top 3 enthüllen
            </button>
            <button
              onClick={() => post({ reveal_step: 0, reveal_running: false })}
              disabled={busy}
              className="font-nunito text-sm px-4 py-2.5 rounded-full border border-white/10 text-white/50 hover:text-white"
            >
              Reset
            </button>
          </div>
        </ControlCard>
      )}

      {config.phase === 'phase_b' && (
        <ControlCard title="PHASE B – BEAMER">
          <div className="flex gap-2">
            {(['total', 'finale'] as const).map((v) => (
              <button
                key={v}
                onClick={() => post({ beamer_view: v })}
                className={`font-nunito text-sm px-4 py-2 rounded-full border transition-all ${
                  config.beamer_view === v
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#F0CE67]'
                    : 'border-[#1E4028] text-white/60 hover:text-white'
                }`}
              >
                {v === 'total' ? 'Gesamtpunkte' : 'Nur Finale'}
              </button>
            ))}
          </div>
        </ControlCard>
      )}

      {/* Spritzer immer steuerbar */}
      <ControlCard title="SPRITZERWERTUNG">
        <Toggle
          label="Spritzer in die Beamer-Rotation aufnehmen"
          on={config.spritzer_revealed}
          onClick={() => post({ spritzer_revealed: !config.spritzer_revealed })}
        />
        <p className="font-nunito text-xs text-white/40 mt-2">
          Zwischenstand, Phase B & Siegerehrung: einblenden = die Spritzerwertung legt sich als
          Overlay darüber; ausschalten blendet sie wieder aus.<br />
          In Phase A läuft sie stattdessen in der Rotation mit (oder oben auf{' '}
          <b className="text-white/70">🍷 Spritzer</b> pinnen).
        </p>
      </ControlCard>
    </div>
  );
}

function fmtT(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const r = sec - m * 60;
  return `${m}:${r.toFixed(1).padStart(4, '0')}`;
}

function TimerControls({
  config,
  teams,
  scores,
  post,
  busy,
}: {
  config: GcConfig;
  teams: GcTeam[];
  scores: GcScore[];
  post: (patch: Record<string, unknown>) => Promise<void>;
  busy: boolean;
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  const state = config.timer_state ?? 'idle';
  const discId = config.timer_discipline_id ?? 'mutter-stapeln';
  const disc = getDiscipline(discId);
  const active = teams.filter((t) => t.checked_in);
  const startMs = config.timer_start_at ? new Date(config.timer_start_at).getTime() : null;

  const finishers = scores
    .filter((s) => s.discipline_id === discId && s.finished && s.raw_value != null)
    .map((s) => ({ team: active.find((t) => t.id === s.team_id), sec: Number(s.raw_value) }))
    .filter((r): r is { team: GcTeam; sec: number } => !!r.team)
    .sort((a, b) => a.sec - b.sec);

  const preStart = state === 'running' && startMs !== null && now !== null && now < startMs;
  const secsToGo = preStart ? Math.ceil((startMs! - now!) / 1000) : 0;
  const elapsed = state === 'running' && startMs !== null && now !== null ? (now - startMs) / 1000 : 0;

  const stateLabel =
    state === 'idle' ? 'Bereit' :
    state === 'armed' ? 'Scharf – wartet auf Start' :
    state === 'running' ? (preStart ? `Countdown: ${secsToGo}` : `Läuft: ${fmtT(elapsed)}`) :
    'Runde beendet';

  return (
    <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-nunito text-sm text-white/70">
          Station: <b className="text-[#F0CE67]">{disc?.name ?? discId}</b>
        </span>
        <span className="font-bebas tracking-[0.15em] text-xs text-[#52B788]">{stateLabel.toUpperCase()}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {state === 'idle' && (
          <button onClick={() => post({ timer_action: 'arm' })} disabled={busy} className="btn-gold px-5 py-2.5 rounded-full text-sm">
            ⏱ Timer scharfschalten
          </button>
        )}
        {state === 'armed' && (
          <>
            <button onClick={() => post({ timer_action: 'start', lead_seconds: 5 })} disabled={busy} className="btn-gold px-6 py-2.5 rounded-full text-sm">
              ▶ START (5-4-3-2-1)
            </button>
            <button onClick={() => post({ timer_action: 'reset' })} disabled={busy} className="font-nunito text-sm px-4 py-2.5 rounded-full border border-white/10 text-white/60 hover:text-white">
              Abbrechen
            </button>
          </>
        )}
        {state === 'running' && (
          <button onClick={() => post({ timer_action: 'stop' })} disabled={busy} className="font-nunito text-sm px-6 py-2.5 rounded-full border border-red-500/40 text-red-300 hover:bg-red-900/20">
            ■ Runde beenden
          </button>
        )}
        {state === 'stopped' && (
          <button onClick={() => post({ timer_action: 'reset' })} disabled={busy} className="btn-gold px-5 py-2.5 rounded-full text-sm">
            ↺ Neue Runde / Zurücksetzen
          </button>
        )}
      </div>

      <p className="font-nunito text-xs text-white/50 mt-3">
        Im Ziel: <b className="text-white">{finishers.length}</b> / {active.length}
      </p>

      {finishers.length > 0 && (
        <ol className="mt-2 space-y-1">
          {finishers.map((r, i) => (
            <li key={r.team.id} className="flex items-center justify-between font-nunito text-sm">
              <span className="text-white/80">
                <b className="text-white/50 w-5 inline-block">{i + 1}.</b> {r.team.team_name}
              </span>
              <span className="font-bebas text-base text-[#F0CE67] tabular-nums">{fmtT(r.sec)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function ControlCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
      <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788] mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
        on ? 'border-[#52B788] bg-[#52B788]/10' : 'border-[#1E4028] bg-[#0A1A0C]'
      }`}
    >
      <span className="font-nunito text-sm text-white">{label}</span>
      <span
        className={`w-12 h-6 rounded-full relative transition-all ${on ? 'bg-[#52B788]' : 'bg-white/10'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
            on ? 'left-6' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  );
}

function CountdownSetter({
  current,
  onSet,
}: {
  current: string | null;
  onSet: (iso: string | null) => void;
}) {
  const [val, setVal] = useState('');
  return (
    <div>
      <label className="block font-nunito text-xs text-white/50 mb-2">
        Countdown-Ziel (z.B. Deadline 19:30)
        {current && <span className="text-[#52B788]"> · gesetzt</span>}
      </label>
      <div className="flex gap-2">
        <input
          type="datetime-local"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="flex-1 rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-3 py-2.5 font-nunito text-white text-sm outline-none focus:border-[#D4AF37]/50"
        />
        <button
          onClick={() => val && onSet(new Date(val).toISOString())}
          className="btn-gold px-4 py-2.5 rounded-xl text-sm whitespace-nowrap"
        >
          Setzen
        </button>
        {current && (
          <button
            onClick={() => onSet(null)}
            className="font-nunito text-sm text-white/50 hover:text-white px-3"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
