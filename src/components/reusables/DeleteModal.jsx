import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trash2, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function DeleteModal({ title, children, onClose, onConfirm, isLoading }) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background, error } = theme.colors;

  const modalRef = useRef(null);

  // ✅ ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // ✅ Click outside to close
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className={`bg-${background} text-${accent} rounded-2xl shadow-lg p-6 w-full max-w-md relative rtl`}
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        dir="rtl"
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 left-4 text-${accent} hover:text-${primary} transition`}
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4 justify-start">
          <Trash2 className={`text-red-500 w-6 h-6`} />
          <h2 className={`text-red-500 text-lg font-bold`}>{title}</h2>
        </div>

        {/* Content */}
        <div className="text-sm leading-relaxed mb-6">{children}</div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md bg-${secondary} text-${accent} hover:bg-opacity-90 transition`}
          >
            انصراف
          </button>
          {isLoading ? (
            <div
              className={`flex flex-row gap-1 px-4 py-2 rounded-lg bg-${secondary}`}
            >
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : (
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-md bg-${primary} text-white hover:opacity-90 transition`}
            >
              حذف
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DeleteModal;
