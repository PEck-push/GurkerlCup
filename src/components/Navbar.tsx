'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const links = [
  { label: 'Disziplinen', href: '#disziplinen' },
  { label: 'Ablauf', href: '#ablauf' },
  { label: 'Zeitplan', href: '#zeitplan' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [iconErr, setIconErr] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-2.5' : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative w-9 h-9 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110">
            {!iconErr ? (
              <Image
                src="/images/gurkerlcup-icon.webp"
                alt=""
                fill
                className="object-contain"
                priority
                onError={() => setIconErr(true)}
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-2xl" aria-hidden>
                🥒
              </span>
            )}
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="font-nunito font-600 text-sm text-white/70 hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition-all"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go('#anmeldung')}
            className="btn-gold ml-3 px-6 py-2.5 rounded-full text-sm"
          >
            Jetzt anmelden
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menü"
        >
          <span className={`w-6 h-0.5 bg-white transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden glass-nav"
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="font-nunito font-600 text-left text-white/80 py-3 border-b border-white/5"
            >
              {l.label}
            </button>
          ))}
          <button onClick={() => go('#anmeldung')} className="btn-gold mt-3 py-3 rounded-full">
            Jetzt anmelden
          </button>
        </div>
      </motion.div>
    </motion.nav>
  );
}
