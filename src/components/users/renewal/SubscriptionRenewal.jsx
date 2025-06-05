import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  Dumbbell,
  UserCheck,
  Tag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";
import DatePicker from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { usePricing } from "../../../context/SubscriptionPricing";

export default function SubscriptionRenewalModal({
  onSubmitUser,
  onClose,
  userID,
}) {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent, background } = themes[activeTheme].colors;

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    person_image: "",
    id: null,
  });

  // const userData = {
  //   first_name: "مهدی",
  //   last_name: "کاظمی",
  //   person_image: "https://randomuser.me/api/portraits/men/76.jpg",
  //   id: 12,
  // };

  const getUserData = useCallback(
    async function getUserData() {
      const response = await fetch(
        `http://127.0.0.1:8000/api/dynamic/?action=person&id=${userID}`
      );
      const data = await response.json();
      const receivedData = data.items[0];
      setUserData({
        first_name: receivedData?.first_name,
        last_name: receivedData?.last_name,
        person_image: receivedData.person_image
      ? `data:image/jpeg;base64,${receivedData.person_image.replace(
          /^.*\/9j\//,
          "/9j/"
        )}`
      : null,
        id: receivedData?.id,
      });
    },
    [userID]
  );

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.1, x: -700 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.1, x: -700 }}
        transition={{ duration: 0.25 }}
        className={`fixed z-50 
          bg-${background} text-${accent} rounded-3xl shadow-2xl 
          w-full max-w-6xl h-[70%] overflow-y-scroll p-8`}
      >
        <Header onClose={onClose} />
        <UserInfo userData={userData} />
        <SubscriptionInfo />
      </motion.div>
    </>
  );
}

function Header({ onClose }) {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent, background } = themes[activeTheme].colors;

  return (
    <header className={`flex justify-between items-center pb-5`}>
      <h1 className={`font-bold text-3xl text-${primary}`}>تمدید اشتراک</h1>
      <motion.span
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          mass: 1,
        }}
      >
        <X
          onClick={() => onClose()}
          className={`text-${primary} cursor-pointer`}
        />
      </motion.span>
    </header>
  );
}

function UserInfo({ userData }) {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent, background } = themes[activeTheme].colors;

  return (
    <div
      className={`flex flex-col justify-center items-center gap-3 border-b border-${primary} pb-5`}
    >
      <div
        className={`rounded-full mx-auto w-48 h-48 flex items-center justify-center`}
      >
        <img
          className="object-cover w-full h-full rounded-full"
          src={userData.person_image}
          alt="User Avatar"
        />
      </div>
      <div className="flex flex-row gap-3 text-lg">
        <div>
          <span className={`text-${accent}`}>کد : </span>
          <span className={`text-${primary} font-bold`}>{userData.id}</span>
        </div>
        <div>
          <span className={`text-${accent}`}>نام کاربر : </span>
          <span className={`text-${primary} font-bold`}>
            {userData.first_name} {userData.last_name}
          </span>
        </div>
      </div>
    </div>
  );
}

function SubscriptionInfo() {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent, background } = themes[activeTheme].colors;

  const { inputs, updateInput, pricing } = usePricing();

  const [formData, setFormData] = useState({
    plan: "normal",
    sport: "body_bulding",
    duration: "",
    startDate: "",
    endDate: "",
    sessions: "",
    price: "",
    tax: "",
    coach: "no-coach",
    coachPrice: "",
  });

  const coachList = ["بدون مربی", "مربی احمدی", "مربی رضایی", "مربی محمدی"];

  // Auto-calculate endDate
  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const start = new Date(formData.startDate);
      const months = parseInt(formData.duration, 10);

      if (!isNaN(months)) {
        const end = new Date(start);
        end.setMonth(end.getMonth() + months);
        const endTimestamp = end.getTime();

        setFormData((prev) => ({
          ...prev,
          endDate: endTimestamp,
        }));
      }
    }
  }, [formData.startDate, formData.duration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (["price", "tax", "coachPrice"].includes(name)) {
      updateInput(name, value);
    }
  };

  // const calculateTax = () => {
  //   const price = Number(formData.price) || 0;
  //   const coachPrice = Number(formData.coachPrice) || 0;
  //   const tax = Number(formData.tax) || 0;

  //   if (!price) return { taxPrice: 0, totalPrice: coachPrice }; // no base price, nothing to calculate

  //   const taxPrice = (tax / 100) * price;
  //   const totalPrice = price + taxPrice + coachPrice;

  //   return {
  //     taxPrice,
  //     totalPrice,
  //   };
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 px-1 py-2 md:grid-cols-2 lg:grid-cols-3">
        {/* Plan */}
        <div className="flex flex-col">
          <label className={`text-sm font-medium text-right text-${accent}`}>
            نوع اشتراک
          </label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            className={`bg-${background} border border-${primary} px-4 py-2 rounded-xl focus:ring focus-ring-${primary}/60 duration-200 outline-none text-${accent}`}
          >
            <option value="normal">عادی</option>
            <option value="vip">ویژه (VIP)</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className={`text-sm font-medium text-right ${accent}`}>
            رشته
          </label>
          <select
            name="body_bulding"
            value={formData.body_bulding}
            onChange={handleChange}
            className={`bg-${background} border border-${primary} px-4 py-2 rounded-xl focus:ring focus-ring-${primary}/60 duration-200 outline-none text-${accent}`}
          >
            <option value="bulding">بدنسازی</option>
            <option value="crossfit">کراسفیت</option>
            <option value="trx">تی ار اکس</option>
            <option value="yoga">یوگا</option>
          </select>
        </div>

        {/* Duration */}
        <div className="flex flex-col">
          <label className={`text-sm font-medium text-right ${accent}`}>
            مدت (ماه)
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={`bg-${background} border border-${primary} px-4 py-2 rounded-xl focus:ring focus-ring-${primary}/60 duration-200 outline-none text-${accent}`}
          >
            <option value="">انتخاب کنید</option>
            {[1, 2, 3, 6, 12].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Sessions */}
        <div className="flex flex-col">
          <label className={`text-sm font-medium text-right ${accent}`}>
            تعداد جلسات
          </label>
          <select
            name="sessions"
            value={formData.sessions}
            onChange={handleChange}
            className={`bg-${background} border border-${primary} px-4 py-2 rounded-xl focus:ring focus-ring-${primary}/60 duration-200 outline-none text-${accent}`}
          >
            <option value="">انتخاب کنید</option>
            {[8, 12, 16, 20, 24, 26, 30].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col">
          <label className={`text-sm font-medium text-right text-${accent}`}>
            تاریخ شروع
          </label>
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={
              formData.startDate
                ? new DateObject({ date: formData.startDate })
                : ""
            }
            onChange={(date) => {
              const gregorianDate = date?.toDate();
              const timestamp = gregorianDate?.getTime();
              setFormData({
                ...formData,
                startDate: timestamp || "",
              });
            }}
            className="custom-persian-picker"
            containerClassName="w-full"
            inputClass={`w-full bg-${background} border border-${primary} px-4 py-2 rounded-xl focus:ring focus:ring-${primary}/60 text-${accent} outline-none text-right`}
            placeholder="تاریخ را انتخاب کنید"
            calendarPosition="bottom-right"
          />
        </div>

        {/* End Date (readonly) */}
        <div className="flex flex-col">
          <label className={`text-sm font-medium text-right ${accent}`}>
            تاریخ پایان
          </label>
          <input
            type="text"
            name="endDate"
            readOnly
            value={
              formData.endDate
                ? new DateObject({
                    date: formData.endDate,
                    calendar: persian,
                    locale: persian_fa,
                  }).format("YYYY/MM/DD")
                : ""
            }
            className={`bg-${background} border border-${primary} cursor-not-allowed outline-none text-${accent} px-4 py-2 rounded-xl`}
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className={`text-sm font-medium text-right ${accent}`}>
            قیمت (تومان)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`bg-${background} border border-${primary} px-4 py-2 rounded-xl focus:ring focus-ring-${primary}/60 duration-200 outline-none text-${accent}`}
            placeholder="مثلاً 500000"
          />
        </div>

        {/* Tax Input */}
        {formData.price && (
          <div className="flex flex-col">
            <label className={`text-sm font-medium text-right ${accent}`}>
              مالیات (%)
            </label>
            <input
              type="number"
              name="tax"
              value={formData.tax}
              onChange={handleChange}
              className={`bg-${background} border border-${primary} px-4 py-2 rounded-xl focus:ring focus-ring-${primary}/60 duration-200 outline-none text-${accent}`}
              placeholder="اگر خالی باشد بدون مالیات"
            />
          </div>
        )}

        {/* Coach Select */}
        <div className="flex flex-col">
          <label className={`text-sm font-medium text-right ${accent}`}>
            انتخاب مربی
          </label>
          <select
            name="coach"
            value={formData.coach}
            onChange={handleChange}
            className={`bg-${background} border border-${primary} px-4 py-2 rounded-xl focus:ring focus-ring-${primary}/60 duration-200 outline-none text-${accent}`}
          >
            {coachList.map((c, i) => (
              <option key={i} value={i === 0 ? "no-coach" : c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Coach Price (if coach selected) */}
        {formData.coach !== "no-coach" && (
          <motion.div
            className="flex flex-col col-span-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <label className={`text-sm font-medium text-right ${accent}`}>
              هزینه مربی (تومان)
            </label>
            <input
              type="number"
              name="coachPrice"
              value={formData.coachPrice}
              onChange={handleChange}
              className={`bg-${background} border border-${primary} px-4 py-2 rounded-xl focus:ring focus-ring-${primary}/60 duration-200 outline-none text-${accent}`}
              placeholder="مثلاً 200000"
            />
          </motion.div>
        )}
      </div>

      <div
        className={`w-full px-6 py-4 flex flex-wrap gap-6 rounded-xl font-bold bg-${secondary}`}
      >
        <div>
          <span>نوع اشتراک : </span>
          <span>{formData.plan === "normal" ? "معمولی" : formData.plan}</span>
        </div>
        {formData.duration && (
          <div>
            <span>مدت اشتراک :</span>
            <span>{formData.duration} ماه</span>
          </div>
        )}
        {formData.price && (
          <div>
            <span>شهریه : </span>
            <span>{pricing.subtotal.toLocaleString("fa-IR")}</span>
          </div>
        )}
        {formData.tax && (
          <div>
            <span>مالیات : </span>
            {/* <span>{calculateTax()?.taxPrice.toLocaleString("fa-IR")}</span> */}
            <span>{pricing.taxAmount.toLocaleString("fa-IR")}</span>
          </div>
        )}
        {formData.coachPrice && (
          <div>
            <span>مربی : </span>
            <span>{Number(formData?.coachPrice)?.toLocaleString("fa-IR")}</span>
          </div>
        )}
        {formData.tax && (
          <div>
            <span>جمع کل : </span>
            <span>{pricing.total.toLocaleString("fa-IR")}</span>
            {/* <span>{calculateTax()?.totalPrice.toLocaleString("fa-IR")}</span> */}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="px-6 py-2 font-bold text-white transition bg-primary rounded-xl hover:bg-opacity-90"
          onClick={(e) => {
            e.preventDefault();
            // toast.success("تمدید با موفقیت ثبت شد");
          }}
        >
          ثبت تمدید
        </motion.button>
      </div>
    </motion.div>
  );
}
