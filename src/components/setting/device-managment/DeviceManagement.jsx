import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plug,
  Wifi,
  Search,
  Filter,
  Download,
  X,
  AlertTriangle,
  Settings,
} from "lucide-react";
import * as XLSX from "xlsx";
import { writeFile } from "xlsx";
import toast from "react-hot-toast";
import DeviceForm from "./DeviceForm";
import Stats from "./Stats";
import DeviceList from "./DeviceList";
import DeviceLog from "./DeviceLog";
import ActionButtons from "./ActionButtons";
import ConnectionWizardModal from "./ConnectionWizarModal";
import DiagnosticModal from "./DiagnosticModal";
import ConfirmModal from "./ConfirmModal";

// Simulated Hardware API
const simulateHardwareAPI = {
  connect: (device) =>
    new Promise((resolve, reject) =>
      setTimeout(
        () =>
          Math.random() > 0.2
            ? resolve({
                ...device,
                status: "connected",
                lastActivity: new Date().toISOString(),
              })
            : reject(new Error("اتصال ناموفق")),
        1000
      )
    ),
  disconnect: (device) =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            ...device,
            status: "disconnected",
            lastActivity: new Date().toISOString(),
          }),
        500
      )
    ),
  test: (device) =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            result: "موفق",
            details: `${device.name} به درستی کار می‌کند`,
            timestamp: new Date().toISOString(),
          }),
        1000
      )
    ),
};

// Component: DeviceForm (Extract to DeviceForm.jsx)

// Component: DeviceList (Extract to DeviceList.jsx)

// Component: DeviceLog (Extract to DeviceLog.jsx)

// Component: Stats (Extract to Stats.jsx)

// Component: ConnectionWizardModal (Extract to ConnectionWizardModal.jsx)

// Component: DiagnosticModal (Extract to DiagnosticModal.jsx)

// Component: ConfirmModal (Extract to ConfirmModal.jsx)

// Component: ActionButtons (Extract to ActionButtons.jsx)

// Component: DeviceManagementPage (Main Component)
const DeviceManagementPage = () => {
  const [devices, setDevices] = useState(() => {
    try {
      const saved = localStorage.getItem("devices");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: "scanner1",
              name: "اسکنر بارکد ۱",
              type: "barcode",
              group: "ورودی اصلی",
              status: "disconnected",
              lastActivity: new Date().toISOString(),
              settings: {},
            },
          ];
    } catch (e) {
      console.error("Error parsing devices from localStorage:", e);
      return [
        {
          id: "scanner1",
          name: "اسکنر بارکد ۱",
          type: "barcode",
          group: "ورودی اصلی",
          status: "disconnected",
          lastActivity: new Date().toISOString(),
          settings: {},
        },
      ];
    }
  });

  const [deviceLog, setDeviceLog] = useState(() => {
    try {
      const saved = localStorage.getItem("deviceLog");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing deviceLog from localStorage:", e);
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("devices", JSON.stringify(devices));
      localStorage.setItem("deviceLog", JSON.stringify(deviceLog));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }

    const checkDeviceHealth = () => {
      const issues = devices.filter(
        (d) => d.status === "connected" && Math.random() < 0.1
      );
      if (issues.length > 0) {
        issues.forEach((device) => {
          setDeviceLog((prev) => [
            ...prev,
            {
              deviceId: device.id,
              deviceName: device.name,
              action: "خطا",
              timestamp: new Date().toISOString(),
              details: "مشکل اتصال یا زمان‌بندی",
            },
          ]);
          toast.error(`هشدار: مشکل در ${device.name}`);
        });
      }
    };

    const interval = setInterval(checkDeviceHealth, 60 * 1000);
    return () => clearInterval(interval);
  }, [devices]);

  const handleAddDevice = (newDevice) => {
    if (devices.find((d) => d.id === newDevice.id)) {
      toast.error("دستگاه با این شناسه وجود دارد");
      return;
    }
    setDevices((prev) => [...prev, newDevice]);
    setDeviceLog((prev) => [
      ...prev,
      {
        deviceId: newDevice.id,
        deviceName: newDevice.name,
        action: "افزودن",
        timestamp: new Date().toISOString(),
        details: "دستگاه جدید اضافه شد",
      },
    ]);
    toast.success(`دستگاه ${newDevice.name} اضافه شد`);
  };

  const handleConnect = async (device) => {
    setIsLoading(true);
    try {
      const connectedDevice = await simulateHardwareAPI.connect(device);
      setDevices((prev) =>
        prev.map((d) => (d.id === device.id ? connectedDevice : d))
      );
      setDeviceLog((prev) => [
        ...prev,
        {
          deviceId: device.id,
          deviceName: device.name,
          action: "اتصال",
          timestamp: new Date().toISOString(),
          details: "دستگاه متصل شد",
        },
      ]);
      toast.success(`دستگاه ${device.name} متصل شد`);
    } catch (e) {
      setDeviceLog((prev) => [
        ...prev,
        {
          deviceId: device.id,
          deviceName: device.name,
          action: "خطا",
          timestamp: new Date().toISOString(),
          details: e.message,
        },
      ]);
      toast.error(`خطا در اتصال ${device.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (device) => {
    setIsLoading(true);
    try {
      const disconnectedDevice = await simulateHardwareAPI.disconnect(device);
      setDevices((prev) =>
        prev.map((d) => (d.id === device.id ? disconnectedDevice : d))
      );
      setDeviceLog((prev) => [
        ...prev,
        {
          deviceId: device.id,
          deviceName: device.name,
          action: "قطع اتصال",
          timestamp: new Date().toISOString(),
          details: "دستگاه قطع شد",
        },
      ]);
      toast.success(`دستگاه ${device.name} قطع شد`);
    } catch (e) {
      toast.error(`خطا در قطع اتصال ${device.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = (device) => {
    setSelectedDevice(device);
    setIsDiagnosticOpen(true);
  };

  const handleConnectAll = () => {
    setConfirmAction({
      title: "اتصال همه دستگاه‌ها",
      message: "آیا مطمئن هستید که می‌خواهید همه دستگاه‌ها را متصل کنید؟",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const disconnectedDevices = devices.filter(
            (d) => d.status === "disconnected"
          );
          const promises = disconnectedDevices.map((d) =>
            simulateHardwareAPI.connect(d)
          );
          const results = await Promise.allSettled(promises);
          setDevices((prev) =>
            prev.map((d) => {
              const result = results.find(
                (r, i) => disconnectedDevices[i].id === d.id
              );
              return result?.status === "fulfilled" ? result.value : d;
            })
          );
          results.forEach((r, i) => {
            const device = disconnectedDevices[i];
            setDeviceLog((prev) => [
              ...prev,
              {
                deviceId: device.id,
                deviceName: device.name,
                action: r.status === "fulfilled" ? "اتصال" : "خطا",
                timestamp: new Date().toISOString(),
                details:
                  r.status === "fulfilled"
                    ? "دستگاه متصل شد"
                    : r.reason.message,
              },
            ]);
          });
          toast.success("اتصال همه دستگاه‌ها انجام شد");
        } catch (e) {
          toast.error("خطا در اتصال همه دستگاه‌ها");
        } finally {
          setIsLoading(false);
          setIsConfirmModalOpen(false);
        }
      },
    });
    setIsConfirmModalOpen(true);
  };

  const handleDisconnectAll = () => {
    setConfirmAction({
      title: "قطع اتصال همه دستگاه‌ها",
      message: "آیا مطمئن هستید که می‌خواهید همه دستگاه‌ها را قطع کنید؟",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const connectedDevices = devices.filter(
            (d) => d.status === "connected"
          );
          setDevices((prev) =>
            prev.map((d) =>
              d.status === "connected"
                ? {
                    ...d,
                    status: "disconnected",
                    lastActivity: new Date().toISOString(),
                  }
                : d
            )
          );
          connectedDevices.forEach((device) =>
            setDeviceLog((prev) => [
              ...prev,
              {
                deviceId: device.id,
                deviceName: device.name,
                action: "قطع اتصال",
                timestamp: new Date().toISOString(),
                details: "دستگاه قطع شد",
              },
            ])
          );
          toast.success("همه دستگاه‌ها قطع شدند");
        } catch (e) {
          toast.error("خطا در قطع اتصال همه دستگاه‌ها");
        } finally {
          setIsLoading(false);
          setIsConfirmModalOpen(false);
        }
      },
    });
    setIsConfirmModalOpen(true);
  };

  const handleExport = () => {
    try {
      const data = deviceLog.map((entry) => ({
        جزئیات: entry.details,
        زمان: new Date(entry.timestamp).toLocaleString("fa-IR"),
        فعالیت: entry.action,
        نام: entry.deviceName,
        شناسه: entry.deviceId,
      }));
      const worksheet = XLSX.utils.json_to_sheet(data, {
        header: ["شناسه", "نام", "فعالیت", "زمان", "جزئیات"],
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "DeviceLog");
      writeFile(workbook, "device_log.xlsx", { cellStyles: true });
      toast.success("لاگ دستگاه‌ها به صورت Excel خروجی گرفته شد");
    } catch (e) {
      console.error("Error in handleExport:", e);
      toast.error("خطا در خروجی Excel");
    }
  };

  return (
    <div
      className="min-h-screen bg-offWhite flex flex-col items-center justify-start p-4 space-y-6"
      dir="rtl"
    >
      <DeviceForm onAddDevice={handleAddDevice} />
      <Stats devices={devices} deviceLog={deviceLog} />
      <DeviceList
        devices={devices}
        onConnect={(device) => {
          setSelectedDevice(device);
          setIsWizardOpen(true);
        }}
        onDisconnect={handleDisconnect}
        onTest={handleTest}
      />
      <DeviceLog deviceLog={deviceLog} onExport={handleExport} />
      <ActionButtons
        onConnectAll={handleConnectAll}
        onDisconnectAll={handleDisconnectAll}
        isLoading={isLoading}
      />
      <ConnectionWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onConnect={(device) => handleConnect(device)}
        device={selectedDevice}
        simulateHardwareAPI={simulateHardwareAPI}
      />
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        device={selectedDevice}
        simulateHardwareAPI={simulateHardwareAPI}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction?.onConfirm}
        title={confirmAction?.title}
        message={confirmAction?.message}
      />
    </div>
  );
};

export default DeviceManagementPage;
