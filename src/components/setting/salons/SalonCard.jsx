import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ChevronDown, ChevronUp, Edit, Clock, Trash2 } from "lucide-react";

import { useTheme } from "../../../context/ThemeContext";


export default function SalonCard({
  salon,
  onEditSalon,
  onDeleteSalon,
  onEditWorkHours,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(salon.name);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      toast.error("نام سالن نمی‌تواند خالی باشد");
      return;
    }
    onEditSalon(salon.id, editName);
    setIsEditing(false);
    toast.success("نام سالن به‌روزرسانی شد");
  };

  const formatWorkHours = (hours) => {
    if (!hours) return "تنظیم نشده";
    return Object.entries(hours)
      .filter(([_, { isOpen }]) => isOpen)
      .map(([day, { open, close }]) => (
        <div key={day} className="flex justify-between text-sm font-amiri">
          <span>{day}</span>
          <span>{`${open}–${close}`}</span>
        </div>
      ));
  };

  const getOpenHoursPercentage = (hours) => {
    if (!hours) return 0;
    const openDays = Object.values(hours).filter(({ isOpen }) => isOpen).length;
    return (openDays / 7) * 100;
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-r from-${theme.colors.secondary} to-${theme.colors.background} p-6 rounded-xl shadow-lg mb-6 border border-${theme.colors.primary}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-${theme.colors.primary} hover:text-${theme.colors.accent} duration-200`}
          >
            {isCollapsed ? <ChevronDown /> : <ChevronUp />}
          </motion.button>
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyUp={(e) => {
                if(e.key === 'Enter') {
                    handleSaveEdit()
                }
              }}
              className={`p-2 border bg-${theme.colors.background} border-${theme.colors.primary} text-${theme.colors.accent} rounded-lg focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary}`}
            />
          ) : (
            <h3 className={`text-xl font-semibold text-${theme.colors.primary}`}>
              {salon.name}
            </h3>
          )}
        </div>
        <div className="flex space-x-3 space-x-reverse">
          {isEditing ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSaveEdit}
              className="text-successGreen flex items-center"
            >
              ذخیره
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(true)}
              className={`text-${theme.colors.primary} hover:text-${theme.colors.accent} duration-200`}
            >
              <Edit size={20} />
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onEditWorkHours(salon.id)}
            className={`text-${theme.colors.primary} hover:text-${theme.colors.accent} duration-200`}
          >
            <Clock size={20} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onDeleteSalon(salon.id)}
            className="text-errorRed hover:text-beige"
          >
            <Trash2 size={20} />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className={`text-sm font-semibold text-${theme.colors.primary}`}>
                ساعات کاری:
              </h4>
              <div className={`bg-${theme.colors.background} text-${theme.colors.accent} p-2 rounded-lg w-1/2`}>
                {formatWorkHours(salon.workHours)}
              </div>
            </div>
            <div>
              <h4 className={`text-sm font-semibold text-${theme.colors.primary} mb-2`}>
                پیش‌نمایش برنامه:
              </h4>
              <div className="bg-lightGray h-4 rounded-full relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${getOpenHoursPercentage(salon.workHours)}%`,
                  }}
                  className={`bg-${theme.colors.primary} h-full rounded-full`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
