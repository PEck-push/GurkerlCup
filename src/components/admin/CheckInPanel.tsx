'use client';

import { useCallback, useEffect, useState } from 'react';
import type { GcTeam } from '@/lib/tournamentTypes';
import { TEAM_AVATARS } from '@/lib/teamAvatars';
import CharAvatar from '../tournament/CharAvatar';
import QrCode from '../QrCode';

interface Registration {
  id: string;
  team_name: string;
}

export default function CheckInPanel() {
  const [teams, setTeams] = useState<GcTeam[]>([]);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [walkIn, setWalkIn] = useState('');
  const [qrTeam, setQrTeam] = useState<GcTeam | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');
  const [avatarPick, setAvatarPick] = useState<string | null>(null);

  useEffect(() => setOrigin(window.location.origin), []);

  async function chooseAvatar(teamId: string, src: string) {
    setTeams((prev) => prev.map((x) => (x.id === teamId ? { ...x, avatar: src } : x)));
    try {
      await fetch('/api/admin/teams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: teamId, avatar: src }),
      });
    } catch {
      setError('Avatar konnte nicht gespeichert werden.');
    }
  }

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await fetch('/api/admin/teams');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Fehler beim Laden.');
        return;
      }
      setTeams(data.teams ?? []);
      setRegs(data.registrations ?? []);
    } catch {
      setError('Netzwerkfehler.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const checkedRegIds = new Set(teams.map((t) => t.registration_id).filter(Boolean));
  const openRegs = regs.filter((r) => !checkedRegIds.has(r.id));

  async function checkIn(registration_id: string) {
    setBusyId(registration_id);
    setError('');
    try {
      const res = await fetch('/api/admin/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_id }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? 'Check-In fehlgeschlagen.');
      else await load();
    } catch {
      setError('Netzwerkfehler.');
    } finally {
      setBusyId(null);
    }
  }

  async function addWalkIn() {
    const name = walkIn.trim();
    if (!name) return;
    setBusyId('walkin');
    setError('');
    try {
      const res = await fetch('/api/admin/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_name: name }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? 'Anlegen fehlgeschlagen.');
      else {
        setWalkIn('');
        await load();
      }
    } catch {
      setError('Netzwerkfehler.');
    } finally {
      setBusyId(null);
    }
  }

  async function removeTeam(id: string) {
    setBusyId(id);
    try {
      const res = await fetch('/api/admin/teams', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setTeams((p) => p.filter((t) => t.id !== id));
      else {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? 'Löschen fehlgeschlagen.');
      }
    } catch {
      setError('Netzwerkfehler.');
    } finally {
      setBusyId(null);
      setConfirmDel(null);
    }
  }

  if (loading) {
    return <p className="font-nunito text-white/40 text-sm py-10 text-center">Lädt…</p>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-900/15 px-4 py-3">
          <p className="font-nunito text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-3">
        <Stat label="Eingecheckt" value={teams.filter((t) => t.checked_in).length} accent="#52B788" />
        <Stat label="Angemeldet" value={regs.length} accent="#D4AF37" />
        <Stat label="Offen" value={openRegs.length} accent="#FB923C" />
        <div className="ml-auto flex flex-wrap gap-2">
          <a
            href="/admin/print-sheets"
            target="_blank"
            rel="noreferrer"
            className="btn-gold px-5 py-3 rounded-full text-sm whitespace-nowrap"
          >
            🖨 Team-Laufblätter
          </a>
          <a
            href="/admin/print-qr"
            target="_blank"
            rel="noreferrer"
            className="font-nunito text-sm text-[#52B788] hover:text-white border border-[#52B788]/30 hover:border-[#52B788] rounded-full px-5 py-3 whitespace-nowrap transition-all"
          >
            🖨 Nur QR-Codes
          </a>
        </div>
      </div>

      {/* Walk-In */}
      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <label className="block font-bebas text-xs tracking-[0.2em] text-[#52B788] mb-2">
          WALK-IN HINZUFÜGEN
        </label>
        <div className="flex gap-2">
          <input
            value={walkIn}
            onChange={(e) => setWalkIn(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addWalkIn()}
            placeholder="Teamname (spontane Anmeldung)"
            className="flex-1 rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-4 py-3 font-nunito text-white text-sm outline-none focus:border-[#D4AF37]/50"
          />
          <button
            onClick={addWalkIn}
            disabled={busyId === 'walkin' || !walkIn.trim()}
            className="btn-gold px-5 py-3 rounded-xl text-sm whitespace-nowrap disabled:opacity-50"
          >
            + Anlegen
          </button>
        </div>
      </div>

      {/* Offene Anmeldungen */}
      {openRegs.length > 0 && (
        <div>
          <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788] mb-3">
            NOCH NICHT EINGECHECKT ({openRegs.length})
          </h3>
          <div className="space-y-2">
            {openRegs.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-3"
              >
                <span className="font-fredoka font-600 text-white">{r.team_name}</span>
                <button
                  onClick={() => checkIn(r.id)}
                  disabled={busyId === r.id}
                  className="btn-gold px-4 py-2 rounded-full text-sm disabled:opacity-50"
                >
                  {busyId === r.id ? '…' : '✓ Einchecken'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eingecheckte Teams */}
      <div>
        <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788] mb-3">
          EINGECHECKTE TEAMS ({teams.length})
        </h3>
        {teams.length === 0 ? (
          <p className="font-nunito text-white/40 text-sm py-6 text-center">Noch keine Teams eingecheckt.</p>
        ) : (
          <div className="space-y-2">
            {teams.map((t) => (
              <div key={t.id} className="rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-3 min-w-0">
                    <CharAvatar startNumber={t.start_number} img={t.avatar ?? undefined} color={t.color} size={44} />
                    <span className="min-w-0">
                      <span className="block font-bebas tracking-wide text-[11px]" style={{ color: t.color }}>
                        #{t.start_number}
                      </span>
                      <span className="block font-fredoka font-600 text-white truncate">{t.team_name}</span>
                    </span>
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {t.is_dummy && (
                      <span className="font-bebas text-[10px] tracking-wide text-[#FB923C] border border-[#FB923C]/40 rounded-full px-2 py-0.5">
                        TEST
                      </span>
                    )}
                    <button
                      onClick={() => setAvatarPick(avatarPick === t.id ? null : t.id)}
                      className="font-nunito text-xs text-[#D4AF37] hover:text-white border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-full px-3 py-1.5 transition-all"
                    >
                      Bild
                    </button>
                    <button
                      onClick={() => setQrTeam(qrTeam?.id === t.id ? null : t)}
                      className="font-nunito text-xs text-[#52B788] hover:text-white border border-[#52B788]/30 hover:border-[#52B788] rounded-full px-3 py-1.5 transition-all"
                    >
                      QR
                    </button>
                    {confirmDel === t.id ? (
                      <>
                        <button
                          onClick={() => removeTeam(t.id)}
                          disabled={busyId === t.id}
                          className="font-bebas text-xs tracking-wide px-3 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-500 disabled:opacity-50"
                        >
                          {busyId === t.id ? '…' : 'Ja, löschen'}
                        </button>
                        <button
                          onClick={() => setConfirmDel(null)}
                          className="font-nunito text-xs text-white/50 hover:text-white px-2 py-1.5"
                        >
                          Abbr.
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDel(t.id)}
                        className="font-nunito text-xs text-red-400/70 hover:text-red-400 border border-red-500/20 hover:border-red-500/50 rounded-full px-3 py-1.5 transition-all"
                      >
                        Löschen
                      </button>
                    )}
                  </div>
                </div>

                {avatarPick === t.id && (
                  <div className="mt-4 pt-4 border-t border-[#1E4028]">
                    <p className="font-bebas text-xs tracking-[0.15em] text-[#52B788] mb-2">CHARAKTER WÄHLEN</p>
                    <div className="flex flex-wrap gap-2">
                      {TEAM_AVATARS.map((src) => (
                        <button
                          key={src}
                          onClick={() => chooseAvatar(t.id, src)}
                          className={`rounded-full transition-transform ${t.avatar === src ? 'ring-2 ring-[#D4AF37] scale-105' : 'opacity-80 hover:opacity-100'}`}
                        >
                          <CharAvatar img={src} color={t.color} size={52} />
                        </button>
                      ))}
                    </div>
                    <p className="font-nunito text-xs text-white/30 mt-2">
                      Weitere Figuren kommen mit dem Charakter-Pack dazu.
                    </p>
                  </div>
                )}

                {qrTeam?.id === t.id && (
                  <div className="mt-4 pt-4 border-t border-[#1E4028] flex flex-col sm:flex-row items-center gap-4">
                    <div className="bg-white p-2 rounded-lg">
                      <QrCode value={`${origin}/team/${t.self_code}`} size={150} />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="font-bebas text-xs tracking-[0.15em] text-[#52B788] mb-1">
                        TEAM-LINK (eigene Ergebnisse)
                      </p>
                      <a
                        href={`/team/${t.self_code}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-nunito text-sm text-[#D4AF37] hover:underline break-all"
                      >
                        {origin}/team/{t.self_code}
                      </a>
                      <p className="font-nunito text-xs text-white/40 mt-2">
                        Code: <span className="font-bebas tracking-widest text-white">{t.self_code}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border border-[#1E4028] bg-[#111E13] px-5 py-3">
      <p className="font-bebas text-3xl leading-none" style={{ color: accent }}>
        {value}
      </p>
      <p className="font-nunito text-xs text-white/40 mt-1">{label}</p>
    </div>
  );
}
