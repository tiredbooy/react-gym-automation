import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const tabs = [
  { id: "default", label: "تنظیمات پیش فرض" },
  { id: "support", label: "تنظیمات توکن" },
  { id: "lockers", label: "مدیریت کمدها" },
  { id: "services", label: "مدیریت خدمات و قیمت‌ها" },
  { id: "admin", label: "تنظیمات دسترسی و مدیریت" },
  { id: "devices", label: "اتصال و مدیریت دستگاه‌ها" },
  { id: "salons", label: "تنظیمات سالن و درگاه‌ها" },
  { id: "coaches", label: "مدیریت مربی ها" },
];

export default function SettingsNavbar() {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];


  return (
    <motion.div initial={{ x : -600 , opacity : 0 }} animate={{ x : 0 , opacity : 1 }} className="flex justify-center mb-6 overflow-x-auto">
      <div
        className={`flex gap-2 w-max md:gap-4 rounded-xl bg-${
          theme.colors.secondary
        } p-2 shadow-inner scroll-smooth`}
      >
        {tabs.map((tab) => (
          <NavLink
            to={`/settings/${tab.id}`}
            key={tab.id}
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? `bg-${theme.colors.primary} text-${theme.colors.secondary}`
                  : `text-${theme.colors.accent} hover:bg-hoverBeige`
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-xl bg-${
                      theme.colors.primary
                    } -z-10`}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                  />
                )}
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.div>
  );
}
