import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import toast, { Toaster } from "react-hot-toast";

// WorkHoursModal Component
const WorkHoursModal = ({ isOpen, onClose, onSave, salonId, initialHours }) => {
  const [days, setDays] = useState(
    initialHours || {
      شنبه: { open: "06:00", close: "23:30", isOpen: true },
      یکشنبه: { open: "06:00", close: "23:30", isOpen: true },
      دوشنبه: { open: "06:00", close: "23:30", isOpen: true },
      سه‌شنبه: { open: "06:00", close: "23:30", isOpen: true },
      چهارشنبه: { open: "06:00", close: "23:30", isOpen: true },
      پنجشنبه: { open: "06:30", close: "21:00", isOpen: true },
      جمعه: { open: "10:00", close: "14:00", isOpen: false },
    }
  );

  const handleTimeChange = (day, field, value) => {
    setDays((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleToggleDay = (day) => {
    setDays((prev) => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  };

  const applyToWeekdays = () => {
    const weekdayHours = days["دوشنبه"];
    setDays((prev) => ({
      ...prev,
      یکشنبه: weekdayHours,
      دوشنبه: weekdayHours,
      سه‌شنبه: weekdayHours,
      چهارشنبه: weekdayHours,
    }));
    toast.success("ساعات کاری به روزهای هفته اعمال شد");
  };

  const handleSave = () => {
    for (const [day, { open, close, isOpen }] of Object.entries(days)) {
      if (isOpen && open >= close) {
        toast.error(`ساعت پایان باید بعد از ساعت شروع باشد برای ${day}`);
        return;
      }
    }
    onSave(salonId, days);
    toast.success("ساعات کاری ذخیره شد");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-nearBlack bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-gradient-to-br from-white to-beige p-6 rounded-xl shadow-2xl max-w-lg w-full"
          >
            <h2 className="text-2xl font-semibold text-darkBlue mb-4 font-amiri flex items-center">
              <Clock className="ml-2" /> تنظیم ساعات کاری
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.keys(days).map((day) => (
                <motion.div
                  key={day}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * Object.keys(days).indexOf(day) }}
                  className="flex items-center space-x-4 space-x-reverse bg-lightGray bg-opacity-50 p-2 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={days[day].isOpen}
                    onChange={() => handleToggleDay(day)}
                    className="h-5 w-5 text-darkBlue rounded"
                  />
                  <span className="w-24 text-nearBlack font-amiri">{day}</span>
                  <input
                    type="time"
                    value={days[day].open}
                    onChange={(e) =>
                      handleTimeChange(day, "open", e.target.value)
                    }
                    disabled={!days[day].isOpen}
                    className="p-2 border bg-beige border-lightGray rounded focus:outline-none focus:ring-2 focus:ring-darkBlue font-amiri"
                  />
                  <span className="text-nearBlack font-amiri">تا</span>
                  <input
                    type="time"
                    value={days[day].close}
                    onChange={(e) =>
                      handleTimeChange(day, "close", e.target.value)
                    }
                    disabled={!days[day].isOpen}
                    className="p-2 border bg-beige border-lightGray rounded focus:outline-none focus:ring-2 focus:ring-darkBlue font-amiri"
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={applyToWeekdays}
                className="px-4 py-2 bg-beige text-nearBlack rounded-lg hover:bg-darkBlue hover:text-offWhite transition-colors font-amiri"
              >
                اعمال به روزهای هفته
              </button>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-lightGray text-nearBlack rounded-lg hover:bg-beige transition-colors font-amiri"
                >
                  لغو
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-darkBlue text-offWhite rounded-lg hover:bg-beige hover:text-nearBlack transition-colors font-amiri"
                >
                  ذخیره
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// AddSalonForm Component
const AddSalonForm = ({ onAddSalon }) => {
  const [name, setName] = useState("");

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
      className="bg-gradient-to-br from-white to-beige p-6 rounded-xl shadow-lg mb-8"
    >
      <h2 className="text-2xl font-semibold text-darkBlue mb-4 font-amiri flex items-center">
        <Calendar className="ml-2" /> افزودن سالن جدید
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-nearBlack mb-1 font-amiri"
            htmlFor="salonName"
          >
            نام سالن
          </label>
          <input
            id="salonName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border bg-offWhite border-lightGray rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue font-amiri"
            placeholder="نام سالن را وارد کنید"
          />
        </div>
        <button
          type="submit"
          className="bg-darkBlue text-offWhite px-6 py-2 rounded-lg hover:bg-beige hover:text-nearBlack transition-colors font-amiri"
        >
          افزودن
        </button>
      </form>
    </motion.div>
  );
};

// SalonCard Component
const SalonCard = ({ salon, onEditSalon, onDeleteSalon, onEditWorkHours }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(salon.name);
  const [isCollapsed, setIsCollapsed] = useState(true);

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
      className="bg-gradient-to-r from-white to-beige p-6 rounded-xl shadow-lg mb-6 border border-lightGray"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-darkBlue hover:text-beige"
          >
            {isCollapsed ? <ChevronDown /> : <ChevronUp />}
          </motion.button>
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="p-2 border bg-offWhite border-lightGray rounded-lg font-amiri focus:outline-none focus:ring-2 focus:ring-darkBlue"
            />
          ) : (
            <h3 className="text-xl font-semibold text-darkBlue font-amiri">
              {salon.name}
            </h3>
          )}
        </div>
        <div className="flex space-x-3 space-x-reverse">
          {isEditing ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSaveEdit}
              className="text-successGreen font-amiri flex items-center"
            >
              ذخیره
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(true)}
              className="text-darkBlue hover:text-beige"
            >
              <Edit size={20} />
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onEditWorkHours(salon.id)}
            className="text-darkBlue hover:text-beige"
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
              <h4 className="text-sm font-semibold text-darkBlue font-amiri">
                ساعات کاری:
              </h4>
              <div className="bg-lightGray p-2 rounded-lg w-1/2">
                {formatWorkHours(salon.workHours)}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-darkBlue font-amiri mb-2">
                پیش‌نمایش برنامه:
              </h4>
              <div className="bg-lightGray h-4 rounded-full relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${getOpenHoursPercentage(salon.workHours)}%`,
                  }}
                  className="bg-darkBlue h-full rounded-full"
                />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-darkBlue font-amiri mb-2">
                تقویم:
              </h4>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                readOnly
                className="bg-offWhite p-2 rounded-lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main SalonSettings Component
const SalonSettings = () => {
  const [salons, setSalons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSalonId, setSelectedSalonId] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);

  const addSalon = (salon) => {
    if (salons.some((s) => s.name === salon.name)) {
      toast.error("سالن با این نام قبلاً وجود دارد");
      return;
    }
    setSalons([...salons, { ...salon, id: Date.now(), workHours: null }]);
  };

  const editSalon = (id, name) => {
    if (salons.some((s) => s.name === name && s.id !== id)) {
      toast.error("سالن با این نام قبلاً وجود دارد");
      return;
    }
    setSalons(
      salons.map((salon) => (salon.id === id ? { ...salon, name } : salon))
    );
  };

  const deleteSalon = (id) => {
    const salon = salons.find((s) => s.id === id);
    setLastDeleted(salon);
    setSalons(salons.filter((salon) => salon.id !== id));
    toast(
      <div className="flex items-center space-x-2 space-x-reverse font-amiri">
        <span>سالن حذف شد</span>
        <button
          onClick={() => {
            setSalons([...salons, lastDeleted]);
            toast.dismiss();
          }}
          className="underline"
        >
          بازگشت
        </button>
      </div>,
      { duration: 5000, style: { background: "#4CAF50", color: "#F1EFEC" } }
    );
    if (selectedSalonId === id) setSelectedSalonId(null);
  };

  const saveWorkHours = (salonId, workHours) => {
    setSalons(
      salons.map((salon) =>
        salon.id === salonId ? { ...salon, workHours } : salon
      )
    );
  };

  const openWorkHoursModal = (id) => {
    setSelectedSalonId(id);
    setModalOpen(true);
  };

  return (
    <div
      className="bg-gradient-to-b from-offWhite to-beige min-h-screen p-8 font-amiri"
      dir="rtl"
    >
      <Toaster position="bottom-left" />
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold text-darkBlue mb-8 text-center"
      >
        تنظیمات سالن‌ها
      </motion.h1>
      <div className="max-w-5xl mx-auto space-y-8">
        <AddSalonForm onAddSalon={addSalon} />
        <div className="space-y-4">
          {salons.map((salon) => (
            <SalonCard
              key={salon.id}
              salon={salon}
              onEditSalon={editSalon}
              onDeleteSalon={deleteSalon}
              onEditWorkHours={openWorkHoursModal}
            />
          ))}
        </div>
        <WorkHoursModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={saveWorkHours}
          salonId={selectedSalonId}
          initialHours={salons.find((s) => s.id === selectedSalonId)?.workHours}
        />
      </div>
    </div>
  );
};

export default SalonSettings;
