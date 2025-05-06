import { Search } from "lucide-react";

export default function Filters({
  search,
  setSearch,
  filter,
  setFilter,
  onExport,
}) {
  <div className="w-full max-w-5xl flex flex-col sm:flex-row gap-4">
    <div className="relative flex-1">
      <Search className="absolute right-2 top-2.5 w-5 h-5 text-gray-500" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جستجو بر اساس شماره یا نام عضو"
        className="w-full p-2 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
      />
    </div>
    <div className="flex gap-2">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
      >
        <option value="all">همه</option>
        <option value="occupied">اشغال‌شده</option>
        <option value="free">آزاد</option>
        <option value="vip">VIP</option>
      </select>
    </div>
  </div>;
}
