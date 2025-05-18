import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

export default function HandleAuthMethodInput({ hardwareData, formData }) {
  const { activeTheme, themes } = useTheme();
    const theme = themes[activeTheme];
    const { primary, secondary, accent, background } = theme.colors;

  return (
    <motion.div
      className="mt-4 text-right"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className={`block mb-2 text-sm font-semibold text-${accent}`}>
        داده‌های سخت‌افزاری
      </label>
      <textarea
        className={`w-full px-4 py-3 text-right border-2 bg-transparent border-${primary} rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-${primary}/70 focus:border-transparent 
                  transition-all duration-300 hover:border-${primary}/50 text-${accent} placeholder-gray-400`}
        placeholder="داده‌های دریافتی از سخت‌افزار..."
        value={hardwareData}
        readOnly
        rows={4}
        aria-label="داده‌های سخت‌افزاری"
      />
      <p className={`text-sm text-${accent} mt-1`}>
        {formData.auth_method === "card" && "لطفا کارت را اسکن کنید."}
        {formData.auth_method === "fingerprint" &&
          "لطفا اثر انگشت را اسکن کنید."}
        {formData.auth_method === "face" &&
          "لطفا چهره را برای شناسایی اسکن کنید."}
      </p>
    </motion.div>
  );
}
