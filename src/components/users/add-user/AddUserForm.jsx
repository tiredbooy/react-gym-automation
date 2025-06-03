import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RadioGroup from "../../reusables/RadioGroup";
import HandleAuthMethodInput from "./HandleAuthMethodInput";
import FormDataInputs from "./FormDataInputs";
import InsuranceDataInputs from "./InsuranceDataInputs";
import SubscriptionDataForm from "./SubscriptionDataForm";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserApiContext";

function AddUserForm({ onOpen, personImage }) {
  const { isLoading , handleAddUser } = useUser();
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent, background } = themes[activeTheme].colors;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    national_code: "",
    birth_date: null,
    person_image: personImage || null,
    thumbnail_image: personImage || null,
    gender: "",
    has_insurance: false,
    insurance_no: "",
    ins_start_date: null,
    ins_end_date: null,
    hardwareData: "",
  });

  const [memberData, setMemberData] = useState({
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
    locker_number: null,
    insurance_fee: 0,
    card_fee: 50000,
    discount: 0,
    total_tuition: 0,
    total_price: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      person_image: personImage,
      thumbnail_image: personImage,
    }));
  }, [personImage]);


  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (name === "auth_method") {
      let hardwareData = "";
      switch (value) {
        case "card":
          hardwareData = "در حال انتظار برای اسکن کارت...";
          break;
        case "fingerprint":
          hardwareData = "لطفا اثر انگشت را اسکن کنید...";
          break;
        case "face":
          hardwareData = "لطفا چهره را برای شناسایی اسکن کنید...";
          break;
        default:
          hardwareData = "";
      }
      setFormData((prev) => ({ ...prev, hardwareData }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "نام الزامی است";
    if (!formData.last_name) newErrors.last_name = "نام خانوادگی الزامی است";
    if (!formData.mobile) newErrors.mobile = "شماره تماس الزامی است";
    if (!formData.national_code) newErrors.national_code = "کد ملی الزامی است";
    if (!formData.birth_date) newErrors.birth_date = "تاریخ تولد الزامی است";
    if (!formData.gender) newErrors.gender = "جنسیت الزامی است";
    if (formData.has_insurance) {
      if (!formData.insurance_no)
        newErrors.insurance_no = "شماره بیمه الزامی است";
      if (!formData.ins_start_date)
        newErrors.ins_start_date = "تاریخ شروع بیمه الزامی است";
      if (!formData.ins_end_date)
        newErrors.ins_end_date = "تاریخ پایان بیمه الزامی است";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if(newErrors) console.log(newErrors);
    if (Object.keys(newErrors).length === 0) {
      handleAddUser(formData)
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      autoComplete="off"
      className={`w-full mx-auto p-8 bg-gradient-to-tl from-${secondary} rounded-xl mt-5`}
    >
      <div className="flex flex-col">
        <FormDataInputs
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
        />
        <div className="mt-4 text-right col-span-full">
          <RadioGroup
            name="has_insurance"
            value={formData.has_insurance}
            onChange={(value) => handleInputChange("has_insurance", value)}
            options={[
              { value: true, label: "دارد" },
              { value: false, label: "ندارد" },
            ]}
            label="بیمه ورزشی"
            wrapperClass={`card bg-${secondary} p-4 rounded-xl`}
            error={errors.has_insurance}
          />
        </div>
        <AnimatePresence mode="wait">
          {formData.has_insurance && (
            <InsuranceDataInputs
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          )}
        </AnimatePresence>
        <div className="mt-5 text-right">
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-xl bg-${primary} font-bold text-${secondary} hover:brightness-90 duration-200`}
          >
            {isLoading ? "لودینگ" : "ثبت کاربر"}
          </button>
        </div>
      </div>

      <div className={`border-t border-${primary} mt-8 pt-6 w-full`}>
        <RadioGroup
          name="auth_method"
          value={formData.auth_method}
          onChange={(value) => handleInputChange("auth_method", value)}
          options={[
            { value: "card", label: "کارت" },
            { value: "fingerprint", label: "اثر انگشت" },
            { value: "face", label: "تشخیص چهره" },
            { value: "none", label: "هیچکدام" },
          ]}
          label="روش احراز هویت"
          wrapperClass={`card bg-${secondary} p-4 rounded-xl`}
          error={errors.auth_method}
        />
        <AnimatePresence>
          {formData.auth_method !== "none" && (
            <HandleAuthMethodInput
              hardwareData={formData.hardwareData}
              formData={formData}
              setHardwareData={(data) =>
                handleInputChange("hardwareData", data)
              }
            />
          )}
        </AnimatePresence>
      </div>
      <div
        className={`border-t border-${primary} mt-8 pt-6 w-full flex flex-col gap-4`}
      >
        <h2 className={`text-center text-2xl font-bold text-${primary}`}>
          اشتراک
        </h2>
        <SubscriptionDataForm />
      </div>
      <div className="flex flex-row gap-5 col-span-full">
        <motion.button
          onClick={() => onOpen((isOpen) => !isOpen)}
          type="button"
          className={`mt-8 w-full sm:w-auto flex justify-center bg-red-700 hover:bg-red-700/90 text-${background} rounded-xl px-6 py-3 font-semibold`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          بازگشت
        </motion.button>
        {isLoading ? (
          <div>Loading</div>
        ) : (
          <motion.button
            type="submit"
            className={`mt-8 w-full sm:w-auto flex justify-center bg-${primary} hover:bg-${primary}/90 text-${background} rounded-xl px-6 py-3 font-semibold`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ثبت نام کاربر
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default AddUserForm;
