import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { NavLink } from "react-router-dom";

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
  return (
    <div className="overflow-x-auto mb-6 flex justify-center">
      <div className="flex gap-2 w-max md:gap-4 rounded-xl bg-beige p-2 shadow-inner scroll-smooth">
        {tabs.map((tab) => (
          <NavLink
            to={`/settings/${tab.id}`}
            key={tab.id}
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-darkBlue text-offWhite"
                  : "text-darkBlue hover:bg-hoverBeige"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-darkBlue -z-10"
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                  />
                )}
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
