import { motion } from "framer-motion";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  color = "text-darkBlue",
  bgColor = "bg-offWhite",
  activeColor = "bg-darkBlue text-offWhite",
  size = "md",
  className,
}) {
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
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first 3 pages, last page, and current +/-1
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
      className={`flex gap-2 items-center justify-center rtl ${color} ${
        className ? className : ""
      }`}
    >
      {/* Prev Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded-full border border-darkBlue transition-all duration-300 px-4 py-2 ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : `${bgColor} hover:bg-hoverBeige`
        }`}
      >
        قبلی
      </motion.button>

      {/* Page Numbers */}
      {renderPages().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-3 py-1 text-darkBlue">
            ...
          </span>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={idx}
            onClick={() => handleClick(page)}
            className={`rounded-full border border-darkBlue transition-all duration-300 ${getSizeClasses()} ${
              page === currentPage
                ? `${activeColor} font-bold shadow-md`
                : `${bgColor} hover:bg-hoverBeige`
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
        className={`rounded-full border border-darkBlue transition-all duration-300 px-4 py-2 ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : `${bgColor} hover:bg-hoverBeige`
        }`}
      >
        بعدی
      </motion.button>
    </div>
  );
}
