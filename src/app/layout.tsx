import type { Metadata } from 'next';
import { Pacifico, Fredoka, Nunito, Bebas_Neue } from 'next/font/google';
import './globals.css';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
  display: 'swap',
});

const fredoka = Fredoka({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
});

const nunito = Nunito({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  title: 'Gurkerl Cup 2026 – Fun Games Pöttsching',
  description:
    'Der legendäre Outdoor-Teamwettkampf auf dem Fußballplatz. 10 Disziplinen, 3er Teams, eine Goldene Gurke. Seid dabei – 18. Juli 2026 in Pöttsching.',
  keywords: ['Gurkerl Cup', 'Fun Games', 'Pöttsching', 'Teamwettkampf', '2026'],
  openGraph: {
    title: 'Gurkerl Cup 2026 – Fun Games Pöttsching',
    description: 'Outdoor-Teamwettkampf mit 10 Disziplinen. Wer holt die Goldene Gurke?',
    type: 'website',
    images: [
      {
        url: '/images/gurkerlcup.webp',
        width: 1200,
        height: 630,
        alt: 'Gurkerl Cup 2026 – Fun Games Pöttsching',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gurkerl Cup 2026 – Fun Games Pöttsching',
    description: 'Outdoor-Teamwettkampf mit 10 Disziplinen. Wer holt die Goldene Gurke?',
    images: ['/images/gurkerlcup.webp'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${pacifico.variable} ${fredoka.variable} ${nunito.variable} ${bebasNeue.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
