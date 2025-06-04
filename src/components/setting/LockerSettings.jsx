import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  Plus,
  ServerCog,
  Building2,
  Boxes,
  Info,
  MoreVertical,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";

import { easeIn, motion } from "framer-motion";

export default function LockerSettings() {
  const [salons, setSalons] = useState([
    {
      id: 1,
      name: "سالن ۱",
      lockers: generateLockers(50),
      hardware: "Locker Device 1",
      status: "فعال",
    },
    {
      id: 2,
      name: "سالن ۲",
      lockers: generateLockers(30),
      hardware: "Locker Device 2",
      status: "فعال",
    },
  ]);

  const [newSalon, setNewSalon] = useState("");
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [addLockerCount, setAddLockerCount] = useState("");
  const [prefix, setPrefix] = useState("");
  const [hardwareList] = useState([
    "Locker Device 1",
    "Locker Device 2",
    "Locker Device 3",
  ]);

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  function generateLockers(count, startFrom = 1, prefix = "") {
    return Array.from({ length: count }, (_, i) => ({
      number: `${prefix}${i + startFrom}`,
      status: "سالم",
    }));
  }

  const handleAddSalon = () => {
    if (!newSalon) return alert("نام سالن را وارد کنید");
    setSalons([
      ...salons,
      {
        id: Date.now(),
        name: newSalon,
        lockers: [],
        hardware: null,
        status: "فعال",
      },
    ]);
    setNewSalon("");
    alert(`سالن ${newSalon} اضافه شد ✅`);
  };

  const handleAddLockers = () => {
    if (!selectedSalon || !addLockerCount)
      return alert("انتخاب سالن و تعداد الزامی است");
    setSalons(
      salons.map((s) => {
        if (s.id === selectedSalon) {
          const newStart = s.lockers.length + 1;
          const newLockers = generateLockers(
            parseInt(addLockerCount),
            newStart,
            prefix
          );
          return { ...s, lockers: [...s.lockers, ...newLockers] };
        }
        return s;
      })
    );
    alert(`تعداد ${addLockerCount} کمد اضافه شد ✅`);
    setAddLockerCount("");
    setPrefix("");
  };

  const handleHardwareChange = (salonId, hardware) => {
    setSalons(salons.map((s) => (s.id === salonId ? { ...s, hardware } : s)));
  };

  const toggleSalonStatus = (salonId) => {
    setSalons(
      salons.map((s) =>
        s.id === salonId
          ? { ...s, status: s.status === "فعال" ? "غیرفعال" : "فعال" }
          : s
      )
    );
  };

  const deleteSalon = (salonId) => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید سالن را حذف کنید؟")) {
      setSalons(salons.filter((s) => s.id !== salonId));
    }
  };

  const toggleLockerStatus = (salonId, lockerNumber) => {
    setSalons(
      salons.map((s) => {
        if (s.id === salonId) {
          const updatedLockers = s.lockers.map((l) =>
            l.number === lockerNumber
              ? { ...l, status: l.status === "سالم" ? "خراب" : "سالم" }
              : l
          );
          return { ...s, lockers: updatedLockers };
        }
        return s;
      })
    );
  };

  return (
    <div
      className={`bg-${theme.colors.background} p-6 rounded-2xl shadow-lg text-${theme.colors.primary} max-w-6xl mx-auto`}
    >
      <motion.h2
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`text-2xl font-bold mb-8 text-right border-b-2 border-${theme.colors.secondary} pb-4`}
      >
        مدیریت تنظیمات کمد‌ها
      </motion.h2>

      {/* Add Salon */}
      <Card title="افزودن سالن جدید" icon={<Building2 size={24} />}>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="نام سالن جدید (مثلاً سالن ۳)"
            className={`flex-1 p-3 rounded-xl border border-${theme.colors.primary} bg-${theme.colors.background} text-right shadow-sm outline-none focus:ring-2 focus:ring-${theme.colors.primary}/30`}
            value={newSalon}
            onChange={(e) => setNewSalon(e.target.value)}
          />
          <button
            onClick={handleAddSalon}
            className={`flex items-center gap-2 bg-${theme.colors.primary} text-${theme.colors.background} px-4 py-2 rounded-xl hover:bg-opacity-80 transition shadow`}
          >
            <Plus size={18} />
            افزودن
          </button>
        </div>
      </Card>

      {/* Add Lockers */}
      <Card title="افزودن گروهی کمد" icon={<Boxes size={24} />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <select
            className={`p-3 rounded-xl border border-${theme.colors.primary} bg-${theme.colors.background} text-right shadow-sm focus:ring-2 focus:ring-${theme.colors.primary}/30`}
            value={selectedSalon || ""}
            onChange={(e) => setSelectedSalon(Number(e.target.value))}
          >
            <option value="">انتخاب سالن</option>
            {salons.map((salon) => (
              <option key={salon.id} value={salon.id}>
                {salon.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="پیشوند (اختیاری)"
            className={`p-3 rounded-xl border border-${theme.colors.primary} bg-${theme.colors.background} text-right shadow-sm outline-none focus:ring-2 focus:ring-${theme.colors.primary}/30`}
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          />
          <input
            type="number"
            placeholder="تعداد کمد جدید"
            className={`p-3 rounded-xl border border-${theme.colors.primary} bg-${theme.colors.background} text-right shadow-sm outline-none focus:ring-2 focus:ring-${theme.colors.primary}/30`}
            value={addLockerCount}
            onChange={(e) => setAddLockerCount(e.target.value)}
          />
          <button
            onClick={handleAddLockers}
            className={`flex items-center justify-center gap-2 bg-${theme.colors.primary} text-${theme.colors.background} px-4 py-2 rounded-xl hover:bg-opacity-80 transition shadow`}
          >
            <Plus size={18} />
            افزودن
          </button>
        </div>
        {selectedSalon && (
          <p className={`text-sm text-${theme.colors.accent} mt-2 text-right`}>
            {`تعداد فعلی: ${
              salons.find((s) => s.id === selectedSalon)?.lockers.length
            } کمد`}
          </p>
        )}
      </Card>

      {/* Hardware & Lockers */}
      {salons.map((salon) => (
        <motion.div
          initial={{ y : 500 , opacity : 0 }}
          animate={{ y : 0 , opacity : 1 }}
          transition={{ ease: easeIn , duration : 0.2}}
          key={salon.id}
          className={`bg-${theme.colors.secondary} p-5 rounded-2xl shadow-sm hover:shadow-md transition mt-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1 text-right">
              <p className="flex items-center gap-2 text-lg font-bold">
                {salon.name}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    salon.status === "فعال"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {salon.status}
                </span>
              </p>
              <p className={`text-sm text-gray-600 flex items-center gap-1`}>
                <Info size={14} /> تعداد کل کمد‌ها: {salon.lockers.length}
              </p>
              <p className="text-xs text-gray-500">
                خراب: {salon.lockers.filter((l) => l.status === "خراب").length}
              </p>
            </div>
            <div className="relative">
              <MoreVertical
                className="cursor-pointer hover:text-darkBlue"
                onClick={() => {
                  const action = window.prompt(
                    'وارد کنید: "deactivate" یا "delete"'
                  );
                  if (action === "deactivate") toggleSalonStatus(salon.id);
                  if (action === "delete") deleteSalon(salon.id);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {salon.lockers.map((locker) => (
              <div
                key={locker.number}
                onClick={() => toggleLockerStatus(salon.id, locker.number)}
                className={`p-3 rounded-lg cursor-pointer flex flex-col items-center justify-center text-sm shadow-sm transition hover:scale-105 ${
                  locker.status === "سالم"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {locker.number}
                {locker.status === "سالم" ? (
                  <Check size={16} />
                ) : (
                  <AlertTriangle size={16} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Card({ children, title, icon }) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1], // material-style ease
      }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.99 }}
      className={`bg-${theme.colors.secondary}/10
                  backdrop-blur-sm
                  p-6 rounded-2xl mb-6 shadow-sm
                  hover:shadow-md
                  transition-all duration-300 ease-in-out`}
    >
      <div
        className={`flex items-center gap-3 mb-4 text-${theme.colors.primary}`}
      >
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className={`text-${theme.colors.primary}/80`}>{children}</div>
    </motion.div>
  );
}
