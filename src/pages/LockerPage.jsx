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
import { useTheme } from "../context/ThemeContext";

import Locker from "../components/locker-page/Locker";
import Stats from "../components/locker-page/Stats";
import Filters from "../components/locker-page/Filters";
import AssignModal from "../components/locker-page/AssignModal";
import HistoryModal from "../components/locker-page/HistoryModal";
import ConfirmModal from "../components/locker-page/ConfirmModal";
import ReportModal from "../components/locker-page/ReportModal";
import ActionButtons from "../components/locker-page/ActionButtons";

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

  const { activeTheme , themes } = useTheme();
  const theme = themes[activeTheme];
  const { primary , secondary , accent , background } = theme.colors;

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
      className={`min-h-screen bg-gradient-to-br from-${secondary} to-${background} flex flex-col items-center justify-start p-4 space-y-6`}
      dir="rtl"
    >
      <header className={`w-full max-w-5xl bg-${primary} text-${background} p-4 rounded-2xl shadow-lg flex justify-between items-center`}>
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
