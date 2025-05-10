import React, { useState } from "react";
import SettingsNavbar from "../components/setting/SettingsNavbar";
import SupportSettings from "../components/setting/SupportSetting";
import ServiceSettings from "../components/setting/ServiceSettings";
import LockerSettings from "../components/setting/LockerSettings.jsx";
import AccessManagement from "../components/setting/AccessManagement.jsx";
import DeviceManagement from "../components/setting/device-managment/DeviceManagement.jsx";
// import DevicesPage from "../components/setting/device-managment/DevicePage.jsx";
// import SalonGatewaysPage from "../components/setting/salons/SalonGatewaysPage.jsx";
import SalonsManagment from "../components/setting/salons/SalonsManagment.jsx";
export default function SettingsPage() {
  const [currentTab, setCurrentTab] = useState("support");

  const renderTabContent = () => {
    switch (currentTab) {
      case "support":
        return <SupportSettings />;
      case "services":
        return <ServiceSettings />;
      // Future cases:
      case "lockers":
        return <LockerSettings />;
      case "admin":
        return <AccessManagement />;
      case "devices":
        return <DeviceManagement />;
      case "salons":
        return <SalonsManagment />;
      default:
        return <div>در حال توسعه...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-offWhite text-nearBlack p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-darkBlue text-center md:text-right">
          تنظیمات سیستم
        </h1>

        <SettingsNavbar currentTab={currentTab} onChange={setCurrentTab} />
        {renderTabContent()}
      </div>
    </div>
  );
}
