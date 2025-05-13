import { useState, useEffect } from "react";
import Pagination from "../reusables/Pagination";
import UserPageHeader from "./Header";
import UserTable from "./UsersTable";
import AddUserModal from "./add-user/AddUserModal";

export default function UsersItem({ users }) {
  const [isOpen, setIsOpen] = useState(false);
  

  return (
    <div className="bg-offWhite py-12 px-8 text-center">
      <UserPageHeader />
      <UserTable users={users} />
      {/* <AddUserModal isOpen={isOpen} onOpen={setIsOpen} /> */}
      <Pagination
        className="mt-5"
        currentPage={2}
        totalPages={10}
        onPageChange={(page) => console.log("Go to page:", page)}
        color="text-nearBlack"
        bgColor="bg-offWhite"
        activeColor="bg-darkBlue text-offWhite"
        size="md"
      />
    </div>
  );
}
