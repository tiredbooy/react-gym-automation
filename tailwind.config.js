import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        offWhite: "#F1EFEC",
        beige: "#D4C9BE",
        hoverBeige: "rgba(212, 201, 190, 0.3)",
        darkBlue: "#123458",
        nearBlack: "#030303",
        lightGray: "#E5E5E5",
        successGreen: "#4CAF50",
        errorRed: "#F44336",
        fiery: {
          primary: "#E63946",
          secondary: "#F9C74F",
          accent: "#073B4C",
          background: "#F8F9FA",
        },
        night: {
          primary: "#6C63FF",
          secondary: "#2A2A2A",
          accent: "#00F5D4",
          background: "#121212",
        },
        nature: {
          primary: "#2A9D8F",
          secondary: "#E9C46A",
          accent: "#264653",
          background: "#F7F7F2",
        },
      },
    },
  },
  plugins: [daisyui],
};
