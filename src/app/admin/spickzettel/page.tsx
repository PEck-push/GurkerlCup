'use client';

import { useEffect, useState } from 'react';

/**
 * Moderations-Spickzettel als druckbare Admin-Seite (1 A4).
 * Statischer Inhalt (Begrüßung, 3 Phasen, Punkte, Karten, Timeline) – nutzt die
 * App-Markenschriften über die CSS-Variablen aus layout.tsx.
 */

const GREEN = '#2F8F63';
const GOLD = '#9A7B18';
const RED = '#C62F2F';
const PHASE_CHIPS = [14, 12, 10, 9, 8, 7, 6, 5, 4, 3];

export default function SpickzettelPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return <main style={{ padding: 40, fontFamily: 'sans-serif', color: '#333' }}>Lädt…</main>;
  }
  if (!authed) {
    return (
      <main style={{ padding: 40, fontFamily: 'sans-serif', color: '#333' }}>
        Bitte zuerst im{' '}
        <a href="/admin" style={{ color: GREEN, fontWeight: 700 }}>
          Admin-Bereich
        </a>{' '}
        einloggen.
      </main>
    );
  }

  return (
    <main className="sp-main">
      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          .no-print { display: none !important; }
          .sp-sheet { box-shadow: none !important; }
          .sp-main { background: #fff !important; padding: 0 !important; }
        }
        .sp-main { background: #e8e8e8; min-height: 100vh; padding: 16px 0 40px; }
        .sp-sheet {
          width: 210mm; min-height: 297mm; background: #fff; color: #12180F;
          margin: 0 auto; padding: 9mm 12mm 8mm; box-sizing: border-box;
          box-shadow: 0 4px 24px rgba(0,0,0,0.22); display: flex; flex-direction: column;
        }
        .sp-sheet .lbl { font-family: var(--font-bebas), sans-serif; letter-spacing: 0.11em; font-size: 14px; margin: 0 0 1.5mm; }

        .sp-top { display: flex; align-items: flex-end; justify-content: space-between; gap: 8mm;
          border-bottom: 3px solid ${GOLD}; padding-bottom: 3mm; margin-bottom: 3.5mm; }
        .sp-top h1 { font-family: var(--font-pacifico), cursive; font-weight: 400; font-size: 11.5mm; line-height: 1.05; margin: 0; color: ${GREEN}; }
        .sp-eyebrow { font-family: var(--font-bebas), sans-serif; font-size: 14px; letter-spacing: 0.16em; color: ${GOLD}; margin: 0 0 1mm; }
        .sp-event { text-align: right; font-family: var(--font-nunito), sans-serif; font-weight: 800; font-size: 12.5px; color: #3A4536; line-height: 1.35; }
        .sp-event b { color: ${GREEN}; }

        .sp-greet { border: 2.5px solid ${GOLD}; background: #FBF7EA; border-radius: 10px; padding: 3mm 5.5mm; margin-bottom: 3.2mm; }
        .sp-greet .lbl { color: ${GOLD}; }
        .sp-greet ul { margin: 0; padding-left: 5.5mm; }
        .sp-greet li { font-family: var(--font-nunito), sans-serif; font-weight: 800; font-size: 14px; line-height: 1.42; }
        .sp-greet li b { color: ${GREEN}; }

        .sp-phases { display: flex; flex-direction: column; gap: 2.2mm; margin-bottom: 3.2mm; }
        .sp-phases > .lbl { color: #3A4536; margin-bottom: 0.5mm; }
        .sp-phase { display: flex; align-items: center; gap: 5mm; border: 2.5px solid var(--c); border-left-width: 8px; border-radius: 10px; padding: 2.5mm 5mm; }
        .sp-phase .no { font-family: var(--font-bebas), sans-serif; font-size: 26px; color: var(--c); line-height: 1; width: 10mm; text-align: center; flex: none; }
        .sp-phase .pname { font-family: var(--font-fredoka), sans-serif; font-weight: 700; font-size: 16px; color: #12180F; margin: 0; }
        .sp-phase .pname .t { color: var(--c); }
        .sp-phase .pname .tm { font-weight: 600; color: #54614A; }
        .sp-phase .ptext { font-family: var(--font-nunito), sans-serif; font-weight: 700; font-size: 13px; color: #3A4536; margin: 0.4mm 0 0; line-height: 1.32; }
        .sp-phase .ptext b { color: #12180F; }

        .sp-two { display: flex; gap: 5mm; margin-bottom: 3.2mm; }
        .sp-box { flex: 1; border: 2.5px solid #1c2618; border-radius: 10px; padding: 3.2mm 4.5mm; }
        .sp-box.pts { border-color: ${GREEN}; } .sp-box.pts .lbl { color: ${GREEN}; }
        .sp-box.cards { border-color: ${GOLD}; } .sp-box.cards .lbl { color: ${GOLD}; }
        .sp-lead { font-family: var(--font-nunito), sans-serif; font-weight: 800; font-size: 12.5px; color: #3A4536; margin: 0 0 2mm; }
        .sp-chips { display: flex; flex-wrap: wrap; gap: 2mm; }
        .sp-chip { display: inline-flex; align-items: baseline; gap: 4px; border-radius: 7px; border: 2px solid #1c2618; padding: 2px 8px; font-family: var(--font-fredoka), sans-serif; font-weight: 700; font-size: 14px; color: #12180F; }
        .sp-chip b { font-family: var(--font-bebas), sans-serif; font-weight: 400; font-size: 11px; color: #54614A; }
        .sp-chip.floor { border-style: dashed; color: #54614A; } .sp-chip.floor b { color: #8a8578; }
        .sp-fin { font-family: var(--font-nunito), sans-serif; margin: 2mm 0 0; font-weight: 800; font-size: 12.5px; color: #12180F; line-height: 1.4; }
        .sp-fin b { color: ${RED}; }
        .sp-cards ul { margin: 0; padding-left: 5mm; }
        .sp-cards li { font-family: var(--font-nunito), sans-serif; font-weight: 700; font-size: 13px; line-height: 1.42; margin-bottom: 1mm; }
        .sp-cards li b { color: ${GOLD}; }
        .sp-cards .warn { color: ${RED}; }

        .sp-extras { border: 2px solid #1c2618; border-radius: 10px; padding: 3mm 5mm; margin-bottom: 3.2mm; }
        .sp-extras .lbl { color: #12180F; }
        .sp-extras ul { margin: 0; padding-left: 5mm; }
        .sp-extras li { font-family: var(--font-nunito), sans-serif; font-weight: 700; font-size: 13px; line-height: 1.42; }
        .sp-extras li b { color: ${GREEN}; }

        .sp-timeline { background: #12180F; color: #F4F2E8; border-radius: 10px; padding: 3mm 5mm; margin-bottom: 3mm; }
        .sp-timeline .lbl { color: #EAD98A; }
        .sp-timeline .row { font-family: var(--font-fredoka), sans-serif; font-weight: 600; font-size: 12px; line-height: 1.6; margin: 0; }
        .sp-timeline .row b { color: #EAD98A; }

        .sp-modusb { font-family: var(--font-nunito), sans-serif; font-weight: 700; font-size: 11.5px; color: #54614A; border: 1.8px dashed #b9b3a4; border-radius: 8px; padding: 2.2mm 5mm; margin-bottom: 3mm; }
        .sp-modusb b { color: #12180F; }

        .sp-closing { margin-top: auto; background: ${GREEN}; color: #fff; border-radius: 12px; padding: 3.5mm; text-align: center; }
        .sp-closing p { font-family: var(--font-fredoka), sans-serif; font-weight: 700; font-size: 18px; margin: 0; }
      `}</style>

      <div
        className="no-print"
        style={{ maxWidth: '210mm', margin: '0 auto 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}
      >
        <p style={{ margin: 0, color: '#333', fontFamily: 'sans-serif', fontSize: 14 }}>
          Moderations-Spickzettel · 1 A4-Seite
        </p>
        <button
          onClick={() => window.print()}
          style={{ background: '#D4AF37', border: '2px solid #0a1f12', borderRadius: 999, padding: '10px 22px', fontWeight: 700, cursor: 'pointer' }}
        >
          🖨 Drucken
        </button>
      </div>

      <div className="sp-sheet">
        <div className="sp-top">
          <div>
            <p className="sp-eyebrow">MODERATIONS-SPICKZETTEL · BEGRÜSSUNG</p>
            <h1>Gurkerl Cup 2026</h1>
          </div>
          <div className="sp-event">
            18. Juli 2026
            <br />
            <b>Fußballplatz Pöttsching</b>
            <br />
            gurkerl.fun
          </div>
        </div>

        <div className="sp-greet">
          <p className="lbl">1 · Begrüßung &amp; Rahmen</p>
          <ul>
            <li>
              Servus &amp; herzlich willkommen zum <b>Gurkerl Cup 2026</b>! 🥒
            </li>
            <li>
              Heute: <b>Turnier + Sommerfest</b> — Grill, kühle Spritzer, am Abend Party mit <b>DJ 1er</b> unter Flutlicht.
            </li>
            <li>
              Zuschauen frei — mitfiebern Pflicht. Alle Teams à 3 kämpfen um die <b>Goldene Gurke</b> 👑
            </li>
          </ul>
        </div>

        <div className="sp-phases">
          <p className="lbl">2 · Der Ablauf — 3 Phasen</p>
          <div className="sp-phase" style={{ ['--c' as string]: GOLD }}>
            <div className="no">1</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="pname">
                <span className="t">ERÖFFNUNG</span> · „Bleib ruhig!" &nbsp;<span className="tm">15:15</span>
              </p>
              <p className="ptext">
                Alle gleichzeitig: Turm bauen → Fähnchen ziehen = <b>erste Platzierung</b>. Setzt den Ton für den Tag.
              </p>
            </div>
          </div>
          <div className="sp-phase" style={{ ['--c' as string]: GREEN }}>
            <div className="no">2</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="pname">
                <span className="t">PHASE A</span> · 7 Stationen &nbsp;<span className="tm">15:30–19:30</span>
              </p>
              <p className="ptext">
                Freie Reihenfolge, jedes Team im eigenen Tempo. <b>⛔ 19:30 harte Deadline</b> — nicht gespielt = 0 Punkte.
              </p>
            </div>
          </div>
          <div className="sp-phase" style={{ ['--c' as string]: RED }}>
            <div className="no">3</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="pname">
                <span className="t">FINALE</span> · Ringerl + Blindes Chaos &nbsp;<span className="tm">ab 20:00</span>
              </p>
              <p className="ptext">
                Die große Aufholjagd. Blindes Chaos zählt <b>doppelt</b> — hier fällt die Entscheidung!
              </p>
            </div>
          </div>
        </div>

        <div className="sp-two">
          <div className="sp-box pts">
            <p className="lbl">3 · Punktesystem</p>
            <p className="sp-lead">Pro Station zählt der Platz:</p>
            <div className="sp-chips">
              {PHASE_CHIPS.map((v, i) => (
                <span className="sp-chip" key={i}>
                  <b>{i + 1}.</b>
                  {v}
                </span>
              ))}
              <span className="sp-chip floor">
                <b>11.+</b>2
              </span>
            </div>
            <p className="sp-fin">
              Finale wiegt schwer: Ringerl-Sieg <b>24</b> · Blindes Chaos <b>48</b> (×2) → bis zum Schluss ist alles offen.
            </p>
          </div>
          <div className="sp-box cards">
            <p className="lbl">4 · Gurkerl-Karten 🃏</p>
            <p className="sp-lead">2 Joker/Team · nur Phase A · max. 1 pro Station</p>
            <ul>
              <li>
                <b>Doppel-Gurkerl:</b> Punkte der Station ×2 — <span className="warn">vorher ansagen!</span>
              </li>
              <li>
                <b>2nd Chance:</b> Station nochmal spielen — der 2. Versuch zählt <b>immer</b>.
              </li>
            </ul>
          </div>
        </div>

        <div className="sp-extras">
          <p className="lbl">5 · Nicht vergessen</p>
          <ul>
            <li>
              🍷 <b>Spritzerwertung:</b> Spaß-Sonderwertung — zählt NICHT zur Gesamtwertung.
            </li>
            <li>
              📲 <b>Laufzettel + QR</b> pro Team: eigene Ergebnisse jederzeit live checken.
            </li>
            <li>🤝 Fairness &amp; Gaudi vor allem — im Zweifel zählt das Wort des Betreuers.</li>
          </ul>
        </div>

        <div className="sp-timeline">
          <p className="lbl">Heute im Überblick</p>
          <p className="row">
            <b>14:30</b> Registrierung &nbsp;·&nbsp; <b>15:15</b> Eröffnung &nbsp;·&nbsp; <b>15:30–19:30</b> Phase A &nbsp;·&nbsp;{' '}
            <b>19:45</b> Zwischenstand &nbsp;·&nbsp; <b>20:00</b> Ringerl &nbsp;·&nbsp; <b>20:45</b> Blindes Chaos &nbsp;·&nbsp;{' '}
            <b>21:30</b> Siegerehrung → Fest
          </p>
        </div>

        <div className="sp-modusb">
          <b>Falls Modus B aktiv:</b> jedes Team spielt 6 von 7–8 Stationen (die restlichen frei wählbar auslassen) — kurz ansagen.
        </div>

        <div className="sp-closing">
          <p>„Auf geht's — Bühne frei für den Gurkerl Cup!" 🥒</p>
        </div>
      </div>
    </main>
  );
}
