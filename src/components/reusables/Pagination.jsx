import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useMemo } from "react";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  size = "md",
  className,
}) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-sm";
      case "lg":
        return "px-4 py-2 text-lg";
      default:
        return "px-3 py-1.5 text-base";
    }
  };

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div
      className={`flex gap-2 items-center justify-center rtl text-${accent} ${
        className || ""
      }`}
    >
      {/* Prev Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded-full border border-${primary} transition-all duration-300 px-4 py-2 ${
          currentPage === 1
            ? "bg-transparent text-gray-400 cursor-not-allowed"
            : `bg-${primary}/20 hover:bg-hoverBeige`
        }`}
      >
        قبلی
      </motion.button>

      {/* Page Numbers */}
      {renderPages().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className={`px-3 py-1 text-${primary}`}>
            ...
          </span>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={idx}
            onClick={() => handleClick(page)}
            className={`rounded-full border border-${primary} transition-all duration-300 ${getSizeClasses()} ${
              page === currentPage
                ? `bg-${primary} text-${background} font-bold shadow-md`
                : `bg-${primary}/20 hover:bg-hoverBeige`
            }`}
          >
            {page}
          </motion.button>
        )
      )}

      {/* Next Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`rounded-full border border-${primary} transition-all duration-300 px-4 py-2 ${
          currentPage === totalPages
            ? "bg-transparent text-gray-400 cursor-not-allowed"
            : `bg-${primary}/20 hover:bg-hoverBeige`
        }`}
      >
        بعدی
      </motion.button>
    </div>
  );
}

export default Pagination;
