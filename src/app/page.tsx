import Navbar from '@/components/Navbar';
import ShowcaseHero from '@/components/ShowcaseHero';
import HowItWorks from '@/components/HowItWorks';
import Schedule from '@/components/Schedule';
import RegistrationForm from '@/components/RegistrationForm';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <ShowcaseHero />
        <HowItWorks />
        <Schedule />
        <RegistrationForm />

        {/* Footer */}
        <footer className="py-10 px-6 text-center border-t border-[#2D6A4F]/20 bg-[#0A1F12]">
          <p className="font-pacifico text-[#F0CE67] text-xl mb-1">Gurkerl Cup 2026</p>
          <p className="font-nunito text-white/30 text-xs">
            Fun Games Pöttsching · 18. Juli 2026 ·{' '}
            <a href="/datenschutz" className="text-[#52B788]/60 hover:text-[#52B788] transition-colors">
              Datenschutz
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
