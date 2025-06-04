import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ServiceSettings() {
  const [services, setServices] = useState([
    { id: 1, name: "کراسفیت", price: 14000000 },
    { id: 2, name: "یوگا", price: 9000000 },
    { id: 3, name: "بدنسازی", price: 12000000 },
  ]);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const { activeTheme, themes } = useTheme();

  const theme = themes[activeTheme];

  const handleAddService = () => {
    if (!newService.name.trim() || !newService.price) {
      alert("لطفاً نام و قیمت را وارد کنید");
      return;
    }
    setServices([
      ...services,
      {
        id: Date.now(),
        name: newService.name,
        price: Number(newService.price),
      },
    ]);
    setNewService({ name: "", price: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید این خدمت را حذف کنید؟")) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  const handleEdit = (id, newPrice) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, price: Number(newPrice) } : s))
    );
    setEditingId(null);
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
        y: 20,
        clipPath: "inset(10% 50% 90% 50%)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        y: 20,
        clipPath: "inset(10% 50% 90% 50%)",
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className={`bg-gradient-to-bl from-${theme.colors.secondary} to-${theme.colors.secondary}/60 
              backdrop-blur-xl p-8 rounded-3xl shadow-2xl 
              text-${theme.colors.primary} transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
    >
      <h2 className="mb-4 text-xl font-bold text-right">
        مدیریت خدمات و قیمت‌ها
      </h2>

      <div className="flex flex-col items-center gap-2 mb-6 md:flex-row">
        <input
          type="text"
          placeholder="نام خدمت (مثلاً کراسفیت)"
          className={`flex-1 p-3 rounded-xl border border-${theme.colors.primary} outline-none bg-${theme.colors.secondary} text-right w-full md:w-auto`}
          value={newService.name}
          onChange={(e) =>
            setNewService({ ...newService, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="قیمت (تومان)"
          className={`flex-1 p-3 rounded-xl border border-${theme.colors.primary} outline-none bg-${theme.colors.secondary} text-right w-full md:w-auto`}
          value={newService.price}
          onChange={(e) =>
            setNewService({ ...newService, price: e.target.value })
          }
        />
        <button
          onClick={handleAddService}
          className={`flex items-center gap-2 bg-${theme.colors.primary} text-${theme.colors.background} font-bold px-4 py-2 rounded-xl hover:bg-opacity-80 transition`}
        >
          <Plus size={18} />
          افزودن خدمت
        </button>
      </div>

      <table
        className={`w-full text-right bg-${theme.colors.secondary} rounded-xl overflow-hidden`}
      >
        <thead
          className={`bg-${theme.colors.primary} text-${theme.colors.background}`}
        >
          <tr>
            <th className="px-2 py-3">نام خدمت</th>
            <th className="px-2 py-3">قیمت (تومان)</th>
            <th className="px-2 py-3">عملیات</th>
          </tr>
        </thead>
        <tbody
          className={`text-${theme.colors.primary} divide-y divide-${theme.colors.accent}`}
        >
          {services.map((service) => (
            <tr
              key={service.id}
              className={`hover:bg-${theme.colors.background}/30 transition`}
            >
              <td className="px-2 py-3 font-bold">{service.name}</td>
              <td className="px-2 py-3">
                {editingId === service.id ? (
                  <input
                    type="number"
                    defaultValue={service.price}
                    className={`p-2 rounded-xl border border-${theme.colors.primary} outline-none bg-${theme.colors.background} w-32 text-right`}
                    onBlur={(e) => handleEdit(service.id, e.target.value)}
                  />
                ) : (
                  `${service.price.toLocaleString()}`
                )}
              </td>
              <td className="flex justify-center gap-2 px-2 py-3">
                <button
                  onClick={() => setEditingId(service.id)}
                  className={`p-2 hover:bg-${theme.colors.secondary}/80 rounded-xl`}
                  title="ویرایش قیمت"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className={`p-2 hover:bg-${theme.colors.secondary}/80 rounded-xl`}
                  title="حذف خدمت"
                >
                  <Trash2 size={18} className="text-errorRed" />
                </button>
              </td>
            </tr>
          ))}
          {services.length === 0 && (
            <tr>
              <td
                colSpan="3"
                className={`py-4 text-center text-${theme.colors.accent}`}
              >
                هیچ خدمتی ثبت نشده است.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
