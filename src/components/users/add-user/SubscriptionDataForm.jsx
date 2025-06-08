import { motion } from "framer-motion";
import { useReducer, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { useTheme } from "../../../context/ThemeContext";
import { usePricing } from "../../../context/SubscriptionPricing";
import { useUser } from "../../../context/UserApiContext";

// Data constants
const sports = [
  { id: 1, label: "بدنسازی" },
  { id: 2, label: "کراسفیت" },
  { id: 3, label: "یوگا" },
  { id: 4, label: "ایروبیک" },
];

const coaches = [
  { value: "", label: "بدون مربی", vipPrice: 0, normalPrice: 0 },
  { value: "ali", label: "علی محمدی", vipPrice: 4500000, normalPrice: 1000000 },
  {
    value: "reza",
    label: "رضا حسینی",
    vipPrice: 4500000,
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
  { value: "normal", label: "ماهانه (عادی)", basePrice: 1400000 },
  { value: "vip", label: "ماهانه (ویژه)", basePrice: 2300000 },
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

// Utility functions
const toEnglishDigits = (str) =>
  str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

const formatCurrency = (amount) =>
  new Intl.NumberFormat("fa-IR").format(amount);

const calculateEndDate = (startDate, months) => {
  if (!startDate) return null;
  const endDate = new DateObject(startDate);
  endDate.month += months;
  return toEnglishDigits(endDate.format("YYYY/MM/DD"));
};

// Reducer
const initialState = {
  sport: "",
  session_time: "",
  coach: "",
  programType: null,
  coach_price: 0,
  subscription_type: "",
  duration: "",
  minutiae: null,
  minutiae2: null,
  minutiae3: null,
  face_template_1: null,
  face_template_2: null,
  face_template_3: null,
  face_template_4: null,
  face_template_5: null,
  paid_method: null,
  start_date: null,
  end_date: null,
  locker_number: null,
  insurance_fee: 0,
  card_fee: 50000,
  discount: 0,
  total_tuition: 0,
  total_price: 0,
  errors: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: null },
      };
    case "UPDATE_NUMERIC":
      return { ...state, [action.field]: action.value };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "UPDATE_TOTALS":
      return {
        ...state,
        total_tuition: action.tuition,
        total_price: action.total,
      };
    default:
      return state;
  }
};

// Components
const SelectField = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
  disabled,
}) => {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent } = themes[activeTheme].colors;

  return (
    <div className="text-right">
      <label className={`block mb-2 text-sm font-semibold text-${accent}`}>
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 text-right bg-${secondary} border-2 rounded-xl text-${accent} focus:outline-none focus:ring-2 focus:ring-${primary} focus:border-transparent transition-all duration-300 hover:border-${primary}/40 appearance-none ${
          error ? "border-red-500" : `border-${primary}`
        } ${disabled ? "opacity-50" : ""}`}
        aria-label={label}
      >
        <option value="" disabled>{`انتخاب ${label}`}</option>
        {options.map((option) => (
          <option
            key={option.value || option.id}
            value={option.value || option.label}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const NumberField = ({ label, name, value, onChange, error }) => {
  const { activeTheme, themes } = useTheme();
  const { primary, accent } = themes[activeTheme].colors;

  return (
    <div className="text-right">
      <label className={`block mb-2 text-sm font-semibold text-${accent}`}>
        {label}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 text-right bg-transparent border-2 rounded-xl text-${accent} focus:outline-none focus:ring-2 focus:ring-${primary}/60 focus:border-transparent transition-all duration-300 hover:border-${primary}/30 appearance-none ${
          error ? "border-red-500" : `border-${primary}`
        }`}
        placeholder={`وارد کردن ${label}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const DateField = ({ label, value, onChange, error }) => {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent } = themes[activeTheme].colors;

  return (
    <div className="text-right">
      <label className={`block mb-2 text-sm font-semibold text-${accent}`}>
        {label}
      </label>
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        digits="en"
        calendarPosition="bottom-right"
        value={
          value
            ? new DateObject({
                date: value,
                format: "YYYY/MM/DD",
                calendar: persian,
              })
            : null
        }
        onChange={onChange}
        inputClass={`w-full px-4 py-3 text-right border-2 bg-${secondary} rounded-xl focus:outline-none focus:ring-2 focus:ring-${primary} focus:border-transparent transition-all duration-300 hover:border-${primary} text-${accent} placeholder-gray-400 ${
          error ? "border-red-500" : `border-${primary}`
        }`}
        placeholder={`انتخاب ${label}`}
        aria-label={label}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default function SubscriptionDataForm() {
  const { isLoading, userID, handleSubscription } = useUser();
  const { inputs, updateInput, pricing } = usePricing();
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent, background } = themes[activeTheme].colors;

  const [state, dispatch] = useReducer(reducer, initialState);

  // Calculate totals
  useEffect(() => {
    let tuition = 0;
    const selectedType = subscriptionTypes.find(
      (type) => type.value === state.subscription_type
    );
    if (selectedType) {
      if (state.subscription_type === "session") {
        tuition = selectedType.basePrice * state.sessions;
      } else {
        const selectedDuration = durations.find(
          (d) => d.value === state.duration
        );
        tuition = selectedType.basePrice * (selectedDuration?.months || 0);
      }
    }
    const total =
      tuition +
      state.coach_price +
      state.insurance_fee +
      state.card_fee -
      state.discount;
    dispatch({ type: "UPDATE_TOTALS", tuition, total });
    updateInput("price", tuition);
  }, [
    state.subscription_type,
    state.duration,
    state.sessions,
    state.coach_price,
    state.insurance_fee,
    state.card_fee,
    state.discount,
  ]);

  // Sync with context
  useEffect(() => {
    dispatch({
      type: "UPDATE_TOTALS",
      tuition: state.total_tuition,
      total: pricing.total,
    });
  }, [pricing.total]);

  // Handlers
  const handleInputChange = (field, value) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseInt(value, 10) || 0;
    dispatch({ type: "UPDATE_NUMERIC", field: name, value: numValue });
    const contextFieldMap = {
      insurance_fee: "insurancePrice",
      card_fee: "cardPrice",
      discount: "discount",
      coach_price: "coachPrice",
    };
    if (contextFieldMap[name]) updateInput(contextFieldMap[name], numValue);
  };

  const handleCoachSelect = (e) => {
    const { value } = e.target;
    const selectedCoach =
      coaches.find((coach) => coach.value === value) || coaches[0];
    const coachPrice = value
      ? state.programType
        ? selectedCoach.vipPrice
        : selectedCoach.normalPrice
      : 0;
    dispatch({ type: "UPDATE_FIELD", field: "coach", value });
    dispatch({
      type: "UPDATE_NUMERIC",
      field: "coach_price",
      value: coachPrice,
    });
    updateInput("coachPrice", coachPrice);
  };

  const handleProgramTypeChange = (value) => {
    const selectedCoach = coaches.find((coach) => coach.value === state.coach);
    const coachPrice = selectedCoach
      ? value
        ? selectedCoach.vipPrice
        : selectedCoach.normalPrice
      : 0;
    dispatch({ type: "UPDATE_FIELD", field: "programType", value });
    dispatch({
      type: "UPDATE_NUMERIC",
      field: "coach_price",
      value: coachPrice,
    });
    updateInput("coachPrice", coachPrice);
  };

  const handleSubscriptionTypeChange = (e) => {
    const { value } = e.target;
    const selectedCoach = coaches.find((coach) => coach.value === state.coach);
    const coachPrice = selectedCoach
      ? value === "vip"
        ? selectedCoach.vipPrice
        : selectedCoach.normalPrice
      : 0;
    const locker_number = value === "vip" ? state.locker_number : null;
    dispatch({ type: "UPDATE_FIELD", field: "subscription_type", value });
    dispatch({
      type: "UPDATE_NUMERIC",
      field: "coach_price",
      value: coachPrice,
    });
    dispatch({
      type: "UPDATE_FIELD",
      field: "locker_number",
      value: locker_number,
    });
    updateInput("coachPrice", coachPrice);
  };

  const handleDurationChange = (e) => {
    const { value } = e.target;
    dispatch({ type: "UPDATE_FIELD", field: "duration", value });
    if (state.start_date) {
      const selectedDuration = durations.find((d) => d.value === value);
      if (selectedDuration) {
        const endDate = calculateEndDate(
          new DateObject({
            date: state.start_date,
            format: "YYYY/MM/DD",
            calendar: persian,
          }),
          selectedDuration.months
        );
        dispatch({ type: "UPDATE_FIELD", field: "end_date", value: endDate });
      }
    }
  };

  const handleStartDateChange = (dateObject) => {
    if (!dateObject) return;
    const jalaliDate = dateObject.format("YYYY/MM/DD");
    const englishDate = toEnglishDigits(jalaliDate);
    dispatch({ type: "UPDATE_FIELD", field: "start_date", value: englishDate });
    if (state.duration) {
      const selectedDuration = durations.find(
        (d) => d.value === state.duration
      );
      if (selectedDuration) {
        const endDate = calculateEndDate(dateObject, selectedDuration.months);
        dispatch({ type: "UPDATE_FIELD", field: "end_date", value: endDate });
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!state.sport) errors.sport = "لطفا رشته ورزشی را انتخاب کنید";
    if (!state.session_time) errors.session_time = "لطفا سانس را انتخاب کنید";
    if (!state.subscription_type)
      errors.subscription_type = "لطفا نوع عضویت را انتخاب کنید";
    if (["normal", "vip"].includes(state.subscription_type) && !state.duration)
      errors.duration = "لطفا مدت زمان را انتخاب کنید";
    if (state.subscription_type === "session" && !state.sessions)
      errors.sessions = "لطفا تعداد جلسات را انتخاب کنید";
    if (!state.start_date) errors.start_date = "لطفا تاریخ شروع را انتخاب کنید";
    if (state.subscription_type === "vip" && !state.locker_number)
      errors.locker_number = "لطفا شماره کمد را انتخاب کنید";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }

    // Map state to match handleSubscription expected format
    const formData = {
      ...state,
      fingerMinutiae1: state.minutiae,
      fingerMinutiae2: state.minutiae2,
      fingerMinutiae3: state.minutiae3,
      face_template: state.face_template_1, // Map face_template_1 to face_template
    };

    handleSubscription(formData);
    console.log("Form submitted:", formData);
    alert("فرم با موفقیت ثبت شد");
  };

  return (
    <motion.form
      className={`bg-gradient-to-l from-${secondary} shadow rounded-xl p-6`}
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SelectField
          label="رشته ورزشی"
          name="sport"
          value={state.sport}
          options={sports}
          onChange={(e) => handleInputChange("sport", e.target.value)}
          error={state.errors.sport}
        />
        <SelectField
          label="سانس"
          name="session_time"
          value={state.session_time}
          options={sessionTimes}
          onChange={(e) => handleInputChange("session_time", e.target.value)}
          error={state.errors.session_time}
        />
        <SelectField
          label="مربی"
          name="coach"
          value={state.coach}
          options={coaches}
          onChange={handleCoachSelect}
        />
        {state.coach && state.coach !== "" && (
          <>
            <div className="text-right">
              <label
                className={`block mb-2 text-sm font-semibold text-${accent}`}
              >
                نوع برنامه
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="programType"
                    value={true}
                    checked={state.programType === true}
                    onChange={() => handleProgramTypeChange(true)}
                    className="ml-2"
                  />
                  خصوصی
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="programType"
                    value={false}
                    checked={state.programType === false}
                    onChange={() => handleProgramTypeChange(false)}
                    className="ml-2"
                  />
                  برنامه
                </label>
              </div>
            </div>
            <NumberField
              label="هزینه برنامه"
              name="coach_price"
              value={state.coach_price}
              onChange={handleNumericChange}
            />
          </>
        )}
        <SelectField
          label="نوع عضویت"
          name="subscription_type"
          value={state.subscription_type}
          options={subscriptionTypes}
          onChange={handleSubscriptionTypeChange}
          error={state.errors.subscription_type}
        />
        {state.subscription_type === "vip" && (
          <NumberField
            label="شماره کمد"
            name="locker_number"
            value={state.locker_number || ""}
            onChange={(e) =>
              handleInputChange(
                "locker_number",
                e.target.value ? parseInt(e.target.value, 10) : null
              )
            }
            error={state.errors.locker_number}
          />
        )}
        <SelectField
          label="مدت زمان"
          name="duration"
          value={state.duration}
          options={durations}
          onChange={handleDurationChange}
          error={state.errors.duration}
          disabled={state.subscription_type === "session"}
        />
        <SelectField
          label="تعداد جلسات"
          name="sessions"
          value={state.sessions}
          options={sessions}
          onChange={(e) =>
            handleInputChange("sessions", parseInt(e.target.value, 10))
          }
          error={state.errors.sessions}
          disabled={state.subscription_type !== "session"}
        />
        <DateField
          label="تاریخ شروع"
          value={state.start_date}
          onChange={handleStartDateChange}
          error={state.errors.start_date}
        />
        <div className="text-right">
          <label className={`block mb-2 text-sm font-semibold text-${accent}`}>
            تاریخ پایان
          </label>
          <input
            type="text"
            value={state.end_date || ""}
            readOnly
            className={`w-full px-4 py-3 text-right border-2 bg-${secondary} border-${primary} rounded-xl focus:outline-none focus:ring-2 focus:ring-${primary} focus:border-transparent transition-all duration-300 hover:border-${primary} text-${accent} placeholder-gray-400`}
            placeholder="تاریخ پایان"
          />
        </div>
        <div className="text-right">
          <label className={`block mb-2 text-sm font-semibold text-${accent}`}>
            هزینه شهریه
          </label>
          <div
            className={`w-full px-4 py-3 text-right bg-${secondary} border-2 border-${primary} rounded-xl text-${accent}`}
          >
            {formatCurrency(state.total_tuition)} تومان
          </div>
        </div>
        <NumberField
          label="هزینه بیمه"
          name="insurance_fee"
          value={state.insurance_fee}
          onChange={handleNumericChange}
        />
        <NumberField
          label="هزینه کارت"
          name="card_fee"
          value={state.card_fee}
          onChange={handleNumericChange}
        />
        <NumberField
          label="تخفیف"
          name="discount"
          value={state.discount}
          onChange={handleNumericChange}
        />
        <div className="flex flex-row w-full gap-24 col-span-full">
          <div className={`text-right w-full bg-${accent} p-4 rounded-xl`}>
            <label
              className={`block mb-2 text-sm font-semibold text-${background}`}
            >
              شهریه
            </label>
            <div className={`text-lg font-bold text-${background}`}>
              {formatCurrency(state.total_tuition)} تومان
            </div>
          </div>
          <div
            onClick={() => console.log(userID)}
            className={`text-right w-full bg-${primary} p-4 rounded-xl`}
          >
            <label
              className={`block mb-2 text-sm font-semibold text-${background}`}
            >
              مبلغ کل
            </label>
            <div className={`text-lg font-bold text-${background}`}>
              {formatCurrency(pricing.total)} تومان
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className={`mt-6 px-6 py-3 bg-${primary} text-${background} rounded-xl hover:bg-${primary}/80 transition-colors`}
      >
        ثبت فرم
      </button>
    </motion.form>
  );
}
