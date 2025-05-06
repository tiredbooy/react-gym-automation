import { useState } from "react";
import { motion , AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function AssignModal({
  isOpen,
  onClose,
  onAssign,
  lockerNumber,
}) {
  const [memberName, setMemberName] = useState("");

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
            className="bg-offWhite p-6 rounded-2xl shadow-lg max-w-sm w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-nearBlack">
                تخصیص کمد شماره {lockerNumber}
              </h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-nearBlack" />
              </button>
            </div>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="نام عضو"
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-beige text-nearBlack"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="p-2 bg-gray-300 rounded-lg text-nearBlack hover:bg-hoverBeige"
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
                className="p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700"
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
