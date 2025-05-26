import SettingsNavbar from "../components/setting/SettingsNavbar";
import {  Outlet } from "react-router-dom";
import DefaultSetting from "../components/setting/defaultSettings/DefaultSetting.jsx";
import { useTheme } from "../context/ThemeContext";

export default function SettingsPage() {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  return (
    <div
      className={`min-h-screen bg-${theme.colors.background} text-nearBlack p-4 md:p-8`}
    >
      <div className="w-full flex flex-col justify-center mx-auto">
        <h1
          className={`text-2xl md:text-4xl font-bold mb-4 text-${theme.colors.primary} text-center md:text-right`}
        >
          تنظیمات سیستم
        </h1>
        <SettingsNavbar />
      </div>
      <div className="max-w-6xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
