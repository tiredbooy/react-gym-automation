import { motion } from "framer-motion";
import { Wifi, Plug, Settings } from "lucide-react";

export default function DeviceList({
  devices,
  onConnect,
  onDisconnect,
  onTest,
}) {
  return (
    <div className="w-full max-w-5xl bg-beige p-4 rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold text-nearBlack mb-4">دستگاه‌های متصل</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices?.map((device) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg shadow-md ${
              device?.status === "connected" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-nearBlack">
                {device?.name}
              </h4>
              <Wifi
                className={`w-5 h-5 ${
                  device?.status === "connected"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              />
            </div>
            <p className="text-sm text-nearBlack">نوع: {device?.type}</p>
            <p className="text-sm text-nearBlack">گروه: {device?.group}</p>
            {device?.settings?.port && (
              <p className="text-sm text-nearBlack">
                پورت: {device?.settings.port}
              </p>
            )}
            {device?.settings?.ip && (
              <p className="text-sm text-nearBlack">
                آی‌پی: {device?.settings.ip}
              </p>
            )}
            {device?.settings?.comPort && (
              <p className="text-sm text-nearBlack">
                پورت COM: {device?.settings.comPort}
              </p>
            )}
            {device?.settings?.baudRate && (
              <p className="text-sm text-nearBlack">
                نرخ باود: {device?.settings.baudRate}
              </p>
            )}
            {device?.settings?.protocol && (
              <p className="text-sm text-nearBlack">
                پروتکل: {device?.settings.protocol}
              </p>
            )}
            {device?.settings?.parity && (
              <p className="text-sm text-nearBlack">
                پریتی: {device?.settings.parity}
              </p>
            )}
            {device?.settings?.dataBits && (
              <p className="text-sm text-nearBlack">
                بیت‌های داده: {device?.settings.dataBits}
              </p>
            )}
            {device?.settings?.stopBits && (
              <p className="text-sm text-nearBlack">
                بیت‌های توقف: {device?.settings.stopBits}
              </p>
            )}
            {device?.settings?.timeout && (
              <p className="text-sm text-nearBlack">
                تایم‌اوت: {device?.settings.timeout} ثانیه
              </p>
            )}
            {device?.settings?.scanInterval && (
              <p className="text-sm text-nearBlack">
                فاصله اسکن: {device?.settings.scanInterval} میلی‌ثانیه
              </p>
            )}
            <p className="text-sm text-nearBlack">
              آخرین فعالیت:{" "}
              {new Date(device?.lastActivity).toLocaleString("fa-IR")}
            </p>
            <div className="flex gap-2 mt-2">
              {device?.status === "disconnected" ? (
                <button
                  onClick={() => onConnect(device)}
                  className="p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plug className="w-4 h-4" /> اتصال
                </button>
              ) : (
                <button
                  onClick={() => onDisconnect(device)}
                  className="p-2 bg-red-500 text-offWhite rounded-lg hover:bg-red-600 flex items-center gap-1"
                >
                  <Plug className="w-4 h-4" /> قطع اتصال
                </button>
              )}
              <button
                onClick={() => onTest(device)}
                className="p-2 bg-yellow-500 text-offWhite rounded-lg hover:bg-yellow-600 flex items-center gap-1"
              >
                <Settings className="w-4 h-4" /> تست
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
