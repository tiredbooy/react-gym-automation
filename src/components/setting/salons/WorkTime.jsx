import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Save, RotateCcw, CheckCircle, Loader2, Clock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Custom time picker component to ensure we only get time
const CustomTimePicker = ({
  value,
  onChange,
  label,
  placeholder,
  helperText,
}) => {
  return (
    <div className="relative group">
      <label className="text-darkBlue mb-1 font-semibold block">{label}</label>
      <DatePicker
        value={value}
        onChange={(val) => onChange(val?.format?.("HH:mm") || "")}
        disableDayPicker
        format="HH:mm"
        className="purple"
        onlyTimePicker
        plugins={[<TimePicker hideSeconds position="bottom" />]}
        editable={false}
        render={(value, openCalendar) => (
          <div
            onClick={openCalendar}
            className="flex items-center justify-between rounded-xl border border-darkBlue/70 px-4 py-3 bg-white/60 cursor-pointer transition hover:bg-hoverBeige group-hover:border-darkBlue"
            aria-label={placeholder}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openCalendar()}
          >
            <span
              className={
                value ? "text-darkBlue font-medium" : "text-darkBlue/60"
              }
            >
              {value || placeholder}
            </span>
            <Clock size={18} className="text-darkBlue/70" />
          </div>
        )}
      />
      <span className="absolute top-full right-0 text-xs text-darkBlue/70 mt-1">
        {helperText}
      </span>
    </div>
  );
};

function WorkTime() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load saved times from localStorage
  useEffect(() => {
    try {
      const savedStart = localStorage.getItem("startTime") || "";
      const savedEnd = localStorage.getItem("endTime") || "";
      setStartTime(savedStart);
      setEndTime(savedEnd);
    } catch (error) {
      console.error("Error loading saved times:", error);
      toast.error("خطا در بارگیری اطلاعات ذخیره شده");
    }
  }, []);

  // Check if there are unsaved changes
  useEffect(() => {
    const savedStart = localStorage.getItem("startTime") || "";
    const savedEnd = localStorage.getItem("endTime") || "";

    setHasChanges(
      (startTime !== savedStart || endTime !== savedEnd) &&
        (startTime !== "" || endTime !== "")
    );
  }, [startTime, endTime]);

  // Validate time format and range
  const validateTimes = () => {
    if (!startTime || !endTime) {
      toast.error("لطفاً هر دو ساعت را انتخاب کنید");
      return false;
    }

    // Parse times for comparison
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    // Convert to minutes for easier comparison
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Check if end time is before start time (potentially overnight shift)
    if (endMinutes < startMinutes) {
      // This could be valid for overnight shifts, so we'll show a confirmation
      const confirm = window.confirm(
        "ساعت پایان قبل از ساعت شروع است. آیا این یک شیفت شبانه است؟"
      );
      return confirm;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateTimes()) return;

    setIsSaving(true);
    try {
      // Simulate API call delay
      await new Promise((res) => setTimeout(res, 1200));

      localStorage.setItem("startTime", startTime);
      localStorage.setItem("endTime", endTime);

      setIsSaving(false);
      setIsSuccess(true);
      setHasChanges(false);

      // Calculate total hours
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      let hourDiff = endHour - startHour;
      let minuteDiff = endMinute - startMinute;

      if (minuteDiff < 0) {
        hourDiff--;
        minuteDiff += 60;
      }

      if (hourDiff < 0) hourDiff += 24; // Handle overnight shifts

      const totalHours = hourDiff + minuteDiff / 60;
      const formattedHours = totalHours.toFixed(1);

      toast.success(`ساعت‌ها ذخیره شدند! (${formattedHours} ساعت)`);

      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error("Error saving times:", error);
      setIsSaving(false);
      toast.error("خطا در ذخیره‌سازی");
    }
  };

  const handleReset = () => {
    if (startTime || endTime) {
      setStartTime("");
      setEndTime("");
      localStorage.removeItem("startTime");
      localStorage.removeItem("endTime");
      toast("ساعت‌ها ریست شدند!", {
        icon: "♻️",
        duration: 3000,
      });
      setHasChanges(false);
    } else {
      toast("هیچ ساعتی برای ریست وجود ندارد", {
        icon: "ℹ️",
        duration: 2000,
      });
    }
  };

  // Calculate working hours
  const calculateWorkingHours = () => {
    if (!startTime || !endTime) return null;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let hourDiff = endHour - startHour;
    let minuteDiff = endMinute - startMinute;

    if (minuteDiff < 0) {
      hourDiff--;
      minuteDiff += 60;
    }

    if (hourDiff < 0) hourDiff += 24; // Handle overnight shifts

    return {
      hours: hourDiff,
      minutes: minuteDiff,
      formatted: `${hourDiff} ساعت و ${minuteDiff} دقیقه`,
    };
  };

  const workingHours = calculateWorkingHours();

  // Card container animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Child element animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="bg-offWhite shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md mx-auto border border-lightGray"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#123458",
            color: "#F1EFEC",
            fontWeight: 500,
            borderRadius: "10px",
          },
        }}
      />

      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-extrabold text-darkBlue text-center mb-2 flex items-center justify-center gap-2">
          انتخاب ساعت کاری
        </h1>
        <p className="text-center text-sm text-darkBlue/70 mb-2">
          ساعت شروع و پایان کاری خود را انتخاب کنید.
        </p>
      </motion.div>

      <motion.div className="flex flex-col gap-5" variants={itemVariants}>
        {/* Start Time */}
        <CustomTimePicker
          value={startTime}
          onChange={setStartTime}
          label="از ساعت"
          placeholder="انتخاب ساعت شروع"
          helperText="ساعت شروع (مثلاً ۰۶:۰۰)"
        />

        {/* End Time */}
        <CustomTimePicker
          value={endTime}
          onChange={setEndTime}
          label="تا ساعت"
          placeholder="انتخاب ساعت پایان"
          helperText="ساعت پایان (مثلاً ۲۳:۳۰)"
        />
      </motion.div>

      {/* Working Hours Display */}
      {workingHours && (
        <motion.div
          className="bg-hoverBeige/40 rounded-xl p-3 text-center"
          variants={itemVariants}
        >
          <p className="text-darkBlue font-medium">
            مدت زمان کاری: {workingHours.formatted}
          </p>
        </motion.div>
      )}

      <motion.div className="flex gap-4 mt-2" variants={itemVariants}>
        {/* Save Button with animation */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition ${
            isSuccess
              ? "bg-successGreen text-offWhite"
              : hasChanges
              ? "bg-darkBlue text-offWhite hover:brightness-110"
              : "bg-darkBlue/40 text-offWhite cursor-not-allowed"
          }`}
        >
          <AnimatePresence initial={false} mode="wait">
            {isSaving ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Loader2 className="animate-spin" size={20} />
              </motion.div>
            ) : isSuccess ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="save"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Save size={20} />
              </motion.div>
            )}
          </AnimatePresence>
          {isSuccess ? "ذخیره شد!" : isSaving ? "درحال ذخیره..." : "ذخیره"}
        </motion.button>

        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleReset}
          disabled={!startTime && !endTime}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition ${
            startTime || endTime
              ? "bg-errorRed text-offWhite hover:brightness-110"
              : "bg-errorRed/40 text-offWhite cursor-not-allowed"
          }`}
        >
          <RotateCcw size={20} />
          ریست
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default WorkTime;
