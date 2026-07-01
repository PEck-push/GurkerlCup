'use client';

import { useEffect, useState } from 'react';
import { disciplineIdsByPhase, getDiscipline } from '@/lib/disciplines';
import { STATION_RULES } from '@/lib/stationRules';
import { avatarFor } from '@/lib/teamAvatars';
import type { GcTeam } from '@/lib/tournamentTypes';
import QrCode from '@/components/QrCode';

interface Registration {
  id: string;
  team_name: string;
  player1: string;
  player2: string;
  player3: string;
}

const STATION_IDS = disciplineIdsByPhase('a'); // 7 Phase-A-Stationen (ohne Eröffnung)

export default function PrintSheetsPage() {
  const [teams, setTeams] = useState<GcTeam[]>([]);
  const [regs, setRegs] = useState<Record<string, Registration>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    (async () => {
      try {
        const res = await fetch('/api/admin/teams');
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Fehler beim Laden.');
          return;
        }
        setTeams((data.teams ?? []).sort((a: GcTeam, b: GcTeam) => a.start_number - b.start_number));
        const map: Record<string, Registration> = {};
        for (const r of data.registrations ?? []) map[r.id] = r;
        setRegs(map);
      } catch {
        setError('Netzwerkfehler.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <main style={{ padding: 40, fontFamily: 'sans-serif' }}>Lädt…</main>;
  if (error) return <main style={{ padding: 40, fontFamily: 'sans-serif', color: '#a01' }}>{error}</main>;

  return (
    <main style={{ background: '#e8e8e8', color: '#111', fontFamily: '-apple-system, Segoe UI, Roboto, sans-serif' }}>
      <style>{`
        @page { size: A4; margin: 10mm; }
        @media print { .no-print { display: none !important; } .sheet { box-shadow: none !important; margin: 0 !important; } }
        .sheet { width: 190mm; min-height: 272mm; background: #fff; margin: 12px auto; padding: 10mm; box-sizing: border-box; page-break-after: always; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        .st { border: 2px solid #0a1f12; border-radius: 10px; padding: 8px 12px; margin-bottom: 7px; }
        .st h3 { margin: 0 0 2px; font-size: 15px; }
        .st p { margin: 0; font-size: 12px; line-height: 1.35; }
      `}</style>

      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, maxWidth: 800, margin: '0 auto' }}>
        <p style={{ margin: 0, color: '#333' }}>{teams.length} Team-Laufblätter (A4, je 1 Seite).</p>
        <button onClick={() => window.print()} style={{ background: '#D4AF37', border: '2px solid #0a1f12', borderRadius: 999, padding: '10px 22px', fontWeight: 700, cursor: 'pointer' }}>
          🖨 Drucken
        </button>
      </div>

      {teams.length === 0 && <p style={{ textAlign: 'center', color: '#555' }}>Noch keine Teams eingecheckt.</p>}

      {teams.map((t) => {
        const reg = t.registration_id ? regs[t.registration_id] : undefined;
        const members = [reg?.player1, reg?.player2, reg?.player3].filter(Boolean) as string[];
        return (
          <div key={t.id} className="sheet">
            {/* Kopf */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', borderBottom: `4px solid ${t.color}`, paddingBottom: 10, marginBottom: 12 }}>
              <div style={{ width: 84, height: 84, flexShrink: 0, borderRadius: '50%', backgroundImage: `url(${t.avatar || avatarFor(t.start_number)})`, backgroundSize: '230%', backgroundPosition: '50% 14%', border: `4px solid ${t.color}` }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.color }}>GURKERL CUP 2026 · TEAM #{t.start_number}</div>
                <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.05 }}>{t.team_name}</div>
                <div style={{ fontSize: 13, color: '#444', marginTop: 4 }}>
                  {members.length ? members.join(' · ') : 'Team-Mitglieder'}
                </div>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <QrCode value={`${origin}/team/${t.self_code}`} size={96} />
                <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>Deine Ergebnisse<br />Code: <b>{t.self_code}</b></div>
              </div>
            </div>

            <div style={{ fontSize: 15, fontWeight: 800, margin: '4px 0 8px' }}>🥒 Phase A – Deine Stationen (freie Reihenfolge)</div>

            {STATION_IDS.map((id, i) => {
              const d = getDiscipline(id);
              const r = STATION_RULES[id];
              return (
                <div key={id} className="st" style={{ borderColor: `${t.color}` }}>
                  <h3>
                    <span style={{ display: 'inline-block', width: 22 }}>{d?.emoji}</span>
                    Station {i + 1}: {d?.name}
                  </h3>
                  <p><b>So geht&apos;s:</b> {r?.how}</p>
                  <p style={{ color: '#0a1f12' }}><b>Wertung:</b> {r?.scoring}</p>
                  <p style={{ color: '#888', marginTop: 3 }}>Ergebnis notiert: ______________</p>
                </div>
              );
            })}

            <div style={{ marginTop: 10, fontSize: 11, color: '#333', borderTop: '1px dashed #999', paddingTop: 8 }}>
              🃏 <b>Gurkerl-Karten:</b> 2 Joker pro Team, nur in Phase A (max. 1 pro Spiel).
              &nbsp;<b>Doppel Gurkerl</b> = Rangpunkte dieser Station ×2 (vor dem Spiel ansagen).
              &nbsp;<b>2nd Chance</b> = Station nochmal spielen (2. Versuch zählt immer!).
              &nbsp; Deadline Phase A: <b>19:30 Uhr</b>.
            </div>
          </div>
        );
      })}
    </main>
  );
}
