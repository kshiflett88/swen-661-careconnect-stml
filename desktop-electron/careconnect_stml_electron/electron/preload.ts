const { contextBridge, ipcRenderer } = require("electron");

type Route = "dashboard" | "task-list" | "health-log" | "contacts" | "profile" | "emergency";

export function createCareconnectApi(ipcRendererRef: any = ipcRenderer) {
  return {
    getSystemStatus: () => ipcRendererRef.invoke("system:getStatus"),
    onNavigate: (cb: (route: Route) => void) => {
      const handler = (_: unknown, route: Route) => cb(route);
      ipcRendererRef.on("nav:go", handler);
      return () => ipcRendererRef.removeListener("nav:go", handler);
    },
    onTextScale: (cb: (action: "up" | "down" | "reset") => void) => {
      const handler = (_: unknown, action: "up" | "down" | "reset") => cb(action);
      ipcRendererRef.on("a11y:textScale", handler);
      return () => ipcRendererRef.removeListener("a11y:textScale", handler);
    },
  };
}

export function exposeCareconnect(contextBridgeRef: any = contextBridge, ipcRendererRef: any = ipcRenderer) {
  const api = createCareconnectApi(ipcRendererRef);
  contextBridgeRef.exposeInMainWorld("careconnect", api);
  return api;
}

if (!process.env.JEST_WORKER_ID) {
  exposeCareconnect();
}