import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beamer · Gurkerl Cup 2026',
  robots: { index: false, follow: false },
};

export default function BeamerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
