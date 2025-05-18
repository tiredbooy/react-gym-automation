import { Repeat, LogOut, Trash2, Eye, SquarePen } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function UserTable({ users }) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary, secondary, accent, background } = theme.colors;

  return (
    <div className={`h-[60vh] overflow-y-auto bg-${primary} rounded-lg`}>
      <table className="table w-full rounded-lg">
        {/* Head */}
        <thead
          className={`bg-${background}/90 text-${primary} sticky top-0 z-10`}
        >
          <tr>
            <th>ردیف</th>
            <th>نام و نام خانوادگی</th>
            <th>کد کاربر</th>
            <th>رشته ورزشی</th>
            <th>پایان اشتراک</th>
            <th>شماره تماس</th>
            <th>جلسات باقی مانده</th>
            <th>عملیات ها</th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-${accent}`}>
          {users.map((user, index) => (
            <tr
              key={index}
              className={`bg-${secondary} text-${accent} hover:bg-${background} hover:brightness-110 transition duration-150`}
            >
              <td className="py-4 px-2">{index + 1}</td>
              <td className="py-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src={user.thumbnail_image}
                        alt="Avatar"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/48";
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-${accent}">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className={`text-sm text-${accent}/60`}>
                      {user.user_type}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-2 text-${accent}">{user?.person_id}</td>
              <td className="py-4 px-2 text-${accent}">
                {user.sport}
                <br />
                <span
                  className={`badge badge-ghost badge-sm bg-${secondary} text-${accent} font-bold`}
                >
                  {user.subscription_days} جلسه
                </span>
              </td>
              <td className="py-4 px-2 text-${accent}">{user?.birth_date}</td>
              <td className="py-4 px-2 text-${accent}">{user?.mobile}</td>
              <td className="py-4 px-2 text-${accent}">{user?.locker}</td>
              <td className="py-4 px-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`text-${primary} font-bold`}
                  >
                    <Eye size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-green-500 font-bold"
                  >
                    <Repeat size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-yellow-500 font-bold"
                  >
                    <SquarePen size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
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
