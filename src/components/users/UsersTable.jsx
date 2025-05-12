import { Repeat, LogOut, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function UserTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUserDatas() {
      const startTime = Date.now(); // start in ms
      try {
        const response = await fetch(
          `http://localhost:8000/api/dynamic/?action=person`
        );
        const data = await response.json();

        // Calculate total size of person_image fields
        const totalImageSizeBytes = data.reduce((total, user) => {
          if (user.person_image && typeof user.person_image === "string") {
            return total + (user.person_image.length * 3) / 4; // Base64 to binary size
          }
          return total;
        }, 0);
        const totalImageSizeMB = (totalImageSizeBytes / (1024 * 1024)).toFixed(
          2
        );
        console.log(`Total person_image size: ${totalImageSizeMB} MB`);

        const sortedData = data?.sort(
          (a, b) =>
            new Date(b.creation_datetime) - new Date(a.creation_datetime)
        );
        // const sliced = sortedData?.slice(0, 300);

        // Preprocess user data to format base64 images
        const processedUsers = sortedData.map((user) => ({
          ...user,
          person_image: user.person_image
            ? `data:image/jpeg;base64,${user.person_image.replace(
                /^.*\/9j\//,
                "/9j/"
              )}`
            : null, // No external placeholder
        }));

        setUsers(processedUsers);
      } catch (e) {
        console.error("Error fetching user data:", e);
      } finally {
        const endTime = Date.now(); // end in ms
        const durationSeconds = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`Fetch duration: ${durationSeconds} seconds`);
      }
    }

    getUserDatas();
  }, []);
  useEffect(() => console.log(users), [users]);

  return (
    <div className="h-[60vh] overflow-y-auto bg-darkBlue rounded-lg">
      <table className="table rounded-lg w-full">
        {/* head */}
        <thead className="bg-beige text-darkBlue sticky top-0 z-10">
          <tr>
            <th>نام و نام خانوادگی</th>
            <th>رشته ورزشی</th>
            <th>پایان اشتراک</th>
            <th>ورود</th>
            <th>کمد</th>
            <th>جلسات باقی مانده</th>
            <th>عملیات ها</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={index}
              className="border-b border-beige hover:bg-[#2f5986] transition duration-150"
            >
              <td className="py-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src={user.person_image}
                        alt="Avatar Tailwind CSS Component"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/48"; // Fallback on error
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm opacity-50">{user.user_type}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-2">
                {user.sport}
                <br />
                <span className="badge badge-ghost badge-sm bg-beige text-nearBlack font-bold">
                  {user.subscription_days} جلسه
                </span>
              </td>
              <td className="py-4 px-2">{user?.birth_date}</td>
              <td className="py-4 px-2">{user?.mobile}</td>
              <td className="py-4 px-2">{user.locker}</td>
              <td className="py-4 px-2">{user.locker}</td>
              <td className="py-4 px-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1, color: "yellow" }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="text-beige font-bold"
                  >
                    <Eye size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="text-green-500 font-bold"
                  >
                    <Repeat size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 font-bold"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
