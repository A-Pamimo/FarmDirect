module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#059669',
          accent: '#f59e0b',
          bg: '#fafaf9',
          text: '#1c1917',
          success: '#22c55e',
          error: '#ef4444',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '0.75rem', '2xl': '1rem', full: '9999px' },
      boxShadow: {
        soft: '0 10px 24px rgba(0,0,0,0.06)',
        card: '0 6px 16px rgba(0,0,0,0.07)',
      },
      transitionTimingFunction: {
        pleasant: 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [],
};
