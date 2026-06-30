'use client';

import { useState } from 'react';
import { useGcConfig } from '@/lib/useRealtime';

export default function TestResetPanel() {
  const { config } = useGcConfig();
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [confirm, setConfirm] = useState('');

  async function run(action: string, successMsg: string) {
    setBusy(action);
    setMsg('');
    try {
      const res = await fetch('/api/admin/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      setMsg(res.ok ? successMsg : data.error ?? 'Fehler.');
    } catch {
      setMsg('Netzwerkfehler.');
    } finally {
      setBusy('');
      setConfirm('');
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {config?.test_mode && (
        <div className="rounded-xl border border-[#FB923C]/40 bg-[#FB923C]/10 px-4 py-3">
          <p className="font-fredoka font-700 text-[#FB923C]">🧪 Test-Modus aktiv</p>
          <p className="font-nunito text-sm text-white/60 mt-0.5">
            Es sind Dummy-Teams im System. Vor dem echten Event „Test-Teams entfernen".
          </p>
        </div>
      )}

      {msg && (
        <div className="rounded-xl border border-[#52B788]/30 bg-[#52B788]/10 px-4 py-3">
          <p className="font-nunito text-sm text-[#52B788]">{msg}</p>
        </div>
      )}

      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <h3 className="font-fredoka font-600 text-white mb-1">Probelauf</h3>
        <p className="font-nunito text-sm text-white/50 mb-4">
          Legt 12 Test-Teams mit Zufallswerten an, um Eingabe, Reveal und Podest durchzuspielen.
        </p>
        <button
          onClick={() => run('seed', '✓ Test-Teams + Zufallswerte angelegt.')}
          disabled={!!busy}
          className="btn-gold px-5 py-2.5 rounded-full text-sm disabled:opacity-50"
        >
          {busy === 'seed' ? 'Legt an…' : '🧪 Test-Teams anlegen'}
        </button>
      </div>

      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5 space-y-4">
        <h3 className="font-fredoka font-600 text-white">Zurücksetzen</h3>

        <ConfirmRow
          label="Nur Test-Teams entfernen"
          hint="Löscht alle Dummy-Teams (echte Teams & Anmeldungen bleiben)."
          armed={confirm === 'clear_dummy'}
          busy={busy === 'clear_dummy'}
          onArm={() => setConfirm('clear_dummy')}
          onCancel={() => setConfirm('')}
          onConfirm={() => run('clear_dummy', '✓ Test-Teams entfernt.')}
        />

        <ConfirmRow
          label="Alle Ergebnisse zurücksetzen"
          hint="Löscht alle Wertungen, Teams bleiben. Phase zurück auf Setup."
          armed={confirm === 'reset_scores'}
          busy={busy === 'reset_scores'}
          onArm={() => setConfirm('reset_scores')}
          onCancel={() => setConfirm('')}
          onConfirm={() => run('reset_scores', '✓ Alle Ergebnisse zurückgesetzt.')}
        />

        <ConfirmRow
          label="ALLES zurücksetzen"
          hint="Löscht ALLE Teams UND Ergebnisse. Nur vor einem kompletten Neustart!"
          danger
          armed={confirm === 'reset_all'}
          busy={busy === 'reset_all'}
          onArm={() => setConfirm('reset_all')}
          onCancel={() => setConfirm('')}
          onConfirm={() => run('reset_all', '✓ Alles zurückgesetzt.')}
        />
      </div>
    </div>
  );
}

function ConfirmRow({
  label,
  hint,
  danger,
  armed,
  busy,
  onArm,
  onCancel,
  onConfirm,
}: {
  label: string;
  hint: string;
  danger?: boolean;
  armed: boolean;
  busy: boolean;
  onArm: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1E4028] pt-4 first:border-0 first:pt-0">
      <div className="min-w-0">
        <p className={`font-fredoka font-600 ${danger ? 'text-red-400' : 'text-white'}`}>{label}</p>
        <p className="font-nunito text-xs text-white/40">{hint}</p>
      </div>
      {armed ? (
        <span className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onConfirm}
            disabled={busy}
            className="font-bebas text-xs tracking-wide px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-500 disabled:opacity-50"
          >
            {busy ? '…' : 'Ja, wirklich'}
          </button>
          <button onClick={onCancel} className="font-nunito text-xs text-white/50 hover:text-white px-2">
            Abbrechen
          </button>
        </span>
      ) : (
        <button
          onClick={onArm}
          className={`font-nunito text-sm px-4 py-2 rounded-full border transition-all flex-shrink-0 ${
            danger
              ? 'border-red-500/30 text-red-400/80 hover:border-red-500/60'
              : 'border-white/10 text-white/60 hover:text-white hover:border-white/30'
          }`}
        >
          {label}
        </button>
      )}
    </div>
  );
}
