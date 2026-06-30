'use client';

import { useState } from 'react';
import type { GcScore, GcTeam } from '@/lib/tournamentTypes';
import { SPRITZER_ID } from '@/lib/tournamentTypes';
import { saveScore } from '@/lib/offlineQueue';
import TeamBadge from '../admin/TeamBadge';

/** Spritzerwertung: Eingabe in Metern (1 m = 10 Spritzer). Zählt nicht zur Gesamtwertung. */
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

  const metersOf = (id: string) => {
    const v = values[id]?.trim().replace(',', '.') ?? '';
    const n = v === '' ? null : Number(v);
    return n != null && Number.isFinite(n) ? n : null;
  };

  async function commit(team: GcTeam) {
    const m = metersOf(team.id);
    if (values[team.id]?.trim() && m == null) return;
    await saveScore({ team_id: team.id, discipline_id: SPRITZER_ID, raw_value: m });
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
          Eingabe in <b className="text-white/80">Metern</b> · 1 m = 10 Spritzer · zählt nicht zur Gesamtwertung.
        </p>
      </div>

      <div className="space-y-2">
        {teams.map((t) => {
          const m = metersOf(t.id);
          const spritzer = m != null ? Math.round(m * 10) : null;
          return (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#1E4028] bg-[#0F1A0D] px-4 py-2.5"
            >
              <TeamBadge color={t.color} emoji={t.emoji} name={t.team_name} startNumber={t.start_number} />
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-nunito text-xs text-white/40 w-16 text-right">
                  {spritzer != null ? `${spritzer} 🍷` : ''}
                </span>
                <div className="relative">
                  <input
                    inputMode="decimal"
                    value={values[t.id] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [t.id]: e.target.value }))}
                    onBlur={() => commit(t)}
                    onKeyDown={(e) => e.key === 'Enter' && commit(t)}
                    placeholder="0"
                    className="w-24 rounded-lg bg-[#0A1A0C] border border-[#1E4028] pl-2 pr-7 py-2 font-bebas text-xl text-center text-white outline-none focus:border-[#D4AF37]/60"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 font-nunito text-xs text-white/40">m</span>
                </div>
                <span className="w-4 text-[#52B788]">{savedId === t.id ? '✓' : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
