import AddUserDefaultSetting from "./AddUserDefaultSetting";
import ThemeSettings from "./ThemeSettings";
import { useTheme } from "../../../context/ThemeContext";

function DefaultSetting() {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];


    // need to fix the color
  return (
    <div
      className={`bg-gradient-to-b from-${theme.gradientColors.from} to-${theme.gradientColors.to} rounded-xl px-8 py-6`}
    >
      <AddUserDefaultSetting />
      <ThemeSettings />
    </div>
  );
}

export default DefaultSetting;
