/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js,hbs}"],
  theme: {
    extend: {
      cursor: {
        grabbing: 'grabbing',
      },
      gridTemplateColumns: {
        'layout': '200px repeat(5,minmax(0, 1fr))',
        'layout-sm': '200px repeat(3,minmax(0, 1fr))'
      }
    },
  },
  variants: {
    extend: {
      cursor: ['active','responsive'],
    },
  },
  plugins: [],
}