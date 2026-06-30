'use client';

import { useState } from 'react';
import type { GcScore, GcTeam } from '@/lib/tournamentTypes';
import { SPRITZER_ID } from '@/lib/tournamentTypes';
import { saveScore } from '@/lib/offlineQueue';
import TeamBadge from '../admin/TeamBadge';

/** Spritzerwertung: Spaß-Sonderpreis, schnelle Wert-Eingabe pro Team. */
export default function SpritzerEntry({
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
  const initial: Record<string, string> = {};
  for (const t of teams) {
    const s = scores.find((x) => x.discipline_id === SPRITZER_ID && x.team_id === t.id);
    initial[t.id] = s?.raw_value != null ? String(s.raw_value) : '';
  }
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [savedId, setSavedId] = useState<string | null>(null);

  async function commit(team: GcTeam) {
    const v = values[team.id]?.trim() ?? '';
    const raw = v === '' ? null : Number(v.replace(',', '.'));
    if (raw != null && !Number.isFinite(raw)) return;
    await saveScore({ team_id: team.id, discipline_id: SPRITZER_ID, raw_value: raw });
    setSavedId(team.id);
    onMutate?.();
    setTimeout(() => setSavedId((s) => (s === team.id ? null : s)), 1200);
  }

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="font-nunito text-sm text-[#52B788] hover:text-white">
        ← Zurück
      </button>

      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🍷</span>
          <p className="font-bebas text-xs tracking-[0.2em] text-[#D4AF37]">SONDERWERTUNG</p>
        </div>
        <h2 className="font-fredoka font-700 text-2xl text-white">Spritzerwertung</h2>
        <p className="font-nunito text-sm text-white/50 mt-1">
          Spaß-Wertung – zählt nicht zur Gesamtwertung.
        </p>
      </div>

      <div className="space-y-2">
        {teams.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-2.5"
          >
            <TeamBadge color={t.color} emoji={t.emoji} name={t.team_name} startNumber={t.start_number} />
            <div className="flex items-center gap-2 flex-shrink-0">
              <input
                inputMode="decimal"
                value={values[t.id] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [t.id]: e.target.value }))}
                onBlur={() => commit(t)}
                onKeyDown={(e) => e.key === 'Enter' && commit(t)}
                placeholder="0"
                className="w-20 rounded-lg bg-[#0A1A0C] border border-[#1E4028] px-2 py-2 font-bebas text-xl text-center text-white outline-none focus:border-[#D4AF37]/60"
              />
              <span className="w-4 text-[#52B788]">{savedId === t.id ? '✓' : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
