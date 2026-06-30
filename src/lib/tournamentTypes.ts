/**
 * Geteilte Typen für das Turnier-Live-System (Client + Server).
 * Spiegeln die Supabase-Tabellen gc_config / gc_teams / gc_scores wider.
 */

export type Phase = 'setup' | 'opening' | 'phase_a' | 'reveal' | 'phase_b' | 'podium';
export type BeamerRotation = 'auto' | 'logo' | 'progress' | 'countdown';
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
  finished: boolean;
  card_double: boolean;
  card_second: boolean;
  manual_rank: number | null;
  updated_at: string;
}

/** Spezielle discipline_id für die Spritzerwertung (fließt NICHT in die Gesamtpunkte). */
export const SPRITZER_ID = 'spritzer';

/** Default-Punktetabelle (entspricht gc_config-Default in der Migration). */
export const DEFAULT_POINTS_TABLE: PointsTable = {
  phase_a: [12, 10, 8, 6, 4, 2],
  phase_a_floor: 1,
  opening: [12, 10, 8, 6, 4, 2],
  opening_floor: 1,
  'riesen-ringerl': [20, 18, 16, 14, 12, 10, 8, 6, 4, 2],
  'riesen-ringerl_floor': 1,
  'baelle-chaos': [40, 36, 32, 28, 24, 20, 16, 12, 8, 4],
  'baelle-chaos_floor': 2,
};
