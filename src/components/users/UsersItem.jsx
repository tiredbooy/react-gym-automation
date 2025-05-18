import { useState, useEffect } from "react";
import Pagination from "../reusables/Pagination";
import UserPageHeader from "./Header";
import UserTable from "./UsersTable";
import AddUserModal from "./add-user/AddUserModal";
import { useTheme } from "../../context/ThemeContext";

export default function UsersItem({ users , setUsers }) {
  const [isOpen, setIsOpen] = useState(false);
  const [ currentPage , setCurrentPage ] = useState(1)
  const totalPage = 60;

  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  return (
    <div className={`bg-${theme.colors.background} py-12 px-8 text-center`}>
      <UserPageHeader onAddUserModal={setIsOpen} users={users} setUsers={setUsers} />
      {isOpen && <AddUserModal isOpen={isOpen} onOpen={setIsOpen} />}
      <UserTable users={users} />
      <Pagination
        className="mt-5"
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
