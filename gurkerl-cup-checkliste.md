# 🥒 Gurkerl Cup 2026 – Checkliste (18. Juli 2026, Pöttsching)

> Alles Spiel-Relevante auf einen Blick. Einkaufsmengen siehe `gurkerl-cup-einkaufsliste.csv` (geplant für **bis zu 25 Teams**).

---

## 1) Wochen vorher – Einkauf & Vorbereitung
- [ ] Komplette **Einkaufsliste** abarbeiten (CSV) – v. a. Verbrauchsmaterial (Muttern, Wasserbomben, Plastikbälle, Kazoos)
- [ ] Entscheidung **Biathlon**: Team-Ski *oder* Bollerwagen? · Schießstand **Leitergolf** *oder* **Nerf**?
- [ ] **Gurkengläser** sammeln/leeren (6–10 saubere)
- [ ] **Kazoo-Song-Kärtchen** aus der 250-Songs-CSV drucken, laminieren, schneiden
- [ ] **Gurkerl Pass + je 2 Joker-Karten** pro Team drucken/laminieren
- [ ] **Station-Schilder** (Name + Kurzregel) drucken
- [ ] **Pokale + Goldene Gurke** besorgen
- [ ] Netz, Cornhole-Boards, Waage, Flutlicht, Beamer: **„vorhanden?"-Punkte klären**

## 2) Live-System (App) – vorab scharf machen  ⚠️ wichtig
- [ ] **Vercel Production-Env gesetzt:** `ADMIN_PASSWORD`, `SCORE_PASSWORD`, `BEAMER_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
      *(ohne SCORE_/BEAMER_PASSWORD schlägt der Login auf `/score` und `/beamer` fehl!)*
- [ ] **Supabase „aufwecken"** 1–2 Tage vorher (Free-Tier pausiert nach Inaktivität) – kurz die Live-Seite/Admin öffnen
- [ ] Migration ist eingespielt ✅ (bereits erledigt: `gc_config/gc_teams/gc_scores`)
- [ ] **Punkte-Raster prüfen** im Admin (auf 25 Teams ausgelegt: Eröffnung/Stationen linear „26 − Platz" = 25…1 · Ringerl 40·30·24, 4.–6. je 16, 7.–10. je 12, 11.–15. je 8, ab 16. je 6 · Bälle Chaos exakt das Doppelte)
- [ ] **Probelauf** mit Dummy-Teams (Admin → Test/Reset), alle Phasen einmal durchklicken → danach **Reset**
- [ ] **Passwörter** an Koordinatoren / Beamer-Betreuer verteilen

## 3) Am Eventtag – Check-In (ab 14:30)
- [ ] Teams **einchecken** (Admin → Check-In), Walk-Ins anlegen
- [ ] Jedes Team wählt sein **Avatar-Bild**
- [ ] **Team-Laufblätter (A4)** + **QR-Blätter** drucken und austeilen
- [ ] **Gurkerl Pass + Joker-Karten** übergeben
- [ ] Koordinator-Handys: bei `/score` einloggen · Beamer: `/beamer` einloggen → **Vollbild** + **Ton entsperren**

## 4) Aufbau pro Station
- [ ] **Eröffnung – Mutter Stapeln:** Bänke + je Team 1 Stab & 6 Muttern bereitlegen · Fähnchen-Station mit nummerierten Fähnchen (1–25) aufstellen
- [ ] **Station 1 – Simon:** Gerät + Batterien testen (2 Versuche pro Spieler)
- [ ] **Station 2 – Cornhole:** 4 Ziele markieren – grüner Ring 4 m, Boards bei 5 m & 9 m, Reifen 10 m · Säckchen bereitlegen
- [ ] **Station 3 – Schwammstaffel:** Eimer voll / Kübel auf Waage / Parcours (Slalom + drunter + drüber)
- [ ] **Station 4 – Kazoomeister:** Kazoos + Kärtchen-Box + Desinfektion
- [ ] **Station 5 – Biathlon:** Strecke + Schießstand + Gurken-Ziele + Straf-Hütchen
- [ ] **Station 6 – Wasserbomben:** ab 3 m markieren, Bomben gefüllt bereit, Handtücher
- [ ] **Station 7 – Gurkerlglasl:** Gläser als Pyramide, Aufprall-Linie am Tisch markieren, viele TT-Bälle (1 Min/Spieler, Team sammelt Bälle ein)
- [ ] **Phase B – Riesen-Ringerl:** Netz + Ball + Feldlinien (3 Durchgänge, Ø-Platz zählt)
- [ ] **Phase B – Bälle Chaos:** Feld abgegrenzt, Bälle (inkl. gold) verteilt, Augenbinden, Sammelkübel je Team

## 5) Ablauf / Timeline (aus Regelwerk)
- [ ] **14:30** Ankunft & Registrierung · Pässe/Joker ausgeben
- [ ] **15:15** OPENING **Mutter Stapeln** – alle gleichzeitig · Teams sprinten zur Fähnchen-Station, ziehen ihr Platz-Fähnchen und melden sich · Turnierleitung trägt die Plätze im Admin (Steuerung → Eröffnung) ein
- [ ] **15:30** Phase A Start – 7 Stationen offen, freie Reihenfolge (Beamer: Fortschritt/Logo/Countdown)
- [ ] **19:30** ⛔ **Phase A ENDE (harte Deadline!)** – offene Stationen = 0 Pkt · Rankings berechnen
- [ ] **19:45** **Zwischenstand-Reveal** – Beamer Platz für Platz enthüllen (Slot-Machine + Sound)
- [ ] **20:00** Phase B **Riesen-Ringerl** – 3 Durchgänge, je Durchgang Ausgeschiedene live antippen (Ø-Platz zählt)
- [ ] **20:45** FINALE **Bälle Chaos** (×2 Punkte!) – Punkte live eingeben, Balken sortieren um
- [ ] **21:30** **Siegerehrung** – Podest 3→2→1 + Konfetti · **Spritzerwertung** einblenden
- [ ] Danach: WM-Spiel um Platz 3 / Fest

## 6) Rollen während des Turniers
- [ ] **Scorekeeper/Admin:** Phasen schalten, Korrekturen, Reveal moderieren
- [ ] **Stationsbetreuer (pro Station):** Wert eintragen, „fertig"-Haken, Joker prüfen (max. 1/Spiel, nur Phase A)
- [ ] **Beamer-Betreuer:** Szenen/Rotation steuern, Ton, Vollbild
- [ ] **Backup:** pro Station Stoppuhr + Klemmbrett + Zettel (falls WLAN/Handy streikt)

## 7) Nach dem Turnier
- [ ] Ergebnisse sichern (Notfall-Rangliste als PDF drucken)
- [ ] Material einsammeln, Müll, Leihgaben zurück
- [ ] Fotos/Videos vom Podest 📸

---
### Joker-Erinnerung
**Doppel Gurkerl** = Rangpunkte dieser Station ×2 (vor Spielbeginn ansagen, gilt auch bei schlechtem Ergebnis).
**2nd Chance** = Station nochmal spielen – **der 2. Versuch zählt immer!** Nur Phase A + Eröffnung, max. 1 Joker pro Spiel.
