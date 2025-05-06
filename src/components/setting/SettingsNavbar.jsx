import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'support', label: 'تنظیمات امنیت و پشتیبانی' },
  { id: 'lockers', label: 'مدیریت کمدها' },
  { id: 'services', label: 'مدیریت خدمات و قیمت‌ها' },
  { id: 'admin', label: 'تنظیمات دسترسی و مدیریت' },
  { id: 'devices', label: 'اتصال و مدیریت دستگاه‌ها' },
  { id: 'gyms', label: 'تنظیمات سالن و درگاه‌ها' },
];

export default function SettingsNavbar({ currentTab, onChange }) {
  return (
    <div className="w-full overflow-x-auto mb-6">
      <div className="flex gap-2 md:gap-4 rounded-xl bg-beige p-2 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              currentTab === tab.id
                ? 'bg-darkBlue text-offWhite'
                : 'text-darkBlue hover:bg-hoverBeige'
            }`}
          >
            {currentTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-darkBlue -z-10"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
