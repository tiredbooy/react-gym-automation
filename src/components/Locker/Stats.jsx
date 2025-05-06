import { motion } from "framer-motion";

export default function Stats({ total, occupied, free, vip }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl bg-beige p-4 rounded-2xl shadow-lg flex justify-between text-sm text-nearBlack"
    >
      <div>کل کمدها: {total}</div>
      <div>اشغال‌شده: {occupied}</div>
      <div>آزاد: {free}</div>
      <div>VIP: {vip}</div>
    </motion.div>
  );
}
