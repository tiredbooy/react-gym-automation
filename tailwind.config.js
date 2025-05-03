import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        offWhite: "#F1EFEC",
        beige: "#D4C9BE",
        darkBlue: "#123458",
        nearBlack: "#030303",
      },
    },
  },
  plugins: [daisyui],
};
