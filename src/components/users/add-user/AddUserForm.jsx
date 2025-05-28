import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
// import RadioGroup from "./RadioGroup";
import RadioGroup from "../../reusables/RadioGroup";
import HandleAuthMethodInput from "./HandleAuthMethodInput";
import FormDataInputs from "./FormDataInputs";
import InsuranceDataInputs from "./InsuranceDataInputs";
import SubscriptionDataForm from "./SubscriptionDataForm";
import { useTheme } from "../../../context/ThemeContext";
import { useData } from "../../../context/UserSubscriptionApiContext";

function AddUserForm({ onOpen, personImage }) {
  const { handleAddUser } = useData();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    national_code: "",
    birth_date: null,
    person_image: personImage ? personImage : "",
    thumbnail_image: personImage ? personImage : "",
    gender: "",
    has_insurance: false,
    insurance_no: "",
    ins_start_date: null,
    ins_end_date: null,
    auth_method: "none", // Combined authentication method
  });
  const [errors, setErrors] = useState({});
  const [hardwareData, setHardwareData] = useState(""); // Mock hardware data

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    // Mock hardware data update (replace with actual hardware integration)
    if (name === "auth_method") {
      switch (value) {
        case "card":
          setHardwareData("در حال انتظار برای اسکن کارت...");
          // Example: Call Electron.js card reader function
          // window.electronAPI.scanCard().then(data => setHardwareData(data));
          break;
        case "fingerprint":
          setHardwareData("لطفا اثر انگشت را اسکن کنید...");
          // Example: Call Electron.js fingerprint scanner
          // window.electronAPI.scanFingerprint().then(data => setHardwareData(data));
          break;
        case "face":
          setHardwareData("لطفا چهره را برای شناسایی اسکن کنید...");
          // Example: Call Electron.js face recognition
          // window.electronAPI.scanFace().then(data => setHardwareData(data));
          break;
        default:
          setHardwareData("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    if (!formData.auth_method || formData.auth_method === "none") {
      newErrors.auth_method = "لطفا روش احراز هویت را انتخاب کنید";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", { ...formData, hardwareData });
      handleAddUser(formData);
      // Add API call or hardware data submission
    }
  };

  return (
    <motion.form
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      autoComplete="off"
      onSubmit={handleSubmit}
      className={`w-full mx-auto p-8 bg-gradient-to-tl from-${secondary} rounded-xl mt-5`}
    >
      <FormDataInputs
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
      />

      {/* Insurance Check */}
      <div className="text-right col-span-full mt-4">
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

      {/* Insurance Fields */}
      {formData.has_insurance && (
        <InsuranceDataInputs
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
        />
      )}

      {/* Combined Authentication Section */}
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
              hardwareData={hardwareData}
              formData={formData}
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
        <motion.button
          type="submit"
          className={`mt-8 w-full sm:w-auto flex justify-center bg-${primary} hover:bg-${primary}/90 text-${background} rounded-xl px-6 py-3 font-semibold`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          ثبت نام کاربر
        </motion.button>
      </div>
    </motion.form>
  );
}

export default AddUserForm;
