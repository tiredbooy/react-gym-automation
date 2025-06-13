import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import { SerialPort } from "serialport";
import { ReadlineParser } from "serialport";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { platform } from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let jsonServerProcess;
let tray;
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    // frame: false,
    // titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      nodeIntegrationInWorker: false,
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL("http://localhost:5175");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Tray setup
  tray = new Tray(path.join(__dirname, "assets", "tray-icon.png"));
  const trayMenu = Menu.buildFromTemplate([
    { label: "Open Gym App", click: () => win.show() },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setToolTip("Gym Automation");
  tray.setContextMenu(trayMenu);

  tray.on("click", () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });

  // Window event listeners
  win.on("maximize", () => {
    if (win && !win.isDestroyed()) {
      win.webContents.send("window-is-maximized");
    }
  });

  win.on("unmaximize", () => {
    if (win && !win.isDestroyed()) {
      win.webContents.send("window-is-unmaximized");
    }
  });

  win.on("closed", () => {
    win = null;
  });
}

function ensureJsonFile() {
  const folder = path.join(__dirname, "SettingData");
  const file = path.join(folder, "setting_data.json");

  if (!existsSync(folder)) mkdirSync(folder);
  if (!existsSync(file)) {
    writeFileSync(file, JSON.stringify({ settings: [] }, null, 2));
    console.log("Created default setting_data.json");
  }
}

function startJsonServer() {
  ensureJsonFile();
  const jsonPath = path.join(__dirname, "SettingData", "setting_data.json");

  const isWin = platform() === "win32";
  const cmd = isWin ? "npx.cmd" : "npx";

  jsonServerProcess = spawn(
    cmd,
    ["json-server", "--watch", jsonPath, "--port", "3000"],
    {
      stdio: "inherit",
      shell: true,
      windowsHide: true,
    }
  );

  jsonServerProcess.on("error", (err) => {
    console.error("Failed to start json-server:", err);
  });

  app.on("before-quit", () => {
    if (jsonServerProcess) {
      jsonServerProcess.kill();
    }
  });

  return jsonServerProcess;
}

function setupRFIDReader() {
  // Update this COM port to match your device (e.g. COM3 on Windows or /dev/ttyUSB0 on Linux)
  const port = new SerialPort({
    path: "COM3", // Replace with your actual port!
    baudRate: 9600,
    autoOpen: true,
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  parser.on("data", (data) => {
    console.log("RFID Data:", data);
    if (win && !win.isDestroyed()) {
      win.webContents.send("rfid-data", data); // Send to renderer
    }
  });

  port.on("open", () => {
    console.log("Serial port opened successfully.");
  });

  port.on("error", (err) => {
    console.error("Serial port error:", err.message);
  });
}

// App lifecycle
app.whenReady().then(() => {
  startJsonServer();
  createWindow();
  setupRFIDReader();
  // Window control IPC handlers
  ipcMain.handle("window-minimize", () => {
    if (win && !win.isDestroyed()) {
      win.minimize();
      return true;
    }
    return false;
  });

  ipcMain.handle("window-maximize-or-restore", () => {
    if (win && !win.isDestroyed()) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
      return true;
    }
    return false;
  });

  ipcMain.handle("window-close", () => {
    if (win && !win.isDestroyed()) {
      win.close();
      return true;
    }
    return false;
  });

  // Additional IPC handlers
  ipcMain.handle("app-restart", () => {
    app.relaunch();
    app.quit();
    return true;
  });

  ipcMain.handle("clear-cache", async () => {
    if (win && !win.isDestroyed()) {
      await win.webContents.session.clearCache();
      return true;
    }
    return false;
  });

  ipcMain.handle("get-window-state", () => {
    if (win && !win.isDestroyed()) {
      return {
        isMaximized: win.isMaximized(),
        isMinimized: win.isMinimized(),
        isVisible: win.isVisible(),
      };
    }
    return {};
  });

  ipcMain.handle("restart-json-server", () => {
    if (jsonServerProcess) {
      jsonServerProcess.kill();
    }
    startJsonServer();
    return true;
  });

  ipcMain.handle("get-json-server-status", () => {
    return {
      running: jsonServerProcess && !jsonServerProcess.killed,
      pid: jsonServerProcess ? jsonServerProcess.pid : null,
    };
  });
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
