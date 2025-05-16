import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const allPermissions = [
  "گزارش‌ها",
  "مدیریت خدمات",
  "مدیریت کاربران",
  "مدیریت کمدها",
  "پشتیبانی",
  "مدیریت سخت‌افزار",
  "تنظیمات سالن",
];

export default function RolePermissions({ role, onPermissionChange }) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {allPermissions.map((perm) => {
        const isChecked = role.permissions.includes(perm);

        return (
          <button
            key={perm}
            onClick={() => onPermissionChange(perm)}
            className={`flex items-center gap-2 p-2 rounded-lg text-${theme.colors.accent} transition-colors duration-200`}
          >
            <div
              className={`w-5 h-5 border-2 border-${
                theme.colors.primary
              } rounded-full flex items-center justify-center transition-colors duration-200 ${
                isChecked ? `bg-${theme.colors.primary}` : ""
              }`}
            >
              <AnimatePresence>
                {isChecked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className={`text-${theme.colors.accent} text-sm`}>
              {perm}
            </span>
          </button>
        );
      })}
    </div>
  );
}
