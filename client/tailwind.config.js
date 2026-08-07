/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0d1117',
          secondary: '#161b22',
          tertiary: '#1f2937',
        },
        border: {
          DEFAULT: '#21262d',
          hover: '#30363d',
        },
        accent: {
          blue: '#58a6ff',
          'blue-dim': '#1f3a5c',
          'blue-text': '#cae3ff',
        },
        text: {
          primary: '#e6edf3',
          secondary: '#8b949e',
          dim: '#484f58',
        },
        critical: {
          DEFAULT: '#f85149',
          bg: '#2d0f0f',
        },
        warning: {
          DEFAULT: '#e3b341',
          bg: '#2d1f0a',
        },
        suggestion: {
          DEFAULT: '#3fb950',
          bg: '#0a2010',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        base: '14px',
      },
    },
  },
  plugins: [],
};
