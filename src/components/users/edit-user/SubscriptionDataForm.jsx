import React from "react";

function SubscriptionDataForm({ formData, handleInputChange, errors }) {
  return (
    <div className="bg-gradient-to-l from-gray-100 to-gray-50 shadow rounded-xl p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">نام تیم</label>
        <input
          type="text"
          name="team_name"
          value={formData.team_name || ""}
          onChange={(e) => handleInputChange("team_name", e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
        {errors.team_name && (
          <p className="text-red-500 text-sm mt-1">{errors.team_name}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">شیفت</label>
        <select
          name="shift"
          value={formData.shift || 2}
          onChange={(e) => handleInputChange("shift", parseInt(e.target.value))}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          <option value={1}>شیفت 1</option>
          <option value={2}>شیفت 2</option>
          <option value={3}>شیفت 3</option>
        </select>
        {errors.shift && (
          <p className="text-red-500 text-sm mt-1">{errors.shift}</p>
        )}
      </div>
    </div>
  );
}

export default SubscriptionDataForm;