import { Repeat, LogOut } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

export default function LogTable({ userData }) {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const {primary , secondary , accent , background} = theme.colors;

  return (
    <div className='max-h-96 overflow-y-auto'>
      <table className={`table rounded-lg w-full bg-${background}`}>
        {/* head */}
        <thead
          className={`bg-${background}/70 text-${accent} border-transparent sticky top-0 z-10`}
        >
          <tr>
            <th>کد</th>
            <th>نام و نام خانوادگی</th>
            <th>رشته ورزشی</th>
            <th>پایان اشتراک</th>
            <th>ورود</th>
            <th>کمد</th>
            <th>عملیات ها</th>
          </tr>
        </thead>
        <tbody className="">
          {userData.map((user, index) => (
            <tr
              key={user.id || index}
              className={`border-b border-${accent} bg-${secondary} hover:bg-${background}/30 transition duration-200`}
            >
              <td className={`py-4 px-2 text-${accent}`}>1</td>
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
                    <div className={`font-bold text-${accent}`}>
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm opacity-50">{user.user_type}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-2">
                {user.sport}
                <br />
                <span
                  className={`badge badge-ghost badge-sm bg-${background} text-${accent} font-bold`}
                >
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
              <td className="py-4 px-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <button className="text-green-500 font-bold">
                    <Repeat size={18} />
                  </button>
                  <button className="text-red-500 font-bold">
                    <LogOut size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
