import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { useTheme } from "../../../context/ThemeContext";

function toEnglishDigits(str) {
  return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

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
            name="insurance_no"
            value={formData.insurance_no}
            onChange={(e) => handleInputChange("insurance_no", e.target.value)}
            className={`w-full px-4 py-3 text-right border-2 bg-transparent border-${primary} rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-${primary}/60 focus:border-transparent 
                    transition-all duration-300 hover:border-${primary}/30 text-${accent} placeholder-gray-400
                    ${errors.insurance_no ? "border-errorRed" : ""}`}
            placeholder="شماره بیمه را وارد کنید"
            aria-invalid={!!errors.insurance_no}
            aria-label="شماره بیمه"
          />
          {errors.insurance_no && (
            <p className="text-errorRed text-xs mt-1 text-right">
              {errors.insurance_no}
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
            value={
              formData.ins_start_date
                ? new DateObject({
                    date: formData.birth_date,
                    format: "YYYY/MM/DD",
                    calendar: persian,
                  })
                : null
            }
            // onChange={(date) => handleInputChange("ins_start_date", date)}
            onChange={(date) => {
              const formatted = date?.format?.("YYYY/MM/DD") || "";
              const englishFormatted = toEnglishDigits(formatted); // 🧼 Clean it
              handleInputChange("ins_start_date", englishFormatted);
            }}
            inputClass={`w-full px-4 py-3 text-right border-2 bg-transparent border-${primary} rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-${primary}/60 focus:border-transparent 
                    transition-all duration-300 hover:border-${primary}/30 text-${accent} placeholder-gray-400
                    ${errors.insurance_no ? "border-errorRed" : ""}`}
            placeholder="تاریخ شروع"
            aria-invalid={!!errors.ins_start_date}
            aria-label="تاریخ شروع بیمه"
          />
          {errors.ins_start_date && (
            <p className="text-errorRed text-xs mt-1 text-right">
              {errors.ins_start_date}
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
            value={
              formData.ins_end_date
                ? new DateObject({
                    date: formData.birth_date,
                    format: "YYYY/MM/DD",
                    calendar: persian,
                  })
                : null
            }
            onChange={(date) => {
              const formatted = date?.format?.("YYYY/MM/DD") || "";
              const englishFormatted = toEnglishDigits(formatted); // 🧼 Clean it
              handleInputChange("ins_end_date", englishFormatted);
            }}
            inputClass={`w-full px-4 py-3 text-right border-2 bg-transparent border-${primary} rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-${primary}/60 focus:border-transparent 
                    transition-all duration-300 hover:border-${primary}/30 text-${accent} placeholder-gray-400
                    ${errors.insurance_no ? "border-errorRed" : ""}`}
            placeholder="تاریخ پایان"
            aria-invalid={!!errors.ins_end_date}
            aria-label="تاریخ پایان بیمه"
          />
          {errors.ins_end_date && (
            <p className="text-errorRed text-xs mt-1 text-right">
              {errors.ins_end_date}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
