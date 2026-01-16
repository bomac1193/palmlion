import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Palmlion Design System - African Music Analytics
      // Archetype: Creator + Ruler (African-first, radical ownership)
      colors: {
        // Core Palette - Pan-African inspired
        palm: {
          gold: '#FFD700',
          'gold-dim': '#B8860B',
        },
        midnight: '#0A0A0A',
        charcoal: '#1A1A1A',
        blood: {
          DEFAULT: '#C21807',
          dark: '#8B0000',
        },
        // African accent colors
        kente: {
          gold: '#FFD700',
          green: '#228B22',
          red: '#DC143C',
          black: '#0A0A0A',
        },
        // Semantic
        background: '#0A0A0A',
        foreground: '#FFFFF0',
        surface: '#1A1A1A',
        text: {
          primary: '#FFFFF0',
          secondary: '#A0A0A0',
          tertiary: '#666666',
          gold: '#FFD700',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'roar': 'roar 0.6s ease-out',
        'palm-grow': 'palm-grow 1s ease-out',
        'lion-burst': 'lion-burst 0.8s ease-out',
        'conviction-pulse': 'conviction-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'roar': {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.15)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'palm-grow': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
        'lion-burst': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'conviction-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(255, 215, 0, 0)' },
        },
      },
      backgroundImage: {
        'gradient-palm': 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
        'gradient-kente': 'linear-gradient(135deg, #FFD700 0%, #228B22 50%, #DC143C 100%)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function({ addComponents }: any) {
      addComponents({
        '.palm-label': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#FFD700',
        },
        '.conviction-card': {
          background: '#1A1A1A',
          border: '1px solid rgba(255, 215, 0, 0.15)',
          borderRadius: '12px',
          padding: '24px',
          transition: 'all 0.3s ease',
        },
        '.lion-badge': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
          borderRadius: '50%',
          fontSize: '16px',
        },
      })
    },
  ],
}

export default config
