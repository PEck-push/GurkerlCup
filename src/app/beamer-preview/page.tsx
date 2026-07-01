'use client';

// TEMPORÄRE Demo-Seite: rendert die ECHTEN Beamer-Komponenten mit Mock-Daten (zur Vorschau).
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LeaderboardView, { type LbEntry } from '@/components/tournament/LeaderboardView';
import SpritzerReveal from '@/components/tournament/SpritzerReveal';
import PhaseBBars from '@/components/tournament/PhaseBBars';
import BeamerBackground from '@/components/tournament/BeamerBackground';
import BeamerLogoLoop from '@/components/tournament/BeamerLogoLoop';
import BeamerProgressGrid from '@/components/tournament/BeamerProgressGrid';
import BeamerCountdown from '@/components/tournament/BeamerCountdown';
import { DEFAULT_POINTS_TABLE, type GcConfig, type GcScore, type GcTeam } from '@/lib/tournamentTypes';

const COLORS = ['#D4AF37', '#52B788', '#38BDF8', '#FB923C', '#EF4444', '#A855F7', '#84CC16', '#F472B6', '#2DD4BF', '#FBBF24', '#60A5FA', '#FB7185', '#C084FC', '#4ADE80'];
const NAMES = ['Knackige Kerle', 'Dill-Dynastie', 'Saure Spitzen', 'Senf-Squad', 'Essig-Elite', 'Krokodile', 'Gurken-Gang', 'Salzlake-Stars', 'Cornichon-Crew', 'Spreewald-Spezis', 'Pöttsching Power', 'Die Eingelegten', 'Gemüse-Garde', 'Joker-Gurken'];
const teams: GcTeam[] = NAMES.map((name, i) => ({
  id: `t${i}`, registration_id: null, team_name: name, start_number: i + 1,
  color: COLORS[i % COLORS.length], emoji: '🥒', avatar: null, self_code: `C${i}`,
  checked_in: true, is_dummy: true, card_double_used: null, card_second_used: null, created_at: '',
}));
const config = { points_table: DEFAULT_POINTS_TABLE, beamer_view: 'total' } as unknown as GcConfig;

function Inner() {
  const s = useSearchParams().get('s') ?? 'lb';
  if (s === 'logo') return <BeamerLogoLoop />;
  if (s === 'progress') {
    const scores: GcScore[] = [];
    teams.forEach((t, i) => {
      for (let d = 0; d < ((i * 3) % 9); d++) {
        scores.push({ id: `p${i}-${d}`, team_id: t.id, discipline_id: ['mutter-stapeln', 'hasbro-simon', 'cornhole', 'schwammstaffel', 'kazoomeister', 'gurkerl-biathlon', 'wasserbomben', 'gurkerlglasl'][d % 8], raw_value: 1, finished: true, card_double: false, card_second: false, manual_rank: null, updated_at: '' });
      }
    });
    return <BeamerProgressGrid teams={teams} scores={scores} />;
  }
  if (s === 'countdown') return <BeamerCountdown target={new Date(Date.now() + 3 * 3600_000 + 25 * 60_000).toISOString()} />;
  if (s === 'spritzer') {
    const scores: GcScore[] = teams.map((t, i) => ({ id: `s${i}`, team_id: t.id, discipline_id: 'spritzer', raw_value: 4 - i * 0.25, finished: true, card_double: false, card_second: false, manual_rank: null, updated_at: '' }));
    return <SpritzerReveal teams={teams} scores={scores} />;
  }
  if (s === 'phaseb') {
    const scores: GcScore[] = [];
    teams.forEach((t, i) => {
      scores.push({ id: `a${i}`, team_id: t.id, discipline_id: 'cornhole', raw_value: 50 - i * 3, finished: true, card_double: false, card_second: false, manual_rank: null, updated_at: '' });
      scores.push({ id: `b${i}`, team_id: t.id, discipline_id: 'baelle-chaos', raw_value: 100 - i * 6, finished: true, card_double: false, card_second: false, manual_rank: null, updated_at: '' });
    });
    return <PhaseBBars teams={teams} scores={scores} config={config} />;
  }
  const entries: LbEntry[] = teams.map((t, i) => ({ team: t, rank: i + 1, value: String(120 - i * 7) }));
  return <LeaderboardView entries={entries} unit="Pkt" variant="eyebrow" title="Zwischenstand" />;
}

export default function BeamerPreview() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0A1A0C]">
      <BeamerBackground />
      <div className="absolute inset-0 z-10">
        <Suspense>
          <Inner />
        </Suspense>
      </div>
    </main>
  );
}
