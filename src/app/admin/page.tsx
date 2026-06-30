'use client';

import { useCallback, useEffect, useState } from 'react';
import RegistrationsPanel from '@/components/admin/RegistrationsPanel';
import CheckInPanel from '@/components/admin/CheckInPanel';
import PresenterPanel from '@/components/admin/PresenterPanel';
import ScoreMatrix from '@/components/admin/ScoreMatrix';
import PointsEditor from '@/components/admin/PointsEditor';
import PrintExportPanel from '@/components/admin/PrintExportPanel';
import TestResetPanel from '@/components/admin/TestResetPanel';

type TabId = 'registrations' | 'checkin' | 'presenter' | 'scores' | 'points' | 'print' | 'tools';

const TABS: { id: TabId; label: string }[] = [
  { id: 'registrations', label: 'Anmeldungen' },
  { id: 'checkin', label: 'Check-In' },
  { id: 'presenter', label: 'Steuerung' },
  { id: 'scores', label: 'Wertung' },
  { id: 'points', label: 'Punkte' },
  { id: 'print', label: 'Druck/Export' },
  { id: 'tools', label: 'Test/Reset' },
];

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<TabId>('registrations');

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session');
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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error ?? 'Login fehlgeschlagen.');
        return;
      }
      setPassword('');
      setAuthed(true);
    } catch {
      setLoginError('Netzwerkfehler.');
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
  }

  /* ───────────── Loading ───────────── */
  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A1A0C]">
        <div className="font-nunito text-white/40 text-sm animate-pulse">Lädt…</div>
      </main>
    );
  }

  /* ───────────── Login ───────────── */
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A1A0C] px-5">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-3xl border border-[#1E4028] bg-[#111E13] p-8"
          style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
        >
          <div className="text-center mb-7">
            <div className="text-4xl mb-3">🥒🔒</div>
            <h1 className="font-fredoka font-700 text-2xl text-white">Turnier-Admin</h1>
            <p className="font-nunito text-sm text-white/40 mt-1">Gurkerl Cup 2026</p>
          </div>

          <label className="block font-bebas text-xs tracking-[0.2em] text-[#52B788] mb-2">PASSWORT</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-4 py-3 font-nunito text-white outline-none focus:border-[#D4AF37]/50 transition-colors"
            placeholder="••••••••"
          />

          {loginError && <p className="font-nunito text-sm text-red-400/90 mt-3">{loginError}</p>}

          <button
            type="submit"
            disabled={loggingIn || !password}
            className="btn-gold w-full mt-6 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loggingIn ? 'Anmelden…' : 'Anmelden'}
          </button>
        </form>
      </main>
    );
  }

  /* ───────────── Dashboard ───────────── */
  return (
    <main className="min-h-screen bg-[#0A1A0C] px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="font-fredoka font-700 text-3xl text-white">
            Turnier-Admin <span className="text-[#D4AF37]">🥒</span>
          </h1>
          <div className="flex items-center gap-3">
            <a
              href="/beamer"
              target="_blank"
              rel="noreferrer"
              className="font-nunito text-sm text-[#52B788] hover:text-white px-4 py-2.5 rounded-full border border-[#52B788]/30 hover:border-[#52B788] transition-all"
            >
              Beamer ↗
            </a>
            <button
              onClick={handleLogout}
              className="font-nunito text-sm text-white/50 hover:text-white px-4 py-2.5 rounded-full border border-white/10 hover:border-white/30 transition-all"
            >
              Abmelden
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-7 border-b border-[#1E4028] pb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`font-fredoka font-600 text-sm px-4 py-2 rounded-full transition-all ${
                tab === t.id
                  ? 'bg-[#D4AF37] text-[#0A1F12]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        {tab === 'registrations' && <RegistrationsPanel />}
        {tab === 'checkin' && <CheckInPanel />}
        {tab === 'presenter' && <PresenterPanel />}
        {tab === 'scores' && <ScoreMatrix />}
        {tab === 'points' && <PointsEditor />}
        {tab === 'print' && <PrintExportPanel />}
        {tab === 'tools' && <TestResetPanel />}

        <p className="font-nunito text-xs text-white/20 mt-10 text-center">
          Personenbezogene Daten · vertraulich behandeln · nach dem Event löschen (DSGVO)
        </p>
      </div>
    </main>
  );
}
