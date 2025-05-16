import React, { useState } from "react";
import { PlusCircle, Trash2, Shield, Bell, ToggleRight, Check } from "lucide-react";
import { motion , AnimatePresence } from "framer-motion";
import RolePermissions from "./RolePermissions";
import UserManagement from "./UserManagement";
import { useTheme } from "../../../context/ThemeContext";

const initialRoles = [
  {
    id: 1,
    name: "مدیر",
    permissions: ["گزارش‌ها", "مدیریت خدمات", "مدیریت کاربران"],
  },
  { id: 2, name: "مربی", permissions: ["گزارش‌ها", "مدیریت خدمات"] },
  { id: 3, name: "پذیرش", permissions: ["ثبت ورود و خروج", "مدیریت کمدها"] },
  { id: 4, name: "بوفه", permissions: [] },
];

export default function AccessManagement() {
  const [roles, setRoles] = useState(initialRoles);
  const [newRole, setNewRole] = useState("");
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [notifyStaff, setNotifyStaff] = useState(true);
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  const handleAddRole = () => {
    if (newRole.trim() === "") return;
    setRoles([...roles, { id: Date.now(), name: newRole, permissions: [] }]);
    setNewRole("");
  };

  const handleDeleteRole = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  const handlePermissionChange = (roleId, permission) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: role.permissions.includes(permission)
                ? role.permissions.filter((p) => p !== permission)
                : [...role.permissions, permission],
            }
          : role
      )
    );
  };

  return (
    <div
      className={`bg-gradient-to-bl from-${theme.colors.secondary} p-6 rounded-2xl shadow-lg max-w-6xl mx-auto text-${theme.colors.primary}`}
    >
      <h2
        className={`text-2xl font-bold mb-6 text-right border-b-2 border-${theme.colors.secondary} pb-4`}
      >
        تنظیمات دسترسی و مدیریت
      </h2>

      {/* SMS Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`mb-8 bg-${theme.colors.secondary} p-4 rounded-xl shadow flex flex-col md:flex-row justify-between`}
      >
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <Bell size={20} className={`text-${theme.colors.primary}`} />
          <span className="font-semibold">ارسال پیامک اعلان</span>
        </div>
        <div className="flex gap-4">
          {[
            {
              label: "ورزشکاران",
              checked: notifyUsers,
              toggle: () => setNotifyUsers(!notifyUsers),
            },
            {
              label: "مدیر",
              checked: notifyStaff,
              toggle: () => setNotifyStaff(!notifyStaff),
            },
          ].map(({ label, checked, toggle }) => (
            <button
              key={label}
              onClick={toggle}
              className={`flex items-center gap-2 p-2 rounded-lg text-${theme.colors.accent} transition-colors duration-200`}
            >
              <div
                className={`w-5 h-5 border-2 border-${
                  theme.colors.primary
                } rounded-full flex items-center justify-center transition-colors duration-200 ${
                  checked
                    ? `bg-${theme.colors.primary}`
                    : `border-${theme.colors.primary}`
                }`}
              >
                <AnimatePresence>
                  {checked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className={`text-${theme.colors.accent} text-sm`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Role Management */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className={`text-${theme.colors.primary}`} size={20} /> مدیریت نقش‌ها
          </h3>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="افزودن نقش جدید..."
              className={`flex-1 p-2 rounded-xl text-${theme.colors.accent} border bg-${theme.colors.secondary} focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary} duration-150`}
            />
            <button
              onClick={handleAddRole}
              className={`ml-2 bg-${theme.colors.primary} text-${theme.colors.background} px-4 py-2 rounded-xl hover:bg-opacity-90 transition`}
            >
              <PlusCircle size={20} />
            </button>
          </div>

          {roles.map((role) => (
            <motion.div
              key={role.id}
              className={`bg-${theme.colors.secondary} rounded-xl p-4 mb-4 shadow-md`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{role.name}</span>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <RolePermissions
                role={role}
                onPermissionChange={(permission) =>
                  handlePermissionChange(role.id, permission)
                }
              />
            </motion.div>
          ))}
        </div>

        {/* Staff Management */}
        <UserManagement roles={roles} />
      </motion.div>
    </div>
  );
}
