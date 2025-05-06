import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogIn,
  LogOut,
  Search,
  Filter,
  Download,
  X,
  AlertTriangle,
  BarChart,
  Clock,
} from "lucide-react";
import * as XLSX from "xlsx";

// Member Log Form Component
const MemberLogForm = ({ members, onLogin, onLogout }) => {
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const member = members.find((m) => m.id === parseInt(memberId));
    if (!member) {
      setError("عضو با این شناسه یافت نشد");
      return;
    }
    if (member.isInGym) {
      setError("این عضو قبلاً وارد شده است");
      return;
    }
    onLogin(member);
    setMemberId("");
    setError("");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    const member = members.find((m) => m.id === parseInt(memberId));
    if (!member) {
      setError("عضو با این شناسه یافت نشد");
      return;
    }
    if (!member.isInGym) {
      setError("این عضو در حال حاضر در باشگاه نیست");
      return;
    }
    onLogout(member);
    setMemberId("");
    setError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-beige p-6 rounded-2xl shadow-lg"
    >
      <h2 className="text-xl font-bold text-nearBlack mb-4 text-center">
        ثبت ورود/خروج عضو
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-nearBlack mb-1">
            شناسه عضو (بارکد)
          </label>
          <input
            type="number"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="شناسه را اسکن یا وارد کنید"
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
            autoFocus
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-4">
          <button
            onClick={handleLogin}
            className="flex-1 p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" /> ورود
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 p-2 bg-red-500 text-offWhite rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" /> خروج
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Stats Component
const Stats = ({ members, attendanceLog }) => {
  const membersInGym = members.filter((m) => m.isInGym).length;
  const totalVisits = attendanceLog.filter((l) => l.action === "ورود").length;
  const avgDuration =
    attendanceLog
      .filter((l) => l.action === "خروج" && l.loginTime)
      .reduce((sum, l) => {
        const duration =
          (new Date(l.timestamp) - new Date(l.loginTime)) / (1000 * 60);
        return sum + duration;
      }, 0) / (attendanceLog.filter((l) => l.action === "خروج").length || 1);
  const peakHour = attendanceLog
    .filter((l) => l.action === "ورود")
    .reduce((acc, l) => {
      const hour = new Date(l.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
  const busiestHour =
    Object.entries(peakHour).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const frequentVisitors = attendanceLog
    .filter((l) => l.action === "ورود")
    .reduce((acc, l) => {
      acc[l.memberName] = (acc[l.memberName] || 0) + 1;
      return acc;
    }, {});
  const topVisitor =
    Object.entries(frequentVisitors).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl bg-beige p-4 rounded-2xl shadow-lg flex flex-wrap justify-between text-sm text-nearBlack"
    >
      <div>اعضای حاضر: {membersInGym}</div>
      <div>کل بازدیدها: {totalVisits}</div>
      <div>میانگین مدت بازدید: {Math.round(avgDuration)} دقیقه</div>
      <div>شلوغ‌ترین ساعت: {busiestHour}:00</div>
      <div>بازدیدکننده مکرر: {topVisitor}</div>
    </motion.div>
  );
};

// Attendance Log Component
const AttendanceLog = ({ attendanceLog, onExport, onCorrectLog }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filteredLog = attendanceLog.filter((entry) => {
    const matchesSearch =
      search === "" ||
      entry.memberId.toString().includes(search) ||
      entry.memberName.includes(search);
    const matchesFilter =
      filter === "all" ||
      (filter === "login" && entry.action === "ورود") ||
      (filter === "logout" && entry.action === "خروج") ||
      (filter === "inGym" &&
        entry.action === "ورود" &&
        !attendanceLog.some(
          (l) =>
            l.memberId === entry.memberId &&
            l.action === "خروج" &&
            l.loginTime === entry.timestamp
        ));
    const matchesDate =
      (!dateRange.start ||
        new Date(entry.timestamp) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(entry.timestamp) <= new Date(dateRange.end));
    return matchesSearch && matchesFilter && matchesDate;
  });

  return (
    <div className="w-full max-w-5xl bg-beige p-4 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-lg font-bold text-nearBlack">لاگ حضور و غیاب</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute right-2 top-2.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو بر اساس شناسه یا نام"
              className="p-2 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
          >
            <option value="all">همه</option>
            <option value="login">ورود</option>
            <option value="logout">خروج</option>
            <option value="inGym">در باشگاه</option>
          </select>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
          />
          <button
            onClick={onExport}
            className="p-2 bg-darkBlue text-offWhite rounded-lg flex items-center gap-1 hover:bg-blue-700"
          >
            <Download className="w-5 h-5" /> خروجی Excel
          </button>
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        <table className="w-full text-sm text-nearBlack">
          <thead>
            <tr className="bg-hoverBeige">
              <th className="p-2">شناسه</th>
              <th className="p-2">نام</th>
              <th className="p-2">فعالیت</th>
              <th className="p-2">زمان</th>
              <th className="p-2">مدت بازدید</th>
              <th className="p-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredLog.map((entry, index) => {
              const duration =
                entry.action === "خروج" && entry.loginTime
                  ? Math.round(
                      (new Date(entry.timestamp) - new Date(entry.loginTime)) /
                        (1000 * 60)
                    )
                  : "-";
              const isLongStay =
                entry.action === "ورود" &&
                !attendanceLog.some(
                  (l) =>
                    l.memberId === entry.memberId &&
                    l.action === "خروج" &&
                    l.loginTime === entry.timestamp
                ) &&
                (new Date() - new Date(entry.timestamp)) / (1000 * 60 * 60) > 4;
              return (
                <tr
                  key={index}
                  className={`border-b border-gray-200 ${
                    isLongStay ? "bg-red-100" : ""
                  }`}
                >
                  <td className="p-2">{entry.memberId}</td>
                  <td className="p-2">{entry.memberName}</td>
                  <td className="p-2">{entry.action}</td>
                  <td className="p-2">
                    {new Date(entry.timestamp).toLocaleString("fa-IR")}
                  </td>
                  <td className="p-2">
                    {duration === "-" ? duration : `${duration} دقیقه`}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => onCorrectLog(entry)}
                      className="p-1 bg-yellow-500 text-offWhite rounded hover:bg-yellow-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Correct Log Modal
const CorrectLogModal = ({ isOpen, onClose, onCorrectLog, log }) => {
  const [timestamp, setTimestamp] = useState(
    log ? new Date(log.timestamp).toISOString().slice(0, 16) : ""
  );

  const handleCorrect = () => {
    if (!timestamp) {
      alert("لطفاً زمان را وارد کنید");
      return;
    }
    onCorrectLog({ ...log, timestamp });
    setTimestamp("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-nearBlack bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-offWhite p-6 rounded-2xl shadow-lg max-w-sm w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-nearBlack">تصحیح لاگ</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-nearBlack" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-nearBlack mb-1">
                  زمان
                </label>
                <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-beige text-nearBlack"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onClose}
                className="p-2 bg-gray-300 rounded-lg text-nearBlack hover:bg-hoverBeige"
              >
                لغو
              </button>
              <button
                onClick={handleCorrect}
                className="p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700"
              >
                ذخیره
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Trends Modal
const TrendsModal = ({ isOpen, onClose, attendanceLog }) => {
  const visitCounts = attendanceLog
    .filter((l) => l.action === "ورود")
    .reduce((acc, l) => {
      const date = new Date(l.timestamp).toLocaleDateString("fa-IR");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  const topDays = Object.entries(visitCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const hourlyVisits = attendanceLog
    .filter((l) => l.action === "ورود")
    .reduce((acc, l) => {
      const hour = new Date(l.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
  const topHours = Object.entries(hourlyVisits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-nearBlack bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-offWhite p-6 rounded-2xl shadow-lg max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-nearBlack">
                روند بازدیدها
              </h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-nearBlack" />
              </button>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-nearBlack">
                شلوغ‌ترین روزها
              </h3>
              <ul className="space-y-2 mt-2">
                {topDays.map(([date, count]) => (
                  <li key={date} className="text-sm text-nearBlack">
                    {date}: {count} بازدید
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-nearBlack">
                شلوغ‌ترین ساعات
              </h3>
              <ul className="space-y-2 mt-2">
                {topHours.map(([hour, count]) => (
                  <li key={hour} className="text-sm text-nearBlack">
                    ساعت {hour}: {count} بازدید
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="p-2 bg-gray-300 rounded-lg text-nearBlack hover:bg-hoverBeige"
              >
                بستن
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Confirm Modal
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-nearBlack bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-offWhite p-6 rounded-2xl shadow-lg max-w-sm w-full"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-bold text-nearBlack">{title}</h2>
          </div>
          <p className="text-sm text-nearBlack mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="p-2 bg-gray-300 rounded-lg text-nearBlack hover:bg-hoverBeige"
            >
              لغو
            </button>
            <button
              onClick={onConfirm}
              className="p-2 bg-red-500 text-offWhite rounded-lg hover:bg-red-600"
            >
              تأیید
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Action Buttons Component
const ActionButtons = ({ onLogoutAll, onShowTrends, isLoading }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="fixed bottom-4 w-full max-w-5xl bg-beige p-4 rounded-2xl shadow-lg flex flex-wrap justify-center gap-4"
  >
    <div className="relative group">
      <button
        onClick={onLogoutAll}
        disabled={isLoading}
        className={`p-2 bg-red-500 text-offWhite rounded-lg flex items-center gap-1 hover:bg-red-600 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <LogOut className="w-5 h-5" /> خروج همه اعضا
      </button>
      <span className="absolute bottom-full mb-2 hidden group-hover:block bg-nearBlack text-offWhite text-xs rounded p-1">
        همه اعضا را از باشگاه خارج می‌کند
      </span>
    </div>
    <div className="relative group">
      <button
        onClick={onShowTrends}
        disabled={isLoading}
        className={`p-2 bg-darkBlue text-offWhite rounded-lg flex items-center gap-1 hover:bg-blue-700 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <BarChart className="w-5 h-5" /> نمایش روندها
      </button>
      <span className="absolute bottom-full mb-2 hidden group-hover:block bg-nearBlack text-offWhite text-xs rounded p-1">
        روند بازدیدهای روزانه و ساعتی را نمایش می‌دهد
      </span>
    </div>
  </motion.div>
);

// Toast Component
const Toast = ({ message, isVisible, onClose }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 bg-green-500 text-offWhite p-4 rounded-lg shadow-lg flex items-center gap-2"
      >
        <span>{message}</span>
        <button onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

// Main MemberAttendancePage Component
const MemberAttendancePage = () => {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("members");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "علی رضایی", isGuest: false, isInGym: true },
          { id: 2, name: "مریم احمدی", isGuest: false, isInGym: false },
          { id: 3, name: "مهمان ۱", isGuest: true, isInGym: false },
        ];
  });
  const [attendanceLog, setAttendanceLog] = useState(() => {
    const saved = localStorage.getItem("attendanceLog");
    return saved
      ? JSON.parse(saved)
      : [
          {
            memberId: 1,
            memberName: "علی رضایی",
            action: "ورود",
            timestamp: new Date().toISOString(),
          },
        ];
  });
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [trendsModalOpen, setTrendsModalOpen] = useState(false);
  const [correctLogModalOpen, setCorrectLogModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("attendanceLog", JSON.stringify(attendanceLog));

    const checkLongStays = () => {
      const longStays = attendanceLog.filter(
        (l) =>
          l.action === "ورود" &&
          !attendanceLog.some(
            (log) =>
              log.memberId === l.memberId &&
              log.action === "خروج" &&
              log.loginTime === l.timestamp
          ) &&
          (new Date() - new Date(l.timestamp)) / (1000 * 60 * 60) > 4
      );
      if (longStays.length > 0) {
        showToast(
          `هشدار: ${longStays.length} عضو بیش از ۴ ساعت در باشگاه هستند`
        );
      }

      const guestsToLogout = members
        .filter((m) => m.isGuest && m.isInGym)
        .filter((m) => {
          const lastLogin = attendanceLog.find(
            (l) =>
              l.memberId === m.id &&
              l.action === "ورود" &&
              !attendanceLog.some(
                (log) =>
                  log.memberId === m.id &&
                  log.action === "خروج" &&
                  log.loginTime === l.timestamp
              )
          );
          return (
            lastLogin &&
            (new Date() - new Date(lastLogin.timestamp)) / (1000 * 60 * 60) > 24
          );
        });
      if (guestsToLogout.length > 0) {
        setMembers((prev) =>
          prev.map((m) =>
            guestsToLogout.some((g) => g.id === m.id)
              ? { ...m, isInGym: false }
              : m
          )
        );
        const newLogs = guestsToLogout.map((m) => ({
          memberId: m.id,
          memberName: m.name,
          action: "خروج",
          timestamp: new Date().toISOString(),
          loginTime: attendanceLog.find(
            (l) =>
              l.memberId === m.id &&
              l.action === "ورود" &&
              !attendanceLog.some(
                (log) =>
                  log.memberId === m.id &&
                  log.action === "خروج" &&
                  log.loginTime === l.timestamp
              )
          )?.timestamp,
        }));
        setAttendanceLog((prev) => [...prev, ...newLogs]);
        showToast(`${guestsToLogout.length} مهمان به‌طور خودکار خارج شدند`);
      }
    };

    const interval = setInterval(checkLongStays, 60 * 1000);
    return () => clearInterval(interval);
  }, [members, attendanceLog]);

  const showToast = (message) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast({ message: "", isVisible: false }), 3000);
  };

  const handleLogin = (member) => {
    // console.log("Logging in:", member);
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, isInGym: true } : m))
    );
    const newLog = {
      memberId: member.id,
      memberName: member.name,
      action: "ورود",
      timestamp: new Date().toISOString(),
    };
    setAttendanceLog((prev) => [...prev, newLog]);
    showToast(`${member.name} وارد باشگاه شد`);
  };

  const handleLogout = (member) => {
    // console.log("Logging out:", member);
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, isInGym: false } : m))
    );
    const loginLog = attendanceLog.find(
      (l) =>
        l.memberId === member.id &&
        l.action === "ورود" &&
        !attendanceLog.some(
          (log) =>
            log.memberId === l.memberId &&
            log.action === "خروج" &&
            log.loginTime === l.timestamp
        )
    );
    const newLog = {
      memberId: member.id,
      memberName: member.name,
      action: "خروج",
      timestamp: new Date().toISOString(),
      loginTime: loginLog?.timestamp,
    };
    setAttendanceLog((prev) => [...prev, newLog]);
    showToast(`${member.name} از باشگاه خارج شد`);
  };

  const handleLogoutAll = () => {
    setConfirmAction({
      title: "خروج همه اعضا",
      message: "آیا مطمئن هستید که می‌خواهید همه اعضا را از باشگاه خارج کنید؟",
      onConfirm: () => {
        setIsLoading(true);
        setTimeout(() => {
          const inGymMembers = members.filter((m) => m.isInGym);
          setMembers((prev) => prev.map((m) => ({ ...m, isInGym: false })));
          const newLogs = inGymMembers.map((m) => ({
            memberId: m.id,
            memberName: m.name,
            action: "خروج",
            timestamp: new Date().toISOString(),
            loginTime: attendanceLog.find(
              (l) =>
                l.memberId === m.id &&
                l.action === "ورود" &&
                !attendanceLog.some(
                  (log) =>
                    log.memberId === m.id &&
                    log.action === "خروج" &&
                    log.loginTime === l.timestamp
                )
            )?.timestamp,
          }));
          setAttendanceLog((prev) => [...prev, ...newLogs]);
          showToast("همه اعضا از باشگاه خارج شدند");
          setIsLoading(false);
          setIsConfirmModalOpen(false);
        }, 1000);
      },
    });
    setIsConfirmModalOpen(true);
  };

  const handleCorrectLog = (updatedLog) => {
    // console.log("Correcting log:", updatedLog);
    setAttendanceLog((prev) =>
      prev.map((l) =>
        l.memberId === updatedLog.memberId &&
        l.action === updatedLog.action &&
        l.timestamp === selectedLog.timestamp
          ? updatedLog
          : l
      )
    );
    showToast("لاگ تصحیح شد");
    setSelectedLog(null);
  };

  const handleExport = () => {
    const data = attendanceLog.map((entry) => ({
      شناسه: entry.memberId,
      نام: entry.memberName,
      فعالیت: entry.action,
      زمان: new Date(entry.timestamp).toLocaleString("fa-IR"),
      "زمان ورود": entry.loginTime
        ? new Date(entry.loginTime).toLocaleString("fa-IR")
        : "",
      "مدت بازدید (دقیقه)":
        entry.action === "خروج" && entry.loginTime
          ? Math.round(
              (new Date(entry.timestamp) - new Date(entry.loginTime)) /
                (1000 * 60)
            )
          : "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AttendanceLog");
    XLSX.writeFile(workbook, "attendance_log.xlsx");
    showToast("لاگ حضور و غیاب به صورت Excel خروجی گرفته شد");
  };

  return (
    <div
      className="min-h-screen bg-offWhite flex flex-col items-center justify-start p-4 space-y-6"
      dir="rtl"
    >
      <header className="w-full max-w-5xl bg-darkBlue text-offWhite p-4 rounded-2xl shadow-lg flex justify-between items-center">
        <h1 className="text-xl font-bold">سیستم حضور و غیاب اعضا</h1>
      </header>

      <MemberLogForm
        members={members}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Stats members={members} attendanceLog={attendanceLog} />
      <AttendanceLog
        attendanceLog={attendanceLog}
        onExport={handleExport}
        onCorrectLog={(log) => {
          setSelectedLog(log);
          setCorrectLogModalOpen(true);
        }}
      />
      <ActionButtons
        onLogoutAll={handleLogoutAll}
        onShowTrends={() => setTrendsModalOpen(true)}
        isLoading={isLoading}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction?.onConfirm}
        title={confirmAction?.title}
        message={confirmAction?.message}
      />
      <TrendsModal
        isOpen={trendsModalOpen}
        onClose={() => setTrendsModalOpen(false)}
        attendanceLog={attendanceLog}
      />
      <CorrectLogModal
        isOpen={correctLogModalOpen}
        onClose={() => {
          setCorrectLogModalOpen(false);
          setSelectedLog(null);
        }}
        onCorrectLog={handleCorrectLog}
        log={selectedLog}
      />
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ message: "", isVisible: false })}
      />
    </div>
  );
};

export default MemberAttendancePage;
