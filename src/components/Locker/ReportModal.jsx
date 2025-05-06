import { AnimatePresence, motion } from "framer-motion";

export default function ReportModal({ isOpen, onClose, lockers }) {
  const usageStats = lockers
    .map((locker) => ({
      number: locker.number,
      usageCount: locker.history
        ? locker.history.filter((h) => h.action === "تخصیص").length
        : 0,
    }))
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5);

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
                گزارش استفاده از کمدها
              </h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-nearBlack" />
              </button>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-nearBlack">
                پرکاربردترین کمدها
              </h3>
              <ul className="space Y-2 mt-2">
                {usageStats.map((stat) => (
                  <li key={stat.number} className="text-sm text-nearBlack">
                    کمد شماره {stat.number}: {stat.usageCount} بار استفاده
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
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
