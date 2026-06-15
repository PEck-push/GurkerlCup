import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { isAuthed } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Service-Role-Key fehlt (SUPABASE_SERVICE_ROLE_KEY).' },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from('gurkerl_registrations')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []).map((r, i) => ({
    'Nr.': i + 1,
    Team: r.team_name,
    'Spieler 1': r.player1,
    'Spieler 2': r.player2,
    'Spieler 3': r.player3,
    'E-Mail': r.email,
    'Angemeldet am': r.created_at
      ? new Date(r.created_at).toLocaleString('de-AT', { timeZone: 'Europe/Vienna' })
      : '',
    'Check-In': '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [
    { wch: 5 }, { wch: 26 }, { wch: 20 }, { wch: 20 },
    { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 10 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Anmeldungen');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  const body = new Uint8Array(buf);

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="gurkerl-cup-anmeldungen-${date}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  });
}
