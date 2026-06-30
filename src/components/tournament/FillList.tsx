'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * Liste, die so viele Reihen zeigt wie in die Höhe passen (mehr im Fullscreen!).
 * Bei Überlauf läuft sie als Endlos-Marquee. Kein leerer Platzhalter.
 */
export default function FillList({ rows, rowH }: { rows: ReactNode[]; rowH: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(700);

  useEffect(() => {
    const measure = () => setH(ref.current?.clientHeight ?? 700);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const visible = Math.max(1, Math.floor(h / rowH));
  const overflow = rows.length > visible;

  return (
    <div ref={ref} className="h-full overflow-hidden">
      {!overflow ? (
        <div className="flex flex-col">
          {rows.map((c, i) => (
            <div key={i} style={{ height: rowH }}>
              {c}
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          animate={{ y: [0, -(rows.length * rowH)] }}
          transition={{ duration: rows.length * 1.6, repeat: Infinity, ease: 'linear' }}
        >
          {[...rows, ...rows].map((c, i) => (
            <div key={i} style={{ height: rowH }}>
              {c}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
