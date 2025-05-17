import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { useTheme } from "../../../context/ThemeContext";

export default function CoachForm ({ isOpen, coach, onSave, onClose }) {
  const [name, setName] = useState(coach?.name || "");
  const [contact, setContact] = useState(coach?.contact || "");
  const [specialty, setSpecialty] = useState(coach?.specialty || "بدنسازی");
  const [priceProgram, setPriceProgram] = useState(coach?.priceProgram || null);
  const [pricePrivate, setPricePrivate] = useState(coach?.pricePrivate || null);
  const [shift, setShift] = useState(coach?.shift || "صبح");

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      toast.error("نام و شماره تماس الزامی است");
      return;
    }
    onSave({
      id: coach?.id || Date.now(),
      name,
      contact,
      specialty,
      priceProgram,
      pricePrivate,
      shift,
      clients: coach?.clients || [],
    });

    setName("");
    setContact("");
    setSpecialty("");
    setPriceProgram(null);
    setPricePrivate(null);
    setShift("صبح");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-nearBlack bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        className={`bg-${theme.colors.background} p-8 rounded-2xl shadow-2xl w-full max-w-lg`}
      >
        <h2 className={`text-3xl font-bold text-${theme.colors.primary} mb-6`}>
          {coach ? "ویرایش مربی" : "افزودن مربی جدید"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-${theme.colors.accent} mb-2 text-lg`}>
              نام
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 bg-${theme.colors.secondary} border border-${theme.colors.primary} rounded-xl focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary}/50 text-${theme.colors.accent} placeholder-gray-400 transition-all`}
              placeholder="نام مربی"
            />
          </div>
          <div>
            <label className={`block text-${theme.colors.accent} mb-2 text-lg`}>
              شماره تماس
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={`w-full p-3 bg-${theme.colors.secondary} border border-${theme.colors.primary} rounded-xl focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary}/50 text-${theme.colors.accent} placeholder-gray-400 transition-all`}
              placeholder="09123456789"
            />
          </div>
          <div>
            <label className={`block text-${theme.colors.accent} mb-2 text-lg`}>
              تخصص
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className={`w-full p-3 bg-${theme.colors.secondary} border border-${theme.colors.primary} rounded-xl focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary}/60 text-${theme.colors.accent} transition-all`}
            >
              <option value="bodyBuilding">بدنسازی</option>
              <option value="yoga">یوگا</option>
              <option value="crossfit">کراسفیت</option>
              <option value="trx">تی ار ایکس</option>
            </select>
          </div>
          <div>
            <label className={`block text-${theme.colors.accent} mb-2 text-lg`}>
              قیمت برنامه
            </label>
            <input
              type="number"
              value={priceProgram}
              onChange={(e) => setPriceProgram(e.target.value)}
              className={`w-full p-3 bg-${theme.colors.secondary} border border-${theme.colors.primary} rounded-xl focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary}/50 text-${theme.colors.accent} placeholder-gray-400 transition-all`}
              placeholder="مثال: 200,000"
            />
          </div>
          <div>
            <label className={`block text-${theme.colors.accent} mb-2 text-lg`}>
              قیمت مربی خصوصی
            </label>
            <input
              type="number"
              value={pricePrivate}
              onChange={(e) => setPricePrivate(e.target.value)}
              className={`w-full p-3 bg-${theme.colors.secondary} border border-${theme.colors.primary} rounded-xl focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary}/50 text-${theme.colors.accent} placeholder-gray-400 transition-all`}
              placeholder="مثال: 500,000 "
            />
          </div>
          <div>
            <label className={`block text-${theme.colors.accent} mb-2 text-lg`}>
              شیفت کاری
            </label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className={`w-full p-3 bg-${theme.colors.secondary} border border-${theme.colors.primary} rounded-xl focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary}/60 text-${theme.colors.accent} transition-all`}
            >
              <option value="morning">صبح</option>
              <option value="evening">بعدازظهر</option>
              <option value="night">شب</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 bg-${theme.colors.accent} text-${theme.colors.background} font-semibold rounded-xl hover:bg-${theme.colors.accent}/70 transition-all text-lg duration-200`}
            >
              لغو
            </button>
            <button
              type="submit"
              className={`px-6 py-3 bg-${theme.colors.primary} text-${theme.colors.background} rounded-xl hover:bg-${theme.colors.primary}/80 transition-all text-lg duration-200`}
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};