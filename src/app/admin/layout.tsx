import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin · Gurkerl Cup 2026',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
