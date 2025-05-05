// import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../reusables/Button";
import { UserRoundPlus, Search, User } from "lucide-react";

export default function UserPageHeader() {
  return (
    <div className="flex flex-col gap-5 items-center py-4">
      <div className="w-full text-start">
        <h1 className="text-darkBlue font-bold text-4xl">کاربرها</h1>
      </div>
      <div className="w-full text-start">
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.99 }}>
          <Button className={"flex flex-row gap-1"}>
            <UserRoundPlus size={20} />
            افزودن کاربر
          </Button>
        </motion.button>
      </div>

      <div className="w-full flex flex-row items-center gap-2">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          className="w-24 rounded-xl px-4 py-2 border border-darkBlue bg-offWhite text-darkBlue placeholder:text-darkBlue outline-none transition-all duration-300 focus:border-beige focus:ring-2 focus:ring-hoverBeige shadow-sm"
          placeholder="کد کاربر"
        />
        <div className="relative w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-darkBlue" />
          <motion.input
            whileFocus={{ scale: 1.01 }}
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
