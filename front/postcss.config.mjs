// postcss.config.mjs
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};

export default config;

