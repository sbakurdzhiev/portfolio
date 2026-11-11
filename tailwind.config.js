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
          bg: 'var(--cyber-bg)',
          surface: 'var(--cyber-surface)',
          panel: 'var(--cyber-panel)',
          border: 'var(--cyber-border)',
          borderBright: 'var(--cyber-border-bright)',
          text: 'var(--cyber-text)',
          muted: 'var(--cyber-muted)',
          emerald: 'var(--cyber-emerald)',
          emeraldGlow: 'var(--cyber-emerald-glow)',
          cyan: 'var(--cyber-cyan)',
          cyanGlow: 'var(--cyber-cyan-glow)',
          amber: 'var(--cyber-amber)',
          crimson: 'var(--cyber-crimson)',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px var(--cyber-cyan-glow)',
        'glow-emerald': '0 0 20px -3px var(--cyber-emerald-glow)',
        'glow-subtle': '0 0 15px -3px var(--cyber-cyan-glow)',
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
