'use client';

export default function PrintExportPanel() {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <h3 className="font-fredoka font-600 text-white mb-1">Notfall-Rangliste</h3>
        <p className="font-nunito text-sm text-white/50 mb-4">
          Druckbare Gesamtrangliste (inkl. Punkte je Disziplin & Spritzerwertung) – funktioniert
          auch, wenn der Beamer mal streikt.
        </p>
        <a
          href="/api/admin/print"
          target="_blank"
          rel="noreferrer"
          className="btn-gold px-5 py-2.5 rounded-full text-sm inline-block"
        >
          🖨 Rangliste öffnen / drucken
        </a>
      </div>

      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <h3 className="font-fredoka font-600 text-white mb-1">Anmeldungen exportieren</h3>
        <p className="font-nunito text-sm text-white/50 mb-4">
          Excel-Liste aller Anmeldungen für die Turnierverwaltung & den Check-In.
        </p>
        <a
          href="/api/admin/export"
          className="font-nunito text-sm text-[#52B788] hover:text-white border border-[#52B788]/30 hover:border-[#52B788] rounded-full px-5 py-2.5 inline-block transition-all"
        >
          ⬇ Excel (Anmeldungen)
        </a>
      </div>
    </div>
  );
}
