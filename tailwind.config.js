/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        surface: { 100:'#F4F6F7', 200:'#EBEEEF', tint:'#ECFBFC' },
        ink:   { 300:'#8A959B', 400:'#626E74', 500:'#566268', 700:'#2A3338',
                 900:'#0B0F11', 950:'#020102' },
        brand: { 100:'#ECFBFC', 200:'#C9F4F7', 300:'#7FE4EA', 400:'#3FD3DF',
                 500:'#20D5DE', 600:'#00B1C4', 700:'#008DA6', 800:'#006E87',
                 900:'#00566B', 950:'#003F4E' },
        mass:  { 800:'#0B4A5C', 900:'#073644', 950:'#04252D' },
        line:  { DEFAULT:'#E4E8EA', strong:'#C9D0D3', control:'#626E74' },
      },
      fontFamily: {
        display: ['Geologica','Pretendard Variable','Pretendard','Apple SD Gothic Neo','sans-serif'],
        sans:    ['Pretendard Variable','Pretendard','-apple-system','Apple SD Gothic Neo','sans-serif'],
      },
    },
  },
  plugins: [],
};
