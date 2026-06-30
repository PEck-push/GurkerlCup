'use client';

import { useCallback, useEffect, useState } from 'react';
import BeamerStage from '@/components/tournament/BeamerStage';
import MuteButton from '@/components/tournament/MuteButton';
import { unlockAudio } from '@/lib/sounds';

export default function BeamerPage() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const check = useCallback(async () => {
    try {
      const res = await fetch('/api/beamer/session');
      setAuthed(res.ok);
    } catch {
      setAuthed(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/beamer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Login fehlgeschlagen.');
        return;
      }
      unlockAudio(); // Autoplay-Sperre per User-Geste lösen
      setPassword('');
      setAuthed(true);
    } catch {
      setError('Netzwerkfehler.');
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A1A0C]">
        <div className="font-nunito text-white/40 text-sm animate-pulse">Lädt…</div>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A1A0C] px-5">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-3xl border border-[#1E4028] bg-[#111E13] p-8"
          style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
        >
          <div className="text-center mb-7">
            <div className="text-4xl mb-3">🥒📺</div>
            <h1 className="font-fredoka font-700 text-2xl text-white">Beamer-Anzeige</h1>
            <p className="font-nunito text-sm text-white/40 mt-1">Gurkerl Cup 2026</p>
          </div>
          <label className="block font-bebas text-xs tracking-[0.2em] text-[#52B788] mb-2">PASSWORT</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-4 py-3 font-nunito text-white outline-none focus:border-[#D4AF37]/50"
            placeholder="••••••••"
          />
          {error && <p className="font-nunito text-sm text-red-400/90 mt-3">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="btn-gold w-full mt-6 py-3 rounded-full disabled:opacity-50"
          >
            {busy ? 'Starten…' : 'Beamer starten'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0A1A0C] noise-overlay select-none">
      <MuteButton />
      <BeamerStage />
    </main>
  );
}
