import UserPageHeader from "./Header";
import UserTable from "./UsersTable";

export default function UsersItem() {
  return (
    <div className="bg-offWhite py-12 px-8 text-center">
      <UserPageHeader />
      <UserTable />
    </div>
  );
}
