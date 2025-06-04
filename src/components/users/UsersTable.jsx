import { Repeat, LogOut, Trash2, Eye, SquarePen } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { memo } from "react";

const UserTable = memo(
  ({
    users,
    onOpenViewUser,
    onChangeSlectedUserId,
    onDeleting,
    onEdting,
    onRenewal,
  }) => {
    const { activeTheme, themes } = useTheme();
    const theme = themes[activeTheme];
    const { primary, secondary, accent, background } = theme.colors;

    return (
      <div className={`h-[60vh] overflow-y-auto bg-${background} rounded-lg`}>
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
                onDoubleClick={() => {
                  onChangeSlectedUserId(user.id);
                  onOpenViewUser();
                }}
                className={`bg-${secondary} text-${accent} hover:bg-${background} hover:brightness-110 transition duration-150`}
              >
                <td className="px-2 py-4">{index + 1}</td>
                <td className="px-2 py-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 h-12 mask mask-squircle">
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
                <td className="py-4 px-2 text-${accent}">{user?.id}</td>
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
                <td className="px-2 py-4">
                  <div className="flex flex-row items-center justify-start gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        onOpenViewUser();
                        onChangeSlectedUserId(user.id);
                      }}
                      className={`text-${primary} font-bold`}
                    >
                      <Eye size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="font-bold text-green-500"
                      onClick={() => {
                        onRenewal((isOpen) => !isOpen);
                        onChangeSlectedUserId(user.id);
                        console.log("User ID : ", user.id);
                      }}
                    >
                      <Repeat size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="font-bold text-yellow-500"
                      onClick={() => {
                        onEdting((isOpen) => !isOpen);
                        onChangeSlectedUserId(user.id);
                      }}
                    >
                      <SquarePen size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="font-bold text-red-500"
                      onClick={() => {
                        onDeleting((isOpen) => !isOpen);
                        onChangeSlectedUserId(user.id);
                      }}
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
);

export default UserTable;
