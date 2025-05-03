import { useEffect, useState } from "react";

export async function getMockUserStats() {
  // Simulate network delay (optional)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allUsers = 500;
  const newUsers = 50;
  const activeUsers = 300;

  // Mock growth percentages
  const allUsersGrowth = 5.2;
  const newUsersGrowth = 10.0;
  const activeUsersGrowth = -2.3;

  return {
    allUsers,
    newUsers,
    activeUsers,
    allUsersGrowth: allUsersGrowth.toFixed(1),
    newUsersGrowth: newUsersGrowth.toFixed(1),
    activeUsersGrowth: activeUsersGrowth.toFixed(1),
  };
}

export default function DataCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getMockUserStats().then(setStats);
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div class="flex flex-row gap-16 items-center">
      <div class="flex flex-col gap-2 items-start justify-center bg-darkBlue text-white px-16 py-3 rounded-2xl">
        <div class="flex flex-row items-center gap-2">
          <i class="fas fa-users"></i>
          <h5 class="text-md text-gray-300">کل کاربرها</h5>
        </div>
        <span class="text-2xl font-bold">${stats.allUsers}</span>
        <span class="text-sm text-gray-300">
          ${stats.allUsersGrowth >= 0 ? "افزایش" : "کاهش"}{" "}
          {Math.abs(stats.allUsersGrowth)}٪ نسبت به ماه گذشته
        </span>
      </div>

      <div class="flex flex-col gap-2 items-start justify-center bg-darkBlue text-white px-16 py-3 rounded-2xl">
        <div class="flex flex-row items-center gap-2">
          <i class="fas fa-user-check"></i>
          <h5 class="text-md text-gray-300">کاربران فعال</h5>
        </div>
        <span class="text-2xl font-bold">${stats.activeUsers}</span>
        <span class="text-sm text-gray-300">
          ${stats.activeUsersGrowth >= 0 ? "افزایش" : "کاهش"}
          {Math.abs(stats.activeUsersGrowth)}٪ نسبت به ماه گذشته
        </span>
      </div>

      <div class="flex flex-col gap-2 items-start justify-center bg-darkBlue text-white px-16 py-3 rounded-2xl">
        <div class="flex flex-row items-center gap-2">
          <i class="fas fa-user-plus"></i>
          <h5 class="text-md text-gray-300">کاربران جدید</h5>
        </div>
        <span class="text-2xl font-bold">${stats.newUsers}</span>
        <span class="text-sm text-gray-300">
          ${stats.newUsersGrowth >= 0 ? "افزایش" : "کاهش"}{" "}
          {Math.abs(stats.newUsersGrowth)}٪ نسبت به ماه گذشته
        </span>
      </div>
    </div>
  );
}

// return (
//   <div className="grid gap-4 p-4">
//     <div className="card bg-offWhite p-4 rounded-xl shadow">
//       <h2 className="text-lg font-bold text-darkBlue">All Users</h2>
//       <p className="text-3xl font-semibold">{stats.allUsers}</p>
//       <p className="text-sm text-gray-500">Growth: {stats.allUsersGrowth}%</p>
//     </div>
//     <div className="card bg-offWhite p-4 rounded-xl shadow">
//       <h2 className="text-lg font-bold text-darkBlue">New Users</h2>
//       <p className="text-3xl font-semibold">{stats.newUsers}</p>
//       <p className="text-sm text-gray-500">Growth: {stats.newUsersGrowth}%</p>
//     </div>
//     <div className="card bg-offWhite p-4 rounded-xl shadow">
//       <h2 className="text-lg font-bold text-darkBlue">Active Users</h2>
//       <p className="text-3xl font-semibold">{stats.activeUsers}</p>
//       <p className="text-sm text-gray-500">
//         Growth: {stats.activeUsersGrowth}%
//       </p>
//     </div>
//   </div>
// );
