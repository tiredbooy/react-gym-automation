import { useState } from "react";
import toast from "react-hot-toast";
import { motion , AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ConnectionWizardModal ({ isOpen, onClose, onConnect, device , simulateHardwareAPI }) {
    const [step, setStep] = useState(1);
  
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
            className="fixed inset-0 bg-nearBlack bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-offWhite p-6 rounded-2xl shadow-lg max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-nearBlack">
                  ویزارد اتصال - مرحله {step}
                </h2>
                <button onClick={onClose}>
                  <X className="w-5 h-5 text-nearBlack" />
                </button>
              </div>
              <div className="mb-4">
                {step === 1 ? (
                  <>
                    <h3 className="text-sm font-bold text-nearBlack">
                      بررسی دستگاه
                    </h3>
                    <p className="text-sm text-nearBlack">
                      دستگاه: {device?.name}
                    </p>
                    <p className="text-sm text-nearBlack">نوع: {device?.type}</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-nearBlack">اتصال</h3>
                    <p className="text-sm text-nearBlack">
                      در حال اتصال به {device?.name}...
                    </p>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2">
                {step === 1 && (
                  <button
                    onClick={handleNext}
                    className="p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700"
                  >
                    بعدی
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 bg-gray-300 rounded-lg text-nearBlack hover:bg-hoverBeige"
                >
                  لغو
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  