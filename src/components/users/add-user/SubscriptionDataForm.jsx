import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import RadioGroup from "../../reusables/RadioGroup";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const sports = [
  { id: 1, label: "بدنسازی" },
  { id: 2, label: "کراسفیت" },
  { id: 3, label: "یوگا" },
  { id: 4, label: "ایروبیک" },
];

const coaches = [
  { value: "", label: "بدون مربی", vipPrice: 0, normalPrice: 0 },
  {
    value: "ali",
    label: "علی محمدی",
    vipPrice: 45000000,
    normalPrice: 1000000,
  },
  {
    value: "reza",
    label: "رضا حسینی",
    vipPrice: 45000000,
    normalPrice: 1000000,
  },
];

const sessionTimes = [
  { value: "morning", label: "صبح" },
  { value: "afternoon", label: "عصر" },
  { value: "evening", label: "شب" },
];

const durations = [
  { value: "1month", label: "۱ ماه", months: 1 },
  { value: "3month", label: "۳ ماه", months: 3 },
  { value: "6month", label: "۶ ماه", months: 6 },
  { value: "1year", label: "۱ سال", months: 12 },
];

const subscriptionTypes = [
  { value: "normal", label: "ماهانه (عادی)", basePrice: 2000000 },
  { value: "vip", label: "ماهانه (ویژه)", basePrice: 3500000 },
  { value: "session", label: "جلسه ای", basePrice: 200000 },
];

const sessions = [
  { value: 1, label: "۱ جلسه" },
  { value: 12, label: "۱۲ جلسه" },
  { value: 16, label: "۱۶ جلسه" },
  { value: 20, label: "۲۰ جلسه" },
  { value: 24, label: "۲۴ جلسه" },
  { value: 26, label: "۲۶ جلسه" },
  { value: 30, label: "۳۰ جلسه" },
];

// Available lockers for VIP members
const availableLockers = Array.from({ length: 50 }, (_, i) => ({
  value: i + 1,
  label: `شماره ${i + 1}`,
}));

export default function SubscriptionDataForm() {
  // Main form state
  const [formData, setFormData] = useState({
    sport: "",
    session_time: "",
    coach: "",
    programType: null,
    coach_price: 0,
    subscription_type: "",
    duration: "",
    sessions: 0,
    start_date: null,
    end_date: null,
    locker_number: null, // New field for VIP lockers

    // Added new price fields
    insurance_fee: 0,
    card_fee: 50000, // Default card fee
    discount: 0,

    // Calculated fields
    total_tuition: 0,
    total_price: 0,
  });

  // Form validity state
  const [formErrors, setFormErrors] = useState({});

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle numeric input changes and format as numbers
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : parseInt(value, 10) || 0,
    }));
  };

  // Handle program type change
  const handleProgramTypeChange = (value) => {
    // Update program type
    setFormData((prev) => {
      // Calculate new coach price based on new program type
      let coachPrice = 0;
      if (prev.coach) {
        const selectedCoach = coaches.find(
          (coach) => coach.value === prev.coach
        );
        if (selectedCoach) {
          coachPrice =
            value === true ? selectedCoach.vipPrice : selectedCoach.normalPrice;
        }
      }

      return {
        ...prev,
        programType: value,
        coach_price: coachPrice,
      };
    });
  };

  // Handle coach selection
  const handleCoachSelect = (e) => {
    const { value } = e.target;
    const selectedCoach =
      coaches.find((coach) => coach.value === value) || coaches[0];

    // Calculate coach price based on program type if coach is selected
    let coachPrice = 0;
    if (value) {
      coachPrice =
        formData.programType === true
          ? selectedCoach.vipPrice
          : selectedCoach.normalPrice;
    }

    setFormData((prev) => ({
      ...prev,
      coach: value,
      coach_price: coachPrice,
    }));
  };

  // Handle subscription type change
  const handleSubscriptionTypeChange = (e) => {
    const { value } = e.target;
    const selectedType =
      subscriptionTypes.find((type) => type.value === value) ||
      subscriptionTypes[0];

    // Recalculate coach price if a coach is selected
    let coachPrice = 0;
    if (formData.coach) {
      const selectedCoach = coaches.find(
        (coach) => coach.value === formData.coach
      );
      if (selectedCoach) {
        coachPrice =
          value === "vip" ? selectedCoach.vipPrice : selectedCoach.normalPrice;
      }
    }

    // Reset locker number if changing from VIP to another type
    const newLockerNumber = value === "vip" ? formData.locker_number : null;

    setFormData((prev) => ({
      ...prev,
      subscription_type: value,
      coach_price: coachPrice,
      locker_number: newLockerNumber,
    }));
  };

  // Handle duration change and calculate end date
  const handleDurationChange = (e) => {
    const { value } = e.target;
    const selectedDuration = durations.find(
      (duration) => duration.value === value
    );

    setFormData((prev) => ({
      ...prev,
      duration: value,
    }));

    // If start date is selected, calculate end date
    if (formData.start_date && selectedDuration) {
      calculateEndDate(formData.start_date, selectedDuration.months);
    }
  };

  // Handle start date change
  const handleStartDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      start_date: date,
    }));

    // If duration is selected, calculate end date
    if (date && formData.duration) {
      const selectedDuration = durations.find(
        (d) => d.value === formData.duration
      );
      if (selectedDuration) {
        calculateEndDate(date, selectedDuration.months);
      }
    }
  };

  // Calculate end date based on start date and duration
  const calculateEndDate = (startDate, months) => {
    if (!startDate) return;

    // Clone the date object
    const endDate = { ...startDate };

    // Convert month and add duration months
    let newMonth = endDate.month + months;
    let yearAdd = Math.floor((newMonth - 1) / 12);
    newMonth = ((newMonth - 1) % 12) + 1;

    endDate.month = newMonth;
    endDate.year += yearAdd;

    setFormData((prev) => ({
      ...prev,
      end_date: endDate,
    }));
  };

  // Format Persian date to string
  const formatPersianDate = (date) => {
    if (!date) return "";

    // Format Persian date
    return `${date.day}/${date.month}/${date.year}`;
  };

  // Calculate total price whenever relevant fields change
  useEffect(() => {
    let tuition = 0;
    let total = 0;

    // Calculate tuition based on subscription type
    if (formData.subscription_type) {
      const selectedType = subscriptionTypes.find(
        (type) => type.value === formData.subscription_type
      );

      if (selectedType) {
        if (formData.subscription_type === "session") {
          // For session-based subscription, multiply by number of sessions
          tuition = selectedType.basePrice * formData.sessions;
        } else {
          // For monthly subscriptions, multiply by number of months
          const selectedDuration = durations.find(
            (d) => d.value === formData.duration
          );
          const months = selectedDuration ? selectedDuration.months : 0;
          tuition = selectedType.basePrice * months;
        }
      }
    }

    // Calculate total price
    total =
      tuition +
      parseInt(formData.coach_price || 0) +
      parseInt(formData.insurance_fee || 0) +
      parseInt(formData.card_fee || 0) -
      parseInt(formData.discount || 0);

    setFormData((prev) => ({
      ...prev,
      total_tuition: tuition,
      total_price: total,
    }));
  }, [
    formData.subscription_type,
    formData.duration,
    formData.sessions,
    formData.coach_price,
    formData.insurance_fee,
    formData.card_fee,
    formData.discount,
  ]);

  // Format currency (Rial/Toman)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fa-IR").format(amount);
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};

    // Required fields based on subscription type
    if (!formData.sport) errors.sport = "لطفا رشته ورزشی را انتخاب کنید";
    if (!formData.session_time)
      errors.session_time = "لطفا سانس را انتخاب کنید";
    if (!formData.subscription_type)
      errors.subscription_type = "لطفا نوع عضویت را انتخاب کنید";

    // Required fields for monthly subscriptions
    if (
      formData.subscription_type === "normal" ||
      formData.subscription_type === "vip"
    ) {
      if (!formData.duration) errors.duration = "لطفا مدت زمان را انتخاب کنید";
    }

    // Required fields for session-based subscription
    if (formData.subscription_type === "session") {
      if (!formData.sessions)
        errors.sessions = "لطفا تعداد جلسات را انتخاب کنید";
    }

    // Check start date
    if (!formData.start_date)
      errors.start_date = "لطفا تاریخ شروع را انتخاب کنید";

    // VIP specific validation - locker number required
    if (formData.subscription_type === "vip" && !formData.locker_number) {
      errors.locker_number = "لطفا شماره کمد را انتخاب کنید";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    console.log("Form submitted:", formData);
    // Here you would typically send the data to a server
    alert("فرم با موفقیت ثبت شد");
  };

  return (
    <motion.form
      className="bg-beige shadow rounded-xl p-6"
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            رشته ورزشی
          </label>
          <select
            name="sport"
            value={formData.sport}
            onChange={(e) => handleInputChange("sport", e.target.value)}
            className={`w-full px-4 py-3 text-right bg-transparent border-2 ${
              formErrors.sport ? "border-red-500" : "border-gray-400"
            } rounded-xl
              text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent transition-all duration-300 hover:border-blue-300 appearance-none`}
            aria-label="رشته ورزشی"
          >
            <option className="text-gray-400" value="" disabled>
              رشته ورزشی را انتخاب کنید
            </option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.label}>
                {sport.label}
              </option>
            ))}
          </select>
          {formErrors.sport && (
            <p className="text-red-500 text-xs mt-1">{formErrors.sport}</p>
          )}
        </div>
        <div className="text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            سانس
          </label>
          <select
            name="session_time"
            value={formData.session_time}
            onChange={(e) => handleInputChange("session_time", e.target.value)}
            className={`w-full px-4 py-3 text-right bg-transparent border-2 ${
              formErrors.session_time ? "border-red-500" : "border-gray-400"
            } rounded-xl
              text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent transition-all duration-300 hover:border-blue-300 appearance-none`}
            aria-label="سانس"
          >
            <option className="text-gray-400" value="" disabled>
              سانس را انتخاب کنید
            </option>
            {sessionTimes.map((time) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
          {formErrors.session_time && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors.session_time}
            </p>
          )}
        </div>
        <div className="text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            مربی
          </label>
          <select
            name="coach"
            value={formData.coach}
            onChange={handleCoachSelect}
            className={`w-full px-4 py-3 text-right bg-transparent border-2 border-gray-400 rounded-xl
              text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent transition-all duration-300 hover:border-blue-300 appearance-none`}
            aria-label="مربی"
          >
            <option className="text-gray-400" value="">
              بدون مربی
            </option>
            {coaches
              .filter((coach) => coach.value !== "")
              .map((coach) => (
                <option key={coach.value} value={coach.value}>
                  {coach.label}
                </option>
              ))}
          </select>
        </div>
        {formData.coach && formData.coach !== "" && (
          <>
            <div className="text-right">
              <RadioGroup
                name="programType"
                value={formData.programType}
                onChange={handleProgramTypeChange}
                options={[
                  { value: true, label: "خصوصی" },
                  { value: false, label: "برنامه" },
                ]}
                label="نوع برنامه"
                wrapperClass="card bg-beige p-4 rounded-xl"
              />
            </div>

            <div className="text-right">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                هزینه ی برنامه
              </label>
              <input
                type="number"
                name="coach_price"
                value={formData.coach_price}
                onChange={handleNumericChange}
                autoComplete="off"
                className={`w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  transition-all duration-300 hover:border-blue-300 text-gray-800 placeholder-gray-400`}
                placeholder="هزینه ی برنامه را وارد کنید"
              />
            </div>
          </>
        )}
        <div className="text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            نوع عضویت
          </label>
          <select
            name="subscription_type"
            value={formData.subscription_type}
            onChange={handleSubscriptionTypeChange}
            className={`w-full px-4 py-3 text-right bg-transparent border-2 ${
              formErrors.subscription_type
                ? "border-red-500"
                : "border-gray-400"
            } rounded-xl
              text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent transition-all duration-300 hover:border-blue-300 appearance-none`}
            aria-label="نوع عضویت"
          >
            <option className="text-gray-400" value="" disabled>
              نوع عضویت خود را انتخاب کنید
            </option>
            {subscriptionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {formErrors.subscription_type && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors.subscription_type}
            </p>
          )}
        </div>
        {/* VIP-specific locker number field */}
        {formData.subscription_type === "vip" && (
          <div className="text-right">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              شماره کمد
            </label>
            <select
              name="locker_number"
              value={formData.locker_number || ""}
              onChange={(e) =>
                handleInputChange(
                  "locker_number",
                  e.target.value ? parseInt(e.target.value, 10) : null
                )
              }
              className={`w-full px-4 py-3 text-right bg-transparent border-2 ${
                formErrors.locker_number ? "border-red-500" : "border-gray-400"
              } rounded-xl
                text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent transition-all duration-300 hover:border-blue-300 appearance-none`}
              aria-label="شماره کمد"
            >
              <option className="text-gray-400" value="" disabled>
                شماره کمد را انتخاب کنید
              </option>
              {availableLockers.map((locker) => (
                <option key={locker.value} value={locker.value}>
                  {locker.label}
                </option>
              ))}
            </select>
            {formErrors.locker_number && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.locker_number}
              </p>
            )}
          </div>
        )}
        <div className="text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            مدت زمان
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleDurationChange}
            className={`w-full px-4 py-3 text-right bg-transparent border-2 ${
              formErrors.duration ? "border-red-500" : "border-gray-400"
            } rounded-xl 
              text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent transition-all duration-300 hover:border-blue-300 appearance-none
              ${formData.subscription_type === "session" ? "opacity-50" : ""}`}
            aria-label="مدت زمان"
            disabled={formData.subscription_type === "session"}
          >
            <option className="text-gray-400" value="" disabled>
              مدت زمان را انتخاب کنید
            </option>
            {durations.map((duration) => (
              <option key={duration.value} value={duration.value}>
                {duration.label}
              </option>
            ))}
          </select>
          {formErrors.duration && (
            <p className="text-red-500 text-xs mt-1">{formErrors.duration}</p>
          )}
        </div>
        <div className="text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            تعداد جلسات
          </label>
          <select
            name="sessions"
            value={formData.sessions}
            onChange={(e) =>
              handleInputChange("sessions", parseInt(e.target.value, 10))
            }
            className={`w-full px-4 py-3 text-right bg-transparent border-2 ${
              formErrors.sessions ? "border-red-500" : "border-gray-400"
            } rounded-xl
              text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent transition-all duration-300 hover:border-blue-300 appearance-none
              ${formData.subscription_type !== "session" ? "opacity-50" : ""}`}
            aria-label="تعداد جلسات"
            disabled={formData.subscription_type !== "session"}
          >
            <option className="text-gray-400" value="0" disabled>
              تعداد جلسات را انتخاب کنید
            </option>
            {sessions.map((session) => (
              <option key={session.value} value={session.value}>
                {session.label}
              </option>
            ))}
          </select>
          {formErrors.sessions && (
            <p className="text-red-500 text-xs mt-1">{formErrors.sessions}</p>
          )}
        </div>
        <div className="text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            تاریخ شروع
          </label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            value={formData.start_date}
            onChange={handleStartDateChange}
            inputClass={`w-full px-4 py-3 text-right border-2 bg-transparent ${
              formErrors.start_date ? "border-red-500" : "border-gray-400"
            } rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-300 hover:border-blue-300 text-gray-800 placeholder-gray-400`}
            placeholder="تاریخ شروع را انتخاب کنید"
            aria-label="تاریخ شروع"
          />
          {formErrors.start_date && (
            <p className="text-red-500 text-xs mt-1">{formErrors.start_date}</p>
          )}
        </div>
        <div className="text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            تاریخ پایان
          </label>
          <input
            type="text"
            name="subscription_end_date"
            value={
              formData.end_date ? formatPersianDate(formData.end_date) : ""
            }
            readOnly
            placeholder="تاریخ پایان"
            autoComplete="off"
            className={`w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-300 hover:border-blue-300 text-gray-800 placeholder-gray-500`}
          />
        </div>
        {/* Price Fields */}
        <div className="text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            هزینه ی بیمه
          </label>
          <input
            type="number"
            name="insurance_fee"
            value={formData.insurance_fee}
            onChange={handleNumericChange}
            autoComplete="off"
            className={`w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-300 hover:border-blue-300 text-gray-800 placeholder-gray-400`}
            placeholder="هزینه ی بیمه را وارد کنید"
          />
        </div>
        <div className="text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            هزینه ی کارت
          </label>
          <input
            type="number"
            name="card_fee"
            value={formData.card_fee}
            onChange={handleNumericChange}
            autoComplete="off"
            className={`w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-300 hover:border-blue-300 text-gray-800 placeholder-gray-400`}
            placeholder="هزینه ی کارت را وارد کنید"
          />
        </div>
        <div className="text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            تخفیف
          </label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleNumericChange}
            autoComplete="off"
            className={`w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-300 hover:border-blue-300 text-gray-800 placeholder-gray-400`}
            placeholder="مبلغ تخفیف را وارد کنید"
          />
        </div>
        
        {/* Summary Fields */}
        <div className="col-span-full flex flex-row gap-24 w-full">
          <div className="text-right w-full bg-lightGray p-4 rounded-xl">
            <label className="block mb-2 text-sm font-semibold text-darkBlue">
              شهریه
            </label>
            <div className="text-lg font-bold text-darkBlue">
              {formatCurrency(formData.total_tuition)} تومان
            </div>
          </div>

          <div className="text-right w-full bg-darkBlue p-4 rounded-xl">
            <label className="block mb-2 text-sm font-semibold text-offWhite">
              مبلغ کل
            </label>
            <div className="text-lg font-bold text-offWhite">
              {formatCurrency(formData.total_price)} تومان
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          className="bg-darkBlue text-offWhite px-8 py-3 rounded-xl hover:bg-opacity-90 transition-all duration-300 font-bold"
        >
          ثبت اشتراک
        </button>
      </div>
    </motion.form>
  );
}
