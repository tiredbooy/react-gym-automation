import { motion } from "framer-motion";

export default function Button({ bgColor, txtColor, className , onClick, children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`${bgColor ? bgColor : "bg-darkBlue"} ${
        txtColor ? txtColor : "text-beige"
      } ${className ? className : ""} px-4 py-2 rounded-xl`}
    >
      {children}
    </motion.button>
  );
}
