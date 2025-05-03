import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-80 bg-darkBlue min-h-screen bg-light text-blackish flex flex-col shadow-lg">
      {/* Profile Section */}
      <div className="flex items-center space-x-4 p-4 border-b border-sand">
        <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center">
          <span className="text-lg text-navy font-bold">IMG</span>
        </div>
        <div>
          <p className="text-navy font-semibold text-lg">Gym Name</p>
          <p className="text-sand text-sm">@gymusername</p>
        </div>
      </div>

      {/* Menu Header */}
      <p className="text-navy text-sm font-bold px-4 mt-4">منوها</p>

      <ul className="menu text-blackish bg-transparent gap-2 p-4">
        <li>
          <Link to="/">داشبورد</Link>
        </li>
        <li>
          <Link to="/users">کاربرها</Link>
        </li>
        <li>
          <Link to="/payments">پرداخت</Link>
        </li>
        <li>
          <Link to="/lockers">مدیریت کمد</Link>
        </li>
        <li>
          <Link to="/logs">لاگ ورود و خروج</Link>
        </li>
      </ul>

      <div className="border-t border-sand mx-4 my-4"></div>

      <ul className="menu text-blackish bg-transparent gap-2 px-4">
        <li>
          <Link to="/settings">تنظیمات</Link>
        </li>
        <li>
          <a href="#" onClick={() => console.log("Logging out...")}>
            خروج از سیستم
          </a>
        </li>
      </ul>
    </div>
  );
}
