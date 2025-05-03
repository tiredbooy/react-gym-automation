import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/reusables/Sidebar";
import DashboardPage from "./pages/Dashboard";
// import UsersPage from './pages/Users';
// import PaymentsPage from './pages/Payments';
// import LockersPage from './pages/Lockers';
// import LogsPage from './pages/Logs';
// import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Static Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 bg-[#F1EFEC]">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            {/* <Route path="/users" element={<UsersPage />} /> */}
            {/* <Route path="/payments" element={<PaymentsPage />} /> */}
            {/* <Route path="/lockers" element={<LockersPage />} /> */}
            {/* <Route path="/logs" element={<LogsPage />} /> */}
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}
