import React from 'react';

const allPermissions = [
  'گزارش‌ها',
  'مدیریت خدمات',
  'مدیریت کاربران',
  'مدیریت کمدها',
  'پشتیبانی',
  'مدیریت سخت‌افزار',
  'تنظیمات سالن',
];

export default function RolePermissions({ role, onPermissionChange }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {allPermissions.map((perm) => (
        <label key={perm} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={role.permissions.includes(perm)}
            onChange={() => onPermissionChange(perm)}
            className="accent-darkBlue"
          />
          <span className="text-sm">{perm}</span>
        </label>
      ))}
    </div>
  );
}
