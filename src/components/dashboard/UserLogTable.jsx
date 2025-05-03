import { LogOut, Repeat } from "lucide-react";
import { useEffect, useState } from "react";

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
];

export default function UserLogTable() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    setUserData(userMocData);
  }, []);

  return (
    <div className="overflow-x-auto bg-darkBlue w-full">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>نام و نام خانوادگی</th>
            <th>رشته ورزشی</th>
            <th>پایان اشتراک</th>
            <th>ورود</th>
            <th>کمد</th>
            <th>عملیات ها</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {userData.map((user) => (
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>
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
              <td>
                {user.sport}
                <br />
                <span className="badge badge-ghost badge-sm">
                  {user.subscription_days} جلسه
                </span>
              </td>
              <td>{new Date().toLocaleDateString("fa-IR")}</td>
              <td>{new Date().toLocaleDateString("fa-IR")}</td>
              <td>{user.locker}</td>
              <td className="flex flex-row items-center justify-center gap-2 mt-1/2">
                <button className="">
                  <Repeat size={18} />
                </button>
                <button className="text-red-500">
                  <LogOut size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
