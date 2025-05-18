import { motion } from "framer-motion";
import { Lock, AlertTriangle, BarChart } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ActionButtons({
  onCloseAll,
  onOpenAll,
  onReset,
  onReport,
  isLoading,
}) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed bottom-4 w-full max-w-5xl bg-${secondary} p-4 rounded-2xl shadow-lg flex flex-wrap justify-center gap-4`}
    >
      <div className="relative group">
        <button
          onClick={onCloseAll}
          disabled={isLoading}
          className={`p-2 bg-red-500 text-${background} rounded-lg flex items-center gap-1 hover:bg-red-600 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Lock className="w-5 h-5" /> بستن همه کمدها
        </button>
        <span
          className={`absolute bottom-full mb-2 hidden group-hover:block bg-${accent} text-${background} text-xs rounded p-1`}
        >
          همه کمدها را آزاد می‌کند
        </span>
      </div>

      <div className="relative group">
        <button
          onClick={onOpenAll}
          disabled={isLoading}
          className={`p-2 bg-green-500 text-${background} rounded-lg flex items-center gap-1 hover:bg-green-600 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Lock className="w-5 h-5" /> باز کردن همه کمدها
        </button>
        <span
          className={`absolute bottom-full mb-2 hidden group-hover:block bg-${accent} text-${background} text-xs rounded p-1`}
        >
          همه کمدها را در دسترس قرار می‌دهد
        </span>
      </div>

      <div className="relative group">
        <button
          onClick={onReset}
          disabled={isLoading}
          className={`p-2 bg-yellow-500 text-${background} rounded-lg flex items-center gap-1 hover:bg-yellow-600 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <AlertTriangle className="w-5 h-5" /> ریست سیستم
        </button>
        <span
          className={`absolute bottom-full mb-2 hidden group-hover:block bg-${accent} text-${background} text-xs rounded p-1`}
        >
          همه تخصیص‌ها و تاریخچه را پاک می‌کند
        </span>
      </div>

      <div className="relative group">
        <button
          onClick={onReport}
          disabled={isLoading}
          className={`p-2 bg-${primary} text-${background} rounded-lg flex items-center gap-1 hover:brightness-110 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <BarChart className="w-5 h-5" /> گزارش استفاده
        </button>
        <span
          className={`absolute bottom-full mb-2 hidden group-hover:block bg-${accent} text-${background} text-xs rounded p-1`}
        >
          گزارش استفاده از کمدها را نمایش می‌دهد
        </span>
      </div>
    </motion.div>
  );
}
