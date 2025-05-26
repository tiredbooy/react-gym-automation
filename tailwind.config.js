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
  serenity: {
    colors: {
      primary: "serenity-primary", // #353535
      secondary: "serenity-secondary", // #FFFFFF
      accent: "serenity-accent", // #284B63
      highlight: "serenity-highlight", // #3C6E71
      background: "serenity-background", // #D9D9D9
    },
    gradientColors: {
      from: "serenity-secondary", // #FFFFFF
      to: "serenity-background", // #D9D9D9
    },
  },
  softDusk: {
    colors: {
      primary: "softdusk-primary", // #B7C4CF
      secondary: "softdusk-secondary", // #EEE3CB
      accent: "softdusk-accent", // #D7C0AE
      highlight: "softdusk-highlight", // #967E76
      background: "softdusk-background", // #EEE3CB
    },
    gradientColors: {
      from: "softdusk-secondary", // #EEE3CB
      to: "softdusk-accent", // #D7C0AE
    },
  },
  dream: {
    colors: {
      primary: "dream-primary", // #E6D8F2
      secondary: "dream-secondary", // #F2E8F6
      accent: "dream-accent", // #C3A6D9
      background: "dream-background", // #F2E8F6
    },
    gradientColors: {
      from: "dream-secondary", // #F2E8F6
      to: "dream-accent", // #C3A6D9
    },
  },
  ember: {
    colors: {
      primary: "ember-primary", // #B7C4CF
      secondary: "ember-secondary", // #EEE3CB
      accent: "ember-accent", // #D7C0AE
      highlight: "ember-highlight", // #967E76
      background: "ember-background", // #EEE3CB
    },
    gradientColors: {
      from: "ember-scondary",
      to: "ember-background",
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
        softdusk: {
          primary: "#FAF3E0",
          secondary: "#EABF9F",
          accent: "#1E212D",
          background: "#B68973",
        },
        dream: {
          primary: "#A68BC1",
          secondary: "#E6D8F2",
          accent: "#C3A6D9",
          background: "#F2E8F6",
        },
        ember: {
          primary: "#3E4149",
          secondary: "#FFC8C8",
          accent: "#444F5A",
          background: "#FF9999",
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
  daisyui: {
    themes: false,
  },
};
