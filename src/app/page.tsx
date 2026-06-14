import Hero from '@/components/Hero';
import DisciplinesSection from '@/components/DisciplinesSection';
import HowItWorks from '@/components/HowItWorks';
import Schedule from '@/components/Schedule';
import RegistrationForm from '@/components/RegistrationForm';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <DisciplinesSection />
      <HowItWorks />
      <Schedule />
      <RegistrationForm />

      {/* Footer */}
      <footer className="py-10 px-6 text-center border-t border-[#2D6A4F]/20 bg-[#0D2818]">
        <p className="font-pacifico text-[#D4AF37] text-lg mb-1">Gurkerl Cup 2026</p>
        <p className="font-nunito text-white/25 text-xs">
          Fun Games Pöttsching · 18. Juli 2026 ·{' '}
          <a href="/datenschutz" className="text-[#52B788]/50 hover:text-[#52B788] transition-colors">
            Datenschutz
          </a>
        </p>
      </footer>
    </main>
  );
}
