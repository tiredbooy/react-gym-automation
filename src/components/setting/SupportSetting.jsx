import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { CloudCog } from "lucide-react";

export default function SupportSettings() {
  const [token, setToken] = useState("");
  const isDisabled = token.trim() ? false : true;

  const { activeTheme , themes } = useTheme();
  const theme = themes[activeTheme];

  useEffect(() => {
    async function loadToken() {
      const response = await fetch(`http://localhost:3000/tokenSetting`);
      if(!response.ok) return;
      const data = await response.json();
      if(!data) return;
      setToken(data.token)
    };
    loadToken()
  },[])

 const handleSave = () => {
  if (token.trim()) {
    fetch("http://localhost:3000/tokenSetting", {
      method: "PUT", // Use PUT to update the tokenSetting object
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }) // Update token value
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        toast.success("توکن با موفقیت اضافه شد ✔");
        return res.json();
      })
      .catch((err) => {
        console.error("Error updating token:", err);
        alert("خطا در ذخیره توکن!");
      });
  } else {
    alert("لطفاً توکن را وارد کنید");
  }
};

  return (
    <motion.div initial={{ scale : 0.1 , opacity : 0 }} animate={{ scale : 1 , opacity : 1 }}  className="flex flex-col gap-5">
      <div className={`bg-${theme.colors.secondary} p-6 rounded-2xl shadow-md text-${theme.colors.primary}`}>
        <motion.div initial={{ scale : 0.1 , opacity : 0 }} animate={{ scale : 1 , opacity : 1 }} className="flex flex-row items-center gap-2 py-1 mb-4">
        <CloudCog />
          <h2 className="text-xl font-bold text-right">
          تنظیمات امنیت و پشتیبانی
        </h2>
        </motion.div>
        <div className="mb-4">
          <label className="block mb-2 text-sm text-right">
            توکن اختصاصی باشگاه
          </label>
          <input
            type="text"
            className={`w-full p-3 rounded-xl border border-${theme.colors.primary} outline-none bg-${theme.colors.secondary}`}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="مثلاً: GYM123456789TOKEN"
          />
        </div>
        <button
          disabled={isDisabled}
          onClick={handleSave}
          className={`bg-${theme.colors.primary} text-offWhite px-6 py-2 rounded-xl ${!isDisabled ? 'hover:bg-opacity-80' : ''} transition  ${isDisabled ? 'bg-opacity-40 cursor-not-allowed' :''}`}
        >
          ذخیره تنظیمات
        </button>
      </div>
    </motion.div>
  );
}
