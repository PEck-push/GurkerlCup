'use client';

import { useEffect, useState } from 'react';
import type { GcTeam } from '@/lib/tournamentTypes';
import { avatarFor } from '@/lib/teamAvatars';
import QrCode from '@/components/QrCode';

export default function PrintQrPage() {
  const [teams, setTeams] = useState<GcTeam[]>([]);
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
    <main className="qr-print" style={{ background: '#fff', color: '#111', minHeight: '100vh', padding: 24, fontFamily: '-apple-system, Segoe UI, Roboto, sans-serif' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .qr-card { break-inside: avoid; page-break-inside: avoid; }
        }
        .qr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .qr-card { border: 2px solid #0a1f12; border-radius: 16px; padding: 16px; display: flex; gap: 16px; align-items: center; }
      `}</style>

      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>🥒 Gurkerl Cup 2026 – Team-QR-Codes</h1>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
            {teams.length} Teams · jedes Blatt zeigt den QR-Link zur persönlichen Team-Seite (eigene Ergebnisse).
          </p>
        </div>
        <button
          onClick={() => window.print()}
          style={{ background: '#D4AF37', border: '2px solid #0a1f12', borderRadius: 999, padding: '10px 22px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
        >
          🖨 Drucken
        </button>
      </div>

      {teams.length === 0 ? (
        <p style={{ color: '#666' }}>Noch keine Teams eingecheckt.</p>
      ) : (
        <div className="qr-grid">
          {teams.map((t) => (
            <div key={t.id} className="qr-card" style={{ borderColor: t.color }}>
              <div
                style={{
                  width: 64, height: 64, flexShrink: 0, borderRadius: '50%',
                  backgroundImage: `url(${t.avatar || avatarFor(t.start_number)})`,
                  backgroundSize: '230%', backgroundPosition: '50% 14%',
                  border: `3px solid ${t.color}`,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.color }}>#{t.start_number}</div>
                <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.1 }}>{t.team_name}</div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 4, wordBreak: 'break-all' }}>
                  {origin.replace(/^https?:\/\//, '')}/team/{t.self_code}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  Code: <b style={{ letterSpacing: 2, color: '#111' }}>{t.self_code}</b>
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <QrCode value={`${origin}/team/${t.self_code}`} size={110} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
