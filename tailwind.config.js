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
};

/** Helper to generate safelist entries for Tailwind variants */
function generateSafelistFromThemes(themes) {
  const classes = new Set();

  const utilities = ["bg", "text", "border", "ring", "shadow"];
  const variants = ["", "hover", "focus", "checked", "ring"];
  const opacities = Array.from({ length: 9 }, (_, i) => `${(i + 1) * 10}`); // [10, 20, ..., 90]
  const gradientDirections = ["r", "l", "t", "b", "tr", "tl", "br", "bl"]; // Gradient directions

  Object.values(themes).forEach((theme) => {
    const { colors = {}, gradientColors = {} } = theme;

    // Add color-related classes
    Object.values(colors).forEach((color) => {
      utilities.forEach((util) => {
        variants.forEach((variant) => {
          const base = `${util}-${color}`;
          classes.add(variant ? `${variant}:${base}` : base);

          // Add opacity variants for bg-* (e.g., bg-color/50)
          if (util === "bg") {
            opacities.forEach((opacity) => {
              classes.add(
                variant ? `${variant}:${base}/${opacity}` : `${base}/${opacity}`
              );
            });
          }
        });
      });

      // Add gradient-related classes for each color
      gradientDirections.forEach((dir) => {
        // Add bg-gradient-to-* class
        classes.add(`bg-gradient-to-${dir}`);
        variants.forEach((variant) => {
          classes.add(
            variant
              ? `${variant}:bg-gradient-to-${dir}`
              : `bg-gradient-to-${dir}`
          );
        });

        // Add from-*, to-*, and via-* classes for the color
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

    // Add gradientColors classes (if still needed)
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
          primary: "#D7263D", // deeper, refined crimson — bold but modern
          secondary: "#FF924C", // rich sunset orange — warmth with elegance
          accent: "#6A040F", // dark red wine — moody, powerful grounding tone
          background: "#FFF3E4", // soft peachy-beige — warm and inviting
        },

        dark: {
          primary: "#6C63FF",
          secondary: "#2A2A2A",
          accent: "#00F5D4",
          background: "#121212",
        },
        nature: {
          primary: "#3a5a40", // moss green (rich, clean)
          secondary: "#a3b18a", // soft sage (balancing, calming)
          accent: "#588157", // muted olive (great for buttons/icons)
          background: "#dad7cd", // pale stone (light, elegant backdrop)
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
