import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

import Sidebar from "./components/reusables/Sidebar";
import DashboardPage from "./pages/Dashboard";
import UsersPage from "./pages/Users";
import { Payments } from "./pages/Payments";
import LockerManagementPage from "./pages/LockerPage";
import LogPage from "./pages/Logs";
import SettingsPage from "./pages/Setting";
import { Toaster } from "react-hot-toast";
// import LogsPage from './pages/Logs';
// import SettingsPage from './pages/Settings';

// import Titlebar from "./components/titleBar/CustomTitleBar";

// Setings
import DefaultSetting from "./components/setting/defaultSettings/DefaultSetting";
import SupportSettings from "./components/setting/SupportSetting";
import ServiceSettings from "./components/setting/ServiceSettings";
import LockerSettings from "./components/setting/LockerSettings";
import AccessManagement from "./components/setting/access-managment/AccessManagement";
import DeviceManagementPage from "./components/setting/device-managment/DeviceManagement";
import SalonSettings from "./components/setting/salons/SalonsManagment";
import CoachesManagement from "./components/setting/coaches/CoachManagment";

export default function App() {
  const { activeTheme, themes } = useTheme();
  const theme = themes[activeTheme];

  window.electron.onCardScanned((cardData) => {
    console.log("Card Scanned:", cardData);
  });

  return (
    <Router>
      <Toaster position="top-center" />
      {/* <Titlebar /> */}

      <div className="flex min-h-screen">
        {/* Static Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className={`flex-1 bg-${theme.colors.background}`}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="payments" element={<Payments />} />
            <Route path="lockers" element={<LockerManagementPage />} />
            <Route path="logs" element={<LogPage />} />
            <Route path="settings" element={<SettingsPage />}>
              <Route index element={<Navigate replace to="default" />} />
              <Route path="default" element={<DefaultSetting />} />
              <Route path="support" element={<SupportSettings />} />
              <Route path="services" element={<ServiceSettings />} />
              <Route path="lockers" element={<LockerSettings />} />
              <Route path="admin" element={<AccessManagement />} />
              <Route path="devices" element={<DeviceManagementPage />} />
              <Route path="salons" element={<SalonSettings />} />
              <Route path="coaches" element={<CoachesManagement />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}
