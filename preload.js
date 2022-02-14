const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  imageSave: (data) => ipcRenderer.send("image:save", data),
  folderCreate: () => ipcRenderer.send("folder:create"), // tell Electron to create a folder
  videoSave: (fRate) => ipcRenderer.send("video:save", { fRate }), // tell Electron to start video conversion once images are ready.
});
