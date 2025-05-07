import { Search , Download ,  } from "lucide-react";
import { useState } from "react";

export default function DeviceLog ({ deviceLog, onExport }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredLog = deviceLog.filter(
    (entry) =>
      (search === "" ||
        entry.deviceId.includes(search) ||
        entry.deviceName.includes(search)) &&
      (filter === "all" ||
        (filter === "connect" && entry.action === "اتصال") ||
        (filter === "disconnect" && entry.action === "قطع اتصال") ||
        (filter === "error" && entry.action === "خطا"))
  );

  return (
    <div className="w-full max-w-5xl bg-beige p-4 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-nearBlack">
          لاگ فعالیت دستگاه‌ها
        </h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute right-2 top-2.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو بر اساس شناسه یا نام"
              className="p-2 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
          >
            <option value="all">همه</option>
            <option value="connect">اتصال</option>
            <option value="disconnect">قطع اتصال</option>
            <option value="error">خطا</option>
          </select>
          <button
            onClick={onExport}
            className="p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <Download className="w-5 h-5" /> خروجی Excel
          </button>
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        <table className="w-full text-sm text-nearBlack">
          <thead>
            <tr className="bg-hoverBeige">
              <th className="p-2">شناسه</th>
              <th className="p-2">نام</th>
              <th className="p-2">فعالیت</th>
              <th className="p-2">زمان</th>
              <th className="p-2">جزئیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredLog.map((entry, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-2">{entry.deviceId}</td>
                <td className="p-2">{entry.deviceName}</td>
                <td className="p-2">{entry.action}</td>
                <td className="p-2">
                  {new Date(entry.timestamp).toLocaleString("fa-IR")}
                </td>
                <td className="p-2">{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
