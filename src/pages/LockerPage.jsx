import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Star,
  User,
  PlusCircle,
  XCircle,
  Search,
  Filter,
  Download,
  X,
  AlertTriangle,
  BarChart,
} from "lucide-react";

// Locker Component
const Locker = ({
  number,
  type,
  isOccupied,
  member,
  onAssign,
  onRelease,
  onViewHistory,
}) => {
  const baseStyle =
    "flex flex-col items-center justify-center p-2 rounded-xl shadow-md cursor-pointer transition text-center";
  const typeStyles = {
    vip: "bg-yellow-200 text-nearBlack hover:bg-yellow-300",
    open: "bg-green-100 text-green-800 hover:bg-green-200",
    closed: "bg-red-100 text-red-800 hover:bg-red-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${baseStyle} ${typeStyles[type]} w-24 h-24 relative`}
      onClick={() => isOccupied && onViewHistory(number)}
    >
      <div className="flex items-center gap-1 text-sm font-bold">
        <Lock className="w-4 h-4" />
        {number}
      </div>
      {type === "vip" && (
        <div className="flex items-center gap-1 mt-1 text-[10px]">
          <Star className="w-3 h-3" /> VIP
        </div>
      )}
      {isOccupied ? (
        <div className="mt-1 text-[10px] text-center">
          <User className="w-3 h-3 inline" /> {member}
          <div className="mt-1 flex gap-1 justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRelease(number);
              }}
              className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <XCircle className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex gap-1 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssign(number);
            }}
            className="bg-darkBlue text-offWhite p-1 rounded-full text-[10px] hover:bg-blue-700"
          >
            <PlusCircle className="w-3 h-3" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Stats Component
const Stats = ({ total, occupied, free, vip }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-5xl bg-beige p-4 rounded-2xl shadow-lg flex justify-between text-sm text-nearBlack"
  >
    <div>کل کمدها: {total}</div>
    <div>اشغال‌شده: {occupied}</div>
    <div>آزاد: {free}</div>
    <div>VIP: {vip}</div>
  </motion.div>
);

// Filter Component
const Filters = ({ search, setSearch, filter, setFilter, onExport }) => (
  <div className="w-full max-w-5xl flex flex-col sm:flex-row gap-4">
    <div className="relative flex-1">
      <Search className="absolute right-2 top-2.5 w-5 h-5 text-gray-500" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جستجو بر اساس شماره یا نام عضو"
        className="w-full p-2 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
      />
    </div>
    <div className="flex gap-2">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
      >
        <option value="all">همه</option>
        <option value="occupied">اشغال‌شده</option>
        <option value="free">آزاد</option>
        <option value="vip">VIP</option>
      </select>
    </div>
  </div>
);

// Assign Modal Component
const AssignModal = ({ isOpen, onClose, onAssign, lockerNumber }) => {
  const [memberName, setMemberName] = useState("");

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
              <h2 className="text-lg font-bold text-nearBlack">
                تخصیص کمد شماره {lockerNumber}
              </h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-nearBlack" />
              </button>
            </div>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="نام عضو"
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-beige text-nearBlack"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="p-2 bg-gray-300 rounded-lg text-nearBlack hover:bg-hoverBeige"
              >
                لغو
              </button>
              <button
                onClick={() => {
                  if (memberName.trim()) {
                    onAssign(lockerNumber, memberName);
                    setMemberName("");
                    onClose();
                  }
                }}
                className="p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700"
              >
                تخصیص
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// History Modal Component
const HistoryModal = ({ isOpen, onClose, history, lockerNumber }) => (
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
            <h2 className="text-lg font-bold text-nearBlack">
              تاریخچه کمد شماره {lockerNumber}
            </h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-nearBlack" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {history.length ? (
              <ul className="space-y-2">
                {history.map((entry, index) => (
                  <li key={index} className="text-sm text-nearBlack">
                    <span className="font-bold">{entry.member}</span> -{" "}
                    {entry.action} در{" "}
                    {new Date(entry.timestamp).toLocaleString("fa-IR")}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">بدون تاریخچه</p>
            )}
          </div>
          <div className="flex justify-end mt-4 lettre">
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

// Confirm Modal Component
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

// Report Modal Component
const ReportModal = ({ isOpen, onClose, lockers }) => {
  const usageStats = lockers
    .map((locker) => ({
      number: locker.number,
      usageCount: locker.history
        ? locker.history.filter((h) => h.action === "تخصیص").length
        : 0,
    }))
    .sort((a, b) => b.usageCount - a.usageCount)
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
                گزارش استفاده از کمدها
              </h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-nearBlack" />
              </button>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-nearBlack">
                پرکاربردترین کمدها
              </h3>
              <ul className="space Y-2 mt-2">
                {usageStats.map((stat) => (
                  <li key={stat.number} className="text-sm text-nearBlack">
                    کمد شماره {stat.number}: {stat.usageCount} بار استفاده
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

// Action Buttons Component
const ActionButtons = ({
  onCloseAll,
  onOpenAll,
  onReset,
  onReport,
  isLoading,
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="fixed bottom-4 w-full max-w-5xl bg-beige p-4 rounded-2xl shadow-lg flex flex-wrap justify-center gap-4"
  >
    <div className="relative group">
      <button
        onClick={onCloseAll}
        disabled={isLoading}
        className={`p-2 bg-red-500 text-offWhite rounded-lg flex items-center gap-1 hover:bg-red-600 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Lock className="w-5 h-5" /> بستن همه کمدها
      </button>
      <span className="absolute bottom-full mb-2 hidden group-hover:block bg-nearBlack text-offWhite text-xs rounded p-1">
        همه کمدها را آزاد می‌کند
      </span>
    </div>
    <div className="relative group">
      <button
        onClick={onOpenAll}
        disabled={isLoading}
        className={`p-2 bg-green-500 text-offWhite rounded-lg flex items-center gap-1 hover:bg-green-600 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Lock className="w-5 h-5" /> باز کردن همه کمدها
      </button>
      <span className="absolute bottom-full mb-2 hidden group-hover:block bg-nearBlack text-offWhite text-xs rounded p-1">
        همه کمدها را در دسترس قرار می‌دهد
      </span>
    </div>
    <div className="relative group">
      <button
        onClick={onReset}
        disabled={isLoading}
        className={`p-2 bg-yellow-500 text-offWhite rounded-lg flex items-center gap-1 hover:bg-yellow-600 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <AlertTriangle className="w-5 h-5" /> ریست سیستم
      </button>
      <span className="absolute bottom-full mb-2 hidden group-hover:block bg-nearBlack text-offWhite text-xs rounded p-1">
        همه تخصیص‌ها و تاریخچه را پاک می‌کند
      </span>
    </div>
    <div className="relative group">
      <button
        onClick={onReport}
        disabled={isLoading}
        className={`p-2 bg-darkBlue text-offWhite rounded-lg flex items-center gap-1 hover:bg-blue-700 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <BarChart className="w-5 h-5" /> گزارش استفاده
      </button>
      <span className="absolute bottom-full mb-2 hidden group-hover:block bg-nearBlack text-offWhite text-xs rounded p-1">
        گزارش استفاده از کمدها را نمایش می‌دهد
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

// Main LockerManagementPage Component
const LockerManagementPage = () => {
  const [lockers, setLockers] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      number: i + 1,
      isOccupied: false,
      history: [],
    })).map((locker) => {
      if (locker.number === 2)
        return {
          ...locker,
          isOccupied: true,
          member: "علی رضایی",
          history: [
            { member: "علی رضایی", action: "تخصیص", timestamp: new Date() },
          ],
        };
      if (locker.number === 4)
        return {
          ...locker,
          isOccupied: true,
          member: "مریم احمدی",
          history: [
            { member: "مریم احمدی", action: "تخصیص", timestamp: new Date() },
          ],
        };
      return locker;
    })
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [isLoading, setIsLoading] = useState(false);
  const vipLockers = [2, 5];
  const totalLockers = Array.from({ length: 20 }, (_, i) => i + 1);

  const showToast = (message) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast({ message: "", isVisible: false }), 3000);
  };

  const handleAssign = (number, memberName) => {
    setLockers((prev) =>
      prev.map((l) =>
        l.number === number
          ? {
              ...l,
              isOccupied: true,
              member: memberName,
              history: [
                ...(l.history || []),
                { member: memberName, action: "تخصیص", timestamp: new Date() },
              ],
            }
          : l
      )
    );
    showToast(`کمد شماره ${number} به ${memberName} تخصیص یافت`);
  };

  const handleRelease = (number) => {
    const locker = lockers.find((l) => l.number === number);
    setConfirmModal({
      isOpen: true,
      title: "آزادسازی کمد",
      message: `آیا مطمئن هستید که می‌خواهید کمد شماره ${number} را آزاد کنید؟`,
      onConfirm: () => {
        setLockers((prev) =>
          prev.map((l) =>
            l.number === number
              ? {
                  ...l,
                  isOccupied: false,
                  member: null,
                  history: [
                    ...l.history,
                    {
                      member: l.member,
                      action: "آزادسازی",
                      timestamp: new Date(),
                    },
                  ],
                }
              : l
          )
        );
        showToast(`کمد شماره ${number} آزاد شد`);
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
    });
  };

  const handleCloseAll = () => {
    setConfirmModal({
      isOpen: true,
      title: "بستن همه کمدها",
      message: "آیا مطمئن هستید که می‌خواهید همه کمدها را آزاد کنید؟",
      onConfirm: () => {
        setIsLoading(true);
        setTimeout(() => {
          setLockers((prev) =>
            prev.map((l) => ({
              ...l,
              isOccupied: false,
              member: null,
              history: [
                ...l.history,
                ...(l.isOccupied
                  ? [
                      {
                        member: l.member,
                        action: "آزادسازی",
                        timestamp: new Date(),
                      },
                    ]
                  : []),
              ],
            }))
          );
          showToast("همه کمدها آزاد شدند");
          setIsLoading(false);
          setConfirmModal({ ...confirmModal, isOpen: false });
        }, 1000);
      },
    });
  };

  const handleOpenAll = () => {
    setConfirmModal({
      isOpen: true,
      title: "باز کردن همه کمدها",
      message: "آیا مطمئن هستید که می‌خواهید همه کمدها را در دسترس قرار دهید؟",
      onConfirm: () => {
        setIsLoading(true);
        setTimeout(() => {
          setLockers((prev) =>
            prev.map((l) => ({
              ...l,
              isOccupied: false,
              member: null,
              history: [
                ...l.history,
                ...(l.isOccupied
                  ? [
                      {
                        member: l.member,
                        action: "آزادسازی",
                        timestamp: new Date(),
                      },
                    ]
                  : []),
              ],
            }))
          );
          showToast("همه کمدها در دسترس قرار گرفتند");
          setIsLoading(false);
          setConfirmModal({ ...confirmModal, isOpen: false });
        }, 1000);
      },
    });
  };

  const handleReset = () => {
    setConfirmModal({
      isOpen: true,
      title: "ریست سیستم",
      message:
        "آیا مطمئن هستید که می‌خواهید همه تخصیص‌ها و تاریخچه را پاک کنید؟ این عملیات قابل بازگشت نیست.",
      onConfirm: () => {
        setIsLoading(true);
        setTimeout(() => {
          setLockers(
            Array.from({ length: 20 }, (_, i) => ({
              number: i + 1,
              isOccupied: false,
              history: [],
            }))
          );
          showToast("سیستم ریست شد");
          setIsLoading(false);
          setConfirmModal({ ...confirmModal, isOpen: false });
        }, 1000);
      },
    });
  };

  const filteredLockers = lockers.filter((locker) => {
    const matchesSearch =
      search === "" ||
      locker.number.toString().includes(search) ||
      (locker.member && locker.member.includes(search));
    const matchesFilter =
      filter === "all" ||
      (filter === "occupied" && locker.isOccupied) ||
      (filter === "free" && !locker.isOccupied) ||
      (filter === "vip" && vipLockers.includes(locker.number));
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: totalLockers.length,
    occupied: lockers.filter((l) => l.isOccupied).length,
    free: totalLockers.length - lockers.filter((l) => l.isOccupied).length,
    vip: vipLockers.length,
  };

  return (
    <div
      className="min-h-screen bg-offWhite flex flex-col items-center justify-start p-4 space-y-6"
      dir="rtl"
    >
      <header className="w-full max-w-5xl bg-darkBlue text-offWhite p-4 rounded-2xl shadow-lg flex justify-between items-center">
        <h1 className="text-xl font-bold">مدیریت کمدهای باشگاه</h1>
      </header>

      <Stats {...stats} />
      <Filters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 w-full max-w-5xl">
        {filteredLockers.map((locker) => (
          <Locker
            key={locker.number}
            number={locker.number}
            type={
              vipLockers.includes(locker.number)
                ? "vip"
                : locker.isOccupied
                ? "closed"
                : "open"
            }
            isOccupied={locker.isOccupied}
            member={locker.member}
            onAssign={() => {
              setSelectedLocker(locker.number);
              setModalOpen(true);
            }}
            onRelease={handleRelease}
            onViewHistory={() => {
              setSelectedLocker(locker.number);
              setHistoryModalOpen(true);
            }}
          />
        ))}
      </div>

      <ActionButtons
        onCloseAll={handleCloseAll}
        onOpenAll={handleOpenAll}
        onReset={handleReset}
        onReport={() => setReportModalOpen(true)}
        isLoading={isLoading}
      />

      <AssignModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAssign={handleAssign}
        lockerNumber={selectedLocker}
      />
      <HistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={
          lockers.find((l) => l.number === selectedLocker)?.history || []
        }
        lockerNumber={selectedLocker}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        lockers={lockers}
      />
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ message: "", isVisible: false })}
      />
    </div>
  );
};

export default LockerManagementPage;
