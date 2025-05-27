import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import FormDataInputs from "../add-user/FormDataInputs";
import InsuranceDataInputs from "../add-user/InsuranceDataInputs";
import SubscriptionDataForm from "../add-user/SubscriptionDataForm";
import HandleAuthMethodInput from "../add-user/HandleAuthMethodInput";
import RadioGroup from "../../reusables/RadioGroup";
import { X, Save, Camera, Upload } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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

    fetch(`http://localhost:8000/api/dynamic/?action=person&id=${personId}`)
      .then((res) => res.json())
      .then((res) => {
        const data = res.items?.[0];
        if (!data) return;

        setFormData({
          person_id: data.person_id || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          full_name:
            data.full_name ||
            `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          father_name: data.father_name || "",
          gender: data.gender || "",
          national_code: data.national_code || "",
          nidentity: data.nidentity || "",
          person_image: data.person_image || "",
          thumbnail_image: data.thumbnail_image || "",
          birth_date: data.birth_date || "",
          tel: data.tel || "",
          mobile: data.mobile || "",
          email: data.email || "",
          education: data.education || "",
          job: data.job || "",
          has_insurance: data.has_insurance || false,
          insurance_number: data.insurance_no || "",
          insurance_start: data.ins_start_date || null,
          insurance_end: data.ins_end_date || null,
          address: data.address || "",
          has_parrent: data.has_parrent || false,
          team_name: data.team_name || null,
          shift: data.shift || 2,
          user: data.user || null,
          creation_datetime: data.creation_datetime || "",
          modifier: data.modifier || "",
          modification_datetime: data.modification_datetime || "",
          auth_method: data.auth_method || "none",
        });

        if (data.person_image) {
          setImageSrc(`data:image/jpeg;base64,${data.person_image}`);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("خطا در بارگذاری اطلاعات کاربر");
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [personId]);

  const handleInputChange = (name, value) => {
    const formattedValue =
      name === "birth_date" && value?.toString
        ? value.toString("YYYY/MM/DD", { calendar: "persian" })
        : name === "gender"
        ? value === "زن"
          ? "F"
          : value === "مرد"
          ? "M"
          : value
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
      ...(name === "first_name" || name === "last_name"
        ? {
            full_name: `${prev.first_name || ""} ${
              prev.last_name || ""
            }`.trim(),
          }
        : {}),
    }));
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          console.error("Video play error:", err);
          setWebcamError(
            "نمی‌توان ویدیو را پخش کرد. لطفا دسترسی را بررسی کنید."
          );
        });
        console.log("Webcam stream started:", stream);
        setIsWebcamActive(true);
        setShowUploadOptions(false);
      }
    } catch (err) {
      setWebcamError(
        "دسترسی به وب‌کم امکان‌پذیر نیست. لطفا دسترسی را بررسی کنید."
      );
      console.error("Webcam error:", err);
      toast.error("خطا در دسترسی به وب‌کم");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const base64Image = canvasRef.current.toDataURL("image/jpeg");
      const base64Data = base64Image.split(",")[1];
      setImageSrc(base64Image);
      setFormData((prev) => ({
        ...prev,
        person_image: base64Data,
      }));
      console.log(
        "Captured image Base64:",
        base64Data.substring(0, 50) + "..."
      );
      stopWebcam();
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("لطفا یک فایل تصویری آپلود کنید");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const jpegBase64 = canvas.toDataURL("image/jpeg").split(",")[1];
          setImageSrc(`data:image/jpeg;base64,${jpegBase64}`);
          setFormData((prev) => ({
            ...prev,
            person_image: jpegBase64,
          }));
          console.log(
            "Uploaded image Base64:",
            jpegBase64.substring(0, 50) + "..."
          );
          setShowUploadOptions(false);
        };
        img.src = base64Image;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData?.first_name) newErrors.first_name = "نام الزامی است";
    if (!formData?.last_name) newErrors.last_name = "نام خانوادگی الزامی است";
    if (!formData?.mobile) newErrors.mobile = "شماره تماس الزامی است";
    else if (!/^\d{11}$/.test(formData.mobile))
      newErrors.mobile = "شماره موبایل باید 11 رقم باشد";
    if (!formData?.national_code) newErrors.national_code = "کد ملی الزامی است";
    else if (!/^\d{10}$/.test(formData.national_code))
      newErrors.national_code = "کد ملی باید 10 رقم باشد";
    if (!formData?.birth_date) newErrors.birth_date = "تاریخ تولد الزامی است";
    else if (!/^\d{4}\/\d{2}\/\d{2}$/.test(formData.birth_date))
      newErrors.birth_date = "فرمت تاریخ تولد باید YYYY/MM/DD باشد";
    if (!formData?.gender) newErrors.gender = "جنسیت الزامی است";
    else if (!["M", "F"].includes(formData.gender))
      newErrors.gender = "جنسیت باید مرد یا زن باشد";
    if (formData?.has_insurance) {
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
        first_name: formData.first_name,
        last_name: formData.last_name,
        national_code: formData.national_code,
        gender: formData.gender,
        mobile: formData.mobile,
        birth_date: formData.birth_date,
        person_image: formData.person_image || null,
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      toast.promise(
        fetch(
          `http://localhost:8000/api/dynamic/?action=person&id=${personId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        )
          .then(async (res) => {
            const responseData = await res.json();
            console.log("API response:", responseData);
            if (!res.ok) {
              const errorMessage = responseData.errors
                ? Object.entries(responseData.errors)
                    .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
                    .join("; ")
                : responseData.message || `HTTP ${res.status}: Bad Request`;
              throw new Error(errorMessage);
            }
            return responseData;
          })
          .then(() => {
            onCloseModal();
            return "اطلاعات کاربر با موفقیت به‌روزرسانی شد";
          }),
        {
          loading: "در حال به‌روزرسانی...",
          success: (message) => message,
          error: (err) => `خطا: ${err.message}`,
        }
      );
    }
  };

  if (!formData) return null;

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onCloseModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 150 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.3, y: 150 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className={`bg-${background} text-${primary} rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 mx-4 relative`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8">
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

            <div
              className="flex flex-col items-center mb-8"
              style={{ display: isWebcamActive ? "flex" : "none" }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-64 h-48 rounded-lg border-2 border-gray-200 bg-black object-cover"
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

            <form onSubmit={handleSubmit} className="space-y-8">
              <FormDataInputs
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
              />

              <RadioGroup
                name="has_insurance"
                value={formData.has_insurance}
                onChange={(v) => handleInputChange("has_insurance", v)}
                options={[
                  { value: true, label: "دارد" },
                  { value: false, label: "ندارد" },
                ]}
                label="بیمه ورزشی"
                wrapperClass={`card bg-${secondary} p-5 rounded-lg shadow-md`}
                error={errors.has_insurance}
              />

              {formData.has_insurance && (
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
                <SubscriptionDataForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default EditUserModal;
