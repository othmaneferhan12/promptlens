import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        void: '#080810',
        surface: '#0f0f1a',
        card: '#141422',
        elevated: '#1a1a2e',
        lens: '#e040fb',
        gold: '#ffd700',
        cyan: '#00e5ff',
        success: '#00e676',
        warning: '#ffb347',
        error: '#ff6b6b',
      },
      boxShadow: {
        glow: '0 0 40px rgba(224,64,251,0.2)',
        'glow-sm': '0 0 20px rgba(224,64,251,0.15)',
        'glow-cyan': '0 0 30px rgba(0,229,255,0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'nebula': 'nebula 8s ease-in-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        nebula: {
          '0%': { transform: 'translate(-10%, -10%) scale(1)' },
          '100%': { transform: 'translate(5%, 5%) scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
