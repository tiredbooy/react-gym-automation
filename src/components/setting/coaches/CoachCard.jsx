import { useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import {
  Edit,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

export default function CoachCard ({
  coach,
  onEdit,
  onDelete,
  onViewClients,
  onUpdateClients,
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const {activeTheme , themes} = useTheme();
  const theme = themes[activeTheme];

  const programCount = coach.clients
    ? coach.clients.filter((c) => c.type === "برنامه").length
    : 0;
  const privateCount = coach.clients
    ? coach.clients.filter((c) => c.type === "مربی خصوصی").length
    : 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-r from-${theme.colors.background} to-${theme.colors.secondary} p-6 rounded-2xl shadow-lg border border-${theme.colors.primary}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <motion.button
            whileTap={{ scale: 0.9, rotate: "90deg", transition: easeInOut }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-${theme.colors.primary} hover:${theme.colors.primary}`}
          >
            {isCollapsed ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </motion.button>
          <h3 className={`text-2xl font-bold text-${theme.colors.primary}`}>
            {coach.name}
          </h3>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(coach)}
            className={`text-${theme.colors.primary} hover:text-${theme.colors.accent} transition-colors duration-200`}
          >
            <Edit size={24} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(coach.id)}
            className="text-errorRed transition-colors"
          >
            <Trash2 size={24} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onViewClients(coach)}
            className={`text-${theme.colors.primary} hover:text-${theme.colors.accent} transition-colors duration-200`}
          >
            <Calendar size={24} />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 space-y-4"
          >
            <div className={`grid grid-cols-2 gap-4 text-lg text-${theme.colors.accent}`}>
              <span>شماره تماس: {coach.contact}</span>
              <span>تخصص: {coach.specialty}</span>
              <span>شیفت: {coach.shift}</span>
              <span>
                قیمت برنامه:{" "}
                {Number(coach?.priceProgram)?.toLocaleString("fa-IR")} تومان
              </span>
              <span>تعداد برنامه: {programCount}</span>
              <span>
                قیمت مربی خصوصی:{" "}
                {Number(coach?.pricePrivate).toLocaleString("fa-IR")} تومان
              </span>
              <span>تعداد مربی خصوصی: {privateCount}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
