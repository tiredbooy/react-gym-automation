import { motion } from "framer-motion";

function AddUserForm() {
  return (
    <motion.form
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      autoComplete="off"
      className="w-full mx-auto p-8 bg-gradient-to-tl from-beige rounded-xl mt-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="text-right">
          <label
            htmlFor="fullName"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            نام کامل
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            autoComplete="off"
            className="w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            transition-all duration-300 hover:border-blue-300
            text-gray-800 placeholder-gray-400"
            placeholder="نام خود را وارد کنید"
          />
        </div>

        <div className="text-right">
          <label
            htmlFor="phoneNumber"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            شماره تماس
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            autoComplete="off"
            className="w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            transition-all duration-300 hover:border-blue-300
            text-gray-800 placeholder-gray-400"
            placeholder="شماره تماس خود را وارد کنید"
          />
        </div>

        <div className="text-right">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            ایمیل
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            className="w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            transition-all duration-300 hover:border-blue-300
            text-gray-800 placeholder-gray-400"
            placeholder="ایمیل خود را وارد کنید"
          />
        </div>

        <div className="text-right">
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            آدرس
          </label>
          <input
            type="text"
            id="address"
            name="address"
            autoComplete="off"
            className="w-full px-4 py-3 text-right border-2 bg-transparent border-gray-400 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            transition-all duration-300 hover:border-blue-300
            text-gray-800 placeholder-gray-400"
            placeholder="آدرس خود را وارد کنید"
          />
        </div>
      </div>
    </motion.form>
  );
}

export default AddUserForm;
