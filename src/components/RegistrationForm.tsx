'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface FormData {
  teamName: string;
  player1: string;
  player2: string;
  player3: string;
  email: string;
  dsgvo: boolean;
}

interface FieldError {
  teamName?: string;
  player1?: string;
  player2?: string;
  player3?: string;
  email?: string;
  dsgvo?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function RegistrationForm() {
  const [form, setForm] = useState<FormData>({
    teamName: '',
    player1: '',
    player2: '',
    player3: '',
    email: '',
    dsgvo: false,
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [successEmail, setSuccessEmail] = useState('');
  const [emailSent, setEmailSent] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const validate = (): boolean => {
    const e: FieldError = {};
    if (!form.teamName.trim()) e.teamName = 'Teamname ist erforderlich';
    if (!form.player1.trim()) e.player1 = 'Name Spieler 1 ist erforderlich';
    if (!form.player2.trim()) e.player2 = 'Name Spieler 2 ist erforderlich';
    if (!form.player3.trim()) e.player3 = 'Name Spieler 3 ist erforderlich';
    if (!form.email.trim()) {
      e.email = 'E-Mail-Adresse ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Bitte eine gültige E-Mail-Adresse eingeben';
    }
    if (!form.dsgvo) e.dsgvo = 'Zustimmung zur Datenschutzerklärung erforderlich';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: form.teamName.trim(),
          player1: form.player1.trim(),
          player2: form.player2.trim(),
          player3: form.player3.trim(),
          email: form.email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error ?? 'Ein unbekannter Fehler ist aufgetreten.');
        return;
      }

      setSuccessEmail(form.email.trim());
      setEmailSent(data.emailSent ?? false);
      setStatus('success');

      if (typeof window !== 'undefined') {
        import('canvas-confetti').then(({ default: confetti }) => {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#52B788', '#F0CE67', '#2D6A4F', '#ffffff'],
          });
        });
      }
    } catch {
      setStatus('error');
      setErrorMsg('Netzwerkfehler – bitte versuche es erneut.');
    }
  };

  const inputClass = (field: keyof FieldError) =>
    `w-full bg-[#0D2818] border rounded-xl px-4 py-3.5 font-nunito text-white placeholder:text-white/25 focus:outline-none transition-all duration-200 ${
      errors[field]
        ? 'border-red-500/70 focus:border-red-400'
        : 'border-[#2D6A4F]/50 focus:border-[#D4AF37]/60 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)]'
    }`;

  if (status === 'success') {
    return (
      <section id="anmeldung" className="py-24 px-6 md:px-16 bg-[#0D2818]">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-7xl mb-6">🥒</div>
            <h2 className="font-fredoka font-700 text-4xl text-white mb-3">
              Anmeldung erfolgreich!
            </h2>
            <p className="font-nunito text-[#52B788] mb-2">Team <strong className="text-white">{form.teamName}</strong> ist dabei.</p>
            {emailSent ? (
              <p className="font-nunito text-white/50 text-sm">
                Eine Bestätigung wurde an{' '}
                <span className="text-[#D4AF37]">{successEmail}</span> gesendet.
              </p>
            ) : (
              <p className="font-nunito text-amber-400/80 text-sm">
                Bestätigungsmail konnte nicht gesendet werden – eure Anmeldung ist aber gespeichert.
              </p>
            )}
            <div className="mt-8 p-5 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-left">
              <p className="font-bebas text-xs tracking-widest text-[#D4AF37] mb-3">EUER TEAM</p>
              {[form.player1, form.player2, form.player3].map((p, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <span className="font-bebas text-[#52B788] w-5">{i + 1}</span>
                  <span className="font-nunito text-white">{p}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-xl border border-[#52B788]/20 bg-[#52B788]/5 text-left">
              <p className="font-bebas text-xs tracking-widest text-[#52B788] mb-1.5">WICHTIG · CHECK-IN</p>
              <p className="font-nunito text-sm text-white/70 leading-relaxed">
                Bitte seid <span className="text-white font-700">30 Minuten vor dem Start</span> beim Check-In – dort bekommt ihr euren Gurkerl-Pass und die Joker-Karten.
              </p>
            </div>
            <p className="font-nunito text-white/30 text-xs mt-6">
              Bis am 18. Juli 2026 in Pöttsching! 🎉
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="anmeldung" className="py-24 px-6 md:px-16 bg-[#0D2818]">
      <div className="section-divider mb-24" />
      <div className="max-w-lg mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-bebas text-xs tracking-[0.3em] text-[#52B788]/60 mb-3">DABEI SEIN</p>
          <h2 className="font-fredoka font-700 text-5xl text-white">
            Team{' '}
            <span className="text-gold-gradient font-pacifico font-400">anmelden</span>
          </h2>
          <p className="font-nunito text-white/40 text-sm mt-4">
            Jetzt Platz sichern – die Goldene Gurke wartet nicht ewig.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-5"
          noValidate
        >
          {/* Team name */}
          <div>
            <label className="font-nunito font-600 text-sm text-white/70 block mb-1.5">
              Teamname
            </label>
            <input
              type="text"
              placeholder="z.B. Die Gurkelritter"
              value={form.teamName}
              onChange={(e) => {
                setForm((f) => ({ ...f, teamName: e.target.value }));
                if (errors.teamName) setErrors((er) => ({ ...er, teamName: undefined }));
              }}
              className={inputClass('teamName')}
              maxLength={80}
            />
            {errors.teamName && (
              <p className="font-nunito text-red-400 text-xs mt-1">{errors.teamName}</p>
            )}
          </div>

          {/* Players */}
          <div className="rounded-2xl border border-[#2D6A4F]/30 p-5 space-y-4 bg-[#1B4332]/10">
            <p className="font-bebas text-xs tracking-[0.2em] text-[#52B788]/60">TEAMMITGLIEDER</p>
            {(['player1', 'player2', 'player3'] as const).map((key, i) => (
              <div key={key}>
                <label className="font-nunito font-600 text-sm text-white/70 block mb-1.5">
                  Spieler {i + 1}
                </label>
                <input
                  type="text"
                  placeholder={`Vorname Nachname`}
                  value={form[key]}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, [key]: e.target.value }));
                    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
                  }}
                  className={inputClass(key)}
                  maxLength={80}
                />
                {errors[key] && (
                  <p className="font-nunito text-red-400 text-xs mt-1">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Email */}
          <div>
            <label className="font-nunito font-600 text-sm text-white/70 block mb-1.5">
              Kontakt-E-Mail
            </label>
            <input
              type="email"
              placeholder="euer@email.at"
              value={form.email}
              onChange={(e) => {
                setForm((f) => ({ ...f, email: e.target.value }));
                if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
              }}
              className={inputClass('email')}
            />
            {errors.email && (
              <p className="font-nunito text-red-400 text-xs mt-1">{errors.email}</p>
            )}
            <p className="font-nunito text-white/25 text-xs mt-1">
              Ihr erhaltet eine Bestätigungsmail an diese Adresse.
            </p>
          </div>

          {/* DSGVO checkbox */}
          <div
            className={`rounded-xl border p-4 transition-colors ${
              errors.dsgvo ? 'border-red-500/40 bg-red-900/5' : 'border-[#2D6A4F]/30 bg-[#1B4332]/10'
            }`}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={form.dsgvo}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, dsgvo: e.target.checked }));
                    if (errors.dsgvo) setErrors((er) => ({ ...er, dsgvo: undefined }));
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    form.dsgvo
                      ? 'bg-[#D4AF37] border-[#D4AF37]'
                      : 'border-[#2D6A4F] bg-transparent'
                  }`}
                >
                  {form.dsgvo && (
                    <svg className="w-3 h-3 text-[#0D2818]" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <p className="font-nunito text-xs text-white/55 leading-relaxed">
                Ich stimme der Verarbeitung meiner Daten zur Verwaltung der Turnieranmeldung zu
                (Art. 6 Abs. 1 lit. a DSGVO). Die Daten werden ausschließlich für den Gurkerl
                Cup 2026 verwendet und danach gelöscht.{' '}
                <Link href="/datenschutz" className="text-[#52B788] underline underline-offset-2 hover:text-[#52B788]/80">
                  Datenschutzerklärung
                </Link>
              </p>
            </label>
            {errors.dsgvo && (
              <p className="font-nunito text-red-400 text-xs mt-2">{errors.dsgvo}</p>
            )}
          </div>

          {/* Error message */}
          <AnimatePresence>
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-red-500/30 bg-red-900/10 p-4"
              >
                <p className="font-nunito text-red-400 text-sm">⚠ {errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-gold w-full py-4 rounded-xl text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-4 h-4 border-2 border-[#0D2818]/30 border-t-[#0D2818] rounded-full"
                />
                Anmeldung wird gesendet…
              </span>
            ) : (
              'Team anmelden 🥒'
            )}
          </button>

          <p className="font-nunito text-center text-white/20 text-xs">
            Deine Daten werden in der EU gespeichert und nicht weitergegeben.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
