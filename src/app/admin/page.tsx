'use client';

import { useCallback, useEffect, useState } from 'react';

interface Registration {
  id: string;
  team_name: string;
  player1: string;
  player2: string;
  player3: string;
  email: string;
  created_at: string;
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  // login
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // data
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [query, setQuery] = useState('');

  // delete confirm flow
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadRegs = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const res = await fetch('/api/admin/registrations');
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setListError(data.error ?? 'Fehler beim Laden.');
        setAuthed(true);
        return;
      }
      setRegs(data.registrations ?? []);
      setAuthed(true);
    } catch {
      setListError('Netzwerkfehler.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadRegs();
      setChecking(false);
    })();
  }, [loadRegs]);

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
      await loadRegs();
    } catch {
      setLoginError('Netzwerkfehler.');
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
    setRegs([]);
    setConfirmId(null);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setListError('');
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setRegs((prev) => prev.filter((r) => r.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        setListError(data.error ?? 'Löschen fehlgeschlagen.');
      }
    } catch {
      setListError('Netzwerkfehler beim Löschen.');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  const filtered = regs.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [r.team_name, r.player1, r.player2, r.player3, r.email].some((v) =>
      (v ?? '').toLowerCase().includes(q)
    );
  });

  const fmt = (iso: string) =>
    iso
      ? new Date(iso).toLocaleString('de-AT', {
          timeZone: 'Europe/Vienna',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—';

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

          <label className="block font-bebas text-xs tracking-[0.2em] text-[#52B788] mb-2">
            PASSWORT
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-4 py-3 font-nunito text-white outline-none focus:border-[#D4AF37]/50 transition-colors"
            placeholder="••••••••"
          />

          {loginError && (
            <p className="font-nunito text-sm text-red-400/90 mt-3">{loginError}</p>
          )}

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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-fredoka font-700 text-3xl text-white">
              Turnier-Admin <span className="text-[#D4AF37]">🥒</span>
            </h1>
            <p className="font-nunito text-sm text-white/40 mt-1">
              {regs.length} {regs.length === 1 ? 'Team' : 'Teams'} · {regs.length * 3} Spieler·innen
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/admin/export"
              className="btn-gold px-5 py-2.5 rounded-full text-sm whitespace-nowrap"
            >
              ⬇ Excel exportieren
            </a>
            <button
              onClick={handleLogout}
              className="font-nunito text-sm text-white/50 hover:text-white px-4 py-2.5 rounded-full border border-white/10 hover:border-white/30 transition-all"
            >
              Abmelden
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Team, Spieler oder E-Mail suchen…"
          className="w-full md:max-w-md rounded-xl bg-[#111E13] border border-[#1E4028] px-4 py-3 font-nunito text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-colors mb-5"
        />

        {listError && (
          <div className="rounded-xl border border-red-500/30 bg-red-900/15 px-4 py-3 mb-5">
            <p className="font-nunito text-sm text-red-300">{listError}</p>
          </div>
        )}

        {loading ? (
          <p className="font-nunito text-white/40 text-sm py-10 text-center">Lädt…</p>
        ) : filtered.length === 0 ? (
          <p className="font-nunito text-white/40 text-sm py-10 text-center">
            {regs.length === 0 ? 'Noch keine Anmeldungen.' : 'Keine Treffer.'}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#1E4028]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#111E13]">
                  {['#', 'Team', 'Spieler', 'E-Mail', 'Angemeldet', ''].map((h) => (
                    <th
                      key={h}
                      className="font-bebas text-xs tracking-[0.15em] text-[#52B788] text-left px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-t border-[#1E4028]/60 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 font-bebas text-[#D4AF37] align-top">{i + 1}</td>
                    <td className="px-4 py-3 align-top">
                      <span className="font-fredoka font-600 text-white">{r.team_name}</span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-nunito text-sm text-white/75 leading-relaxed">
                        {r.player1}
                        <br />
                        {r.player2}
                        <br />
                        {r.player3}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <a
                        href={`mailto:${r.email}`}
                        className="font-nunito text-sm text-[#52B788] hover:underline break-all"
                      >
                        {r.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 align-top font-nunito text-xs text-white/40 whitespace-nowrap">
                      {fmt(r.created_at)}
                    </td>
                    <td className="px-4 py-3 align-top text-right whitespace-nowrap">
                      {confirmId === r.id ? (
                        <span className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(r.id)}
                            disabled={deletingId === r.id}
                            className="font-bebas text-xs tracking-wide px-3 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                          >
                            {deletingId === r.id ? 'Löscht…' : 'Ja, löschen'}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            disabled={deletingId === r.id}
                            className="font-nunito text-xs text-white/50 hover:text-white px-2 py-1.5"
                          >
                            Abbrechen
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmId(r.id)}
                          className="font-nunito text-xs text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded-full border border-red-500/20 hover:border-red-500/50 transition-all"
                        >
                          Löschen
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="font-nunito text-xs text-white/20 mt-6 text-center">
          Personenbezogene Daten · vertraulich behandeln · nach dem Event löschen (DSGVO)
        </p>
      </div>
    </main>
  );
}
