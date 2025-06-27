import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";

import SalonCard from "./SalonCard";
import AddSalonForm from "./AddSalonForm";
import WorkHoursModal from "./WorkHoursModal";

const API_URL = "http://localhost:3000/salonsManagment";

// Main SalonSettings Component
const SalonSettings = () => {
  const [salons, setSalons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSalonId, setSelectedSalonId] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  useEffect(() => {
    async function fetchSalons() {
      const response = await fetch(API_URL);
      const data = await response.json();

      setSalons(data)
    }
    fetchSalons()
  },[])

  const addSalon = (salon) => {
    if (salons.some((s) => s.name === salon.name)) {
      toast.error("سالن با این نام قبلاً وجود دارد");
      return;
    }
    const salonObj = {...salon,id : Date.now() , workHours : null};

    fetch(API_URL, {
      method : "POST",
      headers : { "Content-Type" : "application/json" },
      body : JSON.stringify(salonObj)
    })

    setSalons([...salons, salonObj]);
  };

  const editSalon = (id, name) => {
    if (salons.some((s) => s.name === name && s.id !== id)) {
      toast.error("سالن با این نام قبلاً وجود دارد");
      return;
    }
    setSalons(
      salons.map((salon) => (salon.id === id ? { ...salon, name } : salon))
    );
  };

  const deleteSalon = async (id) => {
    const salon = salons.find((s) => s.id === id);
    setLastDeleted(salon);
    setSalons(salons.filter((salon) => salon.id !== id));
    // const response = await fetch(API_URL , {
    //   method : "POST",
    //   headers : { "Content-Type" : "application/json" },
    //   body : JSON.stringify(salons)
    // })
    const res = await fetch(`${API_URL}/?id=${id}`, {
      method : "DELETE"
    });
    const data = await res.json();
    console.log(data)
    toast(
      <div className="flex items-center space-x-2 space-x-reverse font-amiri">
        <span>سالن حذف شد</span>
        <button
          onClick={() => {
            setSalons([...salons, lastDeleted]);
            toast.dismiss();
          }}
          className="underline"
        >
          بازگشت
        </button>
      </div>,
      { duration: 5000, style: { background: "#4CAF50", color: "#F1EFEC" } }
    );
    if (selectedSalonId === id) setSelectedSalonId(null);
  };

  const saveWorkHours = (salonId, workHours) => {
    setSalons(
      salons.map((salon) =>
        salon.id === salonId ? { ...salon, workHours } : salon
      )
    );
  };

  const openWorkHoursModal = (id) => {
    setSelectedSalonId(id);
    setModalOpen(true);
  };

  return (
    <div
      className={`bg-gradient-to-b from-${theme.colors.background} to-${theme.colors.secondary} min-h-screen p-8`}
    >
      <Toaster position="bottom-left" />
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`text-4xl font-bold text-${theme.colors.primary} mb-8 text-center`}
      >
        تنظیمات سالن‌ها
      </motion.h1>
      <div className="max-w-5xl mx-auto space-y-8">
        <AddSalonForm onAddSalon={addSalon} />
        <div className="space-y-4">
          {salons.map((salon) => (
            <SalonCard
              key={salon.id}
              salon={salon}
              onEditSalon={editSalon}
              onDeleteSalon={deleteSalon}
              onEditWorkHours={openWorkHoursModal}
            />
          ))}
        </div>
        <WorkHoursModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={saveWorkHours}
          salonId={selectedSalonId}
          initialHours={salons.find((s) => s.id === selectedSalonId)?.workHours}
        />
      </div>
    </div>
  );
};

export default SalonSettings;
