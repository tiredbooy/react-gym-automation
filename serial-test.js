import { SerialPort } from "serialport";

SerialPort.list().then((ports) => {
  ports.forEach((port) => {
    console.log(`📡 ${port.path} - ${port.manufacturer || "Unknown"}`);
  });
});
// Create the serial port connection
const port = new SerialPort({
  path: "COM3",
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: "none",
  autoOpen: true,
});

// When the port is successfully opened
port.on("open", () => {
  console.log("✅ Port opened: COM3");
//   port.write("\r\n", (err) => {
//     if (err) {
//       return console.error("Write error:", err.message);
//     }
//     console.log("Sent wake-up ping to device");
//   });
});

port.on("readable", () => {
  let data;
  while ((data = port.read()) !== null) {
    console.log("🔣 RAW BYTE READ:", [...data]);
  }
});

// If there's any error while opening or using the port
port.on("error", (err) => {
  console.error("❌ Port error:", err.message);
});

// When any data is received from the device
port.on("data", (data) => {
  console.log("RAW BYTES:", [...data]);
  console.log("📦 RAW BUFFER:", data);
  console.log("📝 AS STRING:", data.toString("utf-8"));
  console.log("🔢 HEX:", data.toString("hex"));
});
