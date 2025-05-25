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

export default function SubscriptionRenewalModal() {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent, background } = themes[activeTheme].colors;

  const userData = {
    first_name: "مهدی",
    last_name: "کاظمی",
    person_image: "https://randomuser.me/api/portraits/men/76.jpg",
    id: 12,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.4 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.4 }}
        transition={{ duration: 0.25 }}
        className={`fixed z-50 
          bg-${background} text-${accent} rounded-3xl shadow-2xl 
          w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8`}
      >
        <Header />
        <UserInfo userData={userData} />
        <SubscriptionInfo />
      </motion.div>
    </AnimatePresence>
  );
}

function Header() {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent, background } = themes[activeTheme].colors;

  return (
    <header className={`flex justify-between items-center pb-5`}>
      <h1 className={`font-bold text-3xl text-${primary}`}>تمدید اشتراک</h1>
      <motion.span
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          mass: 1,
        }}
      >
        <X className={`text-${primary} cursor-pointer`} />
      </motion.span>
    </header>
  );
}

function UserInfo({ userData }) {
  const { activeTheme, themes } = useTheme();
  const { primary, secondary, accent, background } = themes[activeTheme].colors;

  return (
    <div className={`flex flex-col justify-center items-center gap-3 border-b border-${primary} pb-5`}>
      <div
        className={`rounded-full mx-auto w-48 h-48 flex items-center justify-center`}
      >
        <img
          className="object-cover w-full h-full rounded-full"
          src={userData.person_image}
          alt="User Avatar"
        />
      </div>
      <div className="flex flex-row gap-3 text-lg">
        <div>
          <span className={`text-${accent}`}>کد : </span>
          <span className={`text-${primary} font-bold`}>{userData.id}</span>
        </div>
        <div>
          <span className={`text-${accent}`}>نام کاربر : </span>
          <span className={`text-${primary} font-bold`}>
            {userData.first_name} {userData.last_name}
          </span>
        </div>
      </div>
    </div>
  );
}

function SubscriptionInfo() {
  return <div>Sub</div>
}