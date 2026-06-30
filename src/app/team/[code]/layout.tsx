import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mein Team · Gurkerl Cup 2026',
  robots: { index: false, follow: false },
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
