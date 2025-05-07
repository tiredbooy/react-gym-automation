import { useState } from "react";
import { motion } from "framer-motion";
import { DoorOpen, Edit, Trash, Settings } from "lucide-react";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function GatewayList({
  gateways,
  salons,
  devices,
  onUpdateGateway,
  onDeleteGateway,
  onTestGateway,
}) {
  const [editingGateway, setEditingGateway] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "نامشخص";
    const date = new DateObject({
      date: new Date(dateStr),
      calendar: persian,
      locale: persian_fa,
    });
    return date.format("YYYY/MM/DD");
  };

  const handleTest = async (gateway) => {
    try {
      const result = await onTestGateway(gateway);
      setTestResult({ gatewayId: gateway.id, message: result.message });
      setTimeout(() => setTestResult(null), 3000);
    } catch (error) {
      setTestResult({ gatewayId: gateway.id, message: error.message });
      setTimeout(() => setTestResult(null), 3000);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (
      !editingGateway.name ||
      !editingGateway.salonId ||
      !editingGateway.deviceId
    ) {
      alert("لطفاً نام، سالن و دستگاه را انتخاب کنید");
      return;
    }
    for (const maint of editingGateway.maintenanceSchedules || []) {
      if (
        !maint.date ||
        !maint.start ||
        !maint.end ||
        maint.start >= maint.end
      ) {
        alert("لطفاً برنامه نگهداری را به درستی وارد کنید");
        return;
      }
    }
    onUpdateGateway(editingGateway);
    setEditingGateway(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h3 className="text-lg font-bold text-nearBlack mb-4">لیست درگاه‌ها</h3>
      {gateways.length === 0 ? (
        <p className="text-nearBlack text-center">هیچ درگاهی ثبت نشده است</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gateways.map((gateway) => (
            <motion.div
              key={gateway.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg shadow-md ${
                gateway.isMaintenanceMode
                  ? "bg-yellow-100"
                  : gateway.status === "active"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-nearBlack">
                  {gateway.name}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingGateway({ ...gateway })}
                    className="p-1 text-darkBlue hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "آیا مطمئن هستید که می‌خواهید این درگاه را حذف کنید؟"
                        )
                      ) {
                        onDeleteGateway(gateway.id);
                      }
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleTest(gateway)}
                    className="p-1 text-yellow-500 hover:text-yellow-700"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-nearBlack">
                <p>
                  سالن:{" "}
                  {salons.find((s) => s.id === gateway.salonId)?.name ||
                    "نامشخص"}
                </p>
                <p>
                  دستگاه:{" "}
                  {devices.find((d) => d.id === gateway.deviceId)?.name ||
                    "نامشخص"}
                </p>
                <p>
                  جهت‌گیری:{" "}
                  {gateway.direction === "bidirectional"
                    ? "دو طرفه"
                    : gateway.direction === "entry"
                    ? "فقط ورودی"
                    : "فقط خروجی"}
                </p>
                {gateway.isMaintenanceMode && <p>در حالت تعمیر و نگهداری</p>}
                {gateway.maintenanceSchedules?.length > 0 && (
                  <div>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      نگهداری:
                    </p>
                    {gateway.maintenanceSchedules.map((m, i) => (
                      <p key={i}>
                        {formatDate(m.date)}، {m.start}–{m.end}
                      </p>
                    ))}
                  </div>
                )}
                <p>ایجاد شده: {formatDate(gateway.createdAt)}</p>
                {testResult?.gatewayId === gateway.id && (
                  <p
                    className={
                      testResult.message.includes("موفقیت")
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {testResult.message}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {editingGateway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-beige p-6 rounded-xl max-w-lg w-full">
            <h2 className="text-xl font-bold text-nearBlack mb-4 text-center">
              ویرایش درگاه
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  نام درگاه
                </label>
                <input
                  type="text"
                  value={editingGateway.name}
                  onChange={(e) =>
                    setEditingGateway({
                      ...editingGateway,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  سالن مرتبط
                </label>
                <select
                  value={editingGateway.salonId}
                  onChange={(e) =>
                    setEditingGateway({
                      ...editingGateway,
                      salonId: e.target.value,
                    })
                  }
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
                  value={editingGateway.deviceId}
                  onChange={(e) =>
                    setEditingGateway({
                      ...editingGateway,
                      deviceId: e.target.value,
                    })
                  }
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
                  value={editingGateway.direction}
                  onChange={(e) =>
                    setEditingGateway({
                      ...editingGateway,
                      direction: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                >
                  <option value="bidirectional">دو طرفه</option>
                  <option value="entry">فقط ورودی</option>
                  <option value="exit">فقط خروجی</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="flex-1 p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700"
                >
                  ذخیره
                </button>
                <button
                  onClick={() => setEditingGateway(null)}
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
