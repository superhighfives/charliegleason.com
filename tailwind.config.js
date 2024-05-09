module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        xxs: '.625rem',
      },
      gridTemplateColumns: {
        'prose': '[full-start] minmax(2em, 1fr) [main-start] minmax(0, 800px) [content-start] minmax(0, 400px) [content-end] 0 [main-end] minmax(2em, 1fr) [full-end]'
      },
      gridColumn: {
        'main': 'main-start / main-end',
        'content': 'main-start / content-start',
        'sidebar': 'content-start / content-end',
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
  plugins: [require('@tailwindcss/forms')],
}
