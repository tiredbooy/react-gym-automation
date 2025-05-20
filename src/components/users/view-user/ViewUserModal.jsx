import { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  Calendar,
  BadgePlus,
  Fingerprint,
  Contact,
  IdCard,
  UserRound,
  ShieldCheck,
  Download,
  Pencil,
  Save,
  Undo2,
} from "lucide-react";

function ViewUserModal({ onCloseModal, personId }) {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent, background } = themes[activeTheme].colors;

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!personId) return;

    fetch(
      `http://localhost:8000/api/dynamic/?action=person&person_id=${personId}`
    )
      .then((res) => res.json())
      .then((res) => {
        const userData = res.items?.[0];
        setUser(userData);
        setForm(userData);
        if (userData?.person_image) {
        //   setImageSrc(`data:image/jpeg;base64,${userData.image}`);
        setImageSrc(`data:image/jpeg;base64,${userData.person_image.replace(
                /^.*\/9j\//,
                "/9j/"
              )}`)
        }
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, [personId]);
  const handleExportPDF = () => {
    alert("قابلیت خروجی PDF هنوز متصل نشده ✅");
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Add API logic here
    setUser(form);
    setEditMode(false);
  };

  

  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCloseModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className={`fixed z-50 
          bg-${background} text-${accent} rounded-3xl shadow-2xl 
          w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">مشاهده اطلاعات کاربر</h2>
          <div className="flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Save size={18} /> ذخیره
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setForm(user);
                  }}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <Undo2 size={24} />
                </button>
              </>
            ) : (
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Download size={18} /> خروجی PDF
                </button>
            )}
            <button
              onClick={onCloseModal}
              className="text-red-500 hover:text-red-700"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex gap-8 items-start mb-8 flex-wrap">
          <img
            src={imageSrc}
            alt="user"
            className="w-36 h-36 rounded-2xl border-4 border-gray-300 object-cover"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right flex-1">
            <UserInfo
              editable={editMode}
              value={form?.person_id}
              label="کد کاربر"
              icon={<IdCard />}
              onChange={(v) => handleChange("person_id", v)}
            />
            <UserInfo
              editable={editMode}
              value={form?.full_name}
              label="نام کامل"
              icon={<UserRound />}
              onChange={(v) => handleChange("full_name", v)}
            />
            <UserInfo
              editable={editMode}
              value={form?.mobile}
              label="شماره تماس"
              icon={<Phone />}
              onChange={(v) => handleChange("mobile", v)}
            />
            <UserInfo
              editable={editMode}
              value={form?.gender}
              label="جنسیت"
              icon={<Contact />}
              onChange={(v) => handleChange("gender", v)}
            />
            <UserInfo
              editable={editMode}
              value={form?.birth_date}
              label="تاریخ تولد"
              icon={<Calendar />}
              onChange={(v) => handleChange("birth_date", v)}
            />
            <UserInfo
              editable={editMode}
              value={form?.national_code}
              label="کد ملی"
              icon={<BadgePlus />}
              onChange={(v) => handleChange("national_code", v)}
            />
            <UserInfo
              editable={editMode}
              value={form?.insurance_no}
              label="بیمه"
              icon={<ShieldCheck />}
              onChange={(v) => handleChange("insurance_no", v)}
            />
            <UserInfo
              editable={editMode}
              value={form?.authMethod}
              label="روش احراز هویت"
              icon={<Fingerprint />}
              onChange={(v) => handleChange("authMethod", v)}
            />
          </div>
        </div>

        {/* Subscriptions */}
        <div className="mb-4">
          <h3 className={`text-xl font-bold mb-4 text-${primary}`}>
            تاریخچه اشتراک‌ها
          </h3>
          <div className={`bg-${secondary} rounded-xl p-4 space-y-4`}>
            {(form?.subscriptions || []).map((sub, i) => (
              <div
                key={i + 1}
                className="bg-white/80 rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-1 text-right">
                  <div className="font-semibold">{sub.sport}</div>
                  <div className="text-sm text-gray-600">
                    {sub.session} | {sub.type}
                  </div>
                  <div className="text-sm text-gray-500">
                    مدت: {sub.duration}
                  </div>
                  <div className="text-sm text-gray-500">
                    از {sub.start} تا {sub.end}
                  </div>
                </div>
                <div className="font-bold text-green-700">{sub.price}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function UserInfo({ icon, label, value, editable, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <span className="font-semibold">{label}:</span>
      {editable ? (
        <input
          type="text"
          className="bg-white/70 border border-gray-300 rounded px-2 py-1 text-sm flex-1"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}

export default ViewUserModal;
