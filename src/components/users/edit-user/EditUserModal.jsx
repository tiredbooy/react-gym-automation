import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import FormDataInputs from "../add-user/FormDataInputs";
import InsuranceDataInputs from "../add-user/InsuranceDataInputs";
import SubscriptionDataForm from "../add-user/SubscriptionDataForm";
import HandleAuthMethodInput from "../add-user/HandleAuthMethodInput";
import RadioGroup from "../../reusables/RadioGroup";
import { X, Save } from "lucide-react";

function EditUserModal({ onCloseModal, personId }) {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, background } = themes[activeTheme].colors;

  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [hardwareData, setHardwareData] = useState("");
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!personId) return;

    fetch(
      `http://localhost:8000/api/dynamic/?action=person&person_id=${personId}`
    )
      .then((res) => res.json())
      .then((res) => {
        const data = res.items?.[0];
        if (!data) return;

        setFormData({
          ...data,
          insurance_number: data.insurance_no || "",
          insurance_start: data.ins_start_date || "",
          insurance_end: data.ins_end_date || "",
        });

        if (data.person_image) {
          setImageSrc(
            `data:image/jpeg;base64,${data.person_image.replace(
              /^.*\/9j\//,
              "/9j/"
            )}`
          );
        }
      })
      .catch(console.error);
  }, [personId]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));

    if (name === "auth_method") {
      switch (value) {
        case "card":
          setHardwareData("در حال انتظار برای اسکن کارت...");
          break;
        case "fingerprint":
          setHardwareData("لطفا اثر انگشت را اسکن کنید...");
          break;
        case "face":
          setHardwareData("لطفا چهره را برای شناسایی اسکن کنید...");
          break;
        default:
          setHardwareData("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData?.first_name) newErrors.first_name = "نام الزامی است";
    if (!formData?.last_name) newErrors.last_name = "نام خانوادگی الزامی است";
    if (!formData?.mobile) newErrors.mobile = "شماره تماس الزامی است";
    if (!formData?.national_code) newErrors.national_code = "کد ملی الزامی است";
    if (!formData?.birth_date) newErrors.birth_date = "تاریخ تولد الزامی است";
    if (!formData?.gender) newErrors.gender = "جنسیت الزامی است";

    if (formData?.hasInsurance) {
      if (!formData?.insurance_number)
        newErrors.insurance_number = "شماره بیمه الزامی است";
      if (!formData?.insurance_start)
        newErrors.insurance_start = "تاریخ شروع بیمه الزامی است";
      if (!formData?.insurance_end)
        newErrors.insurance_end = "تاریخ پایان بیمه الزامی است";
    }

    if (!formData?.auth_method || formData.auth_method === "none") {
      newErrors.auth_method = "روش احراز هویت الزامی است";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload = {
        ...formData,
        insurance_no: formData.insurance_number,
        ins_start_date: formData.insurance_start,
        ins_end_date: formData.insurance_end,
        action: "update_person",
        person_id: formData.person_id,
      };

      fetch("http://localhost:8000/api/dynamic/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => onCloseModal())
        .catch(console.error);
    }
  };

  if (!formData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCloseModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={`fixed left-1/2 top-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-${background} text-${primary} rounded-3xl shadow-xl w-full max-w-5xl max-h-[95vh] overflow-hidden`}
      >
        <div className="h-full overflow-y-auto p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">ویرایش اطلاعات کاربر</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                <Save size={18} /> ذخیره
              </button>
              <button
                onClick={onCloseModal}
                className="text-red-500 hover:text-red-700"
              >
                <X size={28} />
              </button>
            </div>
          </div>

          {imageSrc && (
            <div className="flex flex-col justify-center items-center mb-6">
              <img
                src={imageSrc}
                alt="کاربر"
                className="w-32 h-32 rounded-xl border-2 border-gray-300 object-cover"
              />
              <p className="text-sm text-gray-500 mt-2">
                ایجاد شده در: {formData.creation_datetime}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <FormDataInputs
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />

            <RadioGroup
              name="hasInsurance"
              value={formData.hasInsurance}
              onChange={(v) => handleInputChange("hasInsurance", v)}
              options={[
                { value: true, label: "دارد" },
                { value: false, label: "ندارد" },
              ]}
              label="بیمه ورزشی"
              wrapperClass={`card bg-${secondary} p-4 rounded-xl`}
              error={errors.hasInsurance}
            />

            {formData.hasInsurance && (
              <InsuranceDataInputs
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
              />
            )}

            <div className={`border-t border-${primary} pt-6`}>
              <RadioGroup
                name="auth_method"
                value={formData.auth_method}
                onChange={(v) => handleInputChange("auth_method", v)}
                options={[
                  { value: "card", label: "کارت" },
                  { value: "fingerprint", label: "اثر انگشت" },
                  { value: "face", label: "چهره" },
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

            <div className={`border-t border-${primary} pt-6`}>
              <h3 className={`text-xl font-bold mb-4 text-${primary}`}>
                تمدید اشتراک
              </h3>
              <SubscriptionDataForm />
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default EditUserModal;
