import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function AssignModal({
  isOpen,
  onClose,
  onAssign,
  lockerNumber,
}) {
  const [memberName, setMemberName] = useState("");

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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`bg-${background} p-6 rounded-2xl shadow-lg max-w-sm w-full border border-${secondary}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold text-${accent}`}>
                تخصیص کمد شماره {lockerNumber}
              </h2>
              <button onClick={onClose}>
                <X className={`w-5 h-5 text-${accent}`} />
              </button>
            </div>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="نام عضو"
              className={`w-full p-2 mb-4 rounded-lg border border-${accent} focus:outline-none focus:ring-2 focus:ring-${primary} bg-${secondary} text-${accent}`}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className={`p-2 bg-${secondary} rounded-lg text-${accent} hover:brightness-110`}
              >
                لغو
              </button>
              <button
                onClick={() => {
                  if (memberName.trim()) {
                    onAssign(lockerNumber, memberName);
                    setMemberName("");
                    onClose();
                  }
                }}
                className={`p-2 bg-${primary} text-${background} rounded-lg hover:brightness-110`}
              >
                تخصیص
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
