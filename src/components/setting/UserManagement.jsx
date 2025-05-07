import React, { useState } from "react";
import { CheckCircle, XCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

const initialUsers = [
  {
    id: 1,
    name: "علی رضایی",
    role: "مدیر",
    active: true,
    lastLogin: "1404/02/17 08:30",
  },
  {
    id: 2,
    name: "زهرا احمدی",
    role: "مربی",
    active: false,
    lastLogin: "1404/02/16 09:00",
  },
  {
    id: 3,
    name: "رضا محمدی",
    role: "پذیرش",
    active: true,
    lastLogin: "1404/02/15 12:15",
  },
];

export default function UserManagement({ roles }) {
  const staffRoles = ["مدیر", "مربی", "پذیرش", "بوفه"];
  const [users, setUsers] = useState(initialUsers);

  const toggleActive = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  const handleRoleChange = (id, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Users className="text-darkBlue" size={20} /> مدیریت پرسنل
      </h3>

      <div className="space-y-2">
        {users
          .filter((u) => staffRoles.includes(u.role))
          .map((user) => (
            <motion.div
              key={user.id}
              className="bg-beige p-3 rounded-xl flex justify-between items-center shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <div className="font-bold">{user.name}</div>
                <div className="text-sm">آخرین ورود: {user.lastLogin}</div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="rounded-xl p-1 border bg-offWhite focus:outline-none"
                >
                  {roles
                    .filter((r) => staffRoles.includes(r.name))
                    .map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => toggleActive(user.id)}
                  className={user.active ? "text-green-600" : "text-red-600"}
                >
                  {user.active ? (
                    <CheckCircle size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
