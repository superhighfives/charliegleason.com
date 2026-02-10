/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', '../private/content/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        xxs: '.625rem',
      },
      animation: {
        'equalizer-1': 'equalizer-1 0.8s ease-in-out infinite',
        'equalizer-2': 'equalizer-2 0.6s ease-in-out infinite',
        'equalizer-3': 'equalizer-3 0.7s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'equalizer-1': {
          '0%, 100%': { height: '0.25rem' },
          '50%': { height: '0.75rem' },
        },
        'equalizer-2': {
          '0%, 100%': { height: '0.5rem' },
          '50%': { height: '0.25rem' },
        },
        'equalizer-3': {
          '0%, 100%': { height: '0.375rem' },
          '50%': { height: '0.625rem' },
        },
      },
      gridTemplateColumns: {
        prose:
          '[full-start] minmax(2em, 1fr) [rail-start] minmax(0, 100px) [main-start] repeat(7, minmax(0, 100px)) [content-start] repeat(3, minmax(0, 100px)) [rail-end] minmax(0, 100px) [main-end] minmax(2em, 1fr) [full-end]',
        'prose-sm':
          '[full-start] 0 [rail-start] minmax(0, 1fr) [main-start] repeat(7, minmax(0, 1fr)) [content-start] repeat(3, minmax(0, 1fr)) [rail-end] minmax(0, 1fr) [main-end] 0 [full-end]',
      },
      gridColumn: {
        main: 'rail-start / main-end',
        content: 'main-start / content-start',
        'lg-content': 'rail-start / content-start',
        wide: 'main-start / rail-end',
        sidebar: 'content-start / main-end',
        full: 'full-start / full-end',
      },
      screens: {
        '3xl': '1800px',
      },
    },
    fontFamily: {
      display: [
        'commuters-sans',
        '-apple-system',
        'BlinkMacSystemFont',
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
        'BlinkMacSystemFont',
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
    require('@tailwindcss/typography'),
  ],
}
