import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loader({
  color = `text-black`,
  size = 24,
  icon: Icon = Loader2,
  className = "",
  textClassName = "",
  iconClassName = "",
  children = "درحال بارگذاری..."
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
        className={`${color} ${iconClassName}`}
      >
        <Icon size={size} />
      </motion.div>
      <motion.span
        className={`text-sm font-medium ${color} ${textClassName}`}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {children}
      </motion.span>
    </div>
  );
}