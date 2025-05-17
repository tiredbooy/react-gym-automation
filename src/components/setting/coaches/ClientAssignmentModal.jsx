import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

export default function ClientAssignmentModal({
  isOpen,
  onClose,
  coach,
  coaches,
  onSaveClients,
}) {
  const [clients, setClients] = useState(coach ? coach.clients || [] : []);
  const [newClientName, setNewClientName] = useState("");
  const [clientType, setClientType] = useState("برنامه");

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

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
      className="fixed inset-0 bg-nearBlack bg-opacity-70 flex items-center justify-center z-50"
    >
      <div
        className={`bg-${theme.colors.background} p-8 rounded-2xl shadow-2xl w-full max-w-lg`}
      >
        <h2 className={`text-3xl font-bold text-${theme.colors.primary} mb-6`}>
          مدیریت مشتریان {coach.name}
        </h2>
        <div className="space-y-4">
          <p className={`text-lg text-${theme.colors.accent}`}>
            تعداد برنامه: {programCount} (قیمت: {coach.priceProgram})
          </p>
          <p className={`text-lg text-${theme.colors.accent}`}>
            تعداد شاگرد خصوصی: {privateCount} (قیمت: {coach.pricePrivate})
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex space-x-3 space-x-reverse">
            <input
              type="text"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              className={`flex-1 p-3 bg-${theme.colors.secondary} border border-${theme.colors.primary} rounded-xl focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary}/60 text-${theme.colors.accent} placeholder-lightGray transition-all`}
              placeholder="نام مشتری جدید"
            />
            <select
              value={clientType}
              onChange={(e) => setClientType(e.target.value)}
              className={`p-3 bg-${theme.colors.secondary} border border-${theme.colors.primary} rounded-xl focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary}/60 text-${theme.colors.accent} transition-all`}
            >
              <option value="برنامه">برنامه</option>
              <option value="مربی خصوصی">مربی خصوصی</option>
            </select>
          </div>
        </div>
        <div className="flex gap-5 justify-end mt-6">
          <button
            onClick={onClose}
            className={`px-6 py-3 bg-${theme.colors.accent} font-semibold text-${theme.colors.background} rounded-xl hover:bg-${theme.colors.accent}/70 transition-all text-lg duration-200`}
          >
            بستن
          </button>
          <button
            onClick={handleAddClient}
            className={`px-6 py-3 bg-${theme.colors.primary} font-semibold text-${theme.colors.background} rounded-xl hover:bg-${theme.colors.primary}/60 transition-all text-lg duration-200`}
          >
            افزودن
          </button>
        </div>
      </div>
    </motion.div>
  );
}
