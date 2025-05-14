// import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../reusables/Button";
import { UserRoundPlus, Search, User } from "lucide-react";

export default function UserPageHeader({ onAddUserModal }) {
  return (
    <div className="flex flex-col gap-5 items-center py-4">
      <div className="w-full text-start">
        <h1 className="text-darkBlue font-bold text-4xl">کاربرها</h1>
      </div>
      <div className="w-full text-start">
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.99 }} onClick={() => onAddUserModal(isOpen => !isOpen)} className="flex flex-row gap-1 bg-darkBlue rounded-xl px-4 py-2 font-bold text-beige">
          <UserRoundPlus size={20} />
            افزودن کاربر
        </motion.button>
      </div>

      <div className="w-full flex flex-row items-center gap-2">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          className="w-24 rounded-xl px-4 py-2 border border-darkBlue bg-offWhite text-darkBlue placeholder:text-darkBlue outline-none transition-all duration-300 focus:border-beige focus:ring-2 focus:ring-hoverBeige shadow-sm"
          placeholder="کد کاربر"
        />
        <div className="relative w-full group">
          <Search className="absolute right-3 top-1/2 z-50 -translate-y-1/2 text-darkBlue cursor-pointer transition-colors duration-300 group-focus-within:text-beige" />
          <motion.input
            className="w-full rounded-2xl pr-12 pl-4 py-2 border border-darkBlue bg-offWhite text-darkBlue placeholder:text-darkBlue outline-none transition-all duration-300 focus:border-beige focus:ring-4 focus:ring-hoverBeige focus:ring-offset-0 shadow-sm focus:shadow-lg"
            placeholder="جستجوی کاربران"
          />
        </div>

        <motion.button className="">
          <Button>جستجو</Button>
        </motion.button>
      </div>
    </div>
  );
}
