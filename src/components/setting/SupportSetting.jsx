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
    </div>
  );
}
