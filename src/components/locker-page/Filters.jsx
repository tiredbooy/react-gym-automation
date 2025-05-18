import { Search } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Filters({
  search,
  setSearch,
  filter,
  setFilter,
  onExport,
}) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  return (
    <div className="w-full max-w-5xl flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 group duration-200">
        <Search className="absolute right-2 top-2.5 w-5 h-5 text-gray-500 group-focus-within:text-primary cursor-pointer duration-200" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو بر اساس شماره یا نام عضو"
          className={`w-full p-2 pr-8 rounded-lg border border-${primary} focus:outline-none focus:ring-2 focus:ring-${primary}/80 bg-${secondary} text-${accent} duration-200`}
        />
      </div>
      <div className="flex gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`p-2 rounded-lg border border-${primary} focus:outline-none focus:ring-2 focus:ring-${primary}/80 bg-${secondary} text-${accent}`}
        >
          <option value="all">همه</option>
          <option value="occupied">اشغال‌شده</option>
          <option value="free">آزاد</option>
          <option value="vip">VIP</option>
        </select>
      </div>
    </div>
  );
}
