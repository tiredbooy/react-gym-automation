import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

function ThemeSettings() {
  const { activeTheme, setActiveTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  return (
    <div className={`bg-gradient-to-t ${theme.colors.secondary} mt-8 rounded-2xl p-8 shadow-xl`}>
      <h1 className={`font-bold text-2xl text-${theme.colors.accent} mb-2`}>تنظیمات تم</h1>
      <p className={`text-${theme.colors.accent} mb-6`}>انتخاب ظاهر سیستم مدیریت باشگاه</p>

      <div className="flex flex-wrap gap-6 justify-center">
        {Object.keys(themes).map((themeKey, idx) => (
          <ThemeCard
            key={idx}
            theme={themes[themeKey]}
            isActive={activeTheme === themeKey}
            onClick={() => setActiveTheme(themeKey)}
          />
        ))}
      </div>
    </div>
  );
}

function ThemeCard({ theme, isActive, onClick }) {
  // Convert Tailwind bg class to hex for inline styles
  const getHexColor = (className) => {
    const colorMap = {
      "bg-darkBlue": "#123458",
      "bg-beige": "#D4C9BE",
      "bg-nearBlack": "#030303",
      "bg-offWhite": "#F1EFEC",
      "bg-fiery-primary": "#E63946",
      "bg-fiery-secondary": "#F9C74F",
      "bg-fiery-accent": "#073B4C",
      "bg-fiery-background": "#F8F9FA",
      "bg-night-primary": "#6C63FF",
      "bg-night-secondary": "#2A2A2A",
      "bg-night-accent": "#00F5D4",
      "bg-night-background": "#121212",
      "bg-nature-primary": "#2A9D8F",
      "bg-nature-secondary": "#E9C46A",
      "bg-nature-accent": "#264653",
      "bg-nature-background": "#F7F7F2",
    };
    return colorMap[className] || "#ffffff";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        backgroundColor: theme.isDark
          ? getHexColor(theme.colors.background.split(" ")[0])
          : "#ffffff",
        color: theme.isDark
          ? "#ffffff"
          : getHexColor(
              theme.colors.accent.split(" ")[1].replace("text-", "bg-")
            ),
      }}
      className={`w-64 rounded-xl overflow-hidden ${
        isActive ? `ring-2 ring-offset-2 ${theme.colors.primary}` : ""
      } shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div
        className="h-24 w-full relative"
        style={{
          backgroundColor: getHexColor(theme.colors.primary.split(" ")[0]),
        }}
      >
        {isActive && (
          <motion.div
            className="absolute right-3 top-3 text-white opacity-90"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M6 8H5a4 4 0 0 0 0 8h1"></path>
              <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <path d="M16 16v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2"></path>
              <path d="M8 12h8"></path>
            </svg>
          </motion.div>
        )}
        <div className="absolute -bottom-6 w-full flex justify-center">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ColorOrb
              color={getHexColor(theme.colors.primary.split(" ")[0])}
              index={0}
              isActive={isActive}
            />
            <ColorOrb
              color={getHexColor(theme.colors.secondary.split(" ")[0])}
              index={1}
              isActive={isActive}
            />
            <ColorOrb
              color={getHexColor(theme.colors.accent.split(" ")[0])}
              index={2}
              isActive={isActive}
            />
            <ColorOrb
              color={getHexColor(theme.colors.background.split(" ")[0])}
              index={3}
              isActive={isActive}
            />
          </motion.div>
        </div>
      </div>
      <div className="pt-8 pb-6 px-6">
        <h3
          className="font-bold text-lg text-center mb-1"
          style={{
            color: theme.isDark
              ? "#ffffff"
              : getHexColor(theme.colors.primary.split(" ")[0]),
          }}
        >
          {theme.name}
        </h3>
        <p
          className="text-sm text-center mb-4"
          style={{
            color: theme.isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          }}
        >
          {theme.description}
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            backgroundColor: isActive
              ? getHexColor(theme.colors.primary.split(" ")[0])
              : theme.isDark
              ? "#444444"
              : "#e0e0e0",
            color: isActive || theme.isDark ? "#ffffff" : "#666666",
          }}
          className="w-full py-2 rounded-lg font-medium transition-all duration-300"
        >
          {isActive ? "انتخاب شده" : "انتخاب تم"}
        </motion.button>
      </div>
    </motion.div>
  );
}

function ColorOrb({ color, index, isActive }) {
  const offsetY = index % 2 === 0 ? -4 : 4;

  return (
    <motion.div
      style={{
        backgroundColor: color,
        border:
          color === "#FFFFFF" ||
          color === "#F1EFEC" ||
          color === "#F8F9FA" ||
          color === "#F7F7F2"
            ? "1px solid #e0e0e0"
            : "none",
      }}
      className="w-12 h-12 rounded-full shadow-lg mx-[-8px]"
      initial={{ y: 0 }}
      animate={{
        y: isActive ? offsetY : 0,
        scale: isActive ? 1.1 : 1,
        zIndex: isActive ? 40 - index : 30 - index,
        boxShadow: isActive
          ? "0 8px 16px rgba(0,0,0,0.15)"
          : "0 2px 4px rgba(0,0,0,0.1)",
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        type: "spring",
        stiffness: 150,
      }}
      whileHover={{
        scale: 1.2,
        zIndex: 50,
        transition: { duration: 0.2 },
      }}
    />
  );
}

export default ThemeSettings;
