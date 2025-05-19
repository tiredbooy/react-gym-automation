import { useState, useEffect } from "react";
import Pagination from "../reusables/Pagination";
import UserPageHeader from "./Header";
import UserTable from "./UsersTable";
import AddUserModal from "./add-user/AddUserModal";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

export default function UsersItem({}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  const [users, setUsers] = useState([]);
  const [shift, setShift] = useState(
    JSON.parse(localStorage.getItem("shift")) || 2
  );
  const [searchQuerys, setSearchQuerys] = useState({
    person_name: "",
    id: null,
  });

  const [totalPage, setTotalPage] = useState(null);

  useEffect(() => {
    async function getUserDatas() {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
          action: "person",
          gender: shift === 1 ? "M" : "F",
          page: currentPage,
          limit: "24",
        });

        const response = await fetch(
          `http://localhost:8000/api/dynamic/?${queryParams.toString()}`
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
        setTotalPage(data?.total_pages);
      } catch (e) {
        toast.error("متاسفانه هنگام دریافت اطلاعات خطایی رخ داد لحظاتی دیگر دوباره امتحان کنید!")
      } finally {
        setIsLoading(false);
      }
    }

    getUserDatas();
  }, [shift, currentPage]);

  useEffect(
    () =>
      console.log(
        `Total Page : ${totalPage} And Current Page : ${currentPage}`
      ),
    [currentPage, totalPage]
  );

  return (
    <div className={`bg-${theme.colors.background} py-12 px-8 text-center`}>
      <UserPageHeader
        onAddUserModal={setIsOpen}
        searchQuerys={searchQuerys}
        onChangeSearchQuery={setSearchQuerys}
      />
      {isOpen && <AddUserModal isOpen={isOpen} onOpen={setIsOpen} />}
      {isLoading ? <p>Loading ...</p> : <UserTable users={users} />}
      <Pagination
        className="mt-5"
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
