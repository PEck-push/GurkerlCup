export interface Discipline {
  id: string;
  name: string;
  subtitle?: string;
  category: string;
  categoryVariant: 'gold' | 'green' | 'orange' | 'red';
  emoji: string;
  bgFrom: string;
  bgTo: string;
  glowColor: string;
  teaser: string;
  time: string;
  scoring: string;
  points: string;
  image?: string;
  badge?: string;
}

export const disciplines: Discipline[] = [
  {
    id: 'mutter-stapeln',
    name: 'Bleib ruhig!',
    category: 'Eröffnung',
    categoryVariant: 'gold',
    emoji: '🔩',
    bgFrom: '#1C0F08',
    bgTo: '#0D0804',
    glowColor: 'rgba(212,175,55,0.4)',
    teaser:
      'Der Auftakt gehört allen – der Vorsprung nur einem. Was hier entschieden wird, setzt den Ton für den Rest des Tages.',
    time: 'Ca. 10 Min.',
    scoring: 'Zeitwertung',
    points: '12',
    image: '/images/mutter-stapeln.webp',
    badge: 'OPENING',
  },
  {
    id: 'hasbro-simon',
    name: 'Konzentrier di!',
    category: 'Station 1',
    categoryVariant: 'green',
    emoji: '🟢',
    bgFrom: '#081525',
    bgTo: '#040A14',
    glowColor: 'rgba(82,183,136,0.4)',
    teaser:
      'Dreimal spielen. Dreimal zählen. Wer ein gutes Gedächtnis hat, ist im Vorteil – wer keins hat, hofft auf die anderen beiden.',
    time: '3–5 Min.',
    scoring: 'Höchste Teamsumme',
    points: '12',
    image: '/images/simon.webp',
  },
  {
    id: 'cornhole',
    name: "Wirf g'scheit!",
    category: 'Station 2',
    categoryVariant: 'green',
    emoji: '🎯',
    bgFrom: '#101E0A',
    bgTo: '#080F05',
    glowColor: 'rgba(82,183,136,0.4)',
    teaser:
      'Nah ist sicher. Weit ist riskant. Und irgendwo dazwischen liegt die Frage: Wie mutig seid ihr wirklich?',
    time: '5–7 Min.',
    scoring: 'Höchste Teampunktzahl',
    points: '12',
    image: '/images/cornhole.webp',
  },
  {
    id: 'schwammstaffel',
    name: 'Fü auf!',
    category: 'Station 3',
    categoryVariant: 'green',
    emoji: '💧',
    bgFrom: '#061520',
    bgTo: '#030A10',
    glowColor: 'rgba(82,183,136,0.4)',
    teaser:
      'Drei Minuten. Hindernisse. Eine Waage. Was ihr in dieser Zeit schafft, steht danach schwarz auf weiß – Gramm für Gramm.',
    time: '3 Min. (fix)',
    scoring: 'Meistes Wasser im Ziel',
    points: '12',
    image: '/images/schwammstaffel.webp',
  },
  {
    id: 'kazoomeister',
    name: 'Huach zua!',
    category: 'Station 4',
    categoryVariant: 'green',
    emoji: '🎵',
    bgFrom: '#1A0F25',
    bgTo: '#0D0813',
    glowColor: 'rgba(146,75,200,0.4)',
    teaser:
      'Ihr werdet Songs hören, die ihr kennt. Nur klingen sie gerade… etwas seltsam. 90 Sekunden, um trotzdem die richtigen Antworten zu liefern.',
    time: '1:30 Min. (fix)',
    scoring: 'Meiste richtige Songs',
    points: '12',
    image: '/images/kazzoomeister.webp',
  },
  {
    id: 'gurkerl-biathlon',
    name: 'Gurkerl Biathlon',
    category: 'Station 5',
    categoryVariant: 'gold',
    emoji: '🏆',
    bgFrom: '#250808',
    bgTo: '#120404',
    glowColor: 'rgba(212,175,55,0.5)',
    teaser:
      'Laufen reicht nicht. Treffen reicht nicht. Das Herzstück des Gurkerl Cups fordert beides – und bestraft jeden Fehler auf seine ganz eigene Art.',
    time: '4–6 Min.',
    scoring: 'Zeitwertung',
    points: '12',
    image: '/images/biathlon.webp',
    badge: 'SIGNATURE',
  },
  {
    id: 'wasserbomben',
    name: 'Faung des Zeig!',
    category: 'Station 6',
    categoryVariant: 'green',
    emoji: '💦',
    bgFrom: '#061A22',
    bgTo: '#030D11',
    glowColor: 'rgba(56,189,248,0.4)',
    teaser:
      'Einer wirft. Einer fängt – oder auch nicht. Was dazwischen passiert, liegt nicht mehr in eurer Hand. Die Distanz entscheidet, der Rest ist Schicksal.',
    time: 'Ca. 8 Min.',
    scoring: 'Größte Distanzsumme',
    points: '12',
    image: '/images/wasserbomben.webp',
  },
  {
    id: 'gurkerlglasl',
    name: 'Is Runde ins Eckige',
    category: 'Station 7',
    categoryVariant: 'green',
    emoji: '🫙',
    bgFrom: '#111A06',
    bgTo: '#080D03',
    glowColor: 'rgba(132,204,22,0.4)',
    teaser:
      'Das Glas hat schon Besseres gesehen. Jetzt bekommt es fünf Chancen auf einen neuen Inhalt. Klingt einfach – ist es meistens nicht.',
    time: 'Ca. 3 Min.',
    scoring: 'Meiste Treffer',
    points: '12',
    image: '/images/jar.webp',
  },
  {
    id: 'riesen-ringerl',
    name: 'Riesen-Ringerl',
    category: 'Phase B',
    categoryVariant: 'orange',
    emoji: '🏐',
    bgFrom: '#0F0F22',
    bgTo: '#070711',
    glowColor: 'rgba(251,146,60,0.4)',
    teaser:
      'Alle gleichzeitig. Ein Fehler zu viel, und ihr schaut dem Rest zu. Wer zuletzt übrig bleibt, hat gewonnen – was vorher passiert, ist keine Garantie.',
    time: '15–20 Min.',
    scoring: 'Letztes Team gewinnt',
    points: '20',
    image: '/images/riesen-ringerl.webp',
  },
  {
    id: 'baelle-chaos',
    name: 'Blindes Chaos',
    category: 'FINALE',
    categoryVariant: 'red',
    emoji: '🎯',
    bgFrom: '#220D04',
    bgTo: '#110602',
    glowColor: 'rgba(239,68,68,0.5)',
    teaser:
      'Das Finale setzt auf Dunkelheit, Lärm und doppelte Punkte. Mehr verraten wir nicht – außer dass hier der Gurkerl Cup entschieden wird.',
    time: 'Ca. 10 Min.',
    scoring: '×2 DOPPELTE PUNKTE!',
    points: '40',
    image: '/images/baelle-chaos.webp',
    badge: 'FINALE ×2',
  },
];

/* ───────────────────────── Scoring-Metadaten ─────────────────────────
   Trennt die Wertungs-Logik von der Präsentation oben. Wird von der
   Scoring-Engine (scoring.ts) sowie /score & /beamer genutzt. */

export type ScoreDirection = 'asc' | 'desc'; // asc = kleiner besser (Zeit), desc = größer besser
export type PointsGroup = 'phase_a' | 'opening' | 'riesen-ringerl' | 'baelle-chaos';
export type GamePhase = 'opening' | 'a' | 'b';
export type InputMode = 'number' | 'time' | 'elimination';

export interface DisciplineMeta {
  direction: ScoreDirection;
  pointsGroup: PointsGroup;
  gamePhase: GamePhase;
  cardsAllowed: boolean; // Gurkerl-Karten nur auf den 7 Phase-A-Stationen
  inputUnit: string; // Anzeige-Einheit für die Eingabe
  inputMode: InputMode;
}

export const SCORING_META: Record<string, DisciplineMeta> = {
  'mutter-stapeln': { direction: 'asc', pointsGroup: 'opening', gamePhase: 'opening', cardsAllowed: false, inputUnit: 'Zeit', inputMode: 'time' },
  'hasbro-simon': { direction: 'desc', pointsGroup: 'phase_a', gamePhase: 'a', cardsAllowed: true, inputUnit: 'Punkte', inputMode: 'number' },
  cornhole: { direction: 'desc', pointsGroup: 'phase_a', gamePhase: 'a', cardsAllowed: true, inputUnit: 'Punkte', inputMode: 'number' },
  schwammstaffel: { direction: 'desc', pointsGroup: 'phase_a', gamePhase: 'a', cardsAllowed: true, inputUnit: 'Gramm', inputMode: 'number' },
  kazoomeister: { direction: 'desc', pointsGroup: 'phase_a', gamePhase: 'a', cardsAllowed: true, inputUnit: 'Songs', inputMode: 'number' },
  'gurkerl-biathlon': { direction: 'asc', pointsGroup: 'phase_a', gamePhase: 'a', cardsAllowed: true, inputUnit: 'Zeit', inputMode: 'time' },
  wasserbomben: { direction: 'desc', pointsGroup: 'phase_a', gamePhase: 'a', cardsAllowed: true, inputUnit: 'Meter', inputMode: 'number' },
  gurkerlglasl: { direction: 'desc', pointsGroup: 'phase_a', gamePhase: 'a', cardsAllowed: true, inputUnit: 'Treffer', inputMode: 'number' },
  'riesen-ringerl': { direction: 'desc', pointsGroup: 'riesen-ringerl', gamePhase: 'b', cardsAllowed: false, inputUnit: 'Platz', inputMode: 'elimination' },
  'baelle-chaos': { direction: 'desc', pointsGroup: 'baelle-chaos', gamePhase: 'b', cardsAllowed: false, inputUnit: 'Punkte', inputMode: 'number' },
};

/** Disziplin-IDs in Anzeige-Reihenfolge, die in die Wertung einfließen. */
export const SCORED_DISCIPLINE_IDS: string[] = disciplines
  .filter((d) => SCORING_META[d.id])
  .map((d) => d.id);

/** IDs einer bestimmten Spielphase (in Reihenfolge). */
export function disciplineIdsByPhase(phase: GamePhase): string[] {
  return SCORED_DISCIPLINE_IDS.filter((id) => SCORING_META[id].gamePhase === phase);
}

/** Schnellzugriff auf Disziplin-Stammdaten per id. */
export function getDiscipline(id: string): Discipline | undefined {
  return disciplines.find((d) => d.id === id);
}
