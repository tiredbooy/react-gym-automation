import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function Stats({ total, occupied, free, vip }) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-5xl bg-${theme.colors.secondary} brightness-110 p-4 rounded-2xl shadow-lg flex justify-between text-sm text-${theme.colors.accent}`}
    >
      <div>کل کمدها: {total}</div>
      <div>اشغال‌شده: {occupied}</div>
      <div>آزاد: {free}</div>
      <div>VIP: {vip}</div>
    </motion.div>
  );
}
