'use client';

import { useEffect, useState } from 'react';

/**
 * Animated cosmic aurora background – deep green nebula with gold + emerald
 * swirls, drifting slowly. Mimics the cinematic backdrop from the reference
 * video, adapted to the Gurkerl Cup brand colours.
 */
export default function AuroraBackground({ withParticles = true }: { withParticles?: boolean }) {
  const [particles, setParticles] = useState<
    { left: number; top: number; size: number; gold: boolean; delay: number; dur: number }[]
  >([]);

  useEffect(() => {
    if (!withParticles) return;
    setParticles(
      [...Array(28)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        gold: Math.random() > 0.55,
        delay: Math.random() * 5,
        dur: 4 + Math.random() * 6,
      }))
    );
  }, [withParticles]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* base */}
      <div className="absolute inset-0 bg-[#0A1F12]" />

      {/* swirling conic core */}
      <div
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] opacity-[0.35]"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(13,40,24,0) 0%, rgba(45,106,79,0.4) 25%, rgba(13,40,24,0) 45%, rgba(82,183,136,0.25) 65%, rgba(13,40,24,0) 85%, rgba(45,106,79,0.4) 100%)',
          animation: 'spinSlow 60s linear infinite',
          filter: 'blur(60px)',
        }}
      />

      {/* aurora blobs */}
      <div
        className="aurora-blob"
        style={{
          width: '50vw',
          height: '50vw',
          left: '10%',
          top: '20%',
          background: 'radial-gradient(circle, rgba(45,106,79,0.55), transparent 70%)',
          animation: 'auroraDrift1 18s ease-in-out infinite',
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: '45vw',
          height: '45vw',
          right: '5%',
          top: '10%',
          background: 'radial-gradient(circle, rgba(82,183,136,0.4), transparent 70%)',
          animation: 'auroraDrift2 24s ease-in-out infinite',
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: '40vw',
          height: '40vw',
          left: '40%',
          bottom: '0%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.18), transparent 70%)',
          animation: 'auroraDrift3 20s ease-in-out infinite',
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: '35vw',
          height: '35vw',
          left: '0%',
          bottom: '10%',
          background: 'radial-gradient(circle, rgba(13,40,24,0.8), transparent 70%)',
          animation: 'auroraDrift1 22s ease-in-out infinite reverse',
        }}
      />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,31,18,0.85)_100%)]" />

      {/* particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.gold ? 'rgba(240,206,103,0.8)' : 'rgba(82,183,136,0.6)',
            boxShadow: p.gold ? '0 0 6px rgba(212,175,55,0.6)' : '0 0 6px rgba(82,183,136,0.4)',
            animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* noise */}
      <div className="absolute inset-0 noise-overlay" />
    </div>
  );
}
