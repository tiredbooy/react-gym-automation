import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useUser } from "../../context/UserApiContext";
import AddUserModal from "./add-user/AddUserModal";
import Pagination from "../reusables/Pagination";
import UserPageHeader from "./Header";
import UserTable from "./UsersTable";
import ViewUserModal from "./view-user/ViewUserModal";
import EditUserModal from "./edit-user/EditUserModal";
import Loader from "../reusables/Loader";
import DeleteModal from "../reusables/DeleteModal";
import SubscriptionRenewalModal from "./renewal/SubscriptionRenewal";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function UsersItem() {
  const {
    fetchUsers,
    filteredUsers,
    totalPages,
    isLoading,
    shift,
    currentPage,
    handlePageChange,
    isFiltered,
  } = useUser();

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRenewal, setIsRenewal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const searchRef = useRef();
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  // FIXED: Only fetch on mount and when shift changes
  // Remove fetchUsers from dependencies to prevent loops
  useEffect(() => {
    fetchUsers(1);
  }, [shift , fetchUsers]); // Only depend on shift, not fetchUsers

  // Handle delete
  async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `http://localhost:8000/api/dynamic/?action=person&id=${selectedUserId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete user");

      toast.success(`کاربر ${selectedUserId} با موفقیت حذف شد`);

      // Refresh current page
      await handlePageChange(currentPage);
    } catch (e) {
      toast.error("خطا در حذف کاربر");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={`bg-${theme.colors.background} py-12 px-8 text-center`}>
      <UserPageHeader searchRef={searchRef} onAddUserModal={setIsAddUserOpen} />

      <AnimatePresence mode="wait">
        {isAddUserOpen && (
          <AddUserModal isOpen={isAddUserOpen} onOpen={setIsAddUserOpen} />
        )}
        {isViewUserOpen && (
          <ViewUserModal
            personId={selectedUserId}
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
            personId={selectedUserId}
            onCloseModal={() => {
              setIsEditing(false);
              handlePageChange(currentPage);
            }}
          />
        )}
        {isRenewal && (
          <SubscriptionRenewalModal
            onSubmitUser={() => {}}
            onClose={() => setIsRenewal(false)}
            userID={selectedUserId}
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
          users={filteredUsers}
          onOpenViewUser={() => setIsViewUserOpen(true)}
          onChangeSelectedUserId={setSelectedUserId}
          onEditing={setIsEditing}
          onRenewal={setIsRenewal}
          onDeleting={setIsDeleting}
        />
      )}

      <Pagination
        className="mt-5"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default UsersItem;
