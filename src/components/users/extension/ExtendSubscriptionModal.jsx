import React, { useState, useEffect, useRef } from "react";
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

const SubscriptionRenewalModal = ({ onClose, user, onSubmitUser }) => {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    planType: "standard",
    duration: "1",
    sessions: "8",
    paymentMethod: "card",
    discountCode: "",
    autoRenew: false,
    amount: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(null);

  // Pricing logic
  const pricing = {
    standard: {
      base: 500000,
      sessionRate: 50000,
      label: "استاندارد",
      description: "دسترسی به سالن بدنسازی و کلاس‌های گروهی",
      icon: Dumbbell,
    },
    vip: {
      base: 800000,
      sessionRate: 75000,
      label: "ویژه",
      description: "امکانات لوکس، برنامه تغذیه",
      icon: Star,
    },
    vip_coach: {
      base: 1200000,
      sessionRate: 100000,
      label: "ویژه با مربی ویژه",
      description: "مربی شخصی حرفه‌ای، برنامه اختصاصی",
      icon: UserCheck,
    },
    standard_coach: {
      base: 700000,
      sessionRate: 60000,
      label: "استاندارد با مربی استاندارد",
      description: "مربی پایه، برنامه تمرینی",
      icon: UserCheck,
    },
  };
  const durationOptions = [
    { value: "1", label: "۱ ماه" },
    { value: "3", label: "۳ ماه" },
    { value: "6", label: "۶ ماه" },
    { value: "12", label: "۱۲ ماه" },
  ];
  const sessionOptions = [
    { value: "8", label: "۸ جلسه" },
    { value: "12", label: "۱۲ جلسه" },
    { value: "20", label: "۲۰ جلسه" },
    { value: "unlimited", label: "نامحدود" },
  ];
  const validDiscountCodes = { GYM25: 0.25, FIT10: 0.1 };

  // Calculate amount
  useEffect(() => {
    const duration = parseInt(formData.duration);
    const sessions =
      formData.sessions === "unlimited" ? 30 : parseInt(formData.sessions);
    const basePrice = pricing[formData.planType].base * duration;
    const sessionPrice =
      formData.sessions === "unlimited"
        ? 500000
        : pricing[formData.planType].sessionRate * sessions;
    let total = basePrice + sessionPrice;
    if (discountApplied) {
      total *= 1 - validDiscountCodes[formData.discountCode];
    }
    setFormData((prev) => ({ ...prev, amount: Math.round(total) }));
  }, [
    formData.planType,
    formData.duration,
    formData.sessions,
    formData.discountCode,
    discountApplied,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlanTypeChange = (planType) => {
    setFormData((prev) => ({ ...prev, planType }));
  };

  const applyDiscount = () => {
    if (validDiscountCodes[formData.discountCode]) {
      setDiscountApplied(true);
      toast.success(`تخفیف ${formData.discountCode} اعمال شد!`, {
        style: {
          background: theme.isDark ? "#1f2937" : "#ffffff",
          color: theme.isDark ? "#ffffff" : "#1f2937",
          fontFamily: "Vazir, sans-serif",
          borderRadius: "8px",
          boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
        },
      });
    } else {
      setDiscountApplied(false);
      toast.error("کد تخفیف نامعتبر است", {
        style: {
          background: theme.isDark ? "#1f2937" : "#ffffff",
          color: theme.isDark ? "#ffffff" : "#1f2937",
          fontFamily: "Vazir, sans-serif",
          borderRadius: "8px",
          boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.sessions !== "unlimited" && parseInt(formData.sessions) < 1) {
      toast.error("تعداد جلسات باید حداقل ۱ باشد", {
        style: {
          background: theme.isDark ? "#1f2937" : "#ffffff",
          color: theme.isDark ? "#ffffff" : "#1f2937",
          fontFamily: "Vazir, sans-serif",
          borderRadius: "8px",
          boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
        },
      });
      return;
    }
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("اشتراک با موفقیت تمدید شد!", {
        style: {
          background: theme.isDark ? "#1f2937" : "#ffffff",
          color: theme.isDark ? "#ffffff" : "#1f2937",
          fontFamily: "Vazir, sans-serif",
          borderRadius: "8px",
          boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
        },
      });
      setIsSubmitting(false);
      onSubmitUser();
      onClose();
    }, 1500);
  };

  // Focus trap for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.7, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const getSessionSchedule = () => {
    const sessions =
      formData.sessions === "unlimited" ? 30 : parseInt(formData.sessions);
    const duration = parseInt(formData.duration);
    const weeks = duration * 4;
    const sessionsPerWeek = sessions / weeks;
    return sessions === 30
      ? "نامحدود (تقریباً روزانه)"
      : `تقریباً ${Math.round(sessionsPerWeek * 10) / 10} جلسه در هفته`;
  };

  return (
    <AnimatePresence>
      {true && (
        <div
          className="fixed inset-0 z-[9999] overflow-y-auto"
          data-testid="modal-wrapper"
        >
          <motion.div
            className="fixed inset-0 bg-black"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 font-vazir min-h-screen"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
            ref={modalRef}
          >
            <div
              className={`bg-gradient-to-br from-${background}/95 to-${secondary}/90 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden backdrop-blur-sm border border-${secondary}/20`}
            >
              {/* Header */}
              <div
                className={`bg-gradient-to-r from-${primary} to-${accent} p-4 flex justify-between items-center`}
              >
                <h2
                  id="modal-title"
                  className={`text-2xl font-bold text-${background}`}
                >
                  تمدید اشتراک
                </h2>
                <motion.button
                  onClick={onClose}
                  className={`p-2 rounded-full bg-${secondary}/30 hover:bg-${accent}/50 transition-colors focus:outline-none focus:ring-2 focus:ring-${primary}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="بستن مودال"
                >
                  <X className={`w-6 h-6 text-${background}`} />
                </motion.button>
              </div>

              {/* Form (Scrollable) */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto"
              >
                {/* User Info */}
                <motion.div
                  className={`flex items-center gap-4 bg-${secondary}/10 p-4 rounded-lg border border-${secondary}/20`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-${primary} flex items-center justify-center text-${background} text-xl font-bold`}
                  >
                    {user?.first_name?.charAt(0) || "کاربر"}
                  </div>
                  <div>
                    <p className={`text-${primary} text-lg font-semibold`}>
                      {user?.first_name || "کاربر مهمان"}
                    </p>
                    <p className={`text-sm text-${accent}`}>
                      {user?.email || "ایمیل نامشخص"}
                    </p>
                  </div>
                </motion.div>

                {/* Plan Type Selection */}
                <div>
                  <label
                    className={`block text-${primary} text-lg font-semibold mb-2`}
                  >
                    نوع اشتراک
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                    {Object.keys(pricing).map((planType) => {
                      const Icon = pricing[planType].icon;
                      return (
                        <motion.div
                          key={planType}
                          className={`p-4 rounded-lg bg-${background}/80 border ${
                            formData.planType === planType
                              ? `border-${primary} bg-${primary}/10`
                              : `border-${secondary}/20`
                          } cursor-pointer hover:bg-${secondary}/10 transition-colors`}
                          onClick={() => handlePlanTypeChange(planType)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-6 h-6 text-${primary}`} />
                            <div>
                              <p
                                className={`text-${primary} text-base font-semibold`}
                              >
                                {pricing[planType].label}
                              </p>
                              <p className={`text-sm text-${accent}`}>
                                {pricing[planType].description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label
                    className={`block text-${primary} text-lg font-semibold mb-2`}
                  >
                    مدت زمان
                  </label>
                  <motion.select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg bg-${background}/80 border border-${secondary}/20 text-${primary} focus:outline-none focus:ring-2 focus:ring-${primary} transition-colors`}
                    whileFocus={{ scale: 1.02 }}
                    aria-describedby="duration-description"
                  >
                    {durationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </motion.select>
                  <p
                    id="duration-description"
                    className={`text-sm text-${accent} mt-1`}
                  >
                    مدت زمان اشتراک خود را انتخاب کنید
                  </p>
                </div>

                {/* Sessions */}
                <div>
                  <label
                    className={`block text-${primary} text-lg font-semibold mb-2`}
                  >
                    تعداد جلسات
                  </label>
                  <motion.select
                    name="sessions"
                    value={formData.sessions}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg bg-${background}/80 border border-${secondary}/20 text-${primary} focus:outline-none focus:ring-2 focus:ring-${primary} transition-colors`}
                    whileFocus={{ scale: 1.02 }}
                    aria-describedby="sessions-error sessions-schedule"
                  >
                    {sessionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </motion.select>
                  <p
                    id="sessions-schedule"
                    className={`text-sm text-${accent} mt-1`}
                  >
                    برنامه: {getSessionSchedule()}
                  </p>
                  {formData.sessions !== "unlimited" &&
                    parseInt(formData.sessions) < 1 && (
                      <p
                        id="sessions-error"
                        className={`text-sm text-${theme.colors.error} mt-1`}
                      >
                        تعداد جلسات باید حداقل ۱ باشد
                      </p>
                    )}
                </div>

                {/* Discount Code */}
                <div>
                  <label
                    className={`block text-${primary} text-lg font-semibold mb-2`}
                  >
                    کد تخفیف
                  </label>
                  <div className="flex gap-2">
                    <motion.input
                      type="text"
                      name="discountCode"
                      value={formData.discountCode}
                      onChange={handleChange}
                      placeholder="کد تخفیف را وارد کنید"
                      className={`flex-1 p-3 rounded-lg bg-${background}/80 border border-${secondary}/20 text-${primary} focus:outline-none focus:ring-2 focus:ring-${primary} transition-colors`}
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.button
                      type="button"
                      onClick={applyDiscount}
                      className={`px-4 py-2 bg-${primary} text-${background} rounded-lg hover:bg-${accent} transition-colors`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Tag className="w-5 h-5 inline-block mr-1" />
                      اعمال
                    </motion.button>
                  </div>
                  {discountApplied && (
                    <p className={`text-sm text-${theme.colors.success} mt-1`}>
                      تخفیف {formData.discountCode} اعمال شد
                    </p>
                  )}
                </div>

                {/* Auto-Renewal */}
                <div>
                  <label
                    className={`flex items-center gap-2 cursor-pointer text-${primary} text-lg font-semibold`}
                  >
                    <motion.input
                      type="checkbox"
                      name="autoRenew"
                      checked={formData.autoRenew}
                      onChange={handleChange}
                      className={`w-5 h-5 text-${primary} focus:ring-${primary}`}
                      whileHover={{ scale: 1.1 }}
                    />
                    تمدید خودکار اشتراک
                  </label>
                  <p className={`text-sm text-${accent} mt-1`}>
                    اشتراک شما به صورت خودکار در پایان دوره تمدید می‌شود
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label
                    className={`block text-${primary} text-lg font-semibold mb-2`}
                  >
                    مبلغ (ریال)
                  </label>
                  <motion.div
                    className={`w-full p-3 rounded-lg bg-${background}/80 border border-${secondary}/20 text-${primary} flex items-center justify-between relative group`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-base font-semibold">
                      {formData.amount.toLocaleString("fa-IR")} ریال
                    </span>
                    <motion.div
                      className={`h-2 bg-gradient-to-r from-${primary} to-${accent} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          (formData.amount / 10000000) * 100,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    {/* Tooltip */}
                    <div className="absolute hidden group-hover:block -top-20 left-1/2 transform -translate-x-1/2 bg-${secondary}/95 text-${primary} p-2 rounded-lg shadow-lg text-xs z-10">
                      <p>
                        هزینه پایه:{" "}
                        {(
                          pricing[formData.planType].base *
                          parseInt(formData.duration)
                        ).toLocaleString("fa-IR")}{" "}
                        ریال
                      </p>
                      <p>
                        هزینه جلسات:{" "}
                        {(formData.sessions === "unlimited"
                          ? 500000
                          : pricing[formData.planType].sessionRate *
                            parseInt(formData.sessions || 0)
                        ).toLocaleString("fa-IR")}{" "}
                        ریال
                      </p>
                      {discountApplied && (
                        <p>
                          تخفیف:{" "}
                          {Math.round(
                            (formData.amount /
                              (1 - validDiscountCodes[formData.discountCode])) *
                              validDiscountCodes[formData.discountCode]
                          ).toLocaleString("fa-IR")}{" "}
                          ریال
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Confirmation Step */}
                {showConfirmation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-${background}/90 p-4 rounded-lg shadow-lg text-center border border-${secondary}/20`}
                  >
                    <p className={`text-${primary} text-lg font-semibold mb-3`}>
                      تایید نهایی
                    </p>
                    <p className={`text-sm text-${accent} space-y-1`}>
                      <span className="block">
                        نوع اشتراک: {pricing[formData.planType].label}
                      </span>
                      <span className="block">
                        مدت:{" "}
                        {
                          durationOptions.find(
                            (opt) => opt.value === formData.duration
                          )?.label
                        }
                      </span>
                      <span className="block">
                        جلسات:{" "}
                        {
                          sessionOptions.find(
                            (opt) => opt.value === formData.sessions
                          )?.label
                        }
                      </span>
                      <span className="block">
                        روش پرداخت:{" "}
                        {formData.paymentMethod === "card"
                          ? "کارت بانکی"
                          : "نقدی"}
                      </span>
                      <span className="block">
                        تمدید خودکار: {formData.autoRenew ? "فعال" : "غیرفعال"}
                      </span>
                      {discountApplied && (
                        <span className="block">
                          تخفیف: {formData.discountCode}
                        </span>
                      )}
                      <span className="block font-semibold">
                        مبلغ کل: {formData.amount.toLocaleString("fa-IR")} ریال
                      </span>
                    </p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (formData.sessions !== "unlimited" &&
                      parseInt(formData.sessions) < 1)
                  }
                  className={`w-full py-3 bg-gradient-to-r from-${primary} to-${accent} text-${background} rounded-lg flex items-center justify-center gap-2 hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed font-semibold`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {showConfirmation ? "تایید نهایی" : "بررسی و پرداخت"}
                </motion.button>
              </form>

              {/* Footer */}
              <div
                className={`bg-${secondary}/10 p-4 text-center border-t border-${secondary}/20 flex items-center justify-center gap-2 text-${accent}`}
              >
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">لطفا اطلاعات را با دقت بررسی کنید</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionRenewalModal;
