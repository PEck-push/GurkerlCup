'use client';

import { motion } from 'framer-motion';

const events = [
  {
    time: '14:30',
    title: 'Ankunft & Empfang',
    desc: 'Teamregistrierung · Gurkerl Pass + Joker-Karten werden ausgegeben',
    type: 'normal',
  },
  {
    time: '15:00',
    title: 'Eröffnung',
    desc: 'Intro, Regeln, Teameinteilung – macht euch bereit',
    type: 'normal',
  },
  {
    time: '15:15',
    title: 'OPENING: Mutter Stapeln',
    desc: 'Alle Teams gleichzeitig – das Eröffnungsspiel startet den Wettkampf',
    type: 'highlight',
  },
  {
    time: '15:30',
    title: 'Phase A – Freie Stationen',
    desc: '7 Stationen öffnen · freie Reihenfolge · Fest läuft parallel · Flutlicht ab Dämmerung',
    type: 'normal',
  },
  {
    time: '19:30',
    title: 'Phase A ENDE',
    desc: 'Harte Deadline! Keine Nachzügler. Offene Stationen = 0 Punkte. Scorekeeper berechnet Rankings.',
    type: 'deadline',
  },
  {
    time: '19:45',
    title: 'Zwischenstand-Zeremonie',
    desc: 'Alle Teams versammeln sich – Phase-A-Ranking wird Platz für Platz dramatisch enthüllt!',
    type: 'highlight',
  },
  {
    time: '20:00',
    title: 'Phase B: Riesen-Ringerl',
    desc: 'Alle Teams gleichzeitig · ca. 15–20 Minuten · letztes Team gewinnt',
    type: 'normal',
  },
  {
    time: '20:45',
    title: 'FINALE GRANDE: Bälle Chaos',
    desc: 'DOPPELTE PUNKTE! Alle Teams gleichzeitig. Der größtmögliche Showdown.',
    type: 'finale',
  },
  {
    time: '21:15',
    title: 'Auswertung',
    desc: 'Scorekeeper berechnet das Gesamtranking aller Teams',
    type: 'normal',
  },
  {
    time: '21:30',
    title: '🏆 Siegerehrung & Goldene Gurke',
    desc: 'Platz 3 → 2 → 1 Enthüllung · Pokale · Spritzerwertung',
    type: 'finale',
  },
];

const typeConfig = {
  normal: {
    dot: 'bg-[#2D6A4F]',
    line: 'border-[#2D6A4F]/40',
    time: 'text-[#52B788]',
    title: 'text-white',
    bg: 'bg-transparent',
    border: 'border-transparent',
  },
  highlight: {
    dot: 'bg-[#D4AF37]',
    line: 'border-[#D4AF37]/30',
    time: 'text-[#D4AF37]',
    title: 'text-[#D4AF37]',
    bg: 'bg-[#D4AF37]/5',
    border: 'border-[#D4AF37]/20',
  },
  deadline: {
    dot: 'bg-red-500',
    line: 'border-red-500/30',
    time: 'text-red-400',
    title: 'text-red-400',
    bg: 'bg-red-900/10',
    border: 'border-red-500/20',
  },
  finale: {
    dot: 'bg-orange-500 animate-pulse-gold',
    line: 'border-orange-500/30',
    time: 'text-orange-400',
    title: 'text-orange-400',
    bg: 'bg-orange-900/10',
    border: 'border-orange-500/20',
  },
};

export default function Schedule() {
  return (
    <section className="py-24 px-6 md:px-16" style={{ background: '#111E15' }}>
      <div className="section-divider mb-24" />
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-bebas text-xs tracking-[0.3em] text-[#52B788]/60 mb-3">18. JULI 2026</p>
          <h2 className="font-fredoka font-700 text-5xl text-white">
            Der{' '}
            <span className="text-gold-gradient font-pacifico font-400">Zeitplan</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[68px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#2D6A4F]/40 to-transparent" />

          <div className="flex flex-col gap-2">
            {events.map((event, i) => {
              const cfg = typeConfig[event.type as keyof typeof typeConfig];
              return (
                <motion.div
                  key={event.time + event.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`relative flex gap-6 rounded-xl p-4 border transition-all duration-300 ${cfg.bg} ${cfg.border}`}
                >
                  {/* Time */}
                  <div className="flex-shrink-0 w-14 text-right">
                    <span className={`font-bebas text-base tracking-wide ${cfg.time}`}>
                      {event.time}
                    </span>
                  </div>

                  {/* Dot */}
                  <div className="flex-shrink-0 relative flex items-start justify-center mt-1">
                    <div className={`w-3 h-3 rounded-full ${cfg.dot} ring-4 ring-[#111E15]`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-1">
                    <p className={`font-fredoka font-600 text-base ${cfg.title}`}>{event.title}</p>
                    <p className="font-nunito text-sm text-white/45 mt-0.5 leading-relaxed">
                      {event.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
