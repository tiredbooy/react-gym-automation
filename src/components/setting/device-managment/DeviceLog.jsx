import { Search , Download ,  } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

export default function DeviceLog ({ deviceLog, onExport }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const {activeTheme , themes} = useTheme();
    const theme = themes[activeTheme];

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
    <div className={`w-full max-w-5xl bg-${theme.colors.secondary} p-4 rounded-2xl shadow-lg`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h3 className={`text-lg font-bold text-${theme.colors.primary}`}>
          لاگ فعالیت دستگاه‌ها
        </h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className={`absolute right-2 top-2.5 w-5 h-5 text-${theme.colors.accent}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو بر اساس شناسه یا نام"
              className={`p-2 pr-8 rounded-lg border border-${theme.colors.primary} focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary} bg-${theme.colors.background} text-${theme.colors.accent}`}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`p-2 rounded-lg border border-${theme.colors.primary} focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary} bg-${theme.colors.background} text-${theme.colors.accent}`}
          >
            <option value="all">همه</option>
            <option value="connect">اتصال</option>
            <option value="disconnect">قطع اتصال</option>
            <option value="error">خطا</option>
          </select>
          <button
            onClick={onExport}
            className={`p-2 bg-${theme.colors.primary} text-${theme.colors.background} rounded-lg hover:bg-${theme.colors.primary}/60 flex items-center gap-1 duration-150`}
          >
            <Download className="w-5 h-5" /> خروجی Excel
          </button>
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        <table className={`w-full text-sm text-${theme.colors.primary}`}>
          <thead>
            <tr className={`bg-${theme.colors.primary} text-${theme.colors.background} text-right`}>
              <th className="p-2">شناسه</th>
              <th className="p-2">نام</th>
              <th className="p-2">فعالیت</th>
              <th className="p-2">زمان</th>
              <th className="p-2">جزئیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredLog.map((entry, index) => (
              <tr key={index} className={`border-b hover:bg-${theme.colors.background}/30 border-gray-200 duration-150`}>
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
