'use client';

// TEMPORÄRES Konzept-Mockup (Cartoon-Meme / Sticker, Gurkerl-CI). Wird nach Freigabe gelöscht.
import { motion } from 'framer-motion';

const CHARS = [
  '/images/simon.webp', '/images/wasserbomben.webp', '/images/cornhole.webp',
  '/images/kazzoomeister.webp', '/images/mutter-stapeln.webp', '/images/jar.webp',
  '/images/riesen-ringerl.webp', '/images/baelle-chaos.webp', '/images/schwammstaffel.webp',
];
const COLORS = ['#D4AF37', '#52B788', '#38BDF8', '#FB923C', '#EF4444', '#A855F7', '#84CC16', '#F472B6', '#2DD4BF', '#FBBF24', '#60A5FA', '#FB7185'];
const NAMES = ['Knackige Kerle', 'Dill-Dynastie', 'Saure Spitzen', 'Senf-Squad', 'Essig-Elite', 'Krokodile', 'Gurken-Gang', 'Salzlake-Stars', 'Cornichon-Crew', 'Spreewald-Spezis', 'Pöttsching Power', 'Die Eingelegten'];
const teams = NAMES.map((name, i) => ({ name, pts: 120 - i * 7, color: COLORS[i], img: CHARS[i % CHARS.length] }));

const OUTLINE = '#0a1f12';

function chunky(size: number, fill: string, stroke = 7): React.CSSProperties {
  return {
    WebkitTextStroke: `${stroke}px ${OUTLINE}`,
    paintOrder: 'stroke fill',
    color: fill,
    textShadow: `4px 5px 0 ${OUTLINE}`,
    fontSize: size,
    lineHeight: 1,
  };
}

function Avatar({ img, color, size }: { img: string; color: string; size: number }) {
  return (
    <div
      className="rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${img})`,
        backgroundSize: '230%',
        backgroundPosition: '50% 14%',
        backgroundColor: `${color}33`,
        boxShadow: `0 0 0 4px #FDF6E3, 0 0 0 8px ${OUTLINE}, 6px 7px 0 rgba(0,0,0,0.4), inset 0 0 30px ${color}55`,
      }}
    />
  );
}

const TOP = [
  { rank: 2, c: '#C8CBD0', medal: '🥈' },
  { rank: 1, c: '#D4AF37', medal: '👑' },
  { rank: 3, c: '#CD7F32', medal: '🥉' },
];

export default function BeamerPreview() {
  return (
    <main className="relative w-screen h-screen overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 36%, #11331f 0%, #0A1F12 55%, #04100a 100%)' }}>
      {/* Halftone */}
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(#52B788 1.4px, transparent 1.6px)', backgroundSize: '22px 22px' }} />
      {/* Burst hinter Podium */}
      <div className="absolute" style={{ left: '23%', top: '46%', width: 720, height: 720, marginLeft: -360, marginTop: -360, background: 'repeating-conic-gradient(from 0deg, rgba(212,175,55,0.13) 0deg 10deg, transparent 10deg 20deg)', borderRadius: '50%', filter: 'blur(1px)' }} />
      {/* Stars */}
      {[[8, 16], [15, 70], [30, 22], [42, 84], [60, 14], [70, 60], [88, 30], [92, 76], [50, 50], [80, 8]].map(([l, t], i) => (
        <div key={i} className="absolute rounded-full" style={{ left: `${l}%`, top: `${t}%`, width: i % 3 === 0 ? 6 : 3, height: i % 3 === 0 ? 6 : 3, background: i % 2 ? '#F0CE67' : '#9be7c4', boxShadow: '0 0 8px currentColor' }} />
      ))}

      {/* Comic-Panel-Rahmen */}
      <div className="absolute inset-[14px] rounded-[40px] pointer-events-none" style={{ border: `6px solid ${OUTLINE}`, boxShadow: `inset 0 0 0 5px #FDF6E3, inset 0 0 90px rgba(82,183,136,0.18)` }} />

      <div className="relative h-full flex flex-col px-[5vw] py-[4vh]">
        {/* Kopf */}
        <div className="flex items-center justify-between mb-[2vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/gurkerlcup.webp" alt="" className="h-[10vh] w-auto drop-shadow-[4px_5px_0_rgba(10,31,18,0.8)]" />
          <motion.div initial={{ rotate: -4, scale: 0.9 }} animate={{ rotate: -3, scale: 1 }}
            className="px-8 py-2 rounded-2xl" style={{ background: 'linear-gradient(120deg,#52B788,#9be7c4)', boxShadow: `0 0 0 5px ${OUTLINE}, 8px 9px 0 rgba(0,0,0,0.4)` }}>
            <span className="font-fredoka font-700" style={chunky(34, '#0a1f12', 0)}>ZWISCHENSTAND</span>
          </motion.div>
          <div className="h-[10vh] w-[10vh]" />
        </div>

        <div className="flex-1 min-h-0 flex gap-[2.5vw]">
          {/* LINKS: Top 3 */}
          <div className="flex flex-col justify-center gap-[2vh]" style={{ width: '44%' }}>
            {TOP.map((s, idx) => {
              const t = teams[s.rank - 1];
              const first = s.rank === 1;
              return (
                <motion.div key={s.rank}
                  initial={{ x: -60, opacity: 0, rotate: first ? 0 : idx === 0 ? -2 : 2 }}
                  animate={{ x: 0, opacity: 1, rotate: first ? -1 : idx === 0 ? -2 : 2 }}
                  transition={{ delay: 0.12 * idx, type: 'spring', stiffness: 130, damping: 13 }}
                  className="relative flex items-center gap-5 rounded-[2.2rem] pl-4 pr-7"
                  style={{
                    height: first ? '23vh' : '17vh',
                    background: `linear-gradient(125deg, ${s.c}, ${s.c}aa)`,
                    boxShadow: `0 0 0 5px ${OUTLINE}, 0 0 0 9px #FDF6E3, 12px 13px 0 rgba(0,0,0,0.45)`,
                  }}>
                  {first && (
                    <motion.span className="absolute -top-[5vh] left-1/2 -translate-x-1/2" style={{ fontSize: '6vh' }}
                      animate={{ y: [0, -8, 0], rotate: [-6, 6, -6] }} transition={{ duration: 2.4, repeat: Infinity }}>👑</motion.span>
                  )}
                  <Avatar img={t.img} color={t.color} size={first ? 150 : 110} />
                  <div className="flex-1 min-w-0">
                    <div className="font-fredoka font-700" style={chunky(first ? 44 : 32, '#FDF6E3', first ? 5 : 4)}>{s.medal}{s.rank}</div>
                    <div className="font-fredoka font-700 text-white truncate mt-1" style={{ fontSize: first ? '3vh' : '2.3vh', textShadow: `2px 2px 0 ${OUTLINE}` }}>{t.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-fredoka font-700" style={chunky(first ? 60 : 44, '#F0CE67', first ? 7 : 6)}>{t.pts}</div>
                    <div className="font-bebas tracking-widest text-white/90" style={{ fontSize: '1.6vh' }}>PKT</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RECHTS: Plätze 4..N */}
          <div className="flex-1 min-h-0 flex flex-col justify-center gap-[1.1vh]">
            {teams.slice(3).map((t, i) => (
              <motion.div key={t.name}
                initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-4 rounded-2xl pr-5 h-[7.4vh]"
                style={{ background: `linear-gradient(90deg, ${t.color}33, rgba(255,255,255,0.03) 75%)`, boxShadow: `0 0 0 3px ${OUTLINE}, 5px 6px 0 rgba(0,0,0,0.3)` }}>
                <div className="flex items-center justify-center font-fredoka font-700 flex-shrink-0 ml-[-3px] rounded-2xl" style={{ width: '6.6vh', height: '7.4vh', background: t.color, boxShadow: `inset 0 0 0 4px ${OUTLINE}`, ...chunky(34, '#FDF6E3', 0) }}>{i + 4}</div>
                <Avatar img={t.img} color={t.color} size={56} />
                <span className="flex-1 font-fredoka font-700 text-white truncate" style={{ fontSize: '2.5vh', textShadow: `2px 2px 0 ${OUTLINE}` }}>{t.name}</span>
                <span className="font-fredoka font-700" style={chunky(40, '#F0CE67', 5)}>{t.pts}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Maskottchen-Sticker unten links */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img src="/images/spritzer.webp" alt="" className="absolute -bottom-2 left-[1vw] h-[28vh] w-auto"
        style={{ filter: 'drop-shadow(6px 8px 0 rgba(10,31,18,0.7))' }}
        animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
    </main>
  );
}
