import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['var(--font-pacifico)', 'cursive'],
        fredoka: ['var(--font-fredoka)', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'sans-serif'],
        bebas: ['var(--font-bebas)', 'sans-serif'],
      },
      colors: {
        green: {
          deep: '#0D2818',
          dark: '#1B4332',
          mid: '#2D6A4F',
          light: '#52B788',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F0CE67',
          dark: '#A88B20',
        },
        cream: '#F5F0E8',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212,175,55,0.6)' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
