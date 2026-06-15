import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const MISSING_KEY =
  'Service-Role-Key fehlt (SUPABASE_SERVICE_ROLE_KEY in den Environment Variables setzen).';

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: MISSING_KEY }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('gurkerl_registrations')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ registrations: data ?? [] });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: MISSING_KEY }, { status: 500 });
  }

  let id: string | undefined;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: 'Keine Team-ID angegeben.' }, { status: 400 });
  }

  const { error } = await supabase.from('gurkerl_registrations').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
