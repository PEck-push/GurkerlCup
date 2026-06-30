'use client';

import { useMemo, useState } from 'react';
import {
  disciplines,
  SCORED_DISCIPLINE_IDS,
  SCORING_META,
  getDiscipline,
} from '@/lib/disciplines';
import { liveStandings } from '@/lib/scoring';
import { DEFAULT_POINTS_TABLE, type GcScore, type GcTeam } from '@/lib/tournamentTypes';
import { formatSeconds, parseTimeToSeconds } from '@/lib/timeFormat';
import { saveScore } from '@/lib/offlineQueue';
import { useGcConfig, useGcScores, useGcTeams } from '@/lib/useRealtime';
import TeamBadge from './TeamBadge';

export default function ScoreMatrix() {
  const { data: teams } = useGcTeams();
  const { data: scores, refetch } = useGcScores();
  const { config } = useGcConfig();

  const activeTeams = useMemo(
    () => teams.filter((t) => t.checked_in).sort((a, b) => a.start_number - b.start_number),
    [teams]
  );

  const pointsTable = config?.points_table ?? DEFAULT_POINTS_TABLE;
  const standings = useMemo(
    () => liveStandings(activeTeams, scores, pointsTable),
    [activeTeams, scores, pointsTable]
  );

  const teamById = useMemo(() => {
    const m = new Map<string, GcTeam>();
    for (const t of activeTeams) m.set(t.id, t);
    return m;
  }, [activeTeams]);

  const cols = SCORED_DISCIPLINE_IDS;

  if (activeTeams.length === 0) {
    return (
      <p className="font-nunito text-white/40 text-sm py-10 text-center">
        Noch keine Teams eingecheckt.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {standings.goldTie && (
        <div className="rounded-xl border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-4 py-3">
          <p className="font-fredoka font-700 text-[#F0CE67]">⚔️ Gleichstand um Platz 1!</p>
          <p className="font-nunito text-sm text-white/70 mt-1">
            {standings.goldTieTeamIds.map((id) => teamById.get(id)?.team_name).filter(Boolean).join(' & ')}{' '}
            – Live-Stechen vor Ort entscheidet.
          </p>
        </div>
      )}

      {/* Live-Gesamtranking */}
      <div>
        <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788] mb-3">
          LIVE-GESAMTRANKING (nur Admin sichtbar)
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-[#1E4028]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#111E13]">
                <th className="font-bebas text-xs tracking-wide text-[#52B788] px-3 py-3 text-left sticky left-0 bg-[#111E13]">
                  #
                </th>
                <th className="font-bebas text-xs tracking-wide text-[#52B788] px-3 py-3 text-left sticky left-10 bg-[#111E13]">
                  Team
                </th>
                {cols.map((id) => (
                  <th
                    key={id}
                    title={getDiscipline(id)?.name}
                    className="font-bebas text-xs text-[#52B788] px-2 py-3 text-center"
                  >
                    {getDiscipline(id)?.emoji}
                  </th>
                ))}
                <th className="font-bebas text-xs tracking-wide text-[#D4AF37] px-3 py-3 text-right">
                  Σ
                </th>
              </tr>
            </thead>
            <tbody>
              {standings.rows.map((row) => {
                const t = teamById.get(row.teamId);
                if (!t) return null;
                return (
                  <tr key={row.teamId} className="border-t border-[#1E4028]/60">
                    <td className="px-3 py-2.5 font-bebas text-[#D4AF37] sticky left-0 bg-[#0A1A0C]">
                      {row.finalRank}
                    </td>
                    <td className="px-3 py-2.5 sticky left-10 bg-[#0A1A0C]">
                      <TeamBadge color={t.color} emoji={t.emoji} name={t.team_name} size="sm" />
                    </td>
                    {cols.map((id) => (
                      <td key={id} className="px-2 py-2.5 text-center font-nunito text-white/70">
                        {row.perDiscipline[id] ? row.perDiscipline[id] : '·'}
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-right font-bebas text-lg text-white">{row.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="font-nunito text-xs text-white/30 mt-2">
          Spalten = Disziplinen (Punkte). Σ = Gesamtpunkte. Reihenfolge inkl. Countback-Tiebreak.
        </p>
      </div>

      {/* Korrektur */}
      <CorrectionEditor teams={activeTeams} scores={scores} onSaved={refetch} />
    </div>
  );
}

function CorrectionEditor({
  teams,
  scores,
  onSaved,
}: {
  teams: GcTeam[];
  scores: GcScore[];
  onSaved: () => void;
}) {
  const [teamId, setTeamId] = useState('');
  const [discId, setDiscId] = useState('');
  const [value, setValue] = useState('');
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState('');

  const meta = discId ? SCORING_META[discId] : undefined;
  const isTime = meta?.inputMode === 'time';
  const isElim = meta?.inputMode === 'elimination';

  function loadCurrent(tId: string, dId: string) {
    const s = scores.find((x) => x.team_id === tId && x.discipline_id === dId);
    const m = SCORING_META[dId];
    if (!s) {
      setValue('');
      setFinished(false);
      return;
    }
    if (m?.inputMode === 'elimination') setValue(s.manual_rank != null ? String(s.manual_rank) : '');
    else if (m?.inputMode === 'time') setValue(s.raw_value != null ? formatSeconds(s.raw_value) : '');
    else setValue(s.raw_value != null ? String(s.raw_value) : '');
    setFinished(s.finished);
  }

  async function save() {
    if (!teamId || !discId) return;
    setError('');
    setStatus('saving');

    const body: Record<string, unknown> = { team_id: teamId, discipline_id: discId, finished };
    if (isElim) {
      body.manual_rank = value.trim() === '' ? null : Number(value);
    } else if (value.trim() === '') {
      body.raw_value = null;
    } else {
      const raw = isTime ? parseTimeToSeconds(value) : Number(value.replace(',', '.'));
      if (raw == null || !Number.isFinite(raw)) {
        setError('Wert ungültig.');
        setStatus('idle');
        return;
      }
      body.raw_value = raw;
    }

    const res = await saveScore(body as never);
    if (res.status === 'ok' || res.status === 'queued') {
      setStatus('saved');
      onSaved();
      setTimeout(() => setStatus('idle'), 1200);
    } else {
      setError(res.message);
      setStatus('idle');
    }
  }

  return (
    <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
      <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788] mb-3">KORREKTUR</h3>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <select
          value={teamId}
          onChange={(e) => {
            setTeamId(e.target.value);
            if (discId) loadCurrent(e.target.value, discId);
          }}
          className="rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-3 py-2.5 font-nunito text-white text-sm outline-none focus:border-[#D4AF37]/50"
        >
          <option value="">Team wählen…</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              #{t.start_number} {t.team_name}
            </option>
          ))}
        </select>
        <select
          value={discId}
          onChange={(e) => {
            setDiscId(e.target.value);
            if (teamId) loadCurrent(teamId, e.target.value);
          }}
          className="rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-3 py-2.5 font-nunito text-white text-sm outline-none focus:border-[#D4AF37]/50"
        >
          <option value="">Disziplin wählen…</option>
          {disciplines
            .filter((d) => SCORING_META[d.id])
            .map((d) => (
              <option key={d.id} value={d.id}>
                {d.emoji} {d.name}
              </option>
            ))}
        </select>
      </div>

      {teamId && discId && (
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={isElim ? 'Platz' : isTime ? 'm:ss.cs' : meta?.inputUnit ?? 'Wert'}
            className="w-32 rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-3 py-2.5 font-bebas text-lg text-center text-white outline-none focus:border-[#D4AF37]/60"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={finished} onChange={(e) => setFinished(e.target.checked)} />
            <span className="font-nunito text-sm text-white/70">fertig</span>
          </label>
          <button
            onClick={save}
            disabled={status === 'saving'}
            className="btn-gold px-5 py-2.5 rounded-full text-sm disabled:opacity-50"
          >
            {status === 'saving' ? 'Speichert…' : status === 'saved' ? '✓ Gespeichert' : 'Speichern'}
          </button>
          {error && <span className="font-nunito text-sm text-red-400">{error}</span>}
        </div>
      )}
      <p className="font-nunito text-xs text-white/30 mt-3">
        Karten-Korrekturen am besten direkt in der /score-Eingabe vornehmen.
      </p>
    </div>
  );
}
