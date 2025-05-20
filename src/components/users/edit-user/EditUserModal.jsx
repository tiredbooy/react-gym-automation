import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import FormDataInputs from "../add-user/FormDataInputs";
import InsuranceDataInputs from "../add-user/InsuranceDataInputs";
import SubscriptionDataForm from "../add-user/SubscriptionDataForm";
import HandleAuthMethodInput from "../add-user/HandleAuthMethodInput";
import RadioGroup from "../../reusables/RadioGroup";
import { X, Save, Camera, Upload } from "lucide-react";

function EditUserModal({ onCloseModal, personId }) {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, background } = themes[activeTheme].colors;

  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [hardwareData, setHardwareData] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

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

    // Cleanup webcam stream on component unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
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

  const startWebcam = async () => {
    try {
      setWebcamError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
        setShowUploadOptions(false);
      }
    } catch (err) {
      setWebcamError(
        "دسترسی به وب‌کم امکان‌پذیر نیست. لطفا دسترسی را بررسی کنید."
      );
      console.error("Webcam error:", err);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const base64Image = canvasRef.current.toDataURL("image/jpeg");
      setImageSrc(base64Image);
      setFormData((prev) => ({
        ...prev,
        person_image: base64Image.split(",")[1],
      }));
      stopWebcam();
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setImageSrc(base64Image);
        setFormData((prev) => ({
          ...prev,
          person_image: base64Image.split(",")[1],
        }));
        setShowUploadOptions(false);
      };
      reader.readAsDataURL(file);
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
        person_image: formData.person_image || null, // Include Base64 image
      };

      fetch("http://localhost:8000/api/dynamic/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onCloseModal}
      >
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`bg-${background} text-${primary} rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 mx-4 relative`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                ویرایش اطلاعات کاربر
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
                >
                  <Save size={18} /> ذخیره
                </button>
                <button
                  onClick={onCloseModal}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Image Section */}
            {imageSrc && (
              <div className="flex flex-col items-center mb-8 relative">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setShowUploadOptions(true)}
                >
                  <img
                    src={imageSrc}
                    alt="کاربر"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-200 object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white text-sm">تغییر تصویر</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  ایجاد شده در: {formData.creation_datetime}
                </p>

                {/* Upload Options */}
                <AnimatePresence>
                  {showUploadOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-24 mt-2 bg-white rounded-lg shadow-xl p-4 z-10"
                    >
                      <button
                        onClick={startWebcam}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Camera size={18} /> وب‌کم
                      </button>
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Upload size={18} /> آپلود فایل
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Webcam Capture */}
            {isWebcamActive && (
              <div className="flex flex-col items-center mb-8">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-64 h-48 rounded-lg border-2 border-gray-200"
                />
                <button
                  onClick={captureImage}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  ثبت تصویر
                </button>
                <button
                  onClick={stopWebcam}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  لغو
                </button>
                {webcamError && (
                  <p className="text-red-500 text-sm mt-2">{webcamError}</p>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {/* Form */}
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
                wrapperClass={`card bg-${secondary} p-5 rounded-lg shadow-md`}
                error={errors.hasInsurance}
              />

              {formData.hasInsurance && (
                <InsuranceDataInputs
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
              )}

              <div className={`border-t border-${primary}/20 pt-6`}>
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
                  wrapperClass={`card bg-${secondary} p-5 rounded-lg shadow-md`}
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

              <div className={`border-t border-${primary}/20 pt-6`}>
                <h3 className={`text-xl font-bold mb-4 text-${primary}`}>
                  تمدید اشتراک
                </h3>
                <SubscriptionDataForm />
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default EditUserModal;
