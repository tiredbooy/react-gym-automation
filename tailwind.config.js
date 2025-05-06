import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        offWhite: '#F1EFEC',
        beige: '#D4C9BE',
        hoverBeige: 'rgba(212, 201, 190, 0.3)',
        darkBlue: '#123458',
        nearBlack: '#030303',
        lightGray: '#E5E5E5',
        successGreen: '#4CAF50',
        errorRed: '#F44336',
      }
    }
  },
  plugins: [daisyui],
};
