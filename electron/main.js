import { app, BrowserWindow, Menu } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import os from 'node:os'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let jsonServerProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth : 800,
    minHeight : 600,
    // transparent : true,
    // frame : false,
    // backgroundColor: '#00000000',
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

  const isWin = process.platform === "win32";
  const cmd = isWin ? "npx.cmd" : "npx";

  jsonServerProcess = spawn(
    cmd,
    ["json-server", "--watch", jsonPath, "--port", "3000"],
    {
      stdio: "inherit",
      shell: true,
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
}

// App lifecycle
app.whenReady().then(() => {
  startJsonServer();
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
