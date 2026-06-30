'use client';

import { useEffect, useState } from 'react';
import { useGcConfig } from '@/lib/useRealtime';
import { DEFAULT_POINTS_TABLE, type PointsTable } from '@/lib/tournamentTypes';

const GROUPS: { key: string; label: string }[] = [
  { key: 'opening', label: 'Eröffnung' },
  { key: 'phase_a', label: 'Phase A (Stationen)' },
  { key: 'riesen-ringerl', label: 'Riesen-Ringerl' },
  { key: 'baelle-chaos', label: 'Blindes Chaos (Finale ×2)' },
];

export default function PointsEditor() {
  const { config } = useGcConfig();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [floors, setFloors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!config) return;
    const pt = config.points_table ?? DEFAULT_POINTS_TABLE;
    const d: Record<string, string> = {};
    const f: Record<string, string> = {};
    for (const g of GROUPS) {
      d[g.key] = ((pt[g.key] as number[]) ?? []).join(', ');
      f[g.key] = String((pt[`${g.key}_floor`] as number) ?? 1);
    }
    setDraft(d);
    setFloors(f);
  }, [config]);

  async function save() {
    setError('');
    const pt: Record<string, number[] | number> = {};
    for (const g of GROUPS) {
      const arr = (draft[g.key] ?? '')
        .split(/[,\s]+/)
        .map((x) => x.trim())
        .filter(Boolean)
        .map(Number);
      if (arr.some((n) => !Number.isFinite(n))) {
        setError(`Ungültige Punkte bei "${g.label}".`);
        return;
      }
      const floor = Number(floors[g.key]);
      if (!Number.isFinite(floor)) {
        setError(`Ungültiger Floor bei "${g.label}".`);
        return;
      }
      pt[g.key] = arr;
      pt[`${g.key}_floor`] = floor;
    }
    setStatus('saving');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points_table: pt as PointsTable }),
      });
      if (!res.ok) {
        const dd = await res.json().catch(() => ({}));
        setError(dd.error ?? 'Speichern fehlgeschlagen.');
        setStatus('idle');
        return;
      }
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500);
    } catch {
      setError('Netzwerkfehler.');
      setStatus('idle');
    }
  }

  function reset() {
    const d: Record<string, string> = {};
    const f: Record<string, string> = {};
    for (const g of GROUPS) {
      d[g.key] = (DEFAULT_POINTS_TABLE[g.key] as number[]).join(', ');
      f[g.key] = String(DEFAULT_POINTS_TABLE[`${g.key}_floor`] as number);
    }
    setDraft(d);
    setFloors(f);
  }

  if (!config) return <p className="font-nunito text-white/40 text-sm py-10 text-center">Lädt…</p>;

  return (
    <div className="space-y-5 max-w-2xl">
      <p className="font-nunito text-sm text-white/50">
        Punkte je Platz (Platz 1 = erster Wert). Werte unterhalb der Liste bekommen den Floor-Wert.
      </p>

      {GROUPS.map((g) => (
        <div key={g.key} className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
          <h3 className="font-fredoka font-600 text-white mb-3">{g.label}</h3>
          <label className="block font-bebas text-xs tracking-[0.15em] text-[#52B788] mb-1">
            PUNKTE (Komma-getrennt)
          </label>
          <input
            value={draft[g.key] ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, [g.key]: e.target.value }))}
            className="w-full rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-3 py-2.5 font-nunito text-white text-sm outline-none focus:border-[#D4AF37]/50 mb-3"
          />
          <label className="block font-bebas text-xs tracking-[0.15em] text-[#52B788] mb-1">
            FLOOR (ab dem letzten Platz)
          </label>
          <input
            value={floors[g.key] ?? ''}
            onChange={(e) => setFloors((f) => ({ ...f, [g.key]: e.target.value }))}
            className="w-24 rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-3 py-2.5 font-bebas text-center text-white text-sm outline-none focus:border-[#D4AF37]/50"
          />
        </div>
      ))}

      {error && <p className="font-nunito text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button onClick={save} disabled={status === 'saving'} className="btn-gold px-6 py-3 rounded-full disabled:opacity-50">
          {status === 'saving' ? 'Speichert…' : status === 'saved' ? '✓ Gespeichert' : 'Punktetabelle speichern'}
        </button>
        <button
          onClick={reset}
          className="font-nunito text-sm text-white/50 hover:text-white px-4 py-3 rounded-full border border-white/10 hover:border-white/30"
        >
          Standard wiederherstellen
        </button>
      </div>
    </div>
  );
}
