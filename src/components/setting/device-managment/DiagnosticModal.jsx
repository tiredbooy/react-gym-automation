import { useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function DiagnosticModal({
  isOpen,
  onClose,
  device,
  simulateHardwareAPI,
}) {
  const [result, setResult] = useState(null);

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
            className="bg-offWhite p-6 rounded-2xl shadow-lg max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-nearBlack">
                تشخیص: {device?.name}
              </h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-nearBlack" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-nearBlack">وضعیت: {device?.status}</p>
              <p className="text-sm text-nearBlack">نوع: {device?.type}</p>
              {result && (
                <div className="mt-2">
                  <p className="text-sm text-nearBlack">
                    نتیجه: {result.result}
                  </p>
                  <p className="text-sm text-nearBlack">
                    جزئیات: {result.details}
                  </p>
                  <p className="text-sm text-nearBlack">
                    زمان: {new Date(result.timestamp).toLocaleString("fa-IR")}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleTest}
                className="p-2 bg-yellow-500 text-offWhite rounded-lg hover:bg-yellow-600"
              >
                اجرای تست
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-gray-300 rounded-lg text-nearBlack hover:bg-hoverBeige"
              >
                بستن
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
