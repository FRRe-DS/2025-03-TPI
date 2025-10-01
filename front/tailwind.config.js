/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#0070f3",
        rich_black: "#001011",
        midnight_green: "#093A3E",
        verdigris: "#3AAFB9",
        electric_blue: "#64E9EE",
        light_sky_blue: "#97C8EB"
      },
      fontFamily: {
        primary: ['Archivo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

