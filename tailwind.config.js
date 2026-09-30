/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        obsidian: {
          base: 'var(--color-obsidian-base)',
          surface: 'var(--color-obsidian-surface)',
          border: 'var(--color-steel-slate)',
        },
        focusTeal: {
          DEFAULT: 'var(--color-focus-teal)',
          muted: 'rgba(79, 209, 197, 0.2)',
        },
        paperWhite: 'var(--color-paper-white)',
        mutedZinc: 'var(--color-muted-zinc)',
      },
      animation: {
        'boot': 'boot 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        boot: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
