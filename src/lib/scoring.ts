/**
 * Scoring-Engine für den Gurkerl Cup – pure Funktionen, keine Supabase-Imports.
 * Eingaben: Teams + Score-Zeilen + Punktetabelle. Ausgaben: Platzierungen,
 * Punkte, Gesamtranking mit Countback-Tiebreak und Gold-Tie-Flag.
 */

import {
  SCORING_META,
  SCORED_DISCIPLINE_IDS,
  disciplineIdsByPhase,
  type ScoreDirection,
} from './disciplines';
import { SPRITZER_ID, type GcScore, type GcTeam, type PointsTable } from './tournamentTypes';

export interface RankedTeam {
  teamId: string;
  rawValue: number | null;
  rank: number | null; // geteilter Platz bei Gleichstand; null = nicht gewertet
  basePoints: number; // Punkte aus dem Platz (vor Doppel)
  points: number; // basePoints * (Doppel ? 2 : 1)
  cardDouble: boolean;
}

export interface TotalRow {
  teamId: string;
  total: number;
  perDiscipline: Record<string, number>; // discipline_id -> Punkte
  placementCounts: number[]; // Index 0 = Anzahl 1. Plätze, 1 = 2. Plätze … (Countback)
}

export interface FinalRow extends TotalRow {
  finalRank: number;
}

export interface FinalRanking {
  rows: FinalRow[];
  goldTie: boolean; // Gleichstand um Platz 1 → Live-Stechen vor Ort
  goldTieTeamIds: string[];
}

export interface Standings extends FinalRanking {
  perDiscipline: Record<string, RankedTeam[]>;
}

interface RankInputRow {
  teamId: string;
  rawValue: number | null;
  cardDouble: boolean;
  manualRank: number | null;
}

/** Punkte für einen 1-basierten Platz: Tabellenwert, sonst Floor. */
export function pointsForRank(rank: number, table: number[], floor: number): number {
  if (rank < 1) return 0;
  return table[rank - 1] ?? floor;
}

/** Wertung nach Rohwert (Zeit asc / Punkte desc). Ties = geteilter Platz, nächster übersprungen. */
function rankByValue(
  rows: RankInputRow[],
  direction: ScoreDirection,
  table: number[],
  floor: number
): RankedTeam[] {
  const present = rows.filter((r) => r.rawValue != null);
  const absent = rows.filter((r) => r.rawValue == null);

  const sorted = [...present].sort((a, b) =>
    direction === 'asc'
      ? (a.rawValue as number) - (b.rawValue as number)
      : (b.rawValue as number) - (a.rawValue as number)
  );

  const ranked: RankedTeam[] = [];
  let prevValue: number | null = null;
  let prevRank = 0;

  sorted.forEach((r, i) => {
    let rank: number;
    if (prevValue !== null && r.rawValue === prevValue) {
      rank = prevRank; // Gleichstand → selber Platz
    } else {
      rank = i + 1;
      prevValue = r.rawValue as number;
      prevRank = rank;
    }
    const basePoints = pointsForRank(rank, table, floor);
    ranked.push({
      teamId: r.teamId,
      rawValue: r.rawValue,
      rank,
      basePoints,
      points: basePoints * (r.cardDouble ? 2 : 1),
      cardDouble: r.cardDouble,
    });
  });

  for (const r of absent) {
    ranked.push({
      teamId: r.teamId,
      rawValue: null,
      rank: null,
      basePoints: 0,
      points: 0,
      cardDouble: r.cardDouble,
    });
  }
  return ranked;
}

/** Wertung nach manueller Platzierung (Riesen-Ringerl: Ausscheide-Reihenfolge). */
function rankByManual(rows: RankInputRow[], table: number[], floor: number): RankedTeam[] {
  return rows.map((r) => {
    if (r.manualRank == null) {
      return { teamId: r.teamId, rawValue: null, rank: null, basePoints: 0, points: 0, cardDouble: false };
    }
    const basePoints = pointsForRank(r.manualRank, table, floor);
    return {
      teamId: r.teamId,
      rawValue: r.manualRank,
      rank: r.manualRank,
      basePoints,
      points: basePoints,
      cardDouble: false,
    };
  });
}

function tableFor(pointsTable: PointsTable, group: string): { table: number[]; floor: number } {
  const table = (pointsTable[group] as number[]) ?? [];
  const floor = (pointsTable[`${group}_floor`] as number) ?? 0;
  return { table, floor };
}

/** Rohdaten → RankedTeam[] je Disziplin für die angegebenen Disziplin-IDs. */
export function rankDisciplines(
  teams: GcTeam[],
  scores: GcScore[],
  pointsTable: PointsTable,
  disciplineIds: string[] = SCORED_DISCIPLINE_IDS
): Record<string, RankedTeam[]> {
  const scoreMap = new Map<string, GcScore>();
  for (const s of scores) scoreMap.set(`${s.team_id}|${s.discipline_id}`, s);

  const out: Record<string, RankedTeam[]> = {};
  for (const did of disciplineIds) {
    const meta = SCORING_META[did];
    if (!meta) continue;
    const { table, floor } = tableFor(pointsTable, meta.pointsGroup);
    const rows: RankInputRow[] = teams.map((t) => {
      const s = scoreMap.get(`${t.id}|${did}`);
      return {
        teamId: t.id,
        rawValue: s?.raw_value ?? null,
        cardDouble: !!s?.card_double,
        manualRank: s?.manual_rank ?? null,
      };
    });
    out[did] =
      meta.inputMode === 'elimination'
        ? rankByManual(rows, table, floor)
        : rankByValue(rows, meta.direction, table, floor);
  }
  return out;
}

function computeTotals(teams: GcTeam[], perDiscipline: Record<string, RankedTeam[]>): TotalRow[] {
  const byTeam = new Map<string, TotalRow>();
  for (const t of teams) {
    byTeam.set(t.id, { teamId: t.id, total: 0, perDiscipline: {}, placementCounts: [] });
  }
  for (const [did, ranked] of Object.entries(perDiscipline)) {
    for (const r of ranked) {
      const row = byTeam.get(r.teamId);
      if (!row) continue;
      row.perDiscipline[did] = r.points;
      row.total += r.points;
      if (r.rank != null) {
        row.placementCounts[r.rank - 1] = (row.placementCounts[r.rank - 1] ?? 0) + 1;
      }
    }
  }
  for (const row of byTeam.values()) {
    for (let i = 0; i < row.placementCounts.length; i++) {
      if (row.placementCounts[i] == null) row.placementCounts[i] = 0;
    }
  }
  return [...byTeam.values()];
}

/** Countback: mehr 1. Plätze gewinnt, dann mehr 2. usw. <0 ⇒ a vor b. */
function compareCountback(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av !== bv) return bv - av;
  }
  return 0;
}

function isTied(a: TotalRow, b: TotalRow): boolean {
  return a.total === b.total && compareCountback(a.placementCounts, b.placementCounts) === 0;
}

/** Sortiert Totals zum Endranking (Total desc, dann Countback). Flag bei Gold-Gleichstand. */
export function finalRanking(totals: TotalRow[]): FinalRanking {
  const sorted = [...totals].sort(
    (a, b) => b.total - a.total || compareCountback(a.placementCounts, b.placementCounts)
  );

  const rows: FinalRow[] = [];
  let prevRank = 0;
  sorted.forEach((row, i) => {
    let rank: number;
    if (i > 0 && isTied(sorted[i - 1], row)) {
      rank = prevRank;
    } else {
      rank = i + 1;
      prevRank = rank;
    }
    rows.push({ ...row, finalRank: rank });
  });

  let goldTie = false;
  let goldTieTeamIds: string[] = [];
  if (sorted.length >= 2 && sorted[0].total > 0 && isTied(sorted[0], sorted[1])) {
    goldTie = true;
    goldTieTeamIds = rows.filter((r) => r.finalRank === 1).map((r) => r.teamId);
  }

  return { rows, goldTie, goldTieTeamIds };
}

/** Komplettes Standings-Objekt für die angegebenen Disziplinen. */
export function computeStandings(
  teams: GcTeam[],
  scores: GcScore[],
  pointsTable: PointsTable,
  disciplineIds: string[] = SCORED_DISCIPLINE_IDS
): Standings {
  const perDiscipline = rankDisciplines(teams, scores, pointsTable, disciplineIds);
  const totals = computeTotals(teams, perDiscipline);
  const ranking = finalRanking(totals);
  return { perDiscipline, ...ranking };
}

/** Nur Eröffnung + Phase A (für den 19:45-Zwischenstand-Reveal). */
export function phaseAStandings(
  teams: GcTeam[],
  scores: GcScore[],
  pointsTable: PointsTable
): Standings {
  const ids = [...disciplineIdsByPhase('opening'), ...disciplineIdsByPhase('a')];
  return computeStandings(teams, scores, pointsTable, ids);
}

/** Gesamtwertung über alle Disziplinen (Phase A + B) – für Phase-B-Balken & Podest. */
export function liveStandings(
  teams: GcTeam[],
  scores: GcScore[],
  pointsTable: PointsTable
): Standings {
  return computeStandings(teams, scores, pointsTable, SCORED_DISCIPLINE_IDS);
}

/** Spritzerwertung separat (fließt NICHT in die Gesamtpunkte). Reine Platzierung nach Rohwert desc. */
export function spritzerRanking(
  teams: GcTeam[],
  scores: GcScore[]
): { teamId: string; rawValue: number | null; rank: number | null }[] {
  const spritzerScores = scores.filter((s) => s.discipline_id === SPRITZER_ID);
  const rows: RankInputRow[] = teams.map((t) => {
    const s = spritzerScores.find((x) => x.team_id === t.id);
    return { teamId: t.id, rawValue: s?.raw_value ?? null, cardDouble: false, manualRank: null };
  });
  // Punkte irrelevant → leere Tabelle, Floor 0; nur rank + rawValue zählen.
  return rankByValue(rows, 'desc', [], 0).map((r) => ({
    teamId: r.teamId,
    rawValue: r.rawValue,
    rank: r.rank,
  }));
}
