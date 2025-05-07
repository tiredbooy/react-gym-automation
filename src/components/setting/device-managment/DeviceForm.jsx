import { motion, AnimatePresence } from "framer-motion";
import { Plug, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function DeviceForm({ onAddDevice }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("barcode");
  const [group, setGroup] = useState("ورودی اصلی");
  const [port, setPort] = useState("");
  const [ip, setIp] = useState("");
  const [comPort, setComPort] = useState("");
  const [baudRate, setBaudRate] = useState("");
  const [protocol, setProtocol] = useState("");
  const [parity, setParity] = useState("");
  const [dataBits, setDataBits] = useState("");
  const [stopBits, setStopBits] = useState("");
  const [timeout, setTimeout] = useState("");
  const [scanInterval, setScanInterval] = useState("");
  const [error, setError] = useState("");

  const isSerialDevice = ["barcode", "rfid"].includes(deviceType); // USB
  const isNetworkDevice = ["turnstile", "gate"].includes(deviceType); // LAN
  const isRS485Device = ["biometric", "locker"].includes(deviceType); // RS485

  const handleAdd = (e) => {
    e.preventDefault();
    if (!deviceId || !deviceName) {
      setError("لطفاً شناسه و نام دستگاه را پر کنید");
      return;
    }
    const settings = {};
    if (port) settings.port = port;
    if (ip) settings.ip = ip;
    if (comPort) settings.comPort = comPort;
    if (baudRate) settings.baudRate = baudRate;
    if (protocol) settings.protocol = protocol;
    if (parity) settings.parity = parity;
    if (dataBits) settings.dataBits = dataBits;
    if (stopBits) settings.stopBits = stopBits;
    if (timeout) settings.timeout = parseInt(timeout);
    if (scanInterval) settings.scanInterval = parseInt(scanInterval);

    onAddDevice({
      id: deviceId,
      name: deviceName,
      type: deviceType,
      group,
      status: "disconnected",
      lastActivity: new Date().toISOString(),
      settings,
    });
    setDeviceId("");
    setDeviceName("");
    setDeviceType("barcode");
    setGroup("ورودی اصلی");
    setPort("");
    setIp("");
    setComPort("");
    setBaudRate("");
    setProtocol("");
    setParity("");
    setDataBits("");
    setStopBits("");
    setTimeout("");
    setScanInterval("");
    setError("");
    setIsFormOpen(false); // Close form after adding
  };

  return (
    <div className="w-full max-w-md">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="w-full p-3 bg-darkBlue text-offWhite rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-blue-700"
      >
        {isFormOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
        افزودن دستگاه جدید
      </motion.button>
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-beige p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-bold text-nearBlack mb-4 text-center">
              افزودن دستگاه
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  شناسه دستگاه
                </label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="شناسه دستگاه"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  نام دستگاه
                </label>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="نام دستگاه"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  نوع دستگاه
                </label>
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                >
                  <option value="barcode">اسکنر بارکد (USB)</option>
                  <option value="rfid">خواننده RFID (USB)</option>
                  <option value="biometric">اسکنر بیومتریک (RS485)</option>
                  <option value="gate">دروازه ورودی (LAN)</option>
                  <option value="locker">قفل رختکن (RS485)</option>
                  <option value="turnstile">تورنیکت (LAN)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-nearBlack mb-1">
                  گروه دستگاه
                </label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                >
                  <option value="ورودی اصلی">ورودی اصلی</option>
                  <option value="اتاق وزنه">اتاق وزنه</option>
                  <option value="رختکن">رختکن</option>
                  <option value="منطقه کاردیو">منطقه کاردیو</option>
                </select>
              </div>
              {isNetworkDevice && (
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-nearBlack">
                    تنظیمات شبکه (LAN)
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-nearBlack mb-1">
                      آی‌پی (اختیاری)
                    </label>
                    <input
                      type="text"
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                      placeholder="آی‌پی (مثال: 192.168.1.100)"
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nearBlack mb-1">
                      پورت (اختیاری)
                    </label>
                    <input
                      type="number"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="پورت (مثال: 8080)"
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nearBlack mb-1">
                      پروتکل (اختیاری)
                    </label>
                    <select
                      value={protocol}
                      onChange={(e) => setProtocol(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                    >
                      <option value="">انتخاب پروتکل</option>
                      <option value="TCP">TCP</option>
                      <option value="HTTP">HTTP</option>
                      <option value="HTTPS">HTTPS</option>
                      <option value="MQTT">MQTT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nearBlack mb-1">
                      تایم‌اوت (ثانیه، اختیاری)
                    </label>
                    <input
                      type="number"
                      value={timeout}
                      onChange={(e) => setTimeout(e.target.value)}
                      placeholder="تایم‌اوت (مثال: 5)"
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                    />
                  </div>
                </div>
              )}
              {(isSerialDevice || isRS485Device) && (
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-nearBlack">
                    تنظیمات سریال ({isSerialDevice ? "USB" : "RS485"})
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-nearBlack mb-1">
                      پورت COM (اختیاری)
                    </label>
                    <input
                      type="text"
                      value={comPort}
                      onChange={(e) => setComPort(e.target.value)}
                      placeholder="پورت COM (مثال: COM1)"
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nearBlack mb-1">
                      نرخ باود (اختیاری)
                    </label>
                    <select
                      value={baudRate}
                      onChange={(e) => setBaudRate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                    >
                      <option value="">انتخاب نرخ باود</option>
                      <option value="9600">9600</option>
                      <option value="19200">19200</option>
                      <option value="38400">38400</option>
                      <option value="115200">115200</option>
                    </select>
                  </div>
                  {isSerialDevice && (
                    <div>
                      <label className="block text-sm font-medium text-nearBlack mb-1">
                        فاصله اسکن (میلی‌ثانیه، اختیاری)
                      </label>
                      <input
                        type="number"
                        value={scanInterval}
                        onChange={(e) => setScanInterval(e.target.value)}
                        placeholder="فاصله اسکن (مثال: 1000)"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                      />
                    </div>
                  )}
                  {isRS485Device && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-nearBlack mb-1">
                          پریتی (اختیاری)
                        </label>
                        <select
                          value={parity}
                          onChange={(e) => setParity(e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                        >
                          <option value="">انتخاب پریتی</option>
                          <option value="none">None</option>
                          <option value="even">Even</option>
                          <option value="odd">Odd</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-nearBlack mb-1">
                          بیت‌های داده (اختیاری)
                        </label>
                        <select
                          value={dataBits}
                          onChange={(e) => setDataBits(e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                        >
                          <option value="">انتخاب بیت‌های داده</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-nearBlack mb-1">
                          بیت‌های توقف (اختیاری)
                        </label>
                        <select
                          value={stopBits}
                          onChange={(e) => setStopBits(e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                        >
                          <option value="">انتخاب بیت‌های توقف</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-nearBlack mb-1">
                          تایم‌اوت (ثانیه، اختیاری)
                        </label>
                        <input
                          type="number"
                          value={timeout}
                          onChange={(e) => setTimeout(e.target.value)}
                          placeholder="تایم‌اوت (مثال: 5)"
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue bg-offWhite text-nearBlack"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 p-2 bg-darkBlue text-offWhite rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Plug className="w-5 h-5" /> افزودن دستگاه
                </button>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 p-2 bg-gray-300 text-nearBlack rounded-lg hover:bg-hoverBeige"
                >
                  لغو
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
