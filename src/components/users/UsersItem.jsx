import { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";

import AddUserModal from "./add-user/AddUserModal";
import Pagination from "../reusables/Pagination";
import UserPageHeader from "./Header";
import UserTable from "./UsersTable";
import ViewUserModal from "./view-user/ViewUserModal";
import EditUserModal from "./edit-user/EditUserModal";
import Loader from "../reusables/Loader";
import toast from "react-hot-toast";
import DeleteModal from "../reusables/DeleteModal";

export default function UsersItem() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  const [users, setUsers] = useState([]);
  const [shift, setShift] = useState(
    JSON.parse(localStorage.getItem("shift")) || 2
  );
  const [searchQueries, setSearchQueries] = useState({
    person_name: "",
    person_id: null,
  });
  const [totalPage, setTotalPage] = useState(null);

  useEffect(() => {
    console.log("Selected Id :", selectedUserId);
  }, [selectedUserId, isAddUserOpen]);

  useEffect(() => {
    async function fetchUserData() {
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
        toast.error(
          "متاسفانه هنگام دریافت اطلاعات خطایی رخ داد لحظاتی دیگر دوباره امتحان کنید!"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [shift, currentPage]);

  useEffect(() => {
    console.log(`Total Page : ${totalPage} And Current Page : ${currentPage}`);
  }, [currentPage, totalPage]);

  // 🔍 Filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const normalize = (str) =>
        str?.trim().replace(/\s+/g, " ").toLowerCase() || "";

      const fullName = normalize(user.full_name);
      const searchName = normalize(searchQueries.person_name);

      const matchesName = searchName ? fullName.includes(searchName) : true;

      const matchesId = searchQueries.id
        ? String(user.id) === String(searchQueries.id)
        : true;

      return matchesName && matchesId;
    });
  }, [users, searchQueries]);

  async function handleDelete() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/dynamic/?action=person&id=${selectedUserId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) return;
      const data = await response.json();

      console.log(data.items);

      toast.success(`کاربر ${selectedUserId} با موفیقت حذف شد`);
    } catch (e) {
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`bg-${theme.colors.background} py-12 px-8 text-center`}>
      <UserPageHeader
        onAddUserModal={setIsAddUserOpen}
        searchQueries={searchQueries}
        onChangeSearchQuery={setSearchQueries}
      />
      {isAddUserOpen && (
        <EditUserModal isOpen={isAddUserOpen} onOpen={setIsAddUserOpen} />
      )}
      {isViewUserOpen && (
        <ViewUserModal
          personId={selectedUserId} // or from your state
          onCloseModal={() => setIsViewUserOpen(false)}
        />
      )}
      {isDeleting && (
        <DeleteModal
          onClose={() => setIsDeleting(false)}
          onConfirm={handleDelete}
          title="آیا از حذف این آیتم مطمئن هستید؟"
          isLoading={isLoading}
        >
          این عملیات غیرقابل بازگشت است. آیا مطمئن هستید که می‌خواهید ادامه
          دهید؟
        </DeleteModal>
      )}
      {isEditing && (
        <EditUserModal
          personId={selectedUserId} // or from your state
          onCloseModal={() => setIsEditing(false)}
        />
      )}

      {isLoading ? (
        <Loader
          color={`text-${theme.colors.accent}`}
          textClassName={`text-xl`}
          className={`justify-center px-4 py-6 rounded-xl bg-gradient-to-l from-${theme.colors.background} to-${theme.colors.secondary} brightness-75`}
          size={26}
        >
          درحال بارگذاری
        </Loader>
      ) : (
        <UserTable
          users={filteredUsers}
          onOpenViewUser={() => setIsViewUserOpen((isOpen) => !isOpen)}
          onChangeSlectedUserId={setSelectedUserId}
          onDeleting={setIsDeleting}
          onEdting={setIsEditing}
        />
      )}
      <Pagination
        className="mt-5"
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
