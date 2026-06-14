import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung – Gurkerl Cup 2026',
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#0D2818] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-nunito text-sm text-[#52B788] hover:text-[#52B788]/70 transition-colors mb-10"
        >
          ← Zurück zur Startseite
        </Link>

        <h1 className="font-fredoka font-700 text-4xl text-white mb-2">Datenschutzerklärung</h1>
        <p className="font-nunito text-[#52B788]/70 text-sm mb-10">Gurkerl Cup 2026 – Fun Games Pöttsching</p>

        <div className="space-y-10 font-nunito text-[#F5F0E8]/70 text-sm leading-relaxed">
          <section>
            <h2 className="font-fredoka font-600 text-lg text-white mb-3">1. Verantwortlicher</h2>
            <div className="bg-[#1B4332]/30 border border-[#2D6A4F]/30 rounded-xl p-5">
              <p><strong className="text-white">Verantwortlich für die Datenverarbeitung:</strong></p>
              <p className="mt-2">[Name des Veranstalters]<br />
              [Adresse]<br />
              [PLZ Ort]<br />
              E-Mail: [kontakt@email.at]</p>
              <p className="mt-3 text-[#52B788]/60 text-xs italic">
                Bitte füge hier die korrekten Kontaktdaten des Veranstalters ein.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-fredoka font-600 text-lg text-white mb-3">2. Welche Daten wir erheben</h2>
            <p>Im Rahmen der Turnieranmeldung erheben wir ausschließlich folgende personenbezogene Daten:</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-white/60">
              <li>Teamname</li>
              <li>Namen der drei Teammitglieder</li>
              <li>Kontakt-E-Mail-Adresse</li>
            </ul>
          </section>

          <section>
            <h2 className="font-fredoka font-600 text-lg text-white mb-3">3. Zweck der Verarbeitung</h2>
            <p>
              Die erhobenen Daten werden ausschließlich zur Organisation und Durchführung des
              Gurkerl Cups 2026 verwendet:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-white/60">
              <li>Verwaltung der Teamanmeldung</li>
              <li>Versand der Anmeldebestätigung per E-Mail</li>
              <li>Kommunikation rund um das Event</li>
            </ul>
            <p className="mt-3">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
            </p>
          </section>

          <section>
            <h2 className="font-fredoka font-600 text-lg text-white mb-3">4. Speicherdauer</h2>
            <p>
              Eure Daten werden bis spätestens 8 Wochen nach Durchführung des Gurkerl Cups 2026
              (18. Juli 2026) gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka font-600 text-lg text-white mb-3">5. Weitergabe an Dritte</h2>
            <p>
              Eure Daten werden nicht an Dritte weitergegeben. Die technische Infrastruktur
              wird durch folgende Dienstleister bereitgestellt, die als Auftragsverarbeiter
              DSGVO-konform tätig sind:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-white/60">
              <li><strong className="text-white">Supabase</strong> – Datenbankspeicherung (EU-Server Frankfurt/Main)</li>
              <li><strong className="text-white">Resend</strong> – E-Mail-Versand (GDPR-konform)</li>
              <li><strong className="text-white">Vercel</strong> – Hosting der Website</li>
            </ul>
          </section>

          <section>
            <h2 className="font-fredoka font-600 text-lg text-white mb-3">6. Eure Rechte</h2>
            <p>Ihr habt das Recht auf:</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-white/60">
              <li>Auskunft über gespeicherte Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung eurer Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Widerruf der Einwilligung jederzeit</li>
            </ul>
            <p className="mt-4">
              Zur Ausübung eurer Rechte kontaktiert uns unter: <strong className="text-white">[kontakt@email.at]</strong>
            </p>
          </section>

          <section>
            <h2 className="font-fredoka font-600 text-lg text-white mb-3">7. Cookies & Tracking</h2>
            <p>
              Diese Website verwendet keine Tracking-Cookies und keine Analyse-Tools wie
              Google Analytics. Es werden ausschließlich technisch notwendige Verbindungen
              hergestellt.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka font-600 text-lg text-white mb-3">8. Beschwerderecht</h2>
            <p>
              Ihr habt das Recht, Beschwerde bei der österreichischen Datenschutzbehörde einzulegen:
            </p>
            <p className="mt-2 text-white/60">
              Österreichische Datenschutzbehörde<br />
              Barichgasse 40–42, 1030 Wien<br />
              dsb.gv.at
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[#2D6A4F]/30">
          <p className="font-nunito text-white/20 text-xs text-center">
            Stand: Juni 2026 · Gurkerl Cup 2026
          </p>
        </div>
      </div>
    </div>
  );
}
