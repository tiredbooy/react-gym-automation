import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

function ThemeSettings() {
  const { activeTheme, setActiveTheme, themes } = useTheme();
  const theme = themes[activeTheme] || themes.classic; // Fallback to classic if activeTheme is undefined
  console.log(theme);
  return (
    <div
      className={`bg-gradient-to-b from-${
        theme.gradientColors?.from || theme.colors.secondary
      } to-${
        theme.gradientColors?.to || theme.colors.background
      } mt-8 rounded-2xl p-8 shadow-xl`}
    >
      <h1 className={`font-bold text-2xl text-${theme.colors.accent} mb-2`}>
        تنظیمات تم
      </h1>
      <p className={`text-${theme.colors.accent} mb-6`}>
        انتخاب ظاهر سیستم مدیریت باشگاه
      </p>

      <div className="flex flex-wrap gap-6 justify-center">
        {Object.entries(themes).map(([themeKey, themeData], idx) => (
          <ThemeCard
            key={themeKey} // Use themeKey for uniqueness
            theme={themeData}
            themeKey={themeKey}
            isActive={activeTheme === themeKey}
            onClick={() => setActiveTheme(themeKey)}
          />
        ))}
      </div>
    </div>
  );
}

function ThemeCard({ theme, themeKey, isActive, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={themeKey}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-64 rounded-xl overflow-hidden bg-${
        theme.colors.background
      } ${
        isActive ? `ring-2 ring-offset-2 ring-${theme.colors.primary}` : ""
      } shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className={`h-24 w-full bg-${theme.colors.primary} relative`}>
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
              colorClass={`bg-${theme.colors.primary}`}
              index={0}
              isActive={isActive}
            />
            <ColorOrb
              colorClass={`bg-${theme.colors.secondary}`}
              index={1}
              isActive={isActive}
            />
            <ColorOrb
              colorClass={`bg-${theme.colors.accent}`}
              index={2}
              isActive={isActive}
            />
            <ColorOrb
              colorClass={`bg-${theme.colors.background}`}
              index={3}
              isActive={isActive}
            />
          </motion.div>
        </div>
      </div>
      <div className="pt-8 pb-6 px-6">
        <h3
          className={`font-bold text-lg text-center text-${theme.colors.primary} mb-1`}
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
          className={`w-full py-2 rounded-lg font-medium transition-all duration-300 bg-${
            isActive
              ? theme.colors.primary
              : theme.isDark
              ? "gray-600"
              : "gray-200"
          } text-${isActive || theme.isDark ? "white" : "gray-600"}`}
        >
          {isActive ? "انتخاب شده" : "انتخاب تم"}
        </motion.button>
      </div>
    </motion.div>
  );
}

function ColorOrb({ colorClass, index, isActive }) {
  const offsetY = index % 2 === 0 ? -4 : 4;

  return (
    <motion.div
      className={`w-12 h-12 rounded-full shadow-lg mx-[-8px] ${colorClass}`}
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
