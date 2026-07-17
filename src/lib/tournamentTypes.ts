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
 * Ausgelegt auf bis zu 25 Teams, Gewichtung wie im Regelwerk
 * (Station : Ringerl : Finale ≈ 3 : 5 : 10, Finale = 2× Ringerl):
 *  - Eröffnung/Phase A: linear, Punkte = 26 − Platz (Platz 1 = 25 … Platz 25 = 1)
 *  - Phase B: gestufte Gruppen wie im Regelwerk
 */
export const DEFAULT_POINTS_TABLE: PointsTable = {
  phase_a: [25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  phase_a_floor: 1,
  opening: [25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  opening_floor: 1,
  'riesen-ringerl': [40, 30, 24, 16, 16, 16, 12, 12, 12, 12, 8, 8, 8, 8, 8],
  'riesen-ringerl_floor': 6,
  'baelle-chaos': [80, 60, 48, 32, 32, 32, 24, 24, 24, 24, 16, 16, 16, 16, 16],
  'baelle-chaos_floor': 12,
};
