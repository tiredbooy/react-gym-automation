import AddUserDefaultSetting from "./AddUserDefaultSetting";
import ThemeSettings from "./ThemeSettings";
import { useTheme } from "../../../context/ThemeContext";

function DefaultSetting() {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

    // need to fix the color
  return (
    <div
      className={`bg-gradient-to-t from-${theme.gradientColors.from} to-${theme.gradientColors.to} mt-8 rounded-2xl p-8 shadow-xl`}
    >
      <AddUserDefaultSetting />
      <ThemeSettings />
    </div>
  );
}

export default DefaultSetting;
