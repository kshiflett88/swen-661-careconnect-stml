"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("careconnect", {
    // IPC demo: main -> renderer
    getSystemStatus: () => electron_1.ipcRenderer.invoke("system:getStatus"),
    // main -> renderer navigation events
    onNavigate: (cb) => {
        const handler = (_, route) => cb(route);
        electron_1.ipcRenderer.on("nav:go", handler);
        return () => electron_1.ipcRenderer.removeListener("nav:go", handler);
    },
    // menu shortcut demo: text scaling events
    onTextScale: (cb) => {
        const handler = (_, action) => cb(action);
        electron_1.ipcRenderer.on("a11y:textScale", handler);
        return () => electron_1.ipcRenderer.removeListener("a11y:textScale", handler);
    },
});
