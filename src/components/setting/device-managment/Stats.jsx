import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

export default function Stats({ devices, deviceLog }) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className={`w-full max-w-5xl bg-${theme.colors.secondary} p-4 rounded-2xl shadow-lg flex justify-between text-sm text-${theme.colors.primary}`}
  >
    <div>
      دستگاه‌های متصل: {devices.filter((d) => d.status === "connected").length}
    </div>
    <div>کل فعالیت‌ها: {deviceLog.length}</div>
    <div>خطاها: {deviceLog.filter((l) => l.action === "خطا").length}</div>
  </motion.div>;
}
