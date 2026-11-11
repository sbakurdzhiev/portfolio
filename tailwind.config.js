/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05080f',
          surface: '#0b121e',
          panel: '#101a2b',
          border: '#1b2d4b',
          borderBright: '#2a4570',
          text: '#cbd5e1',
          muted: '#64748b',
          emerald: '#00ff9d',
          emeraldGlow: 'rgba(0, 255, 157, 0.15)',
          cyan: '#00d4ff',
          cyanGlow: 'rgba(0, 212, 255, 0.15)',
          amber: '#fbbf24',
          crimson: '#ef4444',
          openshift: '#ee0000',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 212, 255, 0.35)',
        'glow-emerald': '0 0 20px -3px rgba(0, 255, 157, 0.35)',
        'glow-subtle': '0 0 15px -3px rgba(0, 212, 255, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'blink': 'blink 1s step-start infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        blink: {
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
