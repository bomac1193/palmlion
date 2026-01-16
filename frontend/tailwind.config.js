/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dasham brand colors - African-inspired palette
        dash: {
          primary: '#FF6B35',    // Vibrant orange - energy, enthusiasm
          secondary: '#4ECDC4',  // Teal - trust, creativity
          accent: '#FFE66D',     // Gold - celebration, value
          dark: '#1A1A2E',       // Deep purple-black
          darker: '#0F0F1A',     // Almost black
          light: '#F7F7F8',      // Off-white
        },
        // City-specific accents
        lagos: '#00A86B',        // Green - Nigeria
        joburg: '#FFB81C',       // Gold - South Africa
        nairobi: '#BB0000',      // Red - Kenya
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'dash-pulse': 'dashPulse 0.6s ease-out',
        'card-swipe': 'cardSwipe 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        dashPulse: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        cardSwipe: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(100%) rotate(10deg)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
