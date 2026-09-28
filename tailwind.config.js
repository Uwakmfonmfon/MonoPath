/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        obsidian: {
          base: '#050505',
          surface: '#0A0A0A',
          border: '#1A1A1A',
        },
        neonBlue: {
          glow: '#00F0FF',
          accent: '#00B4D8',
          dim: '#0077B6',
        },
      },
      animation: {
        'boot': 'boot 0.5s ease-out forwards',
        'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        boot: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glitch: {
          '0%': { clipPath: 'inset(10% 0 30% 0)' },
          '20%': { clipPath: 'inset(40% 0 10% 0)' },
          '40%': { clipPath: 'inset(10% 0 30% 0)' },
          '60%': { clipPath: 'inset(30% 0 20% 0)' },
          '80%': { clipPath: 'inset(10% 0 30% 0)' },
          '100%': { clipPath: 'inset(40% 0 10% 0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #00F0FF, 0 0 10px #00F0FF' },
          '50%': { boxShadow: '0 0 20px #00F0FF, 0 0 30px #00F0FF' },
        },
      },
    },
  },
  plugins: [],
}
