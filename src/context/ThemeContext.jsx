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
      name: "آتشین",
      description: "انرژی و قدرت",
      isDark: false,
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
      name: "دارک",
      description: "تم تاریک و مدرن",
      isDark: true,
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
      name: "سولارا",
      description: "تم سولارا",
      isDark: false,
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
      name: "طبیعت",
      description: "الهام گرفته از طبیعت",
      isDark: false,
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
      name: "سرنیتی", // Serenity in Persian
      description: "تمی با الهام از آرامش و رنگ‌های ملایم", // "A theme inspired by serenity and soft colors"
      isDark: false,
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
  };

  useEffect(() => {
    localStorage.setItem("theme", activeTheme);
    document.body.className =
      themes[activeTheme]?.colors.background || "offWhite";
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
