/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f8f6',
          100: '#eef0ec',
          200: '#dde1d8',
          300: '#c4ccba',
          400: '#a6b396',
          500: '#8a9a78',
          600: '#6f7f5f',
          700: '#5a674c',
          800: '#4a5540',
          900: '#3f4737',
        },
        accent: {
          50: '#f6f7f5',
          100: '#eceeea',
          200: '#d9ddd4',
          300: '#bfc6b6',
          400: '#a0ab93',
          500: '#839174',
          600: '#6b7a5a',
          700: '#566349',
          800: '#47523d',
          900: '#3c4534',
        },
        sage: {
          50: '#f8f9f7',
          100: '#f0f2ee',
          200: '#e1e5dc',
          300: '#ccd3c2',
          400: '#b1bca3',
          500: '#96a584',
          600: '#7c8a68',
          700: '#657154',
          800: '#535e46',
          900: '#464f3b',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

