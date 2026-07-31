/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          black: '#030712',
          dark: '#0B0F19',
          surface: 'rgba(17, 24, 39, 0.65)',
        },
        nebula: {
          cyan: '#06B6D4',
        },
        quantum: {
          violet: '#8B5CF6',
        },
        gravity: {
          amber: '#F59E0B',
        },
        starlight: '#F9FAFB',
        muted: '#9CA3AF',
        dim: '#6B7280',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        cyanGlow: '0 0 24px 0 rgba(6, 182, 212, 0.35)',
        violetGlow: '0 0 24px 0 rgba(139, 92, 246, 0.35)',
      },
      backdropBlur: {
        glass: '16px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '100px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
