import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Star,
  User,
  PlusCircle,
  XCircle,
  Search,
  Filter,
  Download,
  X,
  AlertTriangle,
  BarChart,
} from "lucide-react";
// Custom Hook
import { useTheme } from "../../context/ThemeContext";

export default function Locker({
  number,
  type,
  isOccupied,
  member,
  onAssign,
  onRelease,
  onViewHistory,
}) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  const baseStyle =
    "flex flex-col items-center justify-center p-2 rounded-xl shadow-md cursor-pointer transition text-center";
  const typeStyles = {
    vip: "bg-yellow-200 text-nearBlack hover:bg-yellow-300",
    open: "bg-green-100 text-green-800 hover:bg-green-200",
    closed: "bg-red-100 text-red-800 hover:bg-red-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${baseStyle} ${typeStyles[type]} w-24 h-24 relative`}
      onClick={() => isOccupied && onViewHistory(number)}
    >
      <div className="flex items-center gap-1 text-sm font-bold">
        <Lock className="w-4 h-4" />
        {number}
      </div>
      {type === "vip" && (
        <div className="flex items-center gap-1 mt-1 text-[10px]">
          <Star className="w-3 h-3" /> VIP
        </div>
      )}
      {isOccupied ? (
        <div className="mt-1 text-[10px] text-center">
          <User className="w-3 h-3 inline" /> {member}
          <div className="mt-1 flex gap-1 justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRelease(number);
              }}
              className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <XCircle className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex gap-1 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssign(number);
            }}
            className={`bg-${primary} text-offWhite p-1 rounded-full text-[10px] hover:bg-blue-700`}
          >
            <PlusCircle className="w-3 h-3" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
