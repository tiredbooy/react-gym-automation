import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DoorOpen, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function GatewayForm({ onAddGateway, salons, devices }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [salonId, setSalonId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [direction, setDirection] = useState("bidirectional");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState([]);
  const [error, setError] = useState("");

  const handleAddMaintenance = () => {
    setMaintenanceSchedules([
      ...maintenanceSchedules,
      { date: "", start: "", end: "" },
    ]);
  };

  const handleMaintenanceChange = (index, field, value) => {
    const newMaintenance = [...maintenanceSchedules];
    newMaintenance[index][field] = value;
    setMaintenanceSchedules(newMaintenance);
  };

  const handleRemoveMaintenance = (index) => {
    setMaintenanceSchedules(maintenanceSchedules.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !salonId || !deviceId) {
      setError("لطفاً نام، سالن و دستگاه را انتخاب کنید");
      return;
    }
    for (const maint of maintenanceSchedules) {
      if (
        !maint.date ||
        !maint.start ||
        !maint.end ||
        maint.start >= maint.end
      ) {
        setError("لطفاً برنامه نگهداری را به درستی وارد کنید");
        return;
      }
    }
    onAddGateway({
      name,
      salonId,
      deviceId,
      direction,
      isMaintenanceMode,
      maintenanceSchedules,
      status: "inactive",
      createdAt: new Date().toISOString(),
    });
    setName("");
    setSalonId("");
    setDeviceId("");
    setDirection("bidirectional");
    setIsMaintenanceMode(false);
    setMaintenanceSchedules([]);
    setError("");
    setIsFormOpen(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="w-full p-3 bg-darkBlue text-offWhite rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-blue-700"
      >
        {isFormOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
        افزودن درگاه جدید
      </motion.button>
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-beige p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-bold text-nearBlack mb-4 text-center">
              افزودن درگاه
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  نام درگاه
                  <span
                    className="text-gray-500 text-xs mr-1"
                    title="نام منحصربه‌فرد درگاه (مثال: ورودی اصلی)"
                  >
                    (?)
                  </span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: درگاه ورودی اصلی"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  سالن مرتبط
                </label>
                <select
                  value={salonId}
                  onChange={(e) => setSalonId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                >
                  <option value="">انتخاب سالن</option>
                  {salons.map((salon) => (
                    <option key={salon.id} value={salon.id}>
                      {salon.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  دستگاه مرتبط
                </label>
                <select
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                >
                  <option value="">انتخاب دستگاه</option>
                  {devices
                    .filter((d) => ["turnstile", "gate"].includes(d.type))
                    .map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.name} ({device.type})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  جهت‌گیری
                </label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                >
                  <option value="bidirectional">دو طرفه</option>
                  <option value="entry">فقط ورودی</option>
                  <option value="exit">فقط خروجی</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isMaintenanceMode}
                  onChange={(e) => setIsMaintenanceMode(e.target.checked)}
                  className="h-4 w-4 text-darkBlue focus:ring-darkBlue"
                />
                <label className="text-sm text-nearBlack">
                  حالت تعمیر و نگهداری
                </label>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-nearBlack">
                  برنامه‌های نگهداری (اختیاری)
                </label>
                {maintenanceSchedules.map((maint, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg bg-offWhite"
                  >
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-nearBlack mb-1">
                        تاریخ
                      </label>
                      <DatePicker
                        value={maint.date}
                        onChange={(date) =>
                          handleMaintenanceChange(
                            index,
                            "date",
                            date
                              ? date.toDate().toISOString().split("T")[0]
                              : ""
                          )
                        }
                        calendar={persian}
                        locale={persian_fa}
                        placeholder="انتخاب تاریخ"
                        containerStyle={{
                          width: "100%",
                        }}
                        inputClass="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                      />
                    </div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="time"
                        value={maint.start}
                        onChange={(e) =>
                          handleMaintenanceChange(
                            index,
                            "start",
                            e.target.value
                          )
                        }
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                      />
                      <input
                        type="time"
                        value={maint.end}
                        onChange={(e) =>
                          handleMaintenanceChange(index, "end", e.target.value)
                        }
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                      />
                    </div>
                    {maintenanceSchedules.length > 0 && (
                      <button
                        onClick={() => handleRemoveMaintenance(index)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        حذف برنامه نگهداری
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddMaintenance}
                  className="text-darkBlue text-sm hover:underline flex items-center gap-1"
                >
                  <Calendar className="w-4 h-4" />
                  افزودن برنامه نگهداری
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex-1 p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <DoorOpen className="w-5 h-5" />
                  افزودن درگاه
                </button>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 p-2 bg-gray-300 text-nearBlack rounded-lg hover:bg-hoverBeige"
                >
                  لغو
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
