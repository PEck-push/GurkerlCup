import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { assignAppearance, generateSelfCode } from '@/lib/teamAppearance';

export const runtime = 'nodejs';

const MISSING_KEY =
  'Service-Role-Key fehlt (SUPABASE_SERVICE_ROLE_KEY in den Environment Variables setzen).';

/** GET: alle Turnier-Teams + alle Registrierungen (für den Check-In-Abgleich). */
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: MISSING_KEY }, { status: 500 });

  const [teamsRes, regsRes] = await Promise.all([
    supabase.from('gc_teams').select('*').order('start_number', { ascending: true }),
    supabase.from('gurkerl_registrations').select('*').order('created_at', { ascending: true }),
  ]);

  if (teamsRes.error) return NextResponse.json({ error: teamsRes.error.message }, { status: 500 });
  if (regsRes.error) return NextResponse.json({ error: regsRes.error.message }, { status: 500 });

  return NextResponse.json({ teams: teamsRes.data ?? [], registrations: regsRes.data ?? [] });
}

/** POST: Team einchecken (registration_id) ODER Walk-In (team_name). */
export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: MISSING_KEY }, { status: 500 });

  let body: { registration_id?: string; team_name?: string; is_dummy?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  let teamName = body.team_name?.trim();
  const registrationId = body.registration_id ?? null;

  // Check-In aus Registrierung → Teamname von dort
  if (registrationId) {
    const { data: reg, error } = await supabase
      .from('gurkerl_registrations')
      .select('team_name')
      .eq('id', registrationId)
      .single();
    if (error || !reg) {
      return NextResponse.json({ error: 'Registrierung nicht gefunden.' }, { status: 404 });
    }
    teamName = reg.team_name;

    const { data: existing } = await supabase
      .from('gc_teams')
      .select('id')
      .eq('registration_id', registrationId)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: 'Team ist bereits eingecheckt.' }, { status: 409 });
    }
  }

  if (!teamName) {
    return NextResponse.json({ error: 'Teamname fehlt.' }, { status: 400 });
  }

  // Nächste Startnummer ermitteln
  const { data: maxRow } = await supabase
    .from('gc_teams')
    .select('start_number')
    .order('start_number', { ascending: false })
    .limit(1)
    .maybeSingle();
  let startNumber = (maxRow?.start_number ?? 0) + 1;

  // Insert mit Retry bei Code-/Startnummern-Kollision
  for (let attempt = 0; attempt < 6; attempt++) {
    const { color, emoji } = assignAppearance(startNumber);
    const { data, error } = await supabase
      .from('gc_teams')
      .insert({
        registration_id: registrationId,
        team_name: teamName,
        start_number: startNumber,
        color,
        emoji,
        self_code: generateSelfCode(),
        checked_in: true,
        is_dummy: !!body.is_dummy,
      })
      .select('*')
      .single();

    if (!error && data) return NextResponse.json({ team: data });

    if (error?.code === '23505') {
      // registration_id-Kollision → bereits eingecheckt
      if (error.message.includes('registration')) {
        return NextResponse.json({ error: 'Team ist bereits eingecheckt.' }, { status: 409 });
      }
      // start_number- oder self_code-Kollision → neu versuchen
      startNumber += 1;
      continue;
    }
    return NextResponse.json({ error: error?.message ?? 'Fehler beim Anlegen.' }, { status: 500 });
  }
  return NextResponse.json({ error: 'Konnte Team nicht anlegen (Kollision).' }, { status: 500 });
}

/** PATCH: Team bearbeiten (Name/Farbe/Emoji/checked_in). */
export async function PATCH(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: MISSING_KEY }, { status: 500 });

  let body: { id?: string; team_name?: string; color?: string; emoji?: string; avatar?: string | null; checked_in?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: 'Keine Team-ID.' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (body.team_name !== undefined) patch.team_name = body.team_name.trim();
  if (body.color !== undefined) patch.color = body.color;
  if (body.emoji !== undefined) patch.emoji = body.emoji;
  if (body.avatar !== undefined) patch.avatar = body.avatar;
  if (body.checked_in !== undefined) patch.checked_in = body.checked_in;

  const { data, error } = await supabase
    .from('gc_teams')
    .update(patch)
    .eq('id', body.id)
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ team: data });
}

/** DELETE: Team entfernen (Scores werden per Cascade gelöscht). */
export async function DELETE(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: MISSING_KEY }, { status: 500 });

  let id: string | undefined;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: 'Keine Team-ID.' }, { status: 400 });

  const { error } = await supabase.from('gc_teams').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
