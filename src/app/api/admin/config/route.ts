import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { SCORING_META } from '@/lib/disciplines';
import type { Phase } from '@/lib/tournamentTypes';

export const runtime = 'nodejs';

const MISSING_KEY = 'Service-Role-Key fehlt (SUPABASE_SERVICE_ROLE_KEY).';

const PHASES: Phase[] = ['setup', 'opening', 'phase_a', 'reveal', 'phase_b', 'podium'];
const ROTATIONS = ['auto', 'logo', 'progress', 'countdown', 'spritzer'];
const VIEWS = ['total', 'finale'];
const TIMER_DISC_DEFAULT = 'mutter-stapeln'; // Auftakt „Bleib ruhig!"

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: MISSING_KEY }, { status: 500 });

  const { data, error } = await supabase.from('gc_config').select('*').eq('id', 1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ config: data });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: MISSING_KEY }, { status: 500 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};

  if (body.phase !== undefined) {
    if (!PHASES.includes(body.phase as Phase)) {
      return NextResponse.json({ error: 'Ungültige Phase.' }, { status: 400 });
    }
    patch.phase = body.phase;
  }
  if (body.reveal_step !== undefined) patch.reveal_step = Math.max(0, Number(body.reveal_step) || 0);
  if (body.reveal_running !== undefined) patch.reveal_running = !!body.reveal_running;
  if (body.opening_revealed !== undefined) patch.opening_revealed = !!body.opening_revealed;
  if (body.spritzer_revealed !== undefined) patch.spritzer_revealed = !!body.spritzer_revealed;
  if (body.beamer_rotation !== undefined) {
    if (!ROTATIONS.includes(body.beamer_rotation as string)) {
      return NextResponse.json({ error: 'Ungültige Beamer-Ansicht.' }, { status: 400 });
    }
    patch.beamer_rotation = body.beamer_rotation;
  }
  if (body.beamer_view !== undefined) {
    if (!VIEWS.includes(body.beamer_view as string)) {
      return NextResponse.json({ error: 'Ungültige Ansicht.' }, { status: 400 });
    }
    patch.beamer_view = body.beamer_view;
  }
  if (body.countdown_target !== undefined) patch.countdown_target = body.countdown_target;
  if (body.slide_seconds !== undefined) {
    patch.slide_seconds = Math.min(120, Math.max(3, Number(body.slide_seconds) || 12));
  }
  if (body.test_mode !== undefined) patch.test_mode = !!body.test_mode;
  if (body.points_table !== undefined) patch.points_table = body.points_table;

  // Auftakt-Timer-Steuerung (Teams stoppen selbst am Handy).
  if (body.timer_action !== undefined) {
    const action = String(body.timer_action);
    if (action === 'arm') {
      const disc =
        typeof body.timer_discipline_id === 'string' && SCORING_META[body.timer_discipline_id]
          ? body.timer_discipline_id
          : TIMER_DISC_DEFAULT;
      patch.timer_state = 'armed';
      patch.timer_discipline_id = disc;
      patch.timer_start_at = null;
    } else if (action === 'start') {
      const lead = Math.min(20, Math.max(3, Number(body.lead_seconds) || 5));
      patch.timer_state = 'running';
      patch.timer_start_at = new Date(Date.now() + lead * 1000).toISOString();
      if (typeof body.timer_discipline_id === 'string' && SCORING_META[body.timer_discipline_id]) {
        patch.timer_discipline_id = body.timer_discipline_id;
      }
    } else if (action === 'stop') {
      patch.timer_state = 'stopped';
    } else if (action === 'reset') {
      patch.timer_state = 'idle';
      patch.timer_discipline_id = null;
      patch.timer_start_at = null;
    } else {
      return NextResponse.json({ error: 'Ungültige Timer-Aktion.' }, { status: 400 });
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nichts zu ändern.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('gc_config')
    .update(patch)
    .eq('id', 1)
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ config: data });
}
