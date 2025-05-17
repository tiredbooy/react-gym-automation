import { NavLink } from "react-router-dom";
import {
  Users,
  Banknote,
  Archive,
  LogOut,
  Settings,
  ScrollText,
  Trello,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

export default function Sidebar() {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  return (
    <div
      className={`w-80 bg-${theme.colors.primary} text-${theme.colors.background} min-h-screen text-blackish flex flex-col shadow-4xl`}
    >
      {/* Profile Section */}
      <div className="flex items-center space-x-4 p-4 border-b border-sand">
        <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center">
          <span className="text-lg text-navy font-bold">IMG</span>
        </div>
        <div>
          <p className="text-navy font-semibold text-lg">اسم باشگاه</p>
          <p className="text-sand text-sm">@gymusername</p>
        </div>
      </div>

      {/* Menu Header */}
      <p className="text-navy text-sm font-bold px-4 mt-4">منوها</p>

      <ul className="menu text-blackish bg-transparent w-full gap-2 p-4">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md hover:bg-${
                theme.colors.secondary
              } hover:text-${theme.colors.accent} hover:font-bold transition duration-150 ${
                isActive
                  ? `bg-${theme.colors.secondary} text-${theme.colors.primary} font-bold`
                  : ""
              }`
            }
          >
            <Trello size={18} />
            <span>داشبورد</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md hover:bg-${
                theme.colors.secondary
              } hover:text-${
                theme.colors.primary
              } hover:font-bold transition duration-150 ${
                isActive
                  ? `bg-${theme.colors.secondary} text-${theme.colors.primary} font-bold`
                  : ""
              }`
            }
          >
            <Users size={18} />
            <span>کاربرها</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md hover:bg-${
                theme.colors.secondary
              } hover:text-${
                theme.colors.primary
              } hover:font-bold transition duration-150 ${
                isActive
                  ? `bg-${theme.colors.secondary} text-${theme.colors.primary} font-bold`
                  : ""
              }`
            }
          >
            <Banknote size={18} />
            <span>پرداخت</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/lockers"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md hover:bg-${
                theme.colors.secondary
              } hover:text-${
                theme.colors.primary
              } hover:font-bold transition duration-150 ${
                isActive
                  ? `bg-${theme.colors.secondary} text-${theme.colors.primary} font-bold`
                  : ""
              }`
            }
          >
            <Archive size={18} />
            <span>مدیریت کمدها</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/logs"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md hover:bg-${
                theme.colors.secondary
              } hover:text-${
                theme.colors.primary
              } hover:font-bold transition duration-150 ${
                isActive
                  ? `bg-${theme.colors.secondary} text-${theme.colors.primary} font-bold`
                  : ""
              }`
            }
          >
            <ScrollText size={18} />
            <span>لاگ ورود و خروج</span>
          </NavLink>
        </li>
      </ul>

      <div className="border-t border-sand mx-4 my-4"></div>

      <ul className="menu text-blackish bg-transparent gap-2 px-4 w-full">
        <li>
          <NavLink
            to="/settings/default"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md hover:bg-${
                theme.colors.secondary
              } hover:text-${
                theme.colors.primary
              } hover:font-bold transition duration-150 ${
                isActive
                  ? ` bg-${theme.colors.secondary} text-${theme.colors.primary} font-bold `
                  : ""
              }`
            }
          >
            <Settings size={18} />
            <span>تنظیمات</span>
          </NavLink>
        </li>
        <li>
          <a
            href="#"
            onClick={() => console.log("Logging out...")}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-${theme.colors.error}/10 transition duration-150 text-${theme.colors.error} font-bold`}
          >
            <LogOut size={18} />
            <span>خروج از سیستم</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
