import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { SCORING_META } from '@/lib/disciplines';

export const runtime = 'nodejs';

/**
 * Öffentlicher Endpunkt: ein Team stoppt seine eigene Auftakt-Zeit (per self_code).
 * Bewusst ohne Login – der self_code ist der „Schlüssel" der Team-Seite. Es kann
 * NUR die aktuell scharfgeschaltete Timer-Station beschrieben werden, nur solange
 * der Timer läuft, und die Zeit wird lokal am Handy gemessen (fair, netzunabhängig).
 */
export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Service-Role-Key fehlt.' }, { status: 500 });
  }

  let body: { code?: string; elapsed_ms?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const code = (body.code ?? '').toString().trim();
  if (!code) return NextResponse.json({ error: 'Kein Team-Code.' }, { status: 400 });

  // 1) Timer-Zustand prüfen
  const { data: config, error: cErr } = await supabase
    .from('gc_config')
    .select('timer_state, timer_discipline_id, timer_start_at')
    .eq('id', 1)
    .single();
  if (cErr || !config) {
    return NextResponse.json({ error: 'Konfiguration nicht gefunden.' }, { status: 500 });
  }
  if (config.timer_state !== 'running') {
    return NextResponse.json({ error: 'Der Timer läuft gerade nicht.' }, { status: 409 });
  }
  const disciplineId: string | null = config.timer_discipline_id;
  if (!disciplineId || !SCORING_META[disciplineId]) {
    return NextResponse.json({ error: 'Keine Station für den Timer gesetzt.' }, { status: 409 });
  }

  const startMs = config.timer_start_at ? new Date(config.timer_start_at).getTime() : null;
  if (startMs && Date.now() < startMs - 500) {
    return NextResponse.json({ error: 'Der Countdown läuft noch.' }, { status: 409 });
  }

  // 2) Team per self_code (case-insensitiv; ohne Wildcards = exakter Match)
  const { data: team, error: tErr } = await supabase
    .from('gc_teams')
    .select('id, team_name')
    .ilike('self_code', code)
    .maybeSingle();
  if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 });
  if (!team) return NextResponse.json({ error: 'Team nicht gefunden.' }, { status: 404 });

  // 3) Verstrichene Zeit bestimmen (Client-Messung bevorzugt, Server als Fallback)
  let elapsedMs = Number(body.elapsed_ms);
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) {
    elapsedMs = startMs ? Date.now() - startMs : NaN;
  }
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) {
    return NextResponse.json({ error: 'Ungültige Zeit.' }, { status: 400 });
  }
  if (elapsedMs > 2 * 3600 * 1000) {
    return NextResponse.json({ error: 'Zeit zu groß.' }, { status: 400 });
  }
  const seconds = Math.round(elapsedMs) / 1000;

  // 4) Sperre: bereits gestoppt?
  const { data: existing } = await supabase
    .from('gc_scores')
    .select('id, finished')
    .eq('team_id', team.id)
    .eq('discipline_id', disciplineId)
    .maybeSingle();
  if (existing?.finished) {
    return NextResponse.json({ error: 'Eure Zeit wurde bereits gestoppt.', already: true }, { status: 409 });
  }

  const { error: upErr } = await supabase
    .from('gc_scores')
    .upsert(
      { team_id: team.id, discipline_id: disciplineId, raw_value: seconds, finished: true },
      { onConflict: 'team_id,discipline_id' }
    );
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, seconds, team: team.team_name });
}
