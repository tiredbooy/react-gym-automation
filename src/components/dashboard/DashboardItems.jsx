import DataCards from "./DataCards";
import UserLogTable from "./UserLogTable";

export default function DashboardItems() {
  return (
    <>
      <div className="py-12 px-12 flex items-center justify-center flex-col gap-5">
        <DataCards />
        <UserLogTable />
      </div>
    </>
  );
}
