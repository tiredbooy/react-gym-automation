import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

function ThemeSettings() {
  const { activeTheme, setActiveTheme, themes } = useTheme();
  const theme = themes[activeTheme] || themes.classic; // Fallback to classic if activeTheme is undefined

  return (
    <motion.div
      initial={{ opacity: 0, x: -500 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring" }}
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

      <div className="flex flex-wrap justify-center gap-6">
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
    </motion.div>
  );
}

function ThemeCard({ theme, themeKey, isActive, onClick }) {
  return (
    <motion.div
      key={themeKey}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{
        duration: 0.25, // faster load
        ease: [0.33, 1, 0.68, 1], // sleek ease-out
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`w-64 rounded-2xl overflow-hidden cursor-pointer 
                  bg-${theme.colors.background} 
                  ${
                    isActive
                      ? `ring-2 ring-offset-2 ring-${theme.colors.primary}`
                      : "hover:ring-1 hover:ring-gray-300"
                  } 
                  shadow-sm hover:shadow-md 
                  transition-all duration-200 ease-in-out`}
    >
      {/* Header */}
      <div className={`h-24 w-full bg-${theme.colors.primary} relative`}>
        {isActive && (
          <motion.div
            className="absolute text-white right-3 top-3 opacity-90"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "tween",
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Check icon */}
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
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M6 8H5a4 4 0 0 0 0 8h1" />
              <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M16 16v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2" />
              <path d="M8 12h8" />
            </svg>
          </motion.div>
        )}
        {/* Orbs */}
        <div className="absolute flex justify-center w-full -bottom-6">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {["primary", "secondary", "accent", "background"].map((key, i) => (
              <ColorOrb
                key={i}
                colorClass={`bg-${theme.colors[key]}`}
                index={i}
                isActive={isActive}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Text */}
      <div className="px-6 pt-10 pb-6">
        <h3
          className={`font-semibold text-lg text-center text-${theme.colors.primary} mb-1`}
        >
          {theme.name}
        </h3>
        <p
          className="mb-4 text-sm text-center"
          style={{
            color: theme.isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          }}
        >
          {theme.description}
        </p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={`w-full py-2 rounded-lg font-medium text-sm 
                      transition-all duration-200 
                      bg-${
                        isActive
                          ? theme.colors.primary
                          : theme.isDark
                          ? "gray-700"
                          : "gray-200"
                      } text-${
            isActive || theme.isDark ? "white" : "gray-700"
          } shadow-inner hover:shadow-sm`}
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
