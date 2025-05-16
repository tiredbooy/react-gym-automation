import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

export default function ConnectionWizardModal({
  isOpen,
  onClose,
  onConnect,
  device,
  simulateHardwareAPI,
}) {
  const [step, setStep] = useState(1);

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      try {
        const connectedDevice = await simulateHardwareAPI.connect(device);
        onConnect(connectedDevice);
        onClose();
      } catch (e) {
        toast.error("خطا در اتصال: " + e.message);
        setStep(1);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-nearBlack bg-opacity-50 flex items-center justify-center z-50`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`bg-${theme.colors.background} p-6 rounded-2xl shadow-lg max-w-md w-full`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold text-${theme.colors.primary}`}>
                ویزارد اتصال - مرحله {step}
              </h2>
              <button onClick={onClose}>
                <X className={`w-5 h-5 text-${theme.colors.accent}`} />
              </button>
            </div>
            <div className="mb-4">
              {step === 1 ? (
                <>
                  <h3
                    className={`text-sm font-bold text-${theme.colors.primary}`}
                  >
                    بررسی دستگاه
                  </h3>
                  <p className={`text-sm text-${theme.colors.accent}`}>
                    دستگاه: {device?.name}
                  </p>
                  <p className={`text-sm text-${theme.colors.accent}`}>
                    نوع: {device?.type}
                  </p>
                </>
              ) : (
                <>
                  <h3
                    className={`text-sm font-bold text-${theme.colors.primary}`}
                  >
                    اتصال
                  </h3>
                  <p className={`text-sm text-${theme.colors.accent}`}>
                    در حال اتصال به {device?.name}...
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-start gap-2">
              <button
                onClick={onClose}
                className="p-2 bg-gray-300 rounded-lg text-nearBlack hover:bg-hoverBeige"
              >
                لغو
              </button>
              {step === 1 && (
                <button
                  onClick={handleNext}
                  className={`p-2 bg-${theme.colors.primary} text-${theme.colors.background} rounded-lg hover:bg-${theme.colors.primary}/60`}
                >
                  بعدی
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
