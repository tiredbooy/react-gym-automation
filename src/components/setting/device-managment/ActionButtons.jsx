import { Plug } from "lucide-react";
import { motion } from "framer-motion";

export default function ActionButtons({
  onConnectAll,
  onDisconnectAll,
  isLoading,
}) {
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="fixed bottom-4 w-full max-w-5xl bg-beige p-4 rounded-2xl shadow-lg flex justify-center gap-4"
  >
    <button
      onClick={onConnectAll}
      disabled={isLoading}
      className={`p-2 bg-green-500 text-offWhite rounded-lg hover:bg-green-600 flex items-center gap-1 ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <Plug className="w-5 h-5" /> اتصال همه
    </button>
    <button
      onClick={onDisconnectAll}
      disabled={isLoading}
      className={`p-2 bg-red-500 text-offWhite rounded-lg hover:bg-red-600 flex items-center gap-1 ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <Plug className="w-5 h-5" /> قطع اتصال همه
    </button>
  </motion.div>;
}
