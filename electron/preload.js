// preload.js
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  // You can add specific APIs or functions here
  send: (channel, data) => {
    // whitelist channels
    const validChannels = ["some-channel"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ["some-channel"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
