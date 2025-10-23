/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./{pages,src,App,components}/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}