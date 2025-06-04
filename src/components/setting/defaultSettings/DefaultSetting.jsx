import AddUserDefaultSetting from "./AddUserDefaultSetting";
import ThemeSettings from "./ThemeSettings";
import { useTheme } from "../../../context/ThemeContext";
import { easeIn, motion } from "framer-motion";

function DefaultSetting() {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];


    // need to fix the color
  return (
    <motion.div
      initial={{ opacity : 0 , scale : .8}}
      animate={{ opacity: 1 , scale : 1 }}
      transition={{  type: "spring" , }}
      className={`bg-gradient-to-b from-${theme.gradientColors.from} to-${theme.gradientColors.to} rounded-xl px-8 py-6`}
    >
      <AddUserDefaultSetting />
      <ThemeSettings />
    </motion.div>
  );
}

export default DefaultSetting;
