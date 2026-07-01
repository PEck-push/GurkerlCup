'use client';

import { useEffect, useRef, useState } from 'react';
import { getDiscipline } from '@/lib/disciplines';
import type { GcConfig, GcTeam } from '@/lib/tournamentTypes';

function fmtClock(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const rest = sec - m * 60;
  return `${m}:${rest.toFixed(1).padStart(4, '0')}`;
}

/**
 * Auftakt-Timer auf der Team-Seite: zentraler Start, das Team stoppt selbst.
 * Die verstrichene Zeit wird lokal am Handy gemessen (Date.now() − Start) und
 * beim Stopp gesendet – dadurch spielen Netz-Latenz/Uhr-Offset für die Dauer
 * keine Rolle. Der Betreuer kann jede Zeit im Admin nachkorrigieren.
 */
export default function TeamTimer({
  team,
  config,
  code,
  finishedSeconds,
}: {
  team: GcTeam;
  config: GcConfig;
  code: string;
  finishedSeconds: number | null;
}) {
  const [now, setNow] = useState<number | null>(null);
  const [myTime, setMyTime] = useState<number | null>(null);
  const [stopping, setStopping] = useState(false);
  const [err, setErr] = useState('');
  const stoppedRef = useRef(false);

  const state = config.timer_state;
  const disc = config.timer_discipline_id ? getDiscipline(config.timer_discipline_id) : undefined;
  const startMs = config.timer_start_at ? new Date(config.timer_start_at).getTime() : null;
  const running = state === 'running';

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60);
    return () => clearInterval(id);
  }, []);

  // Neue Runde (Betreuer hat resettet/neu scharfgeschaltet) → lokalen Stopp zurücksetzen
  useEffect(() => {
    if (state === 'armed' || state === 'idle') {
      stoppedRef.current = false;
      setMyTime(null);
      setErr('');
    }
  }, [state, config.timer_start_at]);

  const displayTime = myTime ?? finishedSeconds;
  const alreadyDone = displayTime != null;

  async function stop() {
    if (stopping || stoppedRef.current || startMs === null) return;
    const elapsed = Date.now() - startMs;
    if (elapsed <= 0) return;
    stoppedRef.current = true;
    setStopping(true);
    setErr('');
    try {
      const res = await fetch('/api/team/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, elapsed_ms: elapsed }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok) {
        setMyTime(d.seconds);
      } else {
        // Bereits gestoppt: Realtime liefert die gespeicherte Zeit nach → kein harter Fehler.
        if (!d.already) stoppedRef.current = false;
        setErr(d.error ?? 'Konnte nicht speichern – nochmal antippen.');
      }
    } catch {
      stoppedRef.current = false;
      setErr('Netzwerkfehler – nochmal antippen.');
    } finally {
      setStopping(false);
    }
  }

  if (now === null) return null;

  const preStart = running && startMs !== null && now < startMs;
  const secsToGo = preStart ? Math.ceil((startMs! - now) / 1000) : 0;
  const elapsedSec = running && startMs !== null ? (now - startMs) / 1000 : 0;

  return (
    <div className="rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-b from-[#1A1405] to-[#0F0D06] p-6 mb-6 text-center overflow-hidden">
      <p className="font-bebas tracking-[0.2em] text-sm text-[#F0CE67]">
        ⏱ {disc?.name ?? 'Auftakt'} · ZEITRENNEN
      </p>

      {/* GESTOPPT */}
      {alreadyDone ? (
        <div className="py-4">
          <p className="font-nunito text-sm text-white/60 mb-1">Eure Zeit steht! 🎉</p>
          <p className="font-fredoka font-700 text-6xl text-[#52B788] tabular-nums">{fmtClock(displayTime!)}</p>
          <p className="font-nunito text-xs text-white/40 mt-2">Gespeichert – lehnt euch zurück.</p>
        </div>
      ) : state === 'armed' ? (
        <div className="py-6">
          <div className="text-5xl mb-3 animate-pulse">📱</div>
          <p className="font-fredoka font-700 text-2xl text-white">Macht euch bereit!</p>
          <p className="font-nunito text-sm text-white/50 mt-1">
            Gleich zählt der Beamer runter. Ein Finger an den STOPP-Button – sofort drücken, wenn ihr fertig seid.
          </p>
        </div>
      ) : preStart ? (
        <div className="py-6">
          <p className="font-nunito text-sm text-white/50 mb-2">Es geht los in…</p>
          <p className="font-fredoka font-700 text-8xl text-[#F0CE67] tabular-nums leading-none">{secsToGo}</p>
        </div>
      ) : running ? (
        <div className="py-2">
          <p className="font-fredoka font-700 text-5xl text-white tabular-nums my-3">{fmtClock(elapsedSec)}</p>
          <button
            onClick={stop}
            disabled={stopping}
            className="w-full rounded-2xl bg-[#EF4444] active:bg-[#dc2626] disabled:opacity-60 py-8 font-fredoka font-700 text-4xl text-white shadow-lg transition-colors select-none"
            style={{ touchAction: 'manipulation' }}
          >
            {stopping ? '…' : 'STOPP! ✋'}
          </button>
          <p className="font-nunito text-xs text-white/40 mt-3">Drückt genau dann, wenn ihr fertig seid.</p>
        </div>
      ) : (
        <div className="py-6">
          <p className="font-fredoka font-700 text-xl text-white">Runde beendet</p>
          <p className="font-nunito text-sm text-white/50 mt-1">
            Keine Zeit erfasst – bitte kurz beim Stationsbetreuer melden.
          </p>
        </div>
      )}

      {err && <p className="font-nunito text-sm text-red-300 mt-2">{err}</p>}
    </div>
  );
}
