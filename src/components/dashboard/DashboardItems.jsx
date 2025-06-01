import { useState, useEffect } from "react";
import GymControlPanel from "./GymControl";
import {
  LogOut,
  Plus,
  Repeat,
  CirclePlus,
  Circle,
  UserRoundPlus,
} from "lucide-react";
import LogTable from "./LogTable";

import { useTheme } from "../../context/ThemeContext";

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

export default function DashboardItems() {
  const [userData, setUserData] = useState([]);

  const { activeTheme , themes } = useTheme();
  const theme = themes[activeTheme];
  const {primary , secondary , accent , background } = theme.colors;

  useEffect(() => {
    setUserData(userMocData);
  }, []);

  return (
    <div className="py-12 px-8">
      <GymControlPanel />

      <div className={`flex flex-col gap-5 w-full border-t py-8`}>
        <header className="flex flex-row justify-between">
          <div className="flex flex-row justify-between items-center gap-5">
            <div className={`bg-${primary} px-4 py-2 rounded-xl text-center text-${secondary} font-bold`}>
              <span>تعداد افراد حاظر در باشگاه : 33</span>
            </div>

            <div className="flex flex-row justify-between items-center gap-3">
              <input
                type="text"
                placeholder="جستجو ورزشکار..."
                className="input input-bordered w-auto rounded-xl"
              />
              <select className={`select bg-${primary} text-${secondary} rounded-xl`}>
                <option>همه رشته‌ها</option>
                <option>کراسفیت</option>
                <option>بکس</option>
              </select>
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <select className={`select w-auto bg-${primary} rounded-xl text-${secondary} outline-none`}>
              <option>انتخاب سالن</option>
              <option>سالن اصلی</option>
              <option>سالن بکس</option>
              <option>سالن کراسفیت</option>
            </select>

            <button className={`bg-${primary} text-${secondary} flex items-center flex-row gap-1 px-4 py-2 rounded-xl hover:bg-${primary}/80 hover:font-semibold duration-150`}>
              <CirclePlus size={18} />
              <span>جلسه آزاد</span>
            </button>

            <button className={`bg-${primary} text-${secondary} flex items-center flex-row gap-1 px-4 py-2 rounded-xl hover:bg-${primary}/80 hover:font-semibold duration-150`}>
              <UserRoundPlus size={18} />
              <span>ثبت نام ورزشکار</span>
            </button>
          </div>
        </header>

        <main className={`overflow-hidden bg-${primary} w-full rounded-xl`}>
          <LogTable userData={userData} />
        </main>
      </div>
      
    </div>
  );
}
