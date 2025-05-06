import React, { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function ServiceSettings() {
  const [services, setServices] = useState([
    { id: 1, name: "کراسفیت", price: 14000000 },
    { id: 2, name: "یوگا", price: 9000000 },
    { id: 3, name: "بدنسازی", price: 12000000 },
  ]);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [editingId, setEditingId] = useState(null);

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
    <div className="bg-offWhite p-6 rounded-2xl shadow-md text-darkBlue">
      <h2 className="text-xl font-bold mb-4 text-right">
        مدیریت خدمات و قیمت‌ها
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="نام خدمت (مثلاً کراسفیت)"
          className="flex-1 p-3 rounded-xl border border-lightGray outline-none bg-beige text-right w-full md:w-auto"
          value={newService.name}
          onChange={(e) =>
            setNewService({ ...newService, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="قیمت (تومان)"
          className="flex-1 p-3 rounded-xl border border-lightGray outline-none bg-beige text-right w-full md:w-auto"
          value={newService.price}
          onChange={(e) =>
            setNewService({ ...newService, price: e.target.value })
          }
        />
        <button
          onClick={handleAddService}
          className="flex items-center gap-2 bg-darkBlue text-offWhite px-4 py-2 rounded-xl hover:bg-opacity-80 transition"
        >
          <Plus size={18} />
          افزودن خدمت
        </button>
      </div>

      <table className="w-full text-right bg-beige rounded-xl overflow-hidden">
        <thead className="bg-darkBlue text-offWhite">
          <tr>
            <th className="py-3 px-2">نام خدمت</th>
            <th className="py-3 px-2">قیمت (تومان)</th>
            <th className="py-3 px-2">عملیات</th>
          </tr>
        </thead>
        <tbody className="text-darkBlue divide-y divide-lightGray">
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-hoverBeige transition">
              <td className="py-3 px-2 font-bold">{service.name}</td>
              <td className="py-3 px-2">
                {editingId === service.id ? (
                  <input
                    type="number"
                    defaultValue={service.price}
                    className="p-2 rounded-xl border border-lightGray outline-none bg-offWhite w-32 text-right"
                    onBlur={(e) => handleEdit(service.id, e.target.value)}
                  />
                ) : (
                  `${service.price.toLocaleString()}`
                )}
              </td>
              <td className="py-3 px-2 flex gap-2 justify-center">
                <button
                  onClick={() => setEditingId(service.id)}
                  className="p-2 hover:bg-hoverBeige rounded-xl"
                  title="ویرایش قیمت"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 hover:bg-hoverBeige rounded-xl"
                  title="حذف خدمت"
                >
                  <Trash2 size={18} className="text-errorRed" />
                </button>
              </td>
            </tr>
          ))}
          {services.length === 0 && (
            <tr>
              <td colSpan="3" className="py-4 text-center text-gray-500">
                هیچ خدمتی ثبت نشده است.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
