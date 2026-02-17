import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        black: '#060810',
        dark: '#0d1117',
        panel: '#111827',
        blue: {
          DEFAULT: '#3b82f6',
          dim: '#1d4ed8',
          light: '#60a5fa',
        },
        cyan: '#22d3ee',
        emerald: '#10b981',
        amber: '#f59e0b',
        violet: '#a78bfa',
      },
      animation: {
        'pulse-slow': 'pulse 2s infinite',
        'fade-up': 'fadeUp 0.7s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
