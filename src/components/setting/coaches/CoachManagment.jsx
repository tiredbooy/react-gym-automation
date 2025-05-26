import React, { useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import {
  UserPlus,
  Edit,
  Trash2,
  Calendar,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import toast, { Toaster } from "react-hot-toast";

import { useTheme } from "../../../context/ThemeContext";
import CoachForm from "./CoachForm";
import ClientAssignmentModal from "./ClientAssignmentModal";
import CoachCard from "./CoachCard";

// CoachesManagement Component
const CoachesManagement = () => {
  const [coaches, setCoaches] = useState([
    {
      id: 1,
      name: "احمد رضایی",
      contact: "09123456789",
      specialty: "بدنسازی",
      priceProgram: "200,000 تومان",
      pricePrivate: "500,000 تومان",
      shift: "صبح",
      clients: [
        { id: 101, name: "علی محمدی", type: "برنامه" },
        { id: 102, name: "سارا احمدی", type: "مربی خصوصی" },
        { id: 103, name: "رضا حسینی", type: "برنامه" },
      ],
    },
    {
      id: 2,
      name: "سارا محمدی",
      contact: "09129876543",
      specialty: "یوگا",
      priceProgram: "150,000 تومان",
      pricePrivate: "400,000 تومان",
      shift: "بعدازظهر",
      clients: [
        { id: 201, name: "مهدی کریمی", type: "برنامه" },
        { id: 202, name: "نرگس رحیمی", type: "مربی خصوصی" },
      ],
    },
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  const addCoach = (coach) => {
    setCoaches([...coaches, coach]);
    toast.success("مربی با موفقیت اضافه شد");
  };

  const editCoach = (coach) => {
    setCoaches(coaches.map((c) => (c.id === coach.id ? coach : c)));
    toast.success("اطلاعات مربی به‌روزرسانی شد");
  };

  const deleteCoach = (id) => {
    setCoaches(coaches.filter((c) => c.id !== id));
    toast.success("مربی حذف شد");
  };

  const updateClients = (id, updatedCoach) => {
    setCoaches(coaches.map((c) => (c.id === id ? updatedCoach : c)));
  };

  const viewClients = (coach) => {
    setSelectedCoach(coach);
    setIsClientModalOpen(true);
  };

  const saveClients = (coachId, clients) => {
    setCoaches(coaches.map((c) => (c.id === coachId ? { ...c, clients } : c)));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(coaches);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "coaches-data.json";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("داده‌ها صادر شد");
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setCoaches(importedData);
          toast.success("داده‌ها وارد شد");
        } catch (error) {
          toast.error("فایل نامعتبر است");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div
      initial={{ y: -300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-gradient-to-b from-${theme.colors.background} to-${theme.colors.secondary} rounded-xl min-h-screen p-8`}
    >
      <Toaster position="bottom-left" />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className={`text-4xl font-bold text-${theme.colors.primary}`}>
            مدیریت مربیان
          </h1>
          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={exportData}
              className={`flex items-center px-6 py-3 bg-${theme.colors.primary} text-offWhite rounded-xl hover:bg-${theme.colors.primary}/90 font-semibold hover:text-${theme.colors.background} transition-all text-lg shadow-md duration-200`}
            >
              <Download size={20} className="mr-2" /> صدور
            </button>
            <label
              className={`flex items-center px-6 py-3 bg-${theme.colors.primary} text-offWhite rounded-xl hover:bg-${theme.colors.primary}/90 font-semibold hover:text-${theme.colors.background} transition-all text-lg shadow-md cursor-pointer duration-200`}
            >
              <Upload size={20} className="mr-2" /> وارد کردن
              <input type="file" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingCoach(null);
            setIsFormOpen(true);
          }}
          className={`flex items-center mx-auto px-8 py-4 bg-${theme.colors.primary} text-offWhite rounded-xl hover:bg-${theme.colors.primary}/90 font-semibold hover:text-${theme.colors.background} transition-all text-xl shadow-md duration-200`}
        >
          <UserPlus size={24} className="mr-2" /> افزودن مربی جدید
        </motion.button>
        <div className="space-y-6">
          {coaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              onEdit={() => {
                setEditingCoach(coach);
                setIsFormOpen(true);
              }}
              onDelete={deleteCoach}
              onViewClients={viewClients}
              onUpdateClients={updateClients}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          {isFormOpen && (
            <CoachForm
              coach={editingCoach}
              onSave={editingCoach ? editCoach : addCoach}
              onClose={() => setIsFormOpen(false)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {isClientModalOpen && (
            <ClientAssignmentModal
              onClose={() => setIsClientModalOpen(false)}
              coach={selectedCoach}
              coaches={coaches}
              onSaveClients={saveClients}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CoachesManagement;
