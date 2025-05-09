import React, { useState } from "react";
import ActionButtons from "./device-managment/ActionButtons";
import { motion } from "framer-motion";
import Button from "../reusables/Button";

export default function SupportSettings() {
  const [token, setToken] = useState("");

  const handleSave = () => {
    if (token.trim()) {
      alert("توکن ذخیره شد ✅");
    } else {
      alert("لطفاً توکن را وارد کنید");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-offWhite p-6 rounded-2xl shadow-md text-darkBlue">
        <h2 className="text-xl font-bold mb-4 text-right">
          تنظیمات امنیت و پشتیبانی
        </h2>
        <div className="mb-4">
          <label className="block text-sm mb-2 text-right">
            توکن اختصاصی باشگاه
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-xl border border-lightGray outline-none bg-beige"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="مثلاً: GYM123456789TOKEN"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-darkBlue text-offWhite px-6 py-2 rounded-xl hover:bg-opacity-80 transition"
        >
          ذخیره تنظیمات
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          whileTap={{ scale: 1 }}
          className="flex flex-col gap-3 bg-red-500 rounded-xl px-4 py-6 shadow-xl"
        >
          {/* Color boxes with hover effect or subtle scaling if needed */}
          <div className="colorBox flex flex-row gap-2">
            <div className="w-16 h-16 rounded-full bg-darkBlue opacity-75"></div>
            <div className="w-16 h-16 rounded-full bg-beige opacity-75"></div>
            <div className="w-16 h-16 rounded-full bg-nearBlack opacity-75"></div>
            <div className="w-16 h-16 rounded-full bg-gray-600 opacity-75"></div>
          </div>

          {/* Animated button */}
          <motion.button
            initial={{ width: "50%" }}
            whileHover={{
              width: "100%",
              transition: {
                duration: 0.3,
                ease: "easeInOut",
              },
            }}
            whileTap={{
              width: "75%",
              transition: { duration: 0.1, ease: "easeInOut" },
            }}
            whileFocus={{ outline: "none" }} // Remove default outline if desired
            className="mx-auto px-4 py-2 rounded-xl bg-blue-500 font-bold text-white transition-transform duration-200"
          >
            انتخاب تم
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
