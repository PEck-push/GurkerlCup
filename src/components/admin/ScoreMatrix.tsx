'use client';

import { useMemo, useState } from 'react';
import {
  disciplines,
  SCORED_DISCIPLINE_IDS,
  SCORING_META,
  getDiscipline,
} from '@/lib/disciplines';
import { liveStandings, rankDisciplines, spritzerRanking } from '@/lib/scoring';
import {
  DEFAULT_POINTS_TABLE,
  SPRITZER_ID,
  type GcScore,
  type GcTeam,
  type PointsTable,
} from '@/lib/tournamentTypes';
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

      {/* Kontroll-Ansicht: Rangfolge + Rohwerte je Spiel */}
      <DisciplineDetail teams={activeTeams} scores={scores} pointsTable={pointsTable} />

      {/* Korrektur */}
      <CorrectionEditor teams={activeTeams} scores={scores} onSaved={refetch} />
    </div>
  );
}

/** Rangfolge + Rohwerte eines einzelnen Spiels – zur Live-Kontrolle der Eingaben. */
export function DisciplineDetail({
  teams,
  scores,
  pointsTable,
}: {
  teams: GcTeam[];
  scores: GcScore[];
  pointsTable: PointsTable;
}) {
  const [discId, setDiscId] = useState<string>(SCORED_DISCIPLINE_IDS[0]);
  const isSpritzer = discId === SPRITZER_ID;
  const meta = SCORING_META[discId];

  const teamById = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);
  const scoreFor = (teamId: string): GcScore | undefined =>
    scores.find((s) => s.team_id === teamId && s.discipline_id === discId);

  const rows = useMemo(() => {
    if (isSpritzer) {
      return spritzerRanking(teams, scores).map((r) => ({
        teamId: r.teamId,
        rank: r.rank,
        rawValue: r.rawValue,
        points: null as number | null,
      }));
    }
    const ranked = rankDisciplines(teams, scores, pointsTable, [discId])[discId] ?? [];
    return ranked.map((r) => ({ teamId: r.teamId, rank: r.rank, rawValue: r.rawValue, points: r.points }));
  }, [teams, scores, pointsTable, discId, isSpritzer]);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999)),
    [rows]
  );

  function wertLabel(row: (typeof rows)[number], s?: GcScore): string {
    if (isSpritzer) return row.rawValue != null ? `${row.rawValue} m` : '–';
    if (meta?.roundsAveraged) {
      return row.rawValue != null ? `Ø ${(Math.round(Number(row.rawValue) * 100) / 100).toLocaleString('de-AT')}` : '–';
    }
    if (meta?.inputMode === 'manual-place') return s?.manual_rank != null ? `Fähnchen ${s.manual_rank}` : '–';
    if (meta?.inputMode === 'time') return row.rawValue != null ? formatSeconds(Number(row.rawValue)) : '–';
    return row.rawValue != null ? `${row.rawValue} ${meta?.inputUnit ?? ''}`.trim() : '–';
  }

  function detailLabel(s?: GcScore): string {
    if (!s) return '';
    if (meta?.roundsAveraged) {
      return `Runden: ${s.p1 ?? '–'} / ${s.p2 ?? '–'} / ${s.p3 ?? '–'}`;
    }
    if (meta?.perPlayer && (s.p1 != null || s.p2 != null || s.p3 != null)) {
      return `Spieler: ${s.p1 ?? '–'} · ${s.p2 ?? '–'} · ${s.p3 ?? '–'}`;
    }
    return '';
  }

  const pickerIds = [...SCORED_DISCIPLINE_IDS, SPRITZER_ID];

  return (
    <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
      <h3 className="font-bebas text-sm tracking-[0.15em] text-[#52B788] mb-3">
        KONTROLLE JE SPIEL – RANGFOLGE & ROHWERTE
      </h3>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {pickerIds.map((id) => {
          const d = id === SPRITZER_ID ? undefined : getDiscipline(id);
          const label = id === SPRITZER_ID ? '🍷 Spritzer' : `${d?.emoji} ${d?.name}`;
          return (
            <button
              key={id}
              onClick={() => setDiscId(id)}
              className={`font-nunito text-xs px-3 py-1.5 rounded-full border transition-all ${
                discId === id
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#F0CE67]'
                  : 'border-[#1E4028] text-white/60 hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#1E4028]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#0F1A0D]">
              <th className="font-bebas text-xs tracking-wide text-[#52B788] px-3 py-2.5 text-left">Rang</th>
              <th className="font-bebas text-xs tracking-wide text-[#52B788] px-3 py-2.5 text-left">Team</th>
              <th className="font-bebas text-xs tracking-wide text-[#52B788] px-3 py-2.5 text-right">Wert</th>
              <th className="font-bebas text-xs tracking-wide text-[#52B788] px-3 py-2.5 text-left">Details</th>
              {!isSpritzer && (
                <th className="font-bebas text-xs tracking-wide text-[#D4AF37] px-3 py-2.5 text-right">Punkte</th>
              )}
              <th className="font-bebas text-xs tracking-wide text-[#52B788] px-3 py-2.5 text-center">🃏</th>
              <th className="font-bebas text-xs tracking-wide text-[#52B788] px-3 py-2.5 text-center">✓</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const t = teamById.get(row.teamId);
              if (!t) return null;
              const s = scoreFor(row.teamId);
              return (
                <tr key={row.teamId} className="border-t border-[#1E4028]/60">
                  <td className="px-3 py-2 font-bebas text-lg text-[#D4AF37]">
                    {row.rank != null ? row.rank : '–'}
                  </td>
                  <td className="px-3 py-2">
                    <TeamBadge color={t.color} emoji={t.emoji} name={t.team_name} startNumber={t.start_number} size="sm" />
                  </td>
                  <td className="px-3 py-2 text-right font-bebas text-lg text-white whitespace-nowrap">
                    {wertLabel(row, s)}
                  </td>
                  <td className="px-3 py-2 font-nunito text-xs text-white/50 whitespace-nowrap">
                    {detailLabel(s)}
                  </td>
                  {!isSpritzer && (
                    <td className="px-3 py-2 text-right font-bebas text-lg text-[#F0CE67]">
                      {row.rank != null ? row.points : '·'}
                    </td>
                  )}
                  <td className="px-3 py-2 text-center font-nunito text-xs">
                    {s?.card_double && <span className="text-[#F0CE67]" title="Doppel Gurkerl">2×</span>}
                    {s?.card_second && <span className="text-[#52B788] ml-1" title="2nd Chance">2nd</span>}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {s?.finished && <span className="text-[#52B788]">✓</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="font-nunito text-xs text-white/30 mt-2">
        Ohne Rang = noch kein Wert erfasst. Punkte hier bereits inkl. Doppel-Gurkerl.
        Beim Riesen-Ringerl zählt der Ø der 3 Durchgänge, bei der Eröffnung die Fähnchen-Nummer.
      </p>
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
  const [round, setRound] = useState(1);
  const [value, setValue] = useState('');
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState('');

  const meta = discId ? SCORING_META[discId] : undefined;
  const isTime = meta?.inputMode === 'time';
  const roundsN = meta?.roundsAveraged ?? 0; // Riesen-Ringerl: Platz je Durchgang in p1–p3
  const isPlace = !roundsN && (meta?.inputMode === 'elimination' || meta?.inputMode === 'manual-place');

  function loadCurrent(tId: string, dId: string, r: number) {
    const s = scores.find((x) => x.team_id === tId && x.discipline_id === dId);
    const m = SCORING_META[dId];
    if (!s) {
      setValue('');
      setFinished(false);
      return;
    }
    if (m?.roundsAveraged) {
      const v = r === 1 ? s.p1 : r === 2 ? s.p2 : s.p3;
      setValue(v != null ? String(v) : '');
    } else if (m?.inputMode === 'elimination' || m?.inputMode === 'manual-place') {
      setValue(s.manual_rank != null ? String(s.manual_rank) : '');
    } else if (m?.inputMode === 'time') {
      setValue(s.raw_value != null ? formatSeconds(s.raw_value) : '');
    } else {
      setValue(s.raw_value != null ? String(s.raw_value) : '');
    }
    setFinished(s.finished);
  }

  async function save() {
    if (!teamId || !discId) return;
    setError('');

    const body: Record<string, unknown> = { team_id: teamId, discipline_id: discId, finished };
    if (roundsN) {
      const rank = value.trim() === '' ? null : Number(value);
      if (rank !== null && (!Number.isFinite(rank) || rank < 1)) {
        setError('Platz ungültig.');
        return;
      }
      body[`p${round}`] = rank;
    } else if (isPlace) {
      const rank = value.trim() === '' ? null : Number(value);
      if (rank !== null && (!Number.isFinite(rank) || rank < 1)) {
        setError('Platz ungültig.');
        return;
      }
      body.manual_rank = rank;
    } else if (value.trim() === '') {
      body.raw_value = null;
    } else {
      const raw = isTime ? parseTimeToSeconds(value) : Number(value.replace(',', '.'));
      if (raw == null || !Number.isFinite(raw)) {
        setError('Wert ungültig.');
        return;
      }
      body.raw_value = raw;
    }

    setStatus('saving');
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
            if (discId) loadCurrent(e.target.value, discId, round);
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
            setRound(1);
            if (teamId) loadCurrent(teamId, e.target.value, 1);
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
          {roundsN > 0 && (
            <select
              value={round}
              onChange={(e) => {
                const r = Number(e.target.value);
                setRound(r);
                loadCurrent(teamId, discId, r);
              }}
              className="rounded-xl bg-[#0A1A0C] border border-[#1E4028] px-3 py-2.5 font-nunito text-white text-sm outline-none focus:border-[#D4AF37]/50"
            >
              {Array.from({ length: roundsN }, (_, i) => i + 1).map((r) => (
                <option key={r} value={r}>
                  Runde {r}
                </option>
              ))}
            </select>
          )}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={roundsN || isPlace ? 'Platz' : isTime ? 'm:ss.cs' : meta?.inputUnit ?? 'Wert'}
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
