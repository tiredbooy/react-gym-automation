import { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../reusables/Button";

const settingsList = [
  "کد ملی",
  "شماره تماس",
  "تاریخ تولد",
  "جنسیت",
  "بیمه ورزشی",
  "روش احراز هویت",
];

function AddUserDefaultSetting() {
  const [checkedSettings, setCheckedSettings] = useState({});

  const toggleSetting = (label) => {
    setCheckedSettings((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="bg-gradiant-to-t shadow-md w-full p-4 rounded-xl flex flex-col gap-6">
      <h1 className="font-bold text-xl text-nearBlack">
        تنظیمات ثبت نام کاربر
      </h1>

      <div className="w-full px-2 flex flex-wrap gap-4">
        {settingsList.map((label) => {
          const isChecked = !!checkedSettings[label];

          return (
            <button
              key={label}
              onClick={() => toggleSetting(label)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:bg-hoverBeige transition font-bold"
            >
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors duration-200 
                                ${
                                  isChecked
                                    ? "bg-darkBlue border-darkBlue"
                                    : "border-nearBlack"
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
              <span className="text-nearBlack text-sm">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AddUserDefaultSetting;
