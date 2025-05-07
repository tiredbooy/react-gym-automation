import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, ChevronUp, Users, Calendar, AlertCircle } from "lucide-react";

export default function SalonForm({ onAddSalon }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [schedules, setSchedules] = useState([
    { start: "", end: "", days: [], type: "recurring", specificDate: "" },
  ]);
  const [capacity, setCapacity] = useState("");
  const [capacityAlertThreshold, setCapacityAlertThreshold] = useState("");
  const [accessRules, setAccessRules] = useState({
    membershipTiers: [],
    gender: "",
    minAge: "",
  });
  const [isHolidayClosed, setIsHolidayClosed] = useState(false);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState([]);
  const [error, setError] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const daysOfWeek = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

  const validateSchedule = (schedule) => {
    if (schedule.type === "recurring" && (!schedule.start || !schedule.end || !schedule.days.length)) {
      return "لطفاً زمان شروع، پایان و روزها را برای برنامه تکراری وارد کنید";
    }
    if (schedule.type === "one-off" && (!schedule.start || !schedule.end || !schedule.specificDate)) {
      return "لطفاً زمان شروع، پایان و تاریخ را برای برنامه یک‌باره وارد کنید";
    }
    if (schedule.start >= schedule.end) {
      return "زمان پایان باید بعد از زمان شروع باشد";
    }
    return null;
  };

  const checkConflicts = (newSchedules) => {
    for (let i = 0; i < newSchedules.length; i++) {
      for (let j = i + 1; j < newSchedules.length; j++) {
        const s1 = newSchedules[i];
        const s2 = newSchedules[j];
        if (s1.type === "one-off" || s2.type === "one-off") continue; // Skip one-off for now
        const commonDays = s1.days.filter((d) => s2.days.includes(d));
        if (commonDays.length && !(s1.end <= s2.start || s2.end <= s1.start)) {
          return `تداخل در ${commonDays.join("، ")} بین ${s1.start}–${s1.end} و ${s2.start}–${s2.end}`;
        }
      }
    }
    return null;
  };

  const handleAddSchedule = () => {
    setSchedules([...schedules, { start: "", end: "", days: [], type: "recurring", specificDate: "" }]);
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const handleDayToggle = (index, day) => {
    const newSchedules = [...schedules];
    const days = newSchedules[index].days;
    newSchedules[index].days = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    setSchedules(newSchedules);
  };

  const handleRemoveSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleAddMaintenance = () => {
    setMaintenanceSchedules([...maintenanceSchedules, { date: "", start: "", end: "" }]);
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
    if (!name) {
      setError("لطفاً نام سالن را وارد کنید");
      return;
    }
    for (const schedule of schedules) {
      const validationError = validateSchedule(schedule);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    const conflictError = checkConflicts(schedules);
    if (conflictError) {
      setError(conflictError);
      return;
    }
    for (const maint of maintenanceSchedules) {
      if (!maint.date || !maint.start || !maint.end || maint.start >= maint.end) {
        setError("لطفاً برنامه نگهداری را به درستی وارد کنید");
        return;
      }
    }
    onAddSalon({
      name,
      schedules,
      capacity: capacity ? parseInt(capacity) : null,
      capacityAlertThreshold: capacityAlertThreshold ? parseInt(capacityAlertThreshold) : null,
      accessRules,
      isHolidayClosed,
      maintenanceSchedules,
      createdAt: new Date().toISOString(), // For analytics
    });
    // Reset form
    setName("");
    setSchedules([{ start: "", end: "", days: [], type: "recurring", specificDate: "" }]);
    setCapacity("");
    setCapacityAlertThreshold("");
    setAccessRules({ membershipTiers: [], gender: "", minAge: "" });
    setIsHolidayClosed(false);
    setMaintenanceSchedules([]);
    setError("");
    setIsFormOpen(false);
    setIsAdvancedOpen(false);
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
        افزودن سالن جدید
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
              افزودن سالن
            </h2>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-nearBlack">اطلاعات پایه</h3>
                <div>
                  <label className="block text-sm font-medium text-nearBlack mb-1">
                    نام سالن
                    <span className="text-gray-500 text-xs mr-1" title="نام منحصربه‌فرد سالن (مثال: بدنسازی)">
                      (?)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: سالن بدنسازی"
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isHolidayClosed}
                    onChange={(e) => setIsHolidayClosed(e.target.checked)}
                    className="h-4 w-4 text-darkBlue focus:ring-darkBlue"
                  />
                  <label className="text-sm text-nearBlack">بسته در تعطیلات رسمی</label>
                </div>
              </div>

              {/* Schedules */}
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-nearBlack flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  برنامه‌های زمانی
                </h3>
                {schedules.map((schedule, index) => (
                  <div key={index} className="border p-4 rounded-lg bg-offWhite">
                    <div className="flex gap-2 mb-2">
                      <select
                        value={schedule.type}
                        onChange={(e) => handleScheduleChange(index, "type", e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                      >
                        <option value="recurring">تکراری (هفتگی)</option>
                        <option value="one-off">یک‌باره (رویداد خاص)</option>
                      </select>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="time"
                        value={schedule.start}
                        onChange={(e) => handleScheduleChange(index, "start", e.target.value)}
                        placeholder="شروع"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                      />
                      <input
                        type="time"
                        value={schedule.end}
                        onChange={(e) => handleScheduleChange(index, "end", e.target.value)}
                        placeholder="پایان"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                      />
                    </div>
                    {schedule.type === "recurring" ? (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {daysOfWeek.map((day) => (
                          <button
                            key={day}
                            onClick={() => handleDayToggle(index, day)}
                            className={`px-2 py-1 rounded-lg text-sm ${
                              schedule.days.includes(day)
                                ? "bg-darkBlue text-offWhite"
                                : "bg-gray-200 text-nearBlack"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-nearBlack mb-1">
                          تاریخ
                        </label>
                        <input
                          type="date"
                          value={schedule.specificDate}
                          onChange={(e) =>
                            handleScheduleChange(index, "specificDate", e.target.value)
                          }
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                        />
                      </div>
                    )}
                    {schedules.length > 1 && (
                      <button
                        onClick={() => handleRemoveSchedule(index)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        حذف برنامه
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddSchedule}
                  className="text-darkBlue text-sm hover:underline flex items-center gap-1"
                >
                  <Calendar className="w-4 h-4" />
                  افزودن برنامه زمانی دیگر
                </button>
              </div>

              {/* Access Rules */}
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-nearBlack flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  قوانین دسترسی (اختیاری)
                </h3>
                <div>
                  <label className="block text-sm font-medium text-nearBlack mb-1">
                    سطح عضویت
                    <span
                      className="text-gray-500 text-xs mr-1"
                      title="سطوح عضویت مجاز برای دسترسی به این سالن"
                    >
                      (?)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["پایه", "پرمیوم", "VIP"].map((tier) => (
                      <button
                        key={tier}
                        onClick={() =>
                          setAccessRules({
                            ...accessRules,
                            membershipTiers: accessRules.membershipTiers.includes(tier)
                              ? accessRules.membershipTiers.filter((t) => t !== tier)
                              : [...accessRules.membershipTiers, tier],
                          })
                        }
                        className={`px-2 py-1 rounded-lg text-sm ${
                          accessRules.membershipTiers.includes(tier)
                            ? "bg-darkBlue text-offWhite"
                            : "bg-gray-200 text-nearBlack"
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-nearBlack mb-1">
                    جنسیت
                  </label>
                  <select
                    value={accessRules.gender}
                    onChange={(e) => setAccessRules({ ...accessRules, gender: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                  >
                    <option value="">همه</option>
                    <option value="مرد">مرد</option>
                    <option value="زن">زن</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-nearBlack mb-1">
                    حداقل سن
                  </label>
                  <input
                    type="number"
                    value={accessRules.minAge}
                    onChange={(e) => setAccessRules({ ...accessRules, minAge: e.target.value })}
                    placeholder="مثال: 16"
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="w-full p-2 bg-gray-200 text-nearBlack rounded-lg flex items-center justify-between"
                >
                  <span className="text-sm font-semibold">تنظیمات پیشرفته</span>
                  {isAdvancedOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <AnimatePresence>
                  {isAdvancedOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 mt-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-nearBlack mb-1">
                          ظرفیت (اختیاری)
                          <span
                            className="text-gray-500 text-xs mr-1"
                            title="حداکثر تعداد افراد مجاز در سالن"
                          >
                            (?)
                          </span>
                        </label>
                        <input
                          type="number"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          placeholder="مثال: 50"
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-nearBlack mb-1">
                          آستانه هشدار ظرفیت (اختیاری)
                          <span
                            className="text-gray-500 text-xs mr-1"
                            title="تعداد افرادی که باعث ارسال هشدار شلوغی می‌شود"
                          >
                            (?)
                          </span>
                        </label>
                        <input
                          type="number"
                          value={capacityAlertThreshold}
                          onChange={(e) => setCapacityAlertThreshold(e.target.value)}
                          placeholder="مثال: 40"
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-nearBlack">
                          برنامه‌های نگهداری (اختیاری)
                        </label>
                        {maintenanceSchedules.map((maint, index) => (
                          <div key={index} className="border p-4 rounded-lg bg-offWhite">
                            <div className="flex gap-2 mb-2">
                              <input
                                type="date"
                                value={maint.date}
                                onChange={(e) =>
                                  handleMaintenanceChange(index, "date", e.target.value)
                                }
                                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                              />
                            </div>
                            <div className="flex gap-2 mb-2">
                              <input
                                type="time"
                                value={maint.start}
                                onChange={(e) =>
                                  handleMaintenanceChange(index, "start", e.target.value)
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Schedule Preview */}
              {schedules.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-nearBlack mb-2">پیش‌نمایش برنامه</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-sm">
                        <strong>{day}:</strong>
                        {schedules
                          .filter(
                            (s) =>
                              (s.type === "recurring" && s.days.includes(day)) ||
                              (s.type === "one-off" &&
                                new Date(s.specificDate).toLocaleDateString("fa-IR") ===
                                  new Date().toLocaleDateString("fa-IR"))
                          )
                          .map((s, i) => (
                            <p key={i}>
                              {s.start}–{s.end}
                              {s.type === "one-off" && ` (${s.specificDate})`}
                            </p>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex-1 p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  افزودن سالن
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