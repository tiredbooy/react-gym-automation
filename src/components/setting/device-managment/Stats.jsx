import { motion } from "framer-motion";

export default function Stats({ devices, deviceLog }) {
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-5xl bg-beige p-4 rounded-2xl shadow-lg flex justify-between text-sm text-nearBlack"
  >
    <div>
      دستگاه‌های متصل: {devices.filter((d) => d.status === "connected").length}
    </div>
    <div>کل فعالیت‌ها: {deviceLog.length}</div>
    <div>خطاها: {deviceLog.filter((l) => l.action === "خطا").length}</div>
  </motion.div>;
}
