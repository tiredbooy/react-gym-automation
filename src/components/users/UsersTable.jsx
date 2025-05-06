import { Repeat, LogOut, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";

const userMocData = [
  {
    first_name: "مهدی",
    last_name: "کاظمی",
    user_type: "ورزشکار",
    sport: "کراس فیت",
    subscription_days: 26,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 12,
  },
  {
    first_name: "مهدی",
    last_name: "کاظمی",
    user_type: "ورزشکار",
    sport: "کراس فیت",
    subscription_days: 26,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 12,
  },
  {
    first_name: "مهدی",
    last_name: "کاظمی",
    user_type: "ورزشکار",
    sport: "کراس فیت",
    subscription_days: 26,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 12,
  },
  {
    first_name: "مهدی",
    last_name: "کاظمی",
    user_type: "ورزشکار",
    sport: "کراس فیت",
    subscription_days: 26,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 12,
  },
  {
    first_name: "مهدی",
    last_name: "کاظمی",
    user_type: "ورزشکار",
    sport: "کراس فیت",
    subscription_days: 26,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 12,
  },
  {
    first_name: "سهیل",
    last_name: "کریمی",
    user_type: "مربی",
    sport: "بدنسازی",
    subscription_days: 26,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 3,
  },
  {
    first_name: "نیما",
    last_name: "غلامی",
    user_type: "کارمند",
    sport: "بدنسازی",
    subscription_days: 120,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 14,
  },
  {
    first_name: "سهند",
    last_name: "رضایی",
    user_type: "بوفه",
    sport: "بدنسازی",
    subscription_days: 12,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 1,
  },
  {
    first_name: "کریم",
    last_name: "رضایی",
    user_type: "مدیر",
    sport: "بدنسازی",
    subscription_days: 46,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 18,
  },
  {
    first_name: "کریم",
    last_name: "رضایی",
    user_type: "مدیر",
    sport: "بدنسازی",
    subscription_days: 46,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 18,
  },
  {
    first_name: "کریم",
    last_name: "رضایی",
    user_type: "مدیر",
    sport: "بدنسازی",
    subscription_days: 46,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 18,
  },
  {
    first_name: "کریم",
    last_name: "رضایی",
    user_type: "مدیر",
    sport: "بدنسازی",
    subscription_days: 46,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 18,
  },
  {
    first_name: "کریم",
    last_name: "رضایی",
    user_type: "مدیر",
    sport: "بدنسازی",
    subscription_days: 46,
    end_subscription_date: new Date().toLocaleDateString("fa-IR"),
    login: new Date().toLocaleDateString("fa-IR"),
    locker: 18,
  },
];

export default function UserTable() {
  return (
    <div className="h-[60vh] overflow-y-auto bg-darkBlue rounded-lg">
      <table className="table rounded-lg w-full">
        {/* head */}
        <thead className="bg-beige text-darkBlue sticky top-0 z-10">
          <tr>
            <th>نام و نام خانوادگی</th>
            <th>رشته ورزشی</th>
            <th>پایان اشتراک</th>
            <th>ورود</th>
            <th>کمد</th>
            <th>جلسات باقی مانده</th>
            <th>عملیات ها</th>
          </tr>
        </thead>
        <tbody>
          {userMocData.map((user, index) => (
            <tr
              key={index}
              className="border-b border-beige hover:bg-[#2f5986] transition duration-150"
            >
              <td className="py-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm opacity-50">{user.user_type}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-2">
                {user.sport}
                <br />
                <span className="badge badge-ghost badge-sm bg-beige text-nearBlack font-bold">
                  {user.subscription_days} جلسه
                </span>
              </td>
              <td className="py-4 px-2">
                {new Date().toLocaleDateString("fa-IR")}
              </td>
              <td className="py-4 px-2">
                {new Date().toLocaleDateString("fa-IR")}
              </td>
              <td className="py-4 px-2">{user.locker}</td>
              <td className="py-4 px-2">{user.locker}</td>
              <td className="py-4 px-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1, color: "yellow" }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="text-beige font-bold"
                  >
                    <Eye size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="text-green-500 font-bold"
                  >
                    <Repeat size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 font-bold"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
