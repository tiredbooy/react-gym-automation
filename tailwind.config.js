import daisyui from "daisyui";

/** Define your themes here */
const themes = {
  classic: {
    colors: {
      primary: "darkBlue",
      secondary: "beige",
      accent: "nearBlack",
      background: "offWhite",
      success: "successGreen",
      error: "errorRed",
    },
    gradientColors: {
      from: "beige",
      to: "offWhite",
    },
  },
  fiery: {
    colors: {
      primary: "fiery-primary",
      secondary: "fiery-secondary",
      accent: "fiery-accent",
      background: "fiery-background",
    },
    gradientColors: {
      from: "fiery-secondary",
      to: "fiery-background",
    },
  },
  dark: {
    colors: {
      primary: "dark-primary",
      secondary: "dark-secondary",
      accent: "dark-accent",
      background: "dark-background",
    },
    gradientColors: {
      from: "dark-secondary",
      to: "dark-background",
    },
  },
  solara: {
    colors: {
      primary: "solara-primary",
      secondary: "solara-secondary",
      accent: "solara-accent",
      background: "solara-background",
    },
    gradientColors: {
      from: "solara-secondary",
      to: "solara-background",
    },
  },
  nature: {
    colors: {
      primary: "nature-primary",
      secondary: "nature-secondary",
      accent: "nature-accent",
      background: "nature-background",
    },
    gradientColors: {
      from: "nature-secondary",
      to: "nature-background",
    },
  },
  ocean: {
    colors: {
      primary: "ocean-primary",
      secondary: "ocean-secondary",
      accent: "ocean-accent",
      background: "ocean-background",
    },
    gradientColors: {
      from: "ocean-secondary",
      to: "ocean-background",
    },
  },
};

/** Helper to generate safelist entries for Tailwind variants */
function generateSafelistFromThemes(themes) {
  const classes = new Set();

  const utilities = ["bg", "text", "border", "ring", "shadow"];
  const variants = ["", "hover", "focus", "checked", "ring"];
  const opacities = Array.from({ length: 9 }, (_, i) => `${(i + 1) * 10}`); // [10, 20, ..., 90]
  const gradientDirections = ["r", "l", "t", "b", "tr", "tl", "br", "bl"];

  Object.values(themes).forEach((theme) => {
    const { colors = {}, gradientColors = {} } = theme;

    // Add color-related classes
    Object.values(colors).forEach((color) => {
      utilities.forEach((util) => {
        variants.forEach((variant) => {
          const base = `${util}-${color}`;
          classes.add(variant ? `${variant}:${base}` : base);

          if (util === "bg") {
            opacities.forEach((opacity) => {
              classes.add(
                variant ? `${variant}:${base}/${opacity}` : `${base}/${opacity}`
              );
            });
          }
        });
      });

      gradientDirections.forEach((dir) => {
        classes.add(`bg-gradient-to-${dir}`);
        variants.forEach((variant) => {
          classes.add(
            variant
              ? `${variant}:bg-gradient-to-${dir}`
              : `bg-gradient-to-${dir}`
          );
        });

        classes.add(`from-${color}`);
        classes.add(`to-${color}`);
        classes.add(`via-${color}`);
        variants.forEach((variant) => {
          classes.add(variant ? `${variant}:from-${color}` : `from-${color}`);
          classes.add(variant ? `${variant}:to-${color}` : `to-${color}`);
          classes.add(variant ? `${variant}:via-${color}` : `via-${color}`);
        });
      });
    });

    if (gradientColors.from) classes.add(`from-${gradientColors.from}`);
    if (gradientColors.to) classes.add(`to-${gradientColors.to}`);
    if (gradientColors.via) classes.add(`via-${gradientColors.via}`);
  });

  return Array.from(classes);
}

const generatedSafelist = generateSafelistFromThemes(themes);

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
          primary: "#D7263D",
          secondary: "#FF924C",
          accent: "#6A040F",
          background: "#FFF3E4",
        },
        dark: {
          primary: "#6C63FF",
          secondary: "#2A2A2A",
          accent: "#00F5D4",
          background: "#121212",
        },
        nature: {
          primary: "#3a5a40",
          secondary: "#a3b18a",
          accent: "#588157",
          background: "#dad7cd",
        },
        solara: {
          primary: "#eb5e28",
          secondary: "#ccc5b9",
          accent: "#252422",
          background: "#fffcf2",
        },
        serenity: {
          primary: "#353535", 
          secondary: "#FFFFFF", 
          accent: "#284B63", 
          highlight: "#3C6E71", 
          background: "#D9D9D9",
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      ringColor: ["checked"],
      boxShadow: ["checked"],
    },
  },
  safelist: generatedSafelist,
  plugins: [daisyui],
};
