import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

const settingsList = [
  { label: "نام", key: "first_name" },
  { label: "نام خانوادگی", key: "last_name" },
  { label: "شماره تماس", key: "phone_num" },
  { label: "کد ملی", key: "nation_code" },
  { label: "تاریخ تولد", key: "birth_date" },
  { label: "جنسیت", key: "gender" },
  { label: "بیمه ورزشی", key: "insurance" },
  { label: "روش احراز هویت", key: "auth_method" },
];

function AddUserDefaultSetting() {
  const { activeTheme, themes } = useTheme();
  const [preferences, setPreferences] = useState({}); // Empty object to avoid errors
  const theme = themes[activeTheme];

  // Load preferences from local JSON server
  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch("http://localhost:3000/addUserpreference");
        const data = await res.json();
        setPreferences(data); // Set state directly with response data
      } catch (err) {
        console.error("Error loading preferences:", err);
      }
    }
    loadPreferences();
  }, []);

  // Toggle setting and update API
  const toggleSetting = (label) => {
    const setting = settingsList.find((item) => item.label === label);
    if (!setting) return;

    // Ensure all keys are included, with fallback to false if undefined
    const updatedPreferences = settingsList.reduce((acc, { key }) => ({
      ...acc,
      [key]: key === setting.key ? !preferences[key] : preferences[key] ?? false,
    }), {});

    setPreferences(updatedPreferences);

    fetch("http://localhost:3000/addUserpreference", {
      method: "PUT", // Replace entire object
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPreferences), // Send full object
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Updated successfully", data);
      })
      .catch((err) => {
        console.error("Update error:", err);
      });
  };

  return (
    <motion.div initial={{ x : 400 , opacity : 0 }} animate={{ x : 0 , opacity : 1  }} transition={{ type : 'spring' }} className={`flex flex-col w-full gap-6 p-4 shadow-md bg-gradient-to-l from-${theme.colors.secondary} rounded-xl`}>
      <h1 className={`font-bold text-2xl text-${theme.colors.accent} mb-2`}>
        تنظیمات ثبت نام کاربر
      </h1>

      <div className="flex flex-wrap w-full gap-4 px-2">
        {settingsList.map(({ label, key }) => {
          const isChecked = !!preferences[key]; // False if undefined

          return (
            <button
              key={label}
              onClick={() => toggleSetting(label)}
              className={`flex items-center gap-2 p-2 rounded-lg text-${theme.colors.accent} transition-colors duration-200`}
            >
              <div
                className={`w-5 h-5 border-${theme.colors.primary} border-2 rounded-full flex items-center justify-center ${
                  isChecked
                    ? `bg-${theme.colors.primary}`
                    : `border-${theme.colors.primary}`
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
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default AddUserDefaultSetting;