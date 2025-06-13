// const { contextBridge, ipcRenderer } = require("electron");
import { contextBridge , ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld("electron", {
  // Window Controls
  minimize: () => ipcRenderer.invoke("window-minimize"),
  maximizeOrRestore: () => ipcRenderer.invoke("window-maximize-or-restore"),
  close: () => ipcRenderer.invoke("window-close"),

   onCardScanned: (callback) => {
    ipcRenderer.on("rfid-data", (event, data) => {
      callback(data);
    });
  },

  // Window State Listeners
  onWindowMaximized: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on("window-is-maximized", subscription);
    return () =>
      ipcRenderer.removeListener("window-is-maximized", subscription);
  },
  onWindowUnmaximized: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on("window-is-unmaximized", subscription);
    return () =>
      ipcRenderer.removeListener("window-is-unmaximized", subscription);
  },

  // Window Information
  getWindowState: () => ipcRenderer.invoke("get-window-state"),

  // Application Controls
  restart: () => ipcRenderer.invoke("app-restart"),
  clearCache: () => ipcRenderer.invoke("clear-cache"),
});

// Prevent navigation to external URLs for security
window.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    if (
      e.target.tagName === "A" &&
      e.target.href &&
      e.target.href.startsWith("http")
    ) {
      e.preventDefault();
      if (window.electron?.openExternal) {
        window.electron.openExternal(e.target.href);
      }
    }
  });
});

// Global error handler
window.addEventListener("error", (e) => {
  if (window.electron?.logError) {
    window.electron.logError(
      "Renderer Error",
      e.error.stack || e.error.message
    );
  }
});

// Unhandled promise rejection handler
window.addEventListener("unhandledrejection", (e) => {
  if (window.electron?.logError) {
    window.electron.logError("Unhandled Promise Rejection", e.reason);
  }
});
