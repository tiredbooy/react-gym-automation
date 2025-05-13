import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function FormDataInputs({ formData , handleInputChange , errors }) { 
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Full Name */}
    <div className="text-right">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        نام
      </label>
      <input
        type="text"
        name="first_name"
        autoComplete="off"
        value={formData.first_name}
        onChange={(e) => handleInputChange("first_name", e.target.value)}
        className={`w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-300 hover:border-blue-300 text-gray-800 placeholder-gray-400
              ${errors.first_name ? "border-errorRed" : ""}`}
        placeholder="نام کاربر را وارد کنید"
        aria-invalid={!!errors.first_name}
        aria-label="نام"
      />
      {errors.first_name && (
        <p className="text-errorRed text-xs mt-1 text-right">
          {errors.first_name}
        </p>
      )}
    </div>

    {/* Last Name */}
    <div className="text-right">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        نام خانوادگی
      </label>
      <input
        type="text"
        name="last_name"
        autoComplete="off"
        value={formData.last_name}
        onChange={(e) => handleInputChange("last_name", e.target.value)}
        className={`w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-300 hover:border-blue-300 text-gray-800 placeholder-gray-400
              ${errors.last_name ? "border-errorRed" : ""}`}
        placeholder="نام خانوادگی کاربر را وارد کنید"
        aria-invalid={!!errors.last_name}
        aria-label="نام خانوادگی"
      />
      {errors.last_name && (
        <p className="text-errorRed text-xs mt-1 text-right">
          {errors.last_name}
        </p>
      )}
    </div>

    {/* Mobile */}
    <div className="text-right">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        شماره تماس
      </label>
      <input
        type="tel"
        name="mobile"
        autoComplete="off"
        value={formData.mobile}
        onChange={(e) => handleInputChange("mobile", e.target.value)}
        className={`w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-300 hover:border-blue-300 text-gray-800 placeholder-gray-400
              ${errors.mobile ? "border-errorRed" : ""}`}
        placeholder="شماره تماس خود را وارد کنید"
        aria-invalid={!!errors.mobile}
        aria-label="شماره تماس"
      />
      {errors.mobile && (
        <p className="text-errorRed text-xs mt-1 text-right">{errors.mobile}</p>
      )}
    </div>

    {/* National Code */}
    <div className="text-right">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        کد ملی
      </label>
      <input
        type="text"
        name="national_code"
        autoComplete="off"
        value={formData.national_code}
        onChange={(e) => handleInputChange("national_code", e.target.value)}
        className={`w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-300 hover:border-blue-300 text-gray-800 placeholder-gray-400
              ${errors.national_code ? "border-errorRed" : ""}`}
        placeholder="کد ملی را وارد کنید"
        aria-invalid={!!errors.national_code}
        aria-label="کد ملی"
      />
      {errors.national_code && (
        <p className="text-errorRed text-xs mt-1 text-right">
          {errors.national_code}
        </p>
      )}
    </div>

    {/* Birth Date */}
    <div className="text-right">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        تاریخ تولد
      </label>
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        value={formData.birth_date}
        onChange={(date) => handleInputChange("birth_date", date)}
        inputClass={`w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-300 hover:border-blue-300 text-gray-800 placeholder-gray-400
              ${errors.birth_date ? "border-errorRed" : ""}`}
        placeholder="تاریخ را انتخاب کنید"
        aria-invalid={!!errors.birth_date}
        aria-label="تاریخ تولد"
      />
      {errors.birth_date && (
        <p className="text-errorRed text-xs mt-1 text-right">
          {errors.birth_date}
        </p>
      )}
    </div>

    {/* Gender */}
    <div className="text-right">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        جنسیت
      </label>
      <select
        name="gender"
        value={formData.gender}
        onChange={(e) => handleInputChange("gender", e.target.value)}
        className={`w-full px-4 py-3 text-right bg-transparent border-2 border-gray-400 rounded-xl
              text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent transition-all duration-300 hover:border-blue-300 appearance-none
              ${errors.gender ? "border-errorRed" : ""}`}
        aria-invalid={!!errors.gender}
        aria-label="جنسیت"
      >
        <option value="" disabled>
          جنسیت را انتخاب کنید
        </option>
        <option value="male">مرد</option>
        <option value="female">زن</option>
      </select>
      {errors.gender && (
        <p className="text-errorRed text-xs mt-1 text-right">{errors.gender}</p>
      )}
    </div>


  </div>;
}
