import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { assignAppearance, generateSelfCode } from '@/lib/teamAppearance';
import { SCORING_META, SCORED_DISCIPLINE_IDS, disciplineIdsByPhase } from '@/lib/disciplines';
import { SPRITZER_ID } from '@/lib/tournamentTypes';

export const runtime = 'nodejs';

const MISSING_KEY = 'Service-Role-Key fehlt (SUPABASE_SERVICE_ROLE_KEY).';

const DUMMY_NAMES = [
  'Gurken-Gang', 'Essig-Elite', 'Saure Spitzen', 'Dill-Dynastie', 'Krokodile',
  'Senf-Squad', 'Pöttsching Power', 'Die Eingelegten', 'Knackige Kerle', 'Salzlake-Stars',
  'Cornichon-Crew', 'Spreewald-Spezis',
];

const ri = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: MISSING_KEY }, { status: 500 });

  let action: string | undefined;
  try {
    ({ action } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  if (action === 'seed') {
    // Startnummer-Offset bestimmen
    const { data: maxRow } = await supabase
      .from('gc_teams')
      .select('start_number')
      .order('start_number', { ascending: false })
      .limit(1)
      .maybeSingle();
    let nextNo = (maxRow?.start_number ?? 0) + 1;

    const created: { id: string }[] = [];
    for (const name of DUMMY_NAMES) {
      const { color, emoji } = assignAppearance(nextNo);
      const { data, error } = await supabase
        .from('gc_teams')
        .insert({
          team_name: name,
          start_number: nextNo,
          color,
          emoji,
          self_code: generateSelfCode(),
          checked_in: true,
          is_dummy: true,
        })
        .select('id')
        .single();
      if (!error && data) created.push(data);
      nextNo += 1;
    }

    // Riesen-Ringerl: zufällige Platzierungen
    const ringerlRanks = created.map((_, i) => i + 1).sort(() => Math.random() - 0.5);

    const stationIds = [...disciplineIdsByPhase('opening'), ...disciplineIdsByPhase('a')];
    const rows: Record<string, unknown>[] = [];
    created.forEach((team, idx) => {
      for (const did of SCORED_DISCIPLINE_IDS) {
        const meta = SCORING_META[did];
        if (meta.inputMode === 'elimination') {
          rows.push({ team_id: team.id, discipline_id: did, manual_rank: ringerlRanks[idx], finished: true });
        } else if (meta.inputMode === 'time') {
          rows.push({ team_id: team.id, discipline_id: did, raw_value: ri(60, 300), finished: true });
        } else {
          const max = did === 'baelle-chaos' ? 100 : 50;
          rows.push({
            team_id: team.id,
            discipline_id: did,
            raw_value: ri(0, max),
            finished: stationIds.includes(did),
          });
        }
      }
      rows.push({ team_id: team.id, discipline_id: SPRITZER_ID, raw_value: ri(0, 20), finished: true });
    });

    if (rows.length > 0) {
      const { error } = await supabase
        .from('gc_scores')
        .upsert(rows, { onConflict: 'team_id,discipline_id' });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from('gc_config').update({ test_mode: true }).eq('id', 1);
    return NextResponse.json({ ok: true, created: created.length });
  }

  if (action === 'clear_dummy') {
    const { error } = await supabase.from('gc_teams').delete().eq('is_dummy', true);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await supabase.from('gc_config').update({ test_mode: false }).eq('id', 1);
    return NextResponse.json({ ok: true });
  }

  if (action === 'reset_scores') {
    const { error } = await supabase.from('gc_scores').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await resetConfig(supabase);
    return NextResponse.json({ ok: true });
  }

  if (action === 'reset_all') {
    await supabase.from('gc_scores').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error } = await supabase.from('gc_teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await resetConfig(supabase);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unbekannte Aktion.' }, { status: 400 });
}

async function resetConfig(supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>) {
  await supabase
    .from('gc_config')
    .update({
      phase: 'setup',
      reveal_step: 0,
      reveal_running: false,
      opening_revealed: false,
      spritzer_revealed: false,
      beamer_rotation: 'auto',
      beamer_view: 'total',
      test_mode: false,
    })
    .eq('id', 1);
}
