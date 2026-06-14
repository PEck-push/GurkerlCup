-- Gurkerl Cup 2026 – Supabase Migration
-- Tabelle: gurkerl_registrations
-- Dieses SQL im Supabase SQL Editor ausführen

CREATE TABLE IF NOT EXISTS gurkerl_registrations (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name   text NOT NULL,
  player1     text NOT NULL,
  player2     text NOT NULL,
  player3     text NOT NULL,
  email       text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- Kein Doppelanmeldung: gleiches Team darf nur einmal registrieren
ALTER TABLE gurkerl_registrations
  ADD CONSTRAINT unique_team_name UNIQUE (team_name);

-- Row Level Security aktivieren
ALTER TABLE gurkerl_registrations ENABLE ROW LEVEL SECURITY;

-- Anonyme Nutzer dürfen INSERT ausführen (Formular)
CREATE POLICY "allow_anon_insert"
  ON gurkerl_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- SELECT und andere Operationen nur für authenticated (Admin)
CREATE POLICY "allow_auth_all"
  ON gurkerl_registrations
  FOR ALL
  TO authenticated
  USING (true);
