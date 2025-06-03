import { useState, useEffect, useMemo, useRef } from "react";
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
import SubscriptionRenewalModal from "./renewal/SubscriptionRenewal";
import { AnimatePresence } from "framer-motion";
import { useUser } from "../../context/UserApiContext";

export default function UsersItem() {
  const { handleFilterUser  } = useUser();

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRenewal, setIsRenewal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const searchRef = useRef();
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

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      searchRef.current?.focus();
    }
  }

  // Inside your component
  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      const queryParams = new URLSearchParams({
        action: "person",
        order_by: "latest",
        gender: "M",
        page: currentPage,
        limit: "24",
      });

      const response = await fetch(
        `http://localhost:8000/api/dynamic/?${queryParams.toString()}`
      );
      const data = await response.json();

      const items = data.items;

      const sortedData = items?.sort(
        (a, b) => new Date(b.creation_datetime) - new Date(a.creation_datetime)
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
  };

  useEffect(() => {
    fetchUserData();
  }, [shift, currentPage]);

  // const filteredUsers = useMemo(() => {
  //   return users.filter((user) => {
  //     const normalize = (str) =>
  //       str?.trim().replace(/\s+/g, " ").toLowerCase() || "";

  //     const fullName = normalize(user.full_name);
  //     const searchName = normalize(searchQueries.person_name);

  //     const matchesName = searchName ? fullName.includes(searchName) : true;

  //     const matchesId = searchQueries.id
  //       ? String(user.id) === String(searchQueries.id)
  //       : true;

  //     return matchesName && matchesId;
  //   });
  // }, [users, searchQueries]);

  function handleFilter() {
    handleFilterUser(searchQueries.person_name , searchQueries.person_id)
  }

  async function handleDelete() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/dynamic/?action=person&id=${selectedUserId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        toast.error("خطا در حذف کاربر");
        return;
      }

      toast.success(`کاربر ${selectedUserId} با موفقیت حذف شد`);

      setIsDeleting((isOpen) => !isOpen);

      // 🔄 Refresh user list after successful deletion
      await fetchUserData();
    } catch (e) {
      console.log("Fetch error:", e.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRenewal() {
    try {
      const response = await fetchUserData(
        `http://localhost:8000/api/dynamic/?action=person&id=${selectedUserId}`
      );
      const data = await response.json();

      console.log(data);
    } catch (e) {
      console.log(e.meesage);
    }
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e)}
      className={`bg-${theme.colors.background} py-12 px-8 text-center`}
    >
      <UserPageHeader
        searchRef={searchRef}
        onAddUserModal={setIsAddUserOpen}
        searchQueries={searchQueries}
        onChangeSearchQuery={setSearchQueries}
        handleFilter={handleFilter}
      />
      <AnimatePresence mode="wait">
        {isAddUserOpen && (
          <AddUserModal isOpen={isAddUserOpen} onOpen={setIsAddUserOpen} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isViewUserOpen && (
          <ViewUserModal
            personId={selectedUserId}
            onCloseModal={() => setIsViewUserOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
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
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {isRenewal && (
          <SubscriptionRenewalModal
            onSubmitUser={handleRenewal}
            onClose={() => setIsRenewal((isOpen) => !isOpen)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isEditing && (
          <EditUserModal
            personId={selectedUserId} // or from your state
            onCloseModal={() => {
              setIsEditing(false);
              fetchUserData();
            }}
          />
        )}
      </AnimatePresence>

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
          users={users}
          onOpenViewUser={() => setIsViewUserOpen((isOpen) => !isOpen)}
          onChangeSlectedUserId={setSelectedUserId}
          onDeleting={setIsDeleting}
          onEdting={setIsEditing}
          onRenewal={setIsRenewal}
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
