/** Kurz-Regeln pro Station (aus dem Regelwerk) – für das Team-Laufblatt. */
export interface StationRule {
  how: string;
  scoring: string;
}

export const STATION_RULES: Record<string, StationRule> = {
  'hasbro-simon': {
    how: 'Jedes der 3 Teammitglieder tritt einmal am Simon/Senso-Gerät an. Der Betreuer zählt die erreichten Runden/Töne.',
    scoring: 'Die Punkte aller 3 Spieler werden addiert – höchste Teamsumme gewinnt.',
  },
  cornhole: {
    how: 'Jeder Spieler wirft auf 4 Ziele in unterschiedlicher Entfernung: Grüner Ring (4 m), zwei Cornhole-Boards (5 m, 9 m) und Reifen (10 m). Vor jedem Wurf das Ziel ansagen.',
    scoring: 'Grüner Ring 2 Pkt · Board 5 m: 1 Pkt Brett/3 Pkt Loch · Board 9 m: 2 Pkt Brett/6 Pkt Loch · Reifen 10 m: 10 Pkt. Alle Punkte der 3 Spieler addiert – höchste Teamsumme gewinnt.',
  },
  schwammstaffel: {
    how: '2 Minuten: Schwamm eintunken, durch den Parcours (Slalom, unten durch, oben drüber), in Kübel B auspressen, zurücklaufen & übergeben.',
    scoring: 'Meiste Gramm Wasser (per Waage) im Zielkübel nach 2 Minuten.',
  },
  kazoomeister: {
    how: 'Ein Spieler zieht Karten von einem Stapel und summt den jeweiligen Song auf dem Kazoo; die beiden anderen raten. Kennt er den Song nicht oder ist er zu schwer, zieht er die nächste Karte. 1:30 Min.',
    scoring: 'Jeder richtig erratene Song = 1 Punkt – meiste Songs gewinnt.',
  },
  'gurkerl-biathlon': {
    how: 'Gemeinsam auf dem Bewegungsgefährt zum Schießstand. Jeder trifft ein Ziel → weiterziehen; Fehler → ganze Strafrunde. Zeit von Start (Spieler 1) bis Ziel (Spieler 3).',
    scoring: 'Reine Zeitwertung – schnellstes Team gewinnt.',
  },
  wasserbomben: {
    how: '3 Durchgänge im Wechsel (werfen / fangen / zuschauen). Der Fänger startet bei 3 m und geht nach jedem Fang 1 m zurück – bis die Bombe platzt.',
    scoring: 'Die erreichten Weiten der 3 Durchgänge werden addiert – größte Distanz gewinnt.',
  },
  gurkerlglasl: {
    how: 'Leere Gurkengläser stehen als Pyramide/Reihe. Der Ball muss hinter einer markierten Linie auf dem Tisch aufspringen, bevor er im Glas landet – nur dann zählt der Treffer. Jeder Spieler hat 1 Minute Zeit für so viele Würfe wie möglich; Teammitglieder sammeln Bälle ein und reichen sie zurück.',
    scoring: 'Jedes getroffene Glas = 1 Punkt – höchste Gesamtanzahl gewinnt.',
  },
};
