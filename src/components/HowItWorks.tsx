'use client';

import { motion } from 'framer-motion';

interface Step {
  no: string;
  kicker: string;
  title: string;
  body: string;
  accent: string; // hex
  glow: string;
  icon: string;
}

const steps: Step[] = [
  {
    no: '1',
    kicker: 'ERÖFFNUNG',
    title: 'Mutter Stapeln',
    body: 'Alle Teams starten gemeinsam. Mit einer dünnen Holzstange werden sechs Sechskantmuttern zu einem Turm gestapelt – ganz ohne die Hände zu benutzen. Das Eröffnungsspiel gibt den Startschuss und zählt bereits zur Gesamtwertung.',
    accent: '#D4AF37',
    glow: 'rgba(212,175,55,0.25)',
    icon: '🔩',
  },
  {
    no: '2',
    kicker: 'PHASE A',
    title: 'Die freien Stationen',
    body: 'Sieben Stationen, frei wählbare Reihenfolge – während parallel das Fest läuft. Jedes Team entscheidet selbst, wann es welche Station besucht. Euer Ergebnis wird sofort an der Station festgehalten.',
    accent: '#52B788',
    glow: 'rgba(82,183,136,0.22)',
    icon: '🗺️',
  },
  {
    no: '3',
    kicker: 'PHASE B · DAS FINALE',
    title: 'Showdown für alle',
    body: 'Nach der großen Zwischenstand-Zeremonie treten alle Teams gleichzeitig an: erst das Riesen-Ringerl, dann das große Finale Bälle Chaos. Hier fällt die Entscheidung – wer holt sich die Goldene Gurke?',
    accent: '#FB923C',
    glow: 'rgba(251,146,60,0.22)',
    icon: '🏆',
  },
];

const jokers = [
  {
    name: 'DOPPEL GURKERL',
    desc: 'Vor Spielbeginn ansagen – die Wertung dieser Station zählt doppelt.',
    warn: 'Gilt auch bei schlechtem Ergebnis!',
  },
  {
    name: '2ND CHANCE GURKERL',
    desc: 'Nach dem ersten Versuch einsetzen – das Team darf die Station nochmal absolvieren.',
    warn: 'Der 2. Versuch zählt immer – auch wenn er schlechter ist!',
  },
];

export default function HowItWorks() {
  return (
    <section id="ablauf" className="py-24 px-6 md:px-16 bg-[#0D2818] noise-overlay relative overflow-hidden">
      {/* soft accent glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-[#2D6A4F]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="font-bebas text-xs tracking-[0.3em] text-[#52B788]/60 mb-3">DER WETTKAMPF</p>
          <h2 className="font-fredoka font-700 text-5xl md:text-6xl text-white">
            So läuft{' '}
            <span className="text-gold-gradient font-pacifico font-400">der Cup</span>
          </h2>
        </motion.div>

        {/* Flow diagram */}
        <div className="relative">
          {steps.map((step, i) => (
            <div key={step.no} className="relative">
              <StepNode step={step} index={i}>
                {/* Phase A special: Gurkerl-Karten */}
                {step.no === '2' && <GurkerlKarten />}
              </StepNode>

              {/* Connector */}
              {i < steps.length - 1 && <Connector />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Step node ───────────── */
function StepNode({
  step,
  index,
  children,
}: {
  step: Step;
  index: number;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl glass p-7 md:p-9"
      style={{ boxShadow: `0 24px 60px -30px ${step.glow}` }}
    >
      {/* number badge */}
      <div
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-bebas text-2xl"
        style={{
          background: `linear-gradient(135deg, ${step.accent}, ${step.accent}99)`,
          color: '#0A1F12',
          boxShadow: `0 0 24px ${step.glow}`,
        }}
      >
        {step.no}
      </div>

      <div className="flex items-start gap-5 mt-4">
        <span className="text-4xl md:text-5xl flex-shrink-0 leading-none">{step.icon}</span>
        <div className="flex-1">
          <p
            className="font-bebas text-sm tracking-[0.25em] mb-1"
            style={{ color: step.accent }}
          >
            {step.kicker}
          </p>
          <h3 className="font-fredoka font-700 text-2xl md:text-3xl text-white mb-3">
            {step.title}
          </h3>
          <p className="font-nunito text-[#F5F0E8]/65 text-sm md:text-base leading-relaxed">
            {step.body}
          </p>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ───────────── Connector ───────────── */
function Connector() {
  return (
    <div className="relative h-16 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-px h-full origin-top"
        style={{
          background: 'linear-gradient(to bottom, rgba(82,183,136,0.6), rgba(212,175,55,0.5))',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="absolute bottom-1.5 text-[#D4AF37]"
      >
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </div>
  );
}

/* ───────────── Gurkerl-Karten special (Phase A) ───────────── */
function GurkerlKarten() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mt-6 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.04] p-5"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xl">🃏</span>
        <p className="font-bebas text-[11px] tracking-[0.12em] text-[#F0CE67] whitespace-nowrap">
          SPECIAL · NUR IN PHASE A
        </p>
      </div>
      <h4 className="font-fredoka font-700 text-lg text-white mb-1.5">Die Gurkerl-Karten</h4>
      <p className="font-nunito text-sm text-white/55 leading-relaxed mb-4">
        Jedes Team bekommt zwei Gurkerl-Karten auf den Gurkerl-Pass. Einsetzbar nur in Phase A und
        beim Eröffnungsspiel – maximal eine pro Spiel. Klug eingesetzt, können sie alles drehen.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {jokers.map((j) => (
          <div
            key={j.name}
            className="rounded-xl bg-black/25 border border-[#D4AF37]/15 p-4"
          >
            <p className="font-bebas text-sm tracking-[0.1em] text-[#F0CE67] mb-1.5">{j.name}</p>
            <p className="font-nunito text-xs text-white/55 leading-relaxed">{j.desc}</p>
            <p className="font-nunito text-xs text-red-400/80 mt-2">⚠ {j.warn}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
