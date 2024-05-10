/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        xxs: '.625rem',
      },
      gridTemplateColumns: {
        'prose': '[full-start] minmax(2em, 1fr) [rail-start] minmax(0, 100px) [main-start] repeat(7, minmax(0, 100px)) [content-start] repeat(3, minmax(0, 100px)) [rail-end] minmax(0, 100px) [main-end] minmax(2em, 1fr) [full-end]'
      },
      gridColumn: {
        'main': 'rail-start / main-end',
        'content': 'main-start / content-start',
        'wide': 'main-start / rail-end',
        'sidebar': 'content-start / main-end',
        'full': 'full-start / full-end'
      }
    },
    fontFamily: {
      display: [
        'commuters-sans',
        '-apple-system',
        ' BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ],
      sans: [
        '-apple-system',
        ' BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ],
      mono: [
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
      ],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}
