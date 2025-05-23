// App.jsx
import React from "react";
import { useState } from "react";
// import FilterBar from './components/FilterBar';
import FilterBar from "../components/Logs/FilterBar";
import LogList from "../components/Logs/LogList";
import ExportButton from "../components/Logs/ExportButton";
import LogTable from "../components/Logs/LogList";
import Pagination from "../components/reusables/Pagination";
// import LogList from './components/LogList';
// import ExportButton from './components/ExportButton';
import { useTheme } from "../context/ThemeContext";

export default function LogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Example pagination

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  return (
    <div className={`min-h-screen bg-${background} text-${primary} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-2xl md:text-4xl font-bold mb-4 text-${primary} text-center md:text-right`}>
          ثبت گزارش ورود و خروج
        </h1>

        <FilterBar />

        <div className="flex justify-between items-center mb-4">
          <p className={`text-sm text-${primary}`}>لیست گزارش‌ها</p>
          <ExportButton />
        </div>

        <LogTable />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          className="mt-5"      
        />
      </div>
    </div>
  );
}

// components/FilterBar.jsx

// components/LogList.jsx

// components/LogItem.jsx

// components/ExportButton.jsx
