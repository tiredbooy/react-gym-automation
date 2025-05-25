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
    softDusk: {
      name: "غروب نرم", // Soft Dusk
      description: "تمی الهام گرفته از رنگ‌های گرم و ملایم غروب", // A theme inspired by the warm, soft colors of dusk
      isDark: false,
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
      name: "رؤیا", // Dream
      description: "تمی الهام گرفته از رویاهای نرم و رنگ‌های آسمانی", // A theme inspired by soft dreams and celestial colors
      isDark: false,
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
      name: "اخگر",
      description: "تمی الهام گرفته از گرمای ملایم و رنگ‌های پرشور",
      isDark: false,
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
