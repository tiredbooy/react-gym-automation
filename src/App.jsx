import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

import Sidebar from "./components/reusables/Sidebar";
import DashboardPage from "./pages/Dashboard";
import UsersPage from "./pages/Users";
import { Payments } from "./pages/Payments";
import LockerManagementPage from "./pages/LockerPage";
import LogPage from "./pages/Logs";
import SettingsPage from "./pages/Setting";
// import LogsPage from './pages/Logs';
// import SettingsPage from './pages/Settings';

export default function App() {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Static Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className={`flex-1 bg-${theme.colors.background}`}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/lockers" element={<LockerManagementPage />} />
            <Route path="/logs" element={<LogPage />} />
            <Route path="/settings/:tab" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
