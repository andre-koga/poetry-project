/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    fontFamily: {
      lora: ["Lora", "serif"],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
