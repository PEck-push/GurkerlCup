'use client';

import { useEffect, useRef, useState } from 'react';
import { playTick } from '@/lib/sounds';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const rnd = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * "Einarmiger Bandit": jeder Buchstabe rotiert, dann rasten sie nacheinander ein.
 * Spielt pro eingerastetem Buchstaben einen Tick, ruft am Ende onComplete().
 */
export default function SlotName({
  text,
  perChar = 110,
  onComplete,
}: {
  text: string;
  perChar?: number;
  onComplete?: () => void;
}) {
  const chars = [...text];
  const [locked, setLocked] = useState(0);
  const [spin, setSpin] = useState<string[]>(() => chars.map(() => rnd()));
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    setLocked(0);
    const spinId = setInterval(() => setSpin(chars.map(() => rnd())), 45);
    let i = 0;
    const lockId = setInterval(() => {
      i += 1;
      setLocked(i);
      if (chars[i - 1] !== ' ') playTick();
      if (i >= chars.length) {
        clearInterval(lockId);
        clearInterval(spinId);
        if (!doneRef.current) {
          doneRef.current = true;
          onComplete?.();
        }
      }
    }, perChar);
    return () => {
      clearInterval(spinId);
      clearInterval(lockId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className="tabular-nums">
      {chars.map((c, idx) => {
        if (idx < locked) return <span key={idx}>{c}</span>;
        if (c === ' ') return <span key={idx}>&nbsp;</span>;
        return (
          <span key={idx} className="text-white/40">
            {spin[idx]}
          </span>
        );
      })}
    </span>
  );
}
