/**
 * Geteilte Typen für das Turnier-Live-System (Client + Server).
 * Spiegeln die Supabase-Tabellen gc_config / gc_teams / gc_scores wider.
 */

export type Phase = 'setup' | 'opening' | 'phase_a' | 'reveal' | 'phase_b' | 'podium';
export type BeamerRotation = 'auto' | 'logo' | 'progress' | 'countdown' | 'spritzer';
export type BeamerView = 'total' | 'finale';

/** Punktetabelle: pro Gruppe ein Array + "<gruppe>_floor" als Mindestpunkte ab dem letzten Listeneintrag. */
export interface PointsTable {
  phase_a: number[];
  phase_a_floor: number;
  opening: number[];
  opening_floor: number;
  'riesen-ringerl': number[];
  'riesen-ringerl_floor': number;
  'baelle-chaos': number[];
  'baelle-chaos_floor': number;
  [key: string]: number[] | number;
}

export interface GcConfig {
  id: number;
  phase: Phase;
  reveal_step: number;
  reveal_running: boolean;
  opening_revealed: boolean;
  spritzer_revealed: boolean;
  beamer_rotation: BeamerRotation;
  beamer_view: BeamerView;
  countdown_target: string | null;
  slide_seconds: number;
  test_mode: boolean;
  points_table: PointsTable;
  updated_at: string;
}

export interface GcTeam {
  id: string;
  registration_id: string | null;
  team_name: string;
  start_number: number;
  color: string;
  emoji: string;
  avatar: string | null;
  self_code: string;
  checked_in: boolean;
  is_dummy: boolean;
  card_double_used: string | null;
  card_second_used: string | null;
  created_at: string;
}

export interface GcScore {
  id: string;
  team_id: string;
  discipline_id: string;
  raw_value: number | null;
  p1: number | null;
  p2: number | null;
  p3: number | null;
  finished: boolean;
  card_double: boolean;
  card_second: boolean;
  manual_rank: number | null;
  updated_at: string;
}

/** Spezielle discipline_id für die Spritzerwertung (fließt NICHT in die Gesamtpunkte). */
export const SPRITZER_ID = 'spritzer';

/**
 * Default-Punktetabelle (entspricht gc_config-Default in der Migration).
 * Hybrid-System (bis 25 Teams, Gewichtung wie Regelwerk, Finale = 2× Ringerl):
 *  - Eröffnung/Phase A: Podium in 2er-Schritten (14·12·10), dann 1er-Schritte
 *    bis Platz 10, ab Platz 11 fixer Boden von 2 Punkten
 *  - Ringerl/Finale: gestufte Gruppen, Sieg ≈ 1,7× bzw. 3,4× Stationssieg
 */
export const DEFAULT_POINTS_TABLE: PointsTable = {
  phase_a: [14, 12, 10, 9, 8, 7, 6, 5, 4, 3],
  phase_a_floor: 2,
  opening: [14, 12, 10, 9, 8, 7, 6, 5, 4, 3],
  opening_floor: 2,
  'riesen-ringerl': [24, 18, 14, 10, 10, 10, 7, 7, 7, 7],
  'riesen-ringerl_floor': 4,
  'baelle-chaos': [48, 36, 28, 20, 20, 20, 14, 14, 14, 14],
  'baelle-chaos_floor': 8,
};
