'use client';

import { useEffect, useState } from 'react';
import { flushQueue, pendingCount } from '@/lib/offlineQueue';

/** Zeigt Offline-Status + gepufferte Eingaben und sendet bei Reconnect nach. */
export default function OfflineBanner() {
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    setOnline(navigator.onLine);
    setPending(pendingCount());

    const tick = async () => {
      setOnline(navigator.onLine);
      if (navigator.onLine) {
        const left = await flushQueue();
        setPending(left);
      } else {
        setPending(pendingCount());
      }
    };

    const onOnline = () => tick();
    const onOffline = () => {
      setOnline(false);
      setPending(pendingCount());
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    const interval = setInterval(tick, 5000);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      clearInterval(interval);
    };
  }, []);

  if (online && pending === 0) return null;

  return (
    <div
      className={`rounded-xl px-4 py-2.5 mb-3 font-nunito text-sm ${
        online
          ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F0CE67]'
          : 'bg-red-900/20 border border-red-500/30 text-red-300'
      }`}
    >
      {online
        ? `${pending} Eingabe${pending === 1 ? '' : 'n'} werden nachgesendet…`
        : `Offline – ${pending} Eingabe${pending === 1 ? '' : 'n'} zwischengespeichert.`}
    </div>
  );
}
