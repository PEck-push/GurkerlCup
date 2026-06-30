'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/** Lokal erzeugter QR-Code (kein externer Dienst). */
export default function QrCode({
  value,
  size = 160,
  className = '',
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: { dark: '#0A1F12', light: '#ffffff' },
    })
      .then((u) => {
        if (active) setUrl(u);
      })
      .catch(() => {
        if (active) setUrl('');
      });
    return () => {
      active = false;
    };
  }, [value, size]);

  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} width={size} height={size} alt="QR-Code" className={`rounded-lg ${className}`} />
  ) : (
    <div style={{ width: size, height: size }} className={`rounded-lg bg-white/5 ${className}`} />
  );
}
