// import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../reusables/Button";
import { UserRoundPlus, Search, User } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";

export default function UserPageHeader({
  onAddUserModal,
  searchQueries,
  onChangeSearchQuery,
  searchRef,
}) {
  const [originalUsers, setOriginalUsers] = useState([]);

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  return (
    <div className="flex flex-col gap-5 items-center py-4">
      <div className="w-full text-start">
        <h1 className={`text-${theme.colors.primary} font-bold text-4xl`}>
          کاربرها
        </h1>
      </div>
      <div className="w-full text-start">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onAddUserModal((isOpen) => !isOpen)}
          className={`flex flex-row gap-1 bg-${theme.colors.primary} rounded-xl px-4 py-2 font-bold text-${theme.colors.background}`}
        >
          <UserRoundPlus size={20} />
          افزودن کاربر
        </motion.button>
      </div>

      <div className="w-full flex flex-row items-center gap-2">
        <motion.input
          className={`w-24 rounded-xl px-4 py-2 border border-${theme.colors.primary} bg-${theme.colors.background} text-${theme.colors.primary} placeholder:text-${theme.colors.primary} outline-none transition-all duration-300 focus:border-${theme.colors.primary} focus:ring-2 focus:ring-${theme.colors.primary}/60 shadow-sm`}
          placeholder="کد کاربر"
          value={searchQueries.person_id || ""}
          onChange={(e) =>
            onChangeSearchQuery((prev) => ({
              ...prev,
              person_id: e.target.value ? Number(e.target.value) : null,
            }))
          }
        />
        <div className="relative w-full group">
          <Search
            className={`absolute right-3 top-1/2 z-50 -translate-y-1/2 text-${theme.colors.primary} cursor-pointer transition-colors duration-300 group-focus-within:text-${theme.colors.accent}`}
          />
          <motion.input
            ref={searchRef}
            className={`w-full rounded-2xl pr-12 pl-4 py-2 border border-${theme.colors.primary} bg-${theme.colors.background} text-${theme.colors.primary} placeholder:text-${theme.colors.primary} outline-none transition-all duration-300 focus:border-${theme.colors.primary} focus:ring-4 focus:ring-${theme.colors.primary}/60 focus:ring-offset-0 shadow-sm focus:shadow-lg`}
            placeholder="جستجوی کاربران"
            value={searchQueries.person_name}
            onChange={(e) =>
              onChangeSearchQuery((prev) => ({
                ...prev,
                person_name: e.target.value,
              }))
            }
          />
        </div>

        <Button
          bgColor={`bg-${theme.colors.primary}`}
          txtColor={`text-${theme.colors.background}`}
        >
          جستجو
        </Button>
      </div>
    </div>
  );
}
