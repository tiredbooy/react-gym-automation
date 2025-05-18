import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-nearBlack bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`bg-${background} p-6 rounded-2xl shadow-lg max-w-sm w-full`}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className={`w-6 h-6 text-${primary}`} />
              <h2 className={`text-lg font-bold text-${primary}`}>{title}</h2>
            </div>
            <p className={`text-sm text-${accent} mb-4`}>{message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className={`p-2 bg-${accent} font-semibold rounded-lg text-${background} hover:brightness-125 duration-200`}
              >
                لغو
              </button>
              <button
                onClick={onConfirm}
                className={`p-2 bg-red-500 text-${background} font-semibold rounded-lg hover:bg-red-600 duration-200`}
              >
                تأیید
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
