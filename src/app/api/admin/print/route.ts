import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { liveStandings, spritzerRanking } from '@/lib/scoring';
import { SCORED_DISCIPLINE_IDS, getDiscipline } from '@/lib/disciplines';
import { DEFAULT_POINTS_TABLE, type GcConfig, type GcScore, type GcTeam } from '@/lib/tournamentTypes';

export const runtime = 'nodejs';

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  );
}

export async function GET() {
  if (!(await isAuthed())) {
    return new NextResponse('Nicht autorisiert.', { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return new NextResponse('Service-Role-Key fehlt.', { status: 500 });

  const [teamsRes, scoresRes, cfgRes] = await Promise.all([
    supabase.from('gc_teams').select('*').eq('checked_in', true).order('start_number'),
    supabase.from('gc_scores').select('*'),
    supabase.from('gc_config').select('*').eq('id', 1).single(),
  ]);

  const teams = (teamsRes.data ?? []) as GcTeam[];
  const scores = (scoresRes.data ?? []) as GcScore[];
  const config = cfgRes.data as GcConfig | null;
  const pt = config?.points_table ?? DEFAULT_POINTS_TABLE;

  const standings = liveStandings(teams, scores, pt);
  const spritzer = spritzerRanking(teams, scores).filter((r) => r.rank != null);
  const teamById = new Map(teams.map((t) => [t.id, t]));
  const cols = SCORED_DISCIPLINE_IDS;
  const stamp = new Date().toLocaleString('de-AT', { timeZone: 'Europe/Vienna' });

  const headCells = cols
    .map((id) => `<th title="${esc(getDiscipline(id)?.name ?? id)}">${getDiscipline(id)?.emoji ?? ''}</th>`)
    .join('');

  const bodyRows = standings.rows
    .map((row) => {
      const t = teamById.get(row.teamId);
      if (!t) return '';
      const cells = cols.map((id) => `<td class="num">${row.perDiscipline[id] || ''}</td>`).join('');
      return `<tr>
        <td class="rank">${row.finalRank}</td>
        <td class="num">${t.start_number}</td>
        <td>${t.emoji} ${esc(t.team_name)}</td>
        ${cells}
        <td class="total">${row.total}</td>
      </tr>`;
    })
    .join('');

  const spritzerRows = spritzer
    .map((r) => {
      const t = teamById.get(r.teamId);
      if (!t) return '';
      return `<tr><td class="rank">${r.rank}</td><td>${t.emoji} ${esc(t.team_name)}</td><td class="num">${r.rawValue ?? ''}</td></tr>`;
    })
    .join('');

  const goldTieNote = standings.goldTie
    ? `<p class="warn">⚔️ Gleichstand um Platz 1: ${standings.goldTieTeamIds
        .map((id) => esc(teamById.get(id)?.team_name ?? ''))
        .filter(Boolean)
        .join(' & ')} – Live-Stechen entscheidet.</p>`
    : '';

  const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8" />
<title>Gurkerl Cup 2026 – Rangliste</title>
<style>
  * { font-family: -apple-system, Segoe UI, Roboto, sans-serif; }
  body { margin: 24px; color: #111; }
  h1 { margin: 0 0 2px; }
  .sub { color: #666; font-size: 13px; margin-bottom: 16px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 24px; font-size: 13px; }
  th, td { border: 1px solid #ccc; padding: 5px 7px; text-align: left; }
  th { background: #1B4332; color: #fff; text-align: center; }
  td.num, td.total, td.rank { text-align: center; }
  td.total { font-weight: 700; background: #f4f0e0; }
  td.rank { font-weight: 700; }
  tr:nth-child(even) td { background: #fafafa; }
  .warn { color: #a01; font-weight: 700; }
  h2 { font-size: 16px; margin: 18px 0 8px; }
  @media print { body { margin: 8mm; } button { display: none; } }
</style></head>
<body>
  <h1>🥒 Gurkerl Cup 2026 – Gesamtrangliste</h1>
  <p class="sub">Stand: ${stamp} · ${teams.length} Teams · Notfall-/Kontroll-Ausdruck</p>
  ${goldTieNote}
  <button onclick="window.print()" style="margin-bottom:12px;padding:8px 14px;cursor:pointer">Drucken</button>
  <table>
    <thead><tr><th>#</th><th>Nr</th><th>Team</th>${headCells}<th>&Sigma;</th></tr></thead>
    <tbody>${bodyRows || '<tr><td colspan="99">Keine Daten.</td></tr>'}</tbody>
  </table>

  <h2>🍷 Spritzerwertung</h2>
  <table>
    <thead><tr><th>#</th><th>Team</th><th>Wert</th></tr></thead>
    <tbody>${spritzerRows || '<tr><td colspan="3">Keine Daten.</td></tr>'}</tbody>
  </table>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
