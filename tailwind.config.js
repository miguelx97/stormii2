/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'major-mono': ['MajorMonoDisplay_400Regular'],
        michroma: ['Michroma_400Regular'],
        'ibm-arabic': ['IBMPlexSansArabic_400Regular'],
        'ibm-arabic-medium': ['IBMPlexSansArabic_500Medium'],
        'ibm-arabic-bold': ['IBMPlexSansArabic_700Bold'],
      },
    },
  },
  plugins: [],
};
