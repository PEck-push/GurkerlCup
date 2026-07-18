import { NextRequest, NextResponse } from 'next/server';
import { isScoreAuthed } from '@/lib/scoreAuth';
import { isAuthed } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { SCORING_META, disciplineIdsByPhase } from '@/lib/disciplines';
import { SPRITZER_ID, type GcScore, type GcTeam } from '@/lib/tournamentTypes';

export const runtime = 'nodejs';

const MISSING_KEY = 'Service-Role-Key fehlt (SUPABASE_SERVICE_ROLE_KEY).';

interface Body {
  team_id?: string;
  discipline_id?: string;
  raw_value?: number | null;
  p1?: number | null;
  p2?: number | null;
  p3?: number | null;
  finished?: boolean;
  card_double?: boolean;
  card_second?: boolean;
  manual_rank?: number | null;
}

export async function POST(request: NextRequest) {
  const [scoreAuthed, adminAuthed] = await Promise.all([isScoreAuthed(), isAuthed()]);
  if (!(scoreAuthed || adminAuthed)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: MISSING_KEY }, { status: 500 });

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const { team_id, discipline_id } = body;
  if (!team_id || !discipline_id) {
    return NextResponse.json({ error: 'team_id und discipline_id erforderlich.' }, { status: 400 });
  }

  const meta = SCORING_META[discipline_id];
  const isSpritzer = discipline_id === SPRITZER_ID;
  if (!meta && !isSpritzer) {
    return NextResponse.json({ error: 'Unbekannte Disziplin.' }, { status: 400 });
  }
  const cardsAllowed = meta?.cardsAllowed ?? false;

  // Team laden (muss existieren & eingecheckt sein)
  const { data: team, error: teamErr } = await supabase
    .from('gc_teams')
    .select('*')
    .eq('id', team_id)
    .single<GcTeam>();
  if (teamErr || !team) {
    return NextResponse.json({ error: 'Team nicht gefunden.' }, { status: 404 });
  }
  if (!team.checked_in) {
    return NextResponse.json({ error: 'Team ist nicht eingecheckt.' }, { status: 400 });
  }

  // Bestehenden Score laden, um Teil-Updates korrekt zu mergen
  const { data: existing } = await supabase
    .from('gc_scores')
    .select('*')
    .eq('team_id', team_id)
    .eq('discipline_id', discipline_id)
    .maybeSingle<GcScore>();

  // ── Modus B: Jedes Team spielt nur 6 von 7 Phase-A-Stationen. Sobald 6 Stationen
  //    abgeschlossen sind, ist die 7. (offene) gesperrt – schützt vor versehentlichen
  //    Einträgen ("rutscht zufällig in ein weiteres Ranking"). Gilt nur für die
  //    Stationseingabe (/score); Admin-Korrekturen sind ausgenommen. ──
  if (!adminAuthed && meta?.gamePhase === 'a' && !(existing?.finished ?? false)) {
    const { data: cfg } = await supabase
      .from('gc_config')
      .select('skip_mode')
      .eq('id', 1)
      .maybeSingle<{ skip_mode: boolean }>();
    if (cfg?.skip_mode) {
      const phaseAIds = disciplineIdsByPhase('a');
      const { data: doneRows } = await supabase
        .from('gc_scores')
        .select('discipline_id')
        .eq('team_id', team_id)
        .eq('finished', true);
      const otherFinished = (doneRows ?? []).filter(
        (r) => r.discipline_id !== discipline_id && phaseAIds.includes(r.discipline_id)
      ).length;
      if (otherFinished >= phaseAIds.length - 1) {
        return NextResponse.json(
          {
            error: `Modus B aktiv: Team hat bereits ${phaseAIds.length - 1} Stationen abgeschlossen – die letzte offene Station ist gesperrt.`,
          },
          { status: 409 }
        );
      }
    }
  }

  const final = {
    raw_value: body.raw_value !== undefined ? body.raw_value : existing?.raw_value ?? null,
    p1: body.p1 !== undefined ? body.p1 : existing?.p1 ?? null,
    p2: body.p2 !== undefined ? body.p2 : existing?.p2 ?? null,
    p3: body.p3 !== undefined ? body.p3 : existing?.p3 ?? null,
    finished: body.finished !== undefined ? body.finished : existing?.finished ?? false,
    card_double: body.card_double !== undefined ? body.card_double : existing?.card_double ?? false,
    card_second: body.card_second !== undefined ? body.card_second : existing?.card_second ?? false,
    manual_rank: body.manual_rank !== undefined ? body.manual_rank : existing?.manual_rank ?? null,
  };

  // Per-Spieler-Disziplinen: Rohwert = Summe der 3 Spieler (Server-seitig, konsistent)
  if (meta?.perPlayer && (body.p1 !== undefined || body.p2 !== undefined || body.p3 !== undefined)) {
    const hasAny = final.p1 != null || final.p2 != null || final.p3 != null;
    final.raw_value = hasAny ? (final.p1 ?? 0) + (final.p2 ?? 0) + (final.p3 ?? 0) : null;
  }

  // ── Karten-Validierung (nur Phase A, max 1 Karte/Station, Inventar) ──
  if ((final.card_double || final.card_second) && !cardsAllowed) {
    return NextResponse.json(
      { error: 'Gurkerl-Karten sind nur in Phase A erlaubt.' },
      { status: 400 }
    );
  }
  if (final.card_double && final.card_second) {
    return NextResponse.json(
      { error: 'Pro Station ist nur eine Karte erlaubt.' },
      { status: 400 }
    );
  }
  if (final.card_double && team.card_double_used && team.card_double_used !== discipline_id) {
    return NextResponse.json(
      { error: 'Doppel-Karte ist bereits an einer anderen Station im Einsatz.' },
      { status: 409 }
    );
  }
  if (final.card_second && team.card_second_used && team.card_second_used !== discipline_id) {
    return NextResponse.json(
      { error: '2nd-Chance-Karte ist bereits an einer anderen Station im Einsatz.' },
      { status: 409 }
    );
  }

  // Score upserten
  const { data: saved, error: saveErr } = await supabase
    .from('gc_scores')
    .upsert(
      { team_id, discipline_id, ...final },
      { onConflict: 'team_id,discipline_id' }
    )
    .select('*')
    .single();
  if (saveErr) {
    return NextResponse.json({ error: saveErr.message }, { status: 500 });
  }

  // Team-Karteninventar nachziehen
  const teamPatch: Record<string, string | null> = {};
  const nextDouble = final.card_double
    ? discipline_id
    : team.card_double_used === discipline_id
      ? null
      : team.card_double_used;
  const nextSecond = final.card_second
    ? discipline_id
    : team.card_second_used === discipline_id
      ? null
      : team.card_second_used;
  if (nextDouble !== team.card_double_used) teamPatch.card_double_used = nextDouble;
  if (nextSecond !== team.card_second_used) teamPatch.card_second_used = nextSecond;
  if (Object.keys(teamPatch).length > 0) {
    await supabase.from('gc_teams').update(teamPatch).eq('id', team_id);
  }

  return NextResponse.json({ score: saved });
}
