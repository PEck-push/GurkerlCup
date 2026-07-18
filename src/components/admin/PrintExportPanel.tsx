'use client';

export default function PrintExportPanel() {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <h3 className="font-fredoka font-600 text-white mb-1">Team-Laufblätter (A4)</h3>
        <p className="font-nunito text-sm text-white/50 mb-4">
          Pro Team ein A4-Blatt: Mitglieder, alle Phase-A-Stationen mit Kurzregeln & Wertung,
          Joker-Hinweis und persönlicher QR-Code.
        </p>
        <a
          href="/admin/print-sheets"
          target="_blank"
          rel="noreferrer"
          className="btn-gold px-5 py-2.5 rounded-full text-sm inline-block"
        >
          🖨 Laufblätter öffnen / drucken
        </a>
      </div>

      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <h3 className="font-fredoka font-600 text-white mb-1">Team-QR-Codes</h3>
        <p className="font-nunito text-sm text-white/50 mb-4">
          Druckbare Blätter mit QR-Code + Link zur persönlichen Team-Seite (eigene Ergebnisse) –
          zum Verteilen an die Teams nach dem Check-In.
        </p>
        <a
          href="/admin/print-qr"
          target="_blank"
          rel="noreferrer"
          className="btn-gold px-5 py-2.5 rounded-full text-sm inline-block"
        >
          🖨 QR-Codes öffnen / drucken
        </a>
      </div>

      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <h3 className="font-fredoka font-600 text-white mb-1">Stationsschilder (A4)</h3>
        <p className="font-nunito text-sm text-white/50 mb-4">
          Ein Schild pro Spiel (10 Seiten) zum Ausdrucken/Laminieren und am Stationstisch
          aufkleben: großes Gurkerl-Bild, Spielname, Regeln &amp; Punkteraster – im Beamer-Look.
        </p>
        <a
          href="/downloads/gurkerl-cup-stationsschilder.pdf"
          target="_blank"
          rel="noreferrer"
          className="btn-gold px-5 py-2.5 rounded-full text-sm inline-block"
        >
          ⬇ Stationsschilder (PDF)
        </a>
      </div>

      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <h3 className="font-fredoka font-600 text-white mb-1">Spiele-Übersicht (kompakt)</h3>
        <p className="font-nunito text-sm text-white/50 mb-4">
          Alle 10 Spiele auf 2 Seiten: Ablauf, Wertung &amp; Punkteraster auf einen Blick –
          ideal für Turnierleitung &amp; Helfer-Briefing.
        </p>
        <a
          href="/downloads/gurkerl-cup-spieleuebersicht.pdf"
          target="_blank"
          rel="noreferrer"
          className="btn-gold px-5 py-2.5 rounded-full text-sm inline-block"
        >
          ⬇ Spiele-Übersicht (PDF)
        </a>
      </div>

      <div className="rounded-2xl border border-[#1E4028] bg-[#111E13] p-5">
        <h3 className="font-fredoka font-600 text-white mb-1">Moderations-Spickzettel (A4)</h3>
        <p className="font-nunito text-sm text-white/50 mb-4">
          Eine Seite für die Begrüßung/Anmoderation: 3 Phasen, Punktesystem, Gurkerl-Karten,
          Spritzer &amp; Timeline – alles auf einen Blick (inkl. Modus-B-Hinweis 6 von 7–8).
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/admin/spickzettel"
            target="_blank"
            rel="noreferrer"
            className="btn-gold px-5 py-2.5 rounded-full text-sm inline-block"
          >
            🖨 Spickzettel öffnen / drucken
          </a>
          <a
            href="/downloads/gurkerl-cup-moderation-spickzettel.pdf"
            target="_blank"
            rel="noreferrer"
            className="font-nunito text-sm text-[#52B788] hover:text-white border border-[#52B788]/30 hover:border-[#52B788] rounded-full px-5 py-2.5 inline-block transition-all"
          >
            ⬇ PDF
          </a>
        </div>
      </div>

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
