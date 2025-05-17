import { useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";

import { useTheme } from "../../../context/ThemeContext";

export default function WorkHoursModal({
  isOpen,
  onClose,
  onSave,
  salonId,
  initialHours,
}) {
  const [days, setDays] = useState(
    initialHours || {
      شنبه: { open: "06:00", close: "23:30", isOpen: true },
      یکشنبه: { open: "06:00", close: "23:30", isOpen: true },
      دوشنبه: { open: "06:00", close: "23:30", isOpen: true },
      سه‌شنبه: { open: "06:00", close: "23:30", isOpen: true },
      چهارشنبه: { open: "06:00", close: "23:30", isOpen: true },
      پنجشنبه: { open: "06:30", close: "21:00", isOpen: true },
      جمعه: { open: "10:00", close: "14:00", isOpen: false },
    }
  );

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  const handleTimeChange = (day, field, value) => {
    setDays((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleToggleDay = (day) => {
    setDays((prev) => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  };

  const applyToWeekdays = () => {
    const weekdayHours = days["دوشنبه"];
    setDays((prev) => ({
      ...prev,
      یکشنبه: weekdayHours,
      دوشنبه: weekdayHours,
      سه‌شنبه: weekdayHours,
      چهارشنبه: weekdayHours,
    }));
    toast.success("ساعات کاری به روزهای هفته اعمال شد");
  };

  const handleSave = () => {
    for (const [day, { open, close, isOpen }] of Object.entries(days)) {
      if (isOpen && open >= close) {
        toast.error(`ساعت پایان باید بعد از ساعت شروع باشد برای ${day}`);
        return;
      }
    }
    onSave(salonId, days);
    toast.success("ساعات کاری ذخیره شد");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-nearBlack bg-opacity-60 flex items-center justify-center z-50`}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className={`bg-gradient-to-br from-${theme.colors.secondary} to-${theme.colors.background} p-6 rounded-xl shadow-2xl max-w-lg w-full`}
          >
            <h2
              className={`text-2xl font-semibold text-${theme.colors.primary} mb-4 flex items-center`}
            >
              <Clock className="ml-2" /> تنظیم ساعات کاری
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.keys(days).map((day) => (
                <motion.div
                  key={day}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * Object.keys(days).indexOf(day) }}
                  className={`flex items-center space-x-4 space-x-reverse bg-gradient-to-l from-${theme.colors.secondary}/60 bg-opacity-50 p-2 rounded-lg`}
                >
                  <input
                    type="checkbox"
                    checked={days[day].isOpen}
                    onChange={() => handleToggleDay(day)}
                    className={`h-5 w-5 accnet-${theme.colors.primary} rounded`}
                  />
                  <span className={`w-24 text-${theme.colors.accent}`}>
                    {day}
                  </span>
                  <input
                    type="time"
                    value={days[day].open}
                    onChange={(e) =>
                      handleTimeChange(day, "open", e.target.value)
                    }
                    disabled={!days[day].isOpen}
                    className={`p-2 border bg-${theme.colors.secondary} border-${theme.colors.primary} rounded focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary}/60 placeholder:text-${theme.colors.accent}/50 text-${theme.colors.accent}`}
                  />
                  <span className={`text-${theme.colors.accent}`}>تا</span>
                  <input
                    type="time"
                    value={days[day].close}
                    onChange={(e) =>
                      handleTimeChange(day, "close", e.target.value)
                    }
                    disabled={!days[day].isOpen}
                    className={`p-2 border bg-${theme.colors.secondary} border-${theme.colors.primary} rounded focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary}/60 placeholder:text-${theme.colors.accent}/50 text-${theme.colors.accent}`}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={applyToWeekdays}
                className={`px-4 py-2 bg-transparent border border-${theme.colors.primary} text-${theme.colors.accent} rounded-lg hover:bg-${theme.colors.primary} hover:text-${theme.colors.background} transition-colors duration-300`}
              >
                اعمال به روزهای هفته
              </button>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={onClose}
                  className={`px-4 py-2 bg-transparent border border-${theme.colors.primary} text-${theme.colors.accent} rounded-lg hover:bg-${theme.colors.primary} hover:text-${theme.colors.background} transition-colors duration-300`}
                >
                  لغو
                </button>
                <motion.button
                  whileHover={{ scale : 1.03 }}
                  whileTap={{ scale : 0.97 }}
                  onClick={handleSave}
                  className={`px-4 py-2 bg-${theme.colors.primary} text-offWhite rounded-lg hover:text-white transition-colors duration-300`}
                >
                  ذخیره
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
