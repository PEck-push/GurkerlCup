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
  image?: string;
  badge?: string;
}

export const disciplines: Discipline[] = [
  {
    id: 'mutter-stapeln',
    name: 'Mutter Stapeln',
    category: 'Eröffnung',
    categoryVariant: 'gold',
    emoji: '🔩',
    bgFrom: '#1C0F08',
    bgTo: '#0D0804',
    glowColor: 'rgba(212,175,55,0.4)',
    teaser:
      'Präzision ohne Berührung. Eine Holzstange, sechs Muttern – und die Uhr tickt. Alle Teams gleichzeitig. Wer stapelt am schnellsten?',
    time: 'Ca. 10 Min.',
    scoring: 'Zeitwertung',
    badge: 'OPENING',
  },
  {
    id: 'hasbro-simon',
    name: 'Hasbro Simon',
    subtitle: 'Gedächtnisspiel',
    category: 'Station 1',
    categoryVariant: 'green',
    emoji: '🟢',
    bgFrom: '#081525',
    bgTo: '#040A14',
    glowColor: 'rgba(82,183,136,0.4)',
    teaser:
      'Farbe folgt Farbe, Ton folgt Ton. Alle drei Teammitglieder treten an – die Scores werden addiert. Wer hat das beste Teamgedächtnis?',
    time: '3–5 Min.',
    scoring: 'Höchste Teamsumme',
    image: '/images/simon.webp',
  },
  {
    id: 'cornhole',
    name: 'Cornhole',
    subtitle: 'Entfernungs-Challenge',
    category: 'Station 2',
    categoryVariant: 'green',
    emoji: '🎯',
    bgFrom: '#101E0A',
    bgTo: '#080F05',
    glowColor: 'rgba(82,183,136,0.4)',
    teaser:
      'Drei Boards, drei Distanzen. Je weiter, desto mehr Punkte – aber wer traut sich wirklich an die Schwer-Zone? 8 Würfe pro Person.',
    time: '5–7 Min.',
    scoring: 'Höchste Teampunktzahl',
  },
  {
    id: 'schwammstaffel',
    name: 'Schwammstaffel',
    category: 'Station 3',
    categoryVariant: 'green',
    emoji: '💧',
    bgFrom: '#061520',
    bgTo: '#030A10',
    glowColor: 'rgba(82,183,136,0.4)',
    teaser:
      'Wasser muss fließen – durch Slalom, unten durch, oben drüber. Nach exakt 3 Minuten entscheidet die Küchenwaage. Gramm um Gramm.',
    time: '3 Min. (fix)',
    scoring: 'Meistes Wasser im Ziel',
  },
  {
    id: 'kazoomeister',
    name: 'Kazoomeister',
    subtitle: 'Songs erraten',
    category: 'Station 4',
    categoryVariant: 'green',
    emoji: '🎵',
    bgFrom: '#1A0F25',
    bgTo: '#0D0813',
    glowColor: 'rgba(146,75,200,0.4)',
    teaser:
      'Mallorca-Hits, Austropop, Klassiker – gespielt auf einem sehr seltsamen Instrument. 90 Sekunden. Möglichst viele Songs erraten.',
    time: '1:30 Min. (fix)',
    scoring: 'Meiste richtige Songs',
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
      'Gemeinsam laufen, zielen, treffen – und Strafrunden mögen. Das Signature Game des Gurkerl Cups. Jeder Fehler kostet wertvolle Zeit.',
    time: '4–6 Min.',
    scoring: 'Zeitwertung',
    badge: 'SIGNATURE',
  },
  {
    id: 'wasserbomben',
    name: 'Wasserbomben Weitwurf',
    category: 'Station 6',
    categoryVariant: 'green',
    emoji: '💦',
    bgFrom: '#061A22',
    bgTo: '#030D11',
    glowColor: 'rgba(56,189,248,0.4)',
    teaser:
      'Werfen ist leicht. Fangen ist die Kunst. Platzen ist Programm. Die Weiten aller drei Durchgänge werden addiert.',
    time: 'Ca. 8 Min.',
    scoring: 'Größte Distanzsumme',
    image: '/images/wasserbomben.webp',
  },
  {
    id: 'gurkerlglasl',
    name: 'Gurkerlglasl Treffer',
    category: 'Station 7',
    categoryVariant: 'green',
    emoji: '🫙',
    bgFrom: '#111A06',
    bgTo: '#080D03',
    glowColor: 'rgba(132,204,22,0.4)',
    teaser:
      'Die Gurken wurden schon gegessen – jetzt kommen Tischtennisbälle rein. Beer-Pong-Stil auf Gurkengläser. 5 Bälle pro Person.',
    time: 'Ca. 3 Min.',
    scoring: 'Meiste Treffer',
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
      'Alle Teams gleichzeitig. Ein Netz, ein Ball, keine Gnade. Nach jedem Kontakt läuft man rüber und stellt sich an. Fehler = Ausscheiden.',
    time: '15–20 Min.',
    scoring: 'Letztes Team gewinnt',
  },
  {
    id: 'baelle-chaos',
    name: 'Bälle Chaos',
    category: 'FINALE',
    categoryVariant: 'red',
    emoji: '🎯',
    bgFrom: '#220D04',
    bgTo: '#110602',
    glowColor: 'rgba(239,68,68,0.5)',
    teaser:
      'Verbundene Augen. Chaos-Feld voller Bälle. Teamkameraden schreien Anweisungen. 5 Minuten, alle Teams gleichzeitig. Alle Punkte doppelt!',
    time: 'Ca. 10 Min.',
    scoring: '×2 DOPPELTE PUNKTE!',
    badge: 'FINALE ×2',
  },
];
