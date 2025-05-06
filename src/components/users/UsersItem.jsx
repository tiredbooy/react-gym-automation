import Pagination from "../reusables/Pagination";
import UserPageHeader from "./Header";
import UserTable from "./UsersTable";

export default function UsersItem() {
  return (
    <div className="bg-offWhite py-12 px-8 text-center">
      <UserPageHeader />
      <UserTable />
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
