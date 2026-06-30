import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eingabe · Gurkerl Cup 2026',
  robots: { index: false, follow: false },
};

export default function ScoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
