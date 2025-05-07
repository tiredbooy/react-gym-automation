import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Edit, Trash, Calendar } from "lucide-react";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function SalonList({
  salons,
  gateways,
  onUpdateSalon,
  onDeleteSalon,
}) {
  const [editingSalon, setEditingSalon] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "نامشخص";
    const date = new DateObject({
      date: new Date(dateStr),
      calendar: persian,
      locale: persian_fa,
    });
    return date.format("YYYY/MM/DD");
  };

  const handleEdit = (salon) => {
    setEditingSalon({ ...salon });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (
      !editingSalon.name ||
      editingSalon.schedules.some(
        (s) =>
          (s.type === "recurring" && (!s.start || !s.end || !s.days.length)) ||
          (s.type === "one-off" && (!s.start || !s.end || !s.specificDate))
      )
    ) {
      alert("لطفاً نام سالن و برنامه‌های زمانی معتبر وارد کنید");
      return;
    }
    const conflictError = checkConflicts(editingSalon.schedules);
    if (conflictError) {
      alert(conflictError);
      return;
    }
    onUpdateSalon(editingSalon);
    setEditingSalon(null);
  };

  const checkConflicts = (schedules) => {
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        const s1 = schedules[i];
        const s2 = schedules[j];
        if (s1.type === "one-off" || s2.type === "one-off") continue;
        const commonDays = s1.days.filter((d) => s2.days.includes(d));
        if (commonDays.length && !(s1.end <= s2.start || s2.end <= s1.start)) {
          return `تداخل در ${commonDays.join("، ")} بین ${s1.start}–${
            s1.end
          } و ${s2.start}–${s2.end}`;
        }
      }
    }
    return null;
  };

  const daysOfWeek = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنج‌شنبه",
    "جمعه",
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h3 className="text-lg font-bold text-nearBlack mb-4">لیست سالن‌ها</h3>
      {salons.length === 0 ? (
        <p className="text-nearBlack text-center">هیچ سالنی ثبت نشده است</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {salons.map((salon) => (
            <motion.div
              key={salon.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-beige rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-nearBlack">
                  {salon.name}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(salon)}
                    className="p-1 text-darkBlue hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "آیا مطمئن هستید که می‌خواهید این سالن را حذف کنید؟"
                        )
                      ) {
                        onDeleteSalon(salon.id);
                      }
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-nearBlack">
                <p className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  برنامه‌ها:
                </p>
                {salon.schedules.map((s, i) => (
                  <p key={i}>
                    {s.start}–{s.end}{" "}
                    {s.type === "recurring"
                      ? `(${s.days.join("، ")})`
                      : `(${formatDate(s.specificDate)})`}
                  </p>
                ))}
                {salon.capacity && (
                  <p className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    ظرفیت: {salon.capacity} نفر
                  </p>
                )}
                {salon.capacityAlertThreshold && (
                  <p>آستانه هشدار: {salon.capacityAlertThreshold} نفر</p>
                )}
                {salon.accessRules.membershipTiers.length > 0 && (
                  <p>
                    سطح عضویت: {salon.accessRules.membershipTiers.join("، ")}
                  </p>
                )}
                {salon.accessRules.gender && (
                  <p>جنسیت: {salon.accessRules.gender}</p>
                )}
                {salon.accessRules.minAge && (
                  <p>حداقل سن: {salon.accessRules.minAge}</p>
                )}
                {salon.isHolidayClosed && <p>بسته در تعطیلات رسمی</p>}
                {salon.maintenanceSchedules?.length > 0 && (
                  <div>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      نگهداری:
                    </p>
                    {salon.maintenanceSchedules.map((m, i) => (
                      <p key={i}>
                        {formatDate(m.date)}، {m.start}–{m.end}
                      </p>
                    ))}
                  </div>
                )}
                <p>
                  درگاه‌ها:{" "}
                  {gateways.filter((g) => g.salonId === salon.id).length ||
                    "هیچ"}
                </p>
                <p>ایجاد شده: {formatDate(salon.createdAt)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {editingSalon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-beige p-6 rounded-xl max-w-lg w-full">
            <h2 className="text-xl font-bold text-nearBlack mb-4 text-center">
              ویرایش سالن
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  نام سالن
                </label>
                <input
                  type="text"
                  value={editingSalon.name}
                  onChange={(e) =>
                    setEditingSalon({ ...editingSalon, name: e.target.value })
                  }
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  برنامه‌های زمانی
                </label>
                {editingSalon.schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg bg-offWhite mb-2"
                  >
                    <select
                      value={schedule.type}
                      onChange={(e) =>
                        setEditingSalon({
                          ...editingSalon,
                          schedules: editingSalon.schedules.map((s, i) =>
                            i === index ? { ...s, type: e.target.value } : s
                          ),
                        })
                      }
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack mb-2"
                    >
                      <option value="recurring">تکراری (هفتگی)</option>
                      <option value="one-off">یک‌باره (رویداد خاص)</option>
                    </select>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="time"
                        value={schedule.start}
                        onChange={(e) =>
                          setEditingSalon({
                            ...editingSalon,
                            schedules: editingSalon.schedules.map((s, i) =>
                              i === index ? { ...s, start: e.target.value } : s
                            ),
                          })
                        }
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                      />
                      <input
                        type="time"
                        value={schedule.end}
                        onChange={(e) =>
                          setEditingSalon({
                            ...editingSalon,
                            schedules: editingSalon.schedules.map((s, i) =>
                              i === index ? { ...s, end: e.target.value } : s
                            ),
                          })
                        }
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                      />
                    </div>
                    {schedule.type === "recurring" ? (
                      <div className="flex flex-wrap gap-2">
                        {[
                          "شنبه",
                          "یکشنبه",
                          "دوشنبه",
                          "سه‌شنبه",
                          "چهارشنبه",
                          "پنج‌شنبه",
                          "جمعه",
                        ].map((day) => (
                          <button
                            key={day}
                            onClick={() =>
                              setEditingSalon({
                                ...editingSalon,
                                schedules: editingSalon.schedules.map((s, i) =>
                                  i === index
                                    ? {
                                        ...s,
                                        days: s.days.includes(day)
                                          ? s.days.filter((d) => d !== day)
                                          : [...s.days, day],
                                      }
                                    : s
                                ),
                              })
                            }
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
                      <input
                        type="date"
                        value={schedule.specificDate}
                        onChange={(e) =>
                          setEditingSalon({
                            ...editingSalon,
                            schedules: editingSalon.schedules.map((s, i) =>
                              i === index
                                ? { ...s, specificDate: e.target.value }
                                : s
                            ),
                          })
                        }
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  ظرفیت (اختیاری)
                </label>
                <input
                  type="number"
                  value={editingSalon.capacity || ""}
                  onChange={(e) =>
                    setEditingSalon({
                      ...editingSalon,
                      capacity: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="flex-1 p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700"
                >
                  ذخیره
                </button>
                <button
                  onClick={() => setEditingSalon(null)}
                  className="flex-1 p-2 bg-gray-300 text-nearBlack rounded-lg hover:bg-hoverBeige"
                >
                  لغو
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
