import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { useTheme } from "../../../context/ThemeContext";

  function toEnglishDigits(str) {
  return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

export default function FormDataInputs({
  formData,
  handleInputChange,
  errors,
}) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  const inputBaseClasses = `w-full px-4 py-3 text-right border-2 bg-transparent rounded-xl 
    focus:outline-none transition-all duration-300 placeholder-gray-400`;

  const themedBorder = `border-${primary}`;
  const themedFocus = `focus:ring-2 focus:ring-${primary} focus:border-transparent`;
  const themedHover = `hover:border-${primary}/60`;
  const textColor = `text-${accent}`;
  const labelColor = `text-${accent}`;
  const themeBack = `bg-${background}`;

  const getInputClass = (hasError) =>
    `${inputBaseClasses} ${themedBorder} ${themedFocus} ${themedHover} ${textColor} ${themeBack} ${
      hasError ? "border-errorRed" : ""
    }`;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Full Name */}
      <div className="text-right">
        <label className={`block mb-2 text-sm font-semibold ${labelColor}`}>
          نام
        </label>
        <input
          type="text"
          name="first_name"
          autoComplete="off"
          value={formData.first_name}
          onChange={(e) => handleInputChange("first_name", e.target.value)}
          className={getInputClass(errors.first_name)}
          placeholder="نام کاربر را وارد کنید"
          aria-invalid={!!errors.first_name}
        />
        {errors.first_name && (
          <p className="mt-1 text-xs text-right text-errorRed">
            {errors.first_name}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div className="text-right">
        <label className={`block mb-2 text-sm font-semibold ${labelColor}`}>
          نام خانوادگی
        </label>
        <input
          type="text"
          name="last_name"
          autoComplete="off"
          value={formData.last_name}
          onChange={(e) => handleInputChange("last_name", e.target.value)}
          className={getInputClass(errors.last_name)}
          placeholder="نام خانوادگی کاربر را وارد کنید"
          aria-invalid={!!errors.last_name}
        />
        {errors.last_name && (
          <p className="mt-1 text-xs text-right text-errorRed">
            {errors.last_name}
          </p>
        )}
      </div>

      {/* Mobile */}
      <div className="text-right">
        <label className={`block mb-2 text-sm font-semibold ${labelColor}`}>
          شماره تماس
        </label>
        <input
          type="tel"
          name="mobile"
          autoComplete="off"
          value={formData.mobile}
          onChange={(e) => handleInputChange("mobile", e.target.value)}
          className={getInputClass(errors.mobile)}
          placeholder="شماره تماس خود را وارد کنید"
          aria-invalid={!!errors.mobile}
        />
        {errors.mobile && (
          <p className="mt-1 text-xs text-right text-errorRed">
            {errors.mobile}
          </p>
        )}
      </div>

      {/* National Code */}
      <div className="text-right">
        <label className={`block mb-2 text-sm font-semibold ${labelColor}`}>
          کد ملی
        </label>
        <input
          type="text"
          name="national_code"
          autoComplete="off"
          value={formData.national_code}
          onChange={(e) => handleInputChange("national_code", e.target.value)}
          className={getInputClass(errors.national_code)}
          placeholder="کد ملی را وارد کنید"
          aria-invalid={!!errors.national_code}
        />
        {errors.national_code && (
          <p className="mt-1 text-xs text-right text-errorRed">
            {errors.national_code}
          </p>
        )}
      </div>

      {/* Birth Date */}
      <div className="text-right">
        <label className={`block mb-2 text-sm font-semibold ${labelColor}`}>
          تاریخ تولد
        </label>
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          value={
            formData.birth_date
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
            handleInputChange("birth_date", englishFormatted);
          }}
          inputClass={getInputClass(errors.birth_date)}
          placeholder="تاریخ را انتخاب کنید"
          aria-invalid={!!errors.birth_date}
        />
        {errors.birth_date && (
          <p className="mt-1 text-xs text-right text-errorRed">
            {errors.birth_date}
          </p>
        )}
      </div>

      {/* Gender */}
      <div className="text-right">
        <label className={`block mb-2 text-sm font-semibold ${labelColor}`}>
          جنسیت
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={(e) => handleInputChange("gender", e.target.value)}
          className={`${getInputClass(
            errors.gender
          )} appearance-none bg-${background}`}
          aria-invalid={!!errors.gender}
        >
          <option value="" disabled>
            جنسیت را انتخاب کنید
          </option>
          <option value="M">مرد</option>
          <option value="F">زن</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-xs text-right text-errorRed">
            {errors.gender}
          </p>
        )}
      </div>
    </div>
  );
}
