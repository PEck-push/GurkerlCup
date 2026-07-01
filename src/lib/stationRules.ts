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
    how: 'Jeder Spieler hat 8 Würfe auf Boards in 3 / 5 / 7 m. Vor jedem Wurf die Zone ansagen – je weiter, desto mehr Punkte (bis 8 Pkt ins Loch).',
    scoring: 'Alle Punkte der 3 Spieler werden addiert – höchste Teamsumme gewinnt.',
  },
  schwammstaffel: {
    how: '3 Minuten: Schwamm eintunken, durch den Parcours (Slalom, unten durch, oben drüber), in Kübel B auspressen, zurücklaufen & übergeben.',
    scoring: 'Meiste Gramm Wasser (per Waage) im Zielkübel nach 3 Minuten.',
  },
  kazoomeister: {
    how: 'Ein Spieler summt bekannte Songs auf dem Kazoo, die beiden anderen raten. Nicht gewusste Songs können weitergegeben werden. 1:30 Min.',
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
    how: 'Leere Gurkengläser stehen als Pyramide/Reihe. Jedes Teammitglied hat 5 Bälle (Beer-Pong-Stil, ggf. mit Aufpraller).',
    scoring: 'Jedes getroffene Glas = 1 Punkt – höchste Gesamtanzahl gewinnt.',
  },
};
