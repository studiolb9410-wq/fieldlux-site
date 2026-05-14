/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './privacy.html', './src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50:  '#FAFAFA',
          200: '#E4E4E7',
          400: '#A1A1AA',
          500: '#71717A',
          700: '#3F3F46',
        },
        surface: {
          base:     '#0A0A0B',
          elevated: '#111114',
          raised:   '#1A1A1E',
        },
        stage: '#050607',
        line: {
          DEFAULT:  '#27272A',
          subtle:   '#1F1F22',
        },
        brand: {
          DEFAULT: '#20D5DE',
          hot:     '#00B8C8',
          dim:     '#087B86',
          muted:   'rgba(32, 213, 222, 0.08)',
          ring:    'rgba(32, 213, 222, 0.3)',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger:  '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
