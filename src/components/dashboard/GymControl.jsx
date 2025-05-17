import { DoorOpen, DoorClosed, Lock, Unlock, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function GymControlPanel() {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  const { primary, secondary, accent, background, success, error } =
    theme.colors;

  return (
    <motion.div
      className="flex flex-row gap-4 w-full mt-4 py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gate Control */}
      <motion.div
        className={`flex flex-col gap-4 bg-${secondary} p-4 rounded-xl shadow-md w-1/2`}
        whileHover={{ scale: 1.02 }}
      >
        <h2
          className={`text-${primary} font-bold text-lg mb-2 flex items-center gap-2`}
        >
          <KeyRound size={20} />
          کنترل گیت
        </h2>

        <div className={`flex flex-col gap-2 text-${accent} font-semibold`}>
          <div className="flex items-center gap-2">
            وضعیت گیت:
            <span
              className={`font-bold text-${primary} flex items-center gap-1`}
            >
              <DoorOpen size={18} />
              ورود
            </span>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`bg-${primary} text-${secondary} px-4 py-2 rounded-lg hover:brightness-110 transition flex items-center gap-2`}
            >
              <Unlock size={18} />
              فعال کردن گیت
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`bg-${primary} text-${secondary} px-4 py-2 rounded-lg hover:brightness-110 transition flex items-center gap-2`}
            >
              <Lock size={18} />
              غیرفعال کردن گیت
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Locker Access */}
      <motion.div
        className={`flex flex-col gap-4 bg-${secondary} p-4 rounded-xl shadow-md w-1/2`}
        whileHover={{ scale: 1.02 }}
      >
        <h2
          className={`text-${primary} font-bold text-lg mb-2 flex items-center gap-2`}
        >
          <Lock size={20} />
          دسترسی کمد
        </h2>

        <div className={`flex items-center gap-2 text-${accent} font-semibold`}>
          وضعیت کمدها:
          <span className={`font-bold text-${primary} flex items-center gap-1`}>
            <DoorClosed size={18} />
            18/20 پر شده
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            className={`px-4 py-1 rounded-xl bg-transparent border border-${primary} text-${primary} placeholder:text-${primary} font-bold outline-none focus:ring focus:ring-${primary} duration-150`}
            required
            placeholder="شماره کمد..."
            min="1"
            title="Must be between 1 to 10"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`bg-${primary} text-${secondary} px-4 py-2 rounded-lg hover:brightness-110 transition flex items-center gap-2`}
          >
            <DoorOpen size={18} />
            باز کردن کمد
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
