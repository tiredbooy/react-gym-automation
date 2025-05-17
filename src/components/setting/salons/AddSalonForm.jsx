import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

import { useTheme } from "../../../context/ThemeContext";


export default function AddSalonForm ({ onAddSalon }) {
  const [name, setName] = useState("");

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("نام سالن الزامی است");
      return;
    }
    onAddSalon({ name });
    setName("");
    toast.success("سالن با موفقیت اضافه شد");
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-gradient-to-br from-${theme.colors.secondary} to-${theme.colors.background} p-6 rounded-xl shadow-lg mb-8`}
    >
      <h2 className={`text-2xl font-semibold text-${theme.colors.primary} mb-4 flex items-center`}>
        <Calendar className="ml-2" /> افزودن سالن جدید
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className={`block text-${theme.colors.accent} mb-1`}
            htmlFor="salonName"
          >
            نام سالن
          </label>
          <input
            id="salonName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 border bg-transparent border-${theme.colors.primary} rounded-lg focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary} duration-200`}
            placeholder="نام سالن را وارد کنید"
          />
        </div>
        <button
          type="submit"
          className={`bg-${theme.colors.primary} text-${theme.colors.background} font-bold px-6 py-2 rounded-lg hover:text-${theme.colors.background} transition-colors duration-200`}
        >
          افزودن
        </button>
      </form>
    </motion.div>
  );
};