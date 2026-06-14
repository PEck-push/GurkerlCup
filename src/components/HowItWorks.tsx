'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

const phases = [
  {
    icon: '👥',
    title: '3er Teams',
    color: 'text-[#52B788]',
    borderColor: 'border-[#52B788]/30',
    bgColor: 'bg-[#52B788]/5',
    content:
      'Bildet Teams aus je 3 Personen und gebt eurem Team einen würdigen Namen. Gemeinsam kämpft ihr den ganzen Nachmittag an verschiedenen Stationen um Punkte – und am Ende um die legendäre Goldene Gurke.',
  },
  {
    icon: '🎮',
    title: 'Eröffnungsspiel',
    color: 'text-[#D4AF37]',
    borderColor: 'border-[#D4AF37]/30',
    bgColor: 'bg-[#D4AF37]/5',
    content:
      'Alle Teams starten gleichzeitig mit dem Mutter Stapeln. Sechs Sechskantmuttern, eine Holzstange – keine Hände. Das Ergebnis zählt bereits zur Gesamtwertung.',
  },
  {
    icon: '🗺️',
    title: 'Phase A – Freie Stationen',
    color: 'text-[#52B788]',
    borderColor: 'border-[#52B788]/30',
    bgColor: 'bg-[#52B788]/5',
    content:
      '7 Stationen können in freier Reihenfolge besucht werden – während das Fest parallel läuft. Euer Rohwert (Zeit, Treffer, Distanz) wird sofort notiert. Das Ranking aller Teams wird erst um 19:30 Uhr berechnet. Deadline: hart.',
  },
  {
    icon: '🃏',
    title: 'Die Joker-Karten',
    color: 'text-[#D4AF37]',
    borderColor: 'border-[#D4AF37]/30',
    bgColor: 'bg-[#D4AF37]/5',
    content: null,
    jokers: [
      {
        name: 'DOPPEL GURKERL',
        desc: 'Vor Spielbeginn ansagen. Rangpunkte dieser Station werden verdoppelt. Platz 1 = 24 statt 12 Punkte.',
        warning: 'Gilt auch bei schlechtem Ergebnis!',
      },
      {
        name: '2ND CHANCE GURKERL',
        desc: 'Nach dem ersten Versuch einsetzen. Das Team darf die Station nochmal absolvieren.',
        warning: 'Der 2. Versuch zählt IMMER – auch wenn er schlechter ist!',
      },
    ],
  },
  {
    icon: '🏟️',
    title: 'Phase B – Das Finale',
    color: 'text-orange-400',
    borderColor: 'border-orange-400/30',
    bgColor: 'bg-orange-400/5',
    content:
      'Um 19:45 Uhr: Die große Zwischenstand-Zeremonie – das Phase-A-Ranking wird dramatisch Platz für Platz enthüllt. Danach: Riesen-Ringerl (alle gegen alle) und das Finale Grande Bälle Chaos mit doppelter Punktzahl!',
  },
];

const pointsTable = [
  { label: 'Phase A + Eröffnung', rows: [{ rank: '1.', pts: '12' }, { rank: '2.', pts: '10' }, { rank: '3.', pts: '8' }, { rank: '4.', pts: '7' }, { rank: '5.', pts: '6' }] },
  { label: 'Riesen-Ringerl', rows: [{ rank: '1.', pts: '20' }, { rank: '2.', pts: '15' }, { rank: '3.', pts: '12' }, { rank: '4–6.', pts: '8' }, { rank: '7+', pts: '4' }] },
  { label: 'Bälle Chaos ×2 🔥', rows: [{ rank: '1.', pts: '40' }, { rank: '2.', pts: '30' }, { rank: '3.', pts: '24' }, { rank: '4–6.', pts: '16' }, { rank: '7+', pts: '8' }] },
];

export default function HowItWorks() {
  return (
    <section id="ablauf" className="py-24 px-6 md:px-16 bg-[#0D2818] noise-overlay relative">
      <div className="section-divider mb-24" />

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-20"
        >
          <p className="font-bebas text-xs tracking-[0.3em] text-[#52B788]/60 mb-3">DER WETTKAMPF</p>
          <h2 className="font-fredoka font-700 text-5xl md:text-6xl text-white">
            So funktioniert{' '}
            <span className="text-gold-gradient font-pacifico font-400">der Cup</span>
          </h2>
        </motion.div>

        {/* Phase cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              custom={i}
              className={`rounded-2xl border p-7 ${phase.borderColor} ${phase.bgColor}`}
              style={{ background: 'rgba(13,40,24,0.6)' }}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0 mt-0.5">{phase.icon}</span>
                <div className="flex-1">
                  <h3 className={`font-fredoka font-700 text-xl ${phase.color} mb-2`}>
                    {phase.title}
                  </h3>
                  {phase.content && (
                    <p className="font-nunito text-[#F5F0E8]/70 text-sm leading-relaxed">
                      {phase.content}
                    </p>
                  )}
                  {phase.jokers && (
                    <div className="flex flex-col gap-3 mt-1">
                      {phase.jokers.map((j) => (
                        <div key={j.name} className="bg-black/20 rounded-xl p-4 border border-[#D4AF37]/20">
                          <p className="font-bebas text-sm tracking-[0.12em] text-[#D4AF37] mb-1">
                            {j.name}
                          </p>
                          <p className="font-nunito text-xs text-white/60 leading-relaxed">{j.desc}</p>
                          <p className="font-nunito text-xs text-red-400/80 mt-1.5">⚠ {j.warning}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Points table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <h3 className="font-fredoka font-700 text-3xl text-white text-center mb-10">
            Das <span className="text-gold-gradient font-pacifico font-400">Punktesystem</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {pointsTable.map((table, ti) => (
              <div
                key={table.label}
                className="rounded-2xl border border-[#2D6A4F]/30 overflow-hidden"
                style={{ background: 'rgba(13,40,24,0.8)' }}
              >
                <div
                  className={`px-5 py-4 border-b border-[#2D6A4F]/20 ${ti === 2 ? 'bg-red-900/20' : 'bg-[#1B4332]/40'}`}
                >
                  <p className="font-fredoka font-600 text-white text-sm">{table.label}</p>
                </div>
                <div className="px-5 py-4">
                  {table.rows.map((row) => (
                    <div
                      key={row.rank}
                      className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                    >
                      <span className="font-nunito text-sm text-white/50">{row.rank}</span>
                      <span className={`font-bebas text-lg ${ti === 2 ? 'text-red-400' : 'text-[#D4AF37]'}`}>
                        {row.pts} Pkt
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="font-nunito text-center text-white/30 text-sm mt-6">
            Maximal erreichbar: 156 Punkte · Punkte werden rangbasiert vergeben (nicht absolut summiert)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
