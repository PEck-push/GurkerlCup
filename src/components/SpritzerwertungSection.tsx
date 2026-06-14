'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function SpritzerwertungSection() {
  const [imgErr, setImgErr] = useState(false);

  return (
    <section className="py-24 px-6 md:px-16 relative overflow-hidden" style={{ background: '#0F1A0D' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(ellipse, #7B1E1E 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl overflow-hidden border border-red-900/30"
          style={{
            background: 'linear-gradient(145deg, #1C0A0A 0%, #0F1208 60%, #0A1208 100%)',
            boxShadow: '0 32px 80px rgba(123,30,30,0.25), 0 0 0 1px rgba(212,175,55,0.08)',
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-0">
            {/* Image panel */}
            <div className="relative w-full md:w-80 flex-shrink-0 h-72 md:h-auto md:min-h-[420px] flex items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #2A0A0A, #0F0505)' }}
            >
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(180,30,30,0.35), transparent 65%)' }} />
              {!imgErr ? (
                <div className="relative w-56 h-56 md:w-64 md:h-64 z-10">
                  <Image
                    src="/images/spritzer.webp"
                    alt="Spritzerwertung"
                    fill
                    className="object-contain drop-shadow-2xl"
                    style={{ filter: 'drop-shadow(0 20px 40px rgba(180,30,30,0.5))' }}
                    onError={() => setImgErr(true)}
                  />
                </div>
              ) : (
                <div className="text-8xl z-10 select-none" style={{ filter: 'drop-shadow(0 12px 24px rgba(180,30,30,0.5))' }}>
                  🍷
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-8 md:p-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/8 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="font-bebas text-xs tracking-[0.25em] text-[#F0CE67]">SPECIAL AWARD</span>
              </div>

              <h2 className="font-fredoka font-700 text-4xl md:text-5xl text-white mb-1 leading-tight">
                Die Spritzerwertung
              </h2>
              <p className="font-bebas text-sm tracking-[0.2em] text-red-400/70 mb-5">
                DIE HÄRTESTE WERTUNG DES ABENDS
              </p>

              <p className="font-nunito text-[#F5F0E8]/65 text-base leading-relaxed mb-8">
                Wie immer gibt es die legendäre Spritzerwertung mit im Programm.
                Ob als Rotweinritter oder Sprüherhunter – der Kampf um die härteste
                Wertung geht in die nächste Runde.
              </p>

              {/* Titles */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4">
                  <p className="font-bebas text-sm tracking-[0.15em] text-red-400 mb-1">🍷 ROTWEINRITTER</p>
                  <p className="font-nunito text-xs text-white/45 leading-relaxed">
                    Wer bis zum Ende die Fassung bewahrt – mit Stil und ohne Flecken.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
                  <p className="font-bebas text-sm tracking-[0.15em] text-[#F0CE67] mb-1">💦 SPRÜHERHUNTER</p>
                  <p className="font-nunito text-xs text-white/45 leading-relaxed">
                    Wer am meisten davonkommt – oder am wenigsten erwischt wird.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
