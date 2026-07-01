-- ============================================================
-- Gurkerl Cup 2026 – Turnier-Live-System Migration
-- Tabellen: gc_config, gc_teams, gc_scores
-- Dieses SQL im Supabase SQL Editor ausführen (Projekt GurkerlCup).
-- Additiv: lässt gurkerl_registrations unberührt.
-- PG 17: gen_random_uuid() ist eingebaut (kein pgcrypto nötig).
-- ============================================================

-- ---------- gc_config: Singleton-Zeile für Phasen-/Reveal-State + Punktetabellen ----------
CREATE TABLE IF NOT EXISTS gc_config (
  id                int PRIMARY KEY DEFAULT 1,
  phase             text NOT NULL DEFAULT 'setup',     -- setup|opening|phase_a|reveal|phase_b|podium
  reveal_step       int  NOT NULL DEFAULT 0,           -- Schrittzähler 19:45-Reveal (von hinten)
  reveal_running    boolean NOT NULL DEFAULT false,    -- Slot-Machine aktiv (Beamer-Trigger)
  opening_revealed  boolean NOT NULL DEFAULT false,    -- Eröffnungs-Mini-Reveal gezeigt
  spritzer_revealed boolean NOT NULL DEFAULT false,    -- Spritzer-Mini-Reveal gezeigt
  beamer_rotation   text NOT NULL DEFAULT 'auto',      -- auto|logo|progress|countdown
  beamer_view       text NOT NULL DEFAULT 'total',     -- total|finale (Phase-B-Balken)
  countdown_target  timestamptz,                       -- Ziel für "Countdown bis 19:30"
  slide_seconds     int NOT NULL DEFAULT 12,           -- Dauer pro Beamer-Slide (Rotation)
  test_mode         boolean NOT NULL DEFAULT false,    -- Probemodus-Badge
  timer_state       text NOT NULL DEFAULT 'idle',      -- Auftakt-Timer: idle|armed|running|stopped
  timer_discipline_id text,                            -- betroffene Station (i.d.R. 'mutter-stapeln')
  timer_start_at    timestamptz,                       -- synchroner GO-Zeitpunkt (Teams stoppen selbst)
  points_table      jsonb NOT NULL DEFAULT '{
    "phase_a":              [12,10,8,7,6,5,4,3,2,1],
    "phase_a_floor":        1,
    "opening":              [12,10,8,7,6,5,4,3,2,1],
    "opening_floor":        1,
    "riesen-ringerl":       [20,15,12,8,8,8],
    "riesen-ringerl_floor": 4,
    "baelle-chaos":         [40,30,24,16,16,16],
    "baelle-chaos_floor":   8
  }'::jsonb,
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gc_config_singleton CHECK (id = 1)
);
INSERT INTO gc_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Nachträglich für bestehende DBs (idempotent): Auftakt-Timer-Spalten ergänzen.
ALTER TABLE gc_config
  ADD COLUMN IF NOT EXISTS timer_state         text NOT NULL DEFAULT 'idle',
  ADD COLUMN IF NOT EXISTS timer_discipline_id text,
  ADD COLUMN IF NOT EXISTS timer_start_at      timestamptz;

-- ---------- gc_teams: eingecheckte Turnier-Teams (aus Registrierung ODER Walk-In) ----------
CREATE TABLE IF NOT EXISTS gc_teams (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id  uuid REFERENCES gurkerl_registrations(id) ON DELETE SET NULL, -- null = Walk-In
  team_name        text NOT NULL,
  start_number     int  NOT NULL,
  color            text NOT NULL,
  emoji            text NOT NULL,
  avatar           text,                     -- gewähltes Charakterbild (Pfad), sonst Fallback per Startnummer
  self_code        text NOT NULL,
  checked_in       boolean NOT NULL DEFAULT true,
  is_dummy         boolean NOT NULL DEFAULT false,
  card_double_used text,    -- discipline_id wo Doppel verbraucht, sonst null
  card_second_used text,    -- discipline_id wo 2nd Chance verbraucht, sonst null
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gc_teams_start_number_unique UNIQUE (start_number),
  CONSTRAINT gc_teams_self_code_unique    UNIQUE (self_code),
  CONSTRAINT gc_teams_registration_unique UNIQUE (registration_id)
);
CREATE INDEX IF NOT EXISTS gc_teams_checked_in_idx ON gc_teams (checked_in);

-- ---------- gc_scores: eine Zeile pro (Team × Disziplin); Spritzer = discipline_id 'spritzer' ----------
CREATE TABLE IF NOT EXISTS gc_scores (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id       uuid NOT NULL REFERENCES gc_teams(id) ON DELETE CASCADE,
  discipline_id text NOT NULL,           -- id aus disciplines.ts ODER 'spritzer'
  raw_value     numeric,                 -- Rohwert (Zeit Sek., Gramm, Treffer, Punkte…); null = leer
  p1            numeric,                 -- Per-Spieler-Werte (Simon/Cornhole/Wasserbomben/Gurkerlglasl)
  p2            numeric,
  p3            numeric,
  finished      boolean NOT NULL DEFAULT false,
  card_double   boolean NOT NULL DEFAULT false,
  card_second   boolean NOT NULL DEFAULT false,
  manual_rank   int,                     -- Riesen-Ringerl: Platzierung aus Ausscheide-Reihenfolge
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gc_scores_team_discipline_unique UNIQUE (team_id, discipline_id)
);
CREATE INDEX IF NOT EXISTS gc_scores_discipline_idx ON gc_scores (discipline_id);
CREATE INDEX IF NOT EXISTS gc_scores_team_idx ON gc_scores (team_id);

-- ---------- updated_at-Trigger ----------
CREATE OR REPLACE FUNCTION gc_touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS gc_scores_touch ON gc_scores;
CREATE TRIGGER gc_scores_touch BEFORE UPDATE ON gc_scores
  FOR EACH ROW EXECUTE FUNCTION gc_touch_updated_at();

DROP TRIGGER IF EXISTS gc_config_touch ON gc_config;
CREATE TRIGGER gc_config_touch BEFORE UPDATE ON gc_config
  FOR EACH ROW EXECUTE FUNCTION gc_touch_updated_at();

-- ============================================================
-- RLS: anon darf NUR SELECT (für Realtime-Reads auf Beamer/Score/Team).
-- Alle Writes laufen über Service-Role (API-Routen) und umgehen RLS.
-- ============================================================
ALTER TABLE gc_teams  ENABLE ROW LEVEL SECURITY;
ALTER TABLE gc_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE gc_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gc_teams_anon_select"  ON gc_teams;
DROP POLICY IF EXISTS "gc_scores_anon_select" ON gc_scores;
DROP POLICY IF EXISTS "gc_config_anon_select" ON gc_config;

CREATE POLICY "gc_teams_anon_select"  ON gc_teams  FOR SELECT TO anon USING (true);
CREATE POLICY "gc_scores_anon_select" ON gc_scores FOR SELECT TO anon USING (true);
CREATE POLICY "gc_config_anon_select" ON gc_config FOR SELECT TO anon USING (true);
-- KEINE insert/update/delete-Policy für anon → Writes nur via service-role.

-- ============================================================
-- Realtime aktivieren (Postgres Changes). Falls Tabelle schon in der
-- Publication ist, Fehler ignorieren (idempotent über DO-Block).
-- ============================================================
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE gc_teams;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE gc_scores;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE gc_config;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
