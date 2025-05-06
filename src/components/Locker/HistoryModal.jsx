import { AnimatePresence, motion } from "framer-motion";

export default function HistoryModal({
  isOpen,
  onClose,
  history,
  lockerNumber,
}) {
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
          className="bg-offWhite p-6 rounded-2xl shadow-lg max-w-sm w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-nearBlack">
              تاریخچه کمد شماره {lockerNumber}
            </h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-nearBlack" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {history.length ? (
              <ul className="space-y-2">
                {history.map((entry, index) => (
                  <li key={index} className="text-sm text-nearBlack">
                    <span className="font-bold">{entry.member}</span> -{" "}
                    {entry.action} در{" "}
                    {new Date(entry.timestamp).toLocaleString("fa-IR")}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">بدون تاریخچه</p>
            )}
          </div>
          <div className="flex justify-end mt-4 lettre">
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
  </AnimatePresence>;
}
