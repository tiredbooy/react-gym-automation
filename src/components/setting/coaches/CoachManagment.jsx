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

// CoachForm Component
const CoachForm = ({ isOpen, coach, onSave, onClose }) => {
  const [name, setName] = useState(coach?.name || "");
  const [contact, setContact] = useState(coach?.contact || "");
  const [specialty, setSpecialty] = useState(coach?.specialty || "بدنسازی");
  const [priceProgram, setPriceProgram] = useState(
    coach?.priceProgram || "200000"
  );
  const [pricePrivate, setPricePrivate] = useState(
    coach?.pricePrivate || "500000"
  );
  const [shift, setShift] = useState(coach?.shift || "صبح");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      toast.error("نام و شماره تماس الزامی است");
      return;
    }
    onSave({
      id: coach?.id || Date.now(),
      name,
      contact,
      specialty,
      priceProgram,
      pricePrivate,
      shift,
      clients: coach?.clients || [],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-nearBlack bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-offWhite p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-darkBlue mb-6 font-amiri">
          {coach ? "ویرایش مربی" : "افزودن مربی جدید"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-nearBlack mb-2 text-lg font-amiri">
              نام
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-white border border-lightGray rounded-xl focus:outline-none focus:ring-2 focus:ring-darkBlue text-nearBlack placeholder-gray-400 font-amiri transition-all"
              placeholder="نام مربی"
            />
          </div>
          <div>
            <label className="block text-nearBlack mb-2 text-lg font-amiri">
              شماره تماس
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-3 bg-white border border-lightGray rounded-xl focus:outline-none focus:ring-2 focus:ring-darkBlue text-nearBlack placeholder-gray-400 font-amiri transition-all"
              placeholder="09123456789"
            />
          </div>
          <div>
            <label className="block text-nearBlack mb-2 text-lg font-amiri">
              تخصص
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full p-3 bg-white border border-lightGray rounded-xl focus:outline-none focus:ring-2 focus:ring-darkBlue text-nearBlack font-amiri transition-all"
            >
              <option value="بدنسازی">بدنسازی</option>
              <option value="یوگا">یوگا</option>
              <option value="ماساژ">ماساژ</option>
            </select>
          </div>
          <div>
            <label className="block text-nearBlack mb-2 text-lg font-amiri">
              قیمت برنامه
            </label>
            <input
              type="number"
              value={priceProgram}
              onChange={(e) => setPriceProgram(e.target.value)}
              className="w-full p-3 bg-white border border-lightGray rounded-xl focus:outline-none focus:ring-2 focus:ring-darkBlue text-nearBlack placeholder-gray-400 font-amiri transition-all"
              placeholder="مثال: 200,000 تومان"
            />
          </div>
          <div>
            <label className="block text-nearBlack mb-2 text-lg font-amiri">
              قیمت مربی خصوصی
            </label>
            <input
              type="number"
              value={pricePrivate}
              onChange={(e) => setPricePrivate(e.target.value)}
              className="w-full p-3 bg-white border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-darkBlue text-nearBlack placeholder-lightGray font-amiri transition-all"
              placeholder="مثال: 500,000 تومان"
            />
          </div>
          <div>
            <label className="block text-nearBlack mb-2 text-lg font-amiri">
              شیفت کاری
            </label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full p-3 bg-white border border-lightGray rounded-xl focus:outline-none focus:ring-2 focus:ring-darkBlue text-nearBlack font-amiri transition-all"
            >
              <option value="صبح">صبح</option>
              <option value="بعدازظهر">بعدازظهر</option>
              <option value="عشاء">عشاء</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-lightGray text-nearBlack rounded-xl hover:bg-beige hover:text-darkBlue transition-all font-amiri text-lg"
            >
              لغو
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-darkBlue text-offWhite rounded-xl hover:bg-beige hover:text-darkBlue transition-all font-amiri text-lg"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// ClientAssignmentModal Component
const ClientAssignmentModal = ({
  isOpen,
  onClose,
  coach,
  coaches,
  onSaveClients,
}) => {
  const [clients, setClients] = useState(coach ? coach.clients || [] : []);
  const [newClientName, setNewClientName] = useState("");
  const [clientType, setClientType] = useState("برنامه");

  const handleAddClient = () => {
    if (newClientName.trim() && coach) {
      const newClient = {
        id: Date.now(),
        name: newClientName,
        type: clientType,
      };
      setClients([...clients, newClient]);
      setNewClientName("");
      toast.success("مشتری جدید اضافه شد");
    }
  };

  const handleReassignClient = (clientId, newCoachId) => {
    const newCoach = coaches.find((c) => c.id === newCoachId);
    if (newCoach && coach) {
      onSaveClients(newCoach.id, [
        ...(newCoach.clients || []),
        clients.find((c) => c.id === clientId),
      ]);
      setClients(clients.filter((c) => c.id !== clientId));
      toast.success("مشتری با موفقیت منتقل شد");
    }
  };

  if (!isOpen || !coach) return null;

  const programCount = clients.filter((c) => c.type === "برنامه").length;
  const privateCount = clients.filter((c) => c.type === "مربی خصوصی").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-nearBlack bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-offWhite p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-darkBlue mb-6 font-amiri">
          مدیریت مشتریان {coach.name}
        </h2>
        <div className="space-y-4">
          <p className="text-lg text-nearBlack font-amiri">
            تعداد برنامه: {programCount} (قیمت: {coach.priceProgram})
          </p>
          <p className="text-lg text-nearBlack font-amiri">
            تعداد مربی خصوصی: {privateCount} (قیمت: {coach.pricePrivate})
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex space-x-3 space-x-reverse">
            <input
              type="text"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              className="flex-1 p-3 bg-white border border-lightGray rounded-xl focus:outline-none focus:ring-2 focus:ring-darkBlue text-nearBlack placeholder-lightGray font-amiri transition-all"
              placeholder="نام مشتری جدید"
            />
            <select
              value={clientType}
              onChange={(e) => setClientType(e.target.value)}
              className="p-3 bg-white border border-lightGray rounded-xl focus:outline-none focus:ring-2 focus:ring-darkBlue text-nearBlack font-amiri transition-all"
            >
              <option value="برنامه">برنامه</option>
              <option value="مربی خصوصی">مربی خصوصی</option>
            </select>
            <button
              onClick={handleAddClient}
              className="px-6 py-3 bg-darkBlue text-offWhite rounded-xl hover:bg-beige hover:text-darkBlue transition-all font-amiri text-lg"
            >
              افزودن
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-lightGray text-nearBlack rounded-xl hover:bg-beige hover:text-darkBlue transition-all font-amiri text-lg"
          >
            بستن
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// CoachCard Component
const CoachCard = ({
  coach,
  onEdit,
  onDelete,
  onViewClients,
  onUpdateClients,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const programCount = coach.clients
    ? coach.clients.filter((c) => c.type === "برنامه").length
    : 0;
  const privateCount = coach.clients
    ? coach.clients.filter((c) => c.type === "مربی خصوصی").length
    : 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-r from-white to-beige p-6 rounded-2xl shadow-lg border border-lightGray"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <motion.button
            whileTap={{ scale: 0.9, rotate: "90deg" , transition : easeInOut }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-darkBlue hover:darkBlue "
          >
            {isCollapsed ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </motion.button>
          <h3 className="text-2xl font-bold text-darkBlue font-amiri">
            {coach.name}
          </h3>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(coach)}
            className="text-darkBlue hover:text-beige transition-colors"
          >
            <Edit size={24} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(coach.id)}
            className="text-errorRed hover:text-beige transition-colors"
          >
            <Trash2 size={24} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onViewClients(coach)}
            className="text-darkBlue hover:text-beige transition-colors"
          >
            <Calendar size={24} />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4 text-lg text-nearBlack font-amiri">
              <span>شماره تماس: {coach.contact}</span>
              <span>تخصص: {coach.specialty}</span>
              <span>شیفت: {coach.shift}</span>
              <span>
                قیمت برنامه:{" "}
                {Number(coach?.priceProgram)?.toLocaleString("fa-IR")} تومان
              </span>
              <span>تعداد برنامه: {programCount}</span>
              <span>
                قیمت مربی خصوصی:{" "}
                {Number(coach?.pricePrivate).toLocaleString("fa-IR")} تومان
              </span>
              <span>تعداد مربی خصوصی: {privateCount}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

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
    <div
      className="bg-gradient-to-b from-offWhite to-beige min-h-screen p-8 font-amiri"
      dir="rtl"
    >
      <Toaster position="bottom-left" />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-darkBlue">مدیریت مربیان</h1>
          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={exportData}
              className="flex items-center px-6 py-3 bg-darkBlue text-offWhite rounded-xl hover:bg-beige hover:text-darkBlue transition-all font-amiri text-lg shadow-md"
            >
              <Download size={20} className="mr-2" /> صدور
            </button>
            <label className="flex items-center px-6 py-3 bg-darkBlue text-offWhite rounded-xl hover:bg-beige hover:text-darkBlue transition-all font-amiri text-lg shadow-md cursor-pointer">
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
          className="flex items-center mx-auto px-8 py-4 bg-darkBlue text-offWhite rounded-xl hover:bg-beige hover:text-darkBlue transition-all font-amiri text-xl shadow-md"
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
        <CoachForm
          isOpen={isFormOpen}
          coach={editingCoach}
          onSave={editingCoach ? editCoach : addCoach}
          onClose={() => setIsFormOpen(false)}
        />
        <ClientAssignmentModal
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          coach={selectedCoach}
          coaches={coaches}
          onSaveClients={saveClients}
        />
      </div>
    </div>
  );
};

export default CoachesManagement;
