const { contextBridge, ipcRenderer } = require("electron");

type Route = "dashboard" | "task-list" | "health-log" | "contacts" | "profile" | "emergency";

contextBridge.exposeInMainWorld("careconnect", {
  // IPC demo: main -> renderer
  getSystemStatus: () => ipcRenderer.invoke("system:getStatus"),

  // main -> renderer navigation events
  onNavigate: (cb: (route: Route) => void) => {
    const handler = (_: unknown, route: Route) => cb(route);
    ipcRenderer.on("nav:go", handler);
    return () => ipcRenderer.removeListener("nav:go", handler);
  },

  // menu shortcut demo: text scaling events
  onTextScale: (cb: (action: "up" | "down" | "reset") => void) => {
    const handler = (_: unknown, action: "up" | "down" | "reset") => cb(action);
    ipcRenderer.on("a11y:textScale", handler);
    return () => ipcRenderer.removeListener("a11y:textScale", handler);
  },
});