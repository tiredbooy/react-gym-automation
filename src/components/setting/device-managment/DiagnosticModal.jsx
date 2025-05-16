import { useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

export default function DiagnosticModal({
  isOpen,
  onClose,
  device,
  simulateHardwareAPI,
}) {
  const [result, setResult] = useState(null);
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  const handleTest = async () => {
    try {
      const testResult = await simulateHardwareAPI.test(device);
      setResult(testResult);
      toast.success("تست با موفقیت انجام شد");
    } catch (e) {
      setResult({
        result: "خطا",
        details: e.message,
        timestamp: new Date().toISOString(),
      });
      toast.error("خطا در تست: " + e.message);
    }
  };

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
            className={`bg-${theme.colors.background} p-6 rounded-2xl shadow-lg max-w-md w-full`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold text-${theme.colors.primary}`}>
                تشخیص: {device?.name}
              </h2>
              <button onClick={onClose}>
                <X className={`w-5 h-5 text-${theme.colors.accent}`} />
              </button>
            </div>
            <div className="mb-4">
              <p className={`text-sm text-${theme.colors.accent}`}>وضعیت: {device?.status}</p>
              <p className={`text-sm text-${theme.colors.accent}`}>نوع: {device?.type}</p>
              {result && (
                <div className="mt-2">
                  <p className={`text-sm text-${theme.colors.accent}`}>
                    نتیجه: {result.result}
                  </p>
                  <p className={`text-sm text-${theme.colors.accent}`}>
                    جزئیات: {result.details}
                  </p>
                  <p className={`text-sm text-${theme.colors.accent}`}>
                    زمان: {new Date(result.timestamp).toLocaleString("fa-IR")}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-start gap-2">
              <button
                onClick={onClose}
                className="p-2 bg-gray-300 rounded-lg text-nearBlack hover:bg-hoverBeige"
              >
                بستن
              </button>
              <button
                onClick={handleTest}
                className={`p-2 bg-${theme.colors.primary} text-${theme.colors.background} rounded-lg hover:bg-yellow-600`}
              >
                اجرای تست
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
