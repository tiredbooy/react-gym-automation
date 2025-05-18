import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useTheme } from "../../../context/ThemeContext";

export default function InsuranceDataInputs({
  formData,
  handleInputChange,
  errors,
}) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  return (
    <AnimatePresence>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 col-span-full mt-5"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-right">
          <label className={`block mb-2 text-sm font-semibold text-${accent}`}>
            شماره بیمه
          </label>
          <input
            type="text"
            name="insurance_number"
            value={formData.insurance_number}
            onChange={(e) =>
              handleInputChange("insurance_number", e.target.value)
            }
            className={`w-full px-4 py-3 text-right border-2 bg-transparent border-${primary} rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-${primary}/60 focus:border-transparent 
                    transition-all duration-300 hover:border-${primary}/30 text-${accent} placeholder-gray-400
                    ${errors.insurance_number ? "border-errorRed" : ""}`}
            placeholder="شماره بیمه را وارد کنید"
            aria-invalid={!!errors.insurance_number}
            aria-label="شماره بیمه"
          />
          {errors.insurance_number && (
            <p className="text-errorRed text-xs mt-1 text-right">
              {errors.insurance_number}
            </p>
          )}
        </div>
        <div className="text-right">
          <label className={`block mb-2 text-sm font-semibold text-${accent}`}>
            تاریخ شروع بیمه
          </label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            value={formData.insurance_start}
            onChange={(date) => handleInputChange("insurance_start", date)}
            inputClass={`w-full px-4 py-3 text-right border-2 bg-transparent border-${primary} rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-${primary}/60 focus:border-transparent 
                    transition-all duration-300 hover:border-${primary}/30 text-${accent} placeholder-gray-400
                    ${errors.insurance_number ? "border-errorRed" : ""}`}
            placeholder="تاریخ شروع"
            aria-invalid={!!errors.insurance_start}
            aria-label="تاریخ شروع بیمه"
          />
          {errors.insurance_start && (
            <p className="text-errorRed text-xs mt-1 text-right">
              {errors.insurance_start}
            </p>
          )}
        </div>
        <div className="text-right">
          <label className={`block mb-2 text-sm font-semibold text-${accent}`}>
            تاریخ پایان بیمه
          </label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            value={formData.insurance_end}
            onChange={(date) => handleInputChange("insurance_end", date)}
            inputClass={`w-full px-4 py-3 text-right border-2 bg-transparent border-${primary} rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-${primary}/60 focus:border-transparent 
                    transition-all duration-300 hover:border-${primary}/30 text-${accent} placeholder-gray-400
                    ${errors.insurance_number ? "border-errorRed" : ""}`}
            placeholder="تاریخ پایان"
            aria-invalid={!!errors.insurance_end}
            aria-label="تاریخ پایان بیمه"
          />
          {errors.insurance_end && (
            <p className="text-errorRed text-xs mt-1 text-right">
              {errors.insurance_end}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
