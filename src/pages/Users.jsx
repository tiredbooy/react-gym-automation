import UsersItem from "../components/users/UsersItem";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUserDatas() {
      const startTime = Date.now(); // Record start time in milliseconds
      try {
        const response = await fetch(
          `http://localhost:8000/api/dynamic/?action=person&gender=F&page=1&limit=8`
        );
        const data = await response.json();

        const items = data.items;

        const sortedData = items?.sort(
          (a, b) =>
            new Date(b.creation_datetime) - new Date(a.creation_datetime)
        );

        // Preprocess user data to format base64 images
        const processedUsers = sortedData.map((user) => ({
          ...user,
          thumbnail_image: user.thumbnail_image
            ? `data:image/jpeg;base64,${user.thumbnail_image.replace(
                /^.*\/9j\//,
                "/9j/"
              )}`
            : null,
          person_image: user.person_image
            ? `data:image/jpeg;base64,${user.person_image.replace(
                /^.*\/9j\//,
                "/9j/"
              )}`
            : null,
        }));

        setUsers(processedUsers);
      } catch (e) {
        console.error("Error fetching user data:", e);
      } finally {
        const endTime = Date.now(); // Record end time in milliseconds
        const durationSeconds = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`Data loaded in: ${durationSeconds} seconds`);
      }
    }

    getUserDatas();
  }, []);

  return <UsersItem users={users} setUsers={setUsers} />;
}
