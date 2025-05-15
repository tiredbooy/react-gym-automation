// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("theme") || "classic";
  });

  const themes = {
    classic: {
      name: "کلاسیک",
      description: "تم رسمی و حرفه‌ای",
      isDark: false,
      colors: {
        primary: "bg-darkBlue text-darkBlue border-darkBlue",
        secondary: "bg-beige text-beige border-beige",
        accent: "bg-nearBlack text-nearBlack border-nearBlack",
        background: "bg-offWhite text-offWhite border-offWhite",
        success: "bg-successGreen text-successGreen border-successGreen",
        error: "bg-errorRed text-errorRed border-errorRed",
      },
      gradientColors: {
        from: "beige",
        to: "offWhite",
      },
    },
    fiery: {
      name: "آتشین",
      description: "انرژی و قدرت",
      isDark: false,
      colors: {
        primary: "bg-fiery-primary text-fiery-primary border-fiery-primary",
        secondary:
          "bg-fiery-secondary text-fiery-secondary border-fiery-secondary",
        accent: "bg-fiery-accent text-fiery-accent border-fiery-accent",
        background:
          "bg-fiery-background text-fiery-background border-fiery-background",
      },
      gradientColors: {
        from: "fiery-secondary",
        to: "fiery-background",
      },
    },
    dark: {
      name: "دارک",
      description: "تم تاریک و مدرن",
      isDark: true,
      colors: {
        primary: "bg-dark-primary text-dark-primary border-dark-primary",
        secondary:
          "bg-dark-secondary text-dark-secondary border-dark-secondary",
        accent: "bg-dark-accent text-dark-accent border-dark-accent",
        background:
          "bg-dark-background text-dark-background border-dark-background",
      },
      gradientColors: {
        from: "dark-secondary",
        to: "dark-background",
      },
    },
    nature: {
      name: "طبیعت",
      description: "الهام گرفته از طبیعت",
      isDark: false,
      colors: {
        primary: "bg-nature-primary text-nature-primary border-nature-primary",
        secondary:
          "bg-nature-secondary text-nature-secondary border-nature-secondary",
        accent: "bg-nature-accent text-nature-accent border-nature-accent",
        background:
          "bg-nature-background text-nature-background border-nature-background",
      },
      gradientColors: {
        from: "nature-secondary",
        to: "nature-background",
      },
    },
  };

  useEffect(() => {
    localStorage.setItem("theme", activeTheme);
    document.body.className =
      themes[activeTheme].colors.background.split(" ")[0];
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
