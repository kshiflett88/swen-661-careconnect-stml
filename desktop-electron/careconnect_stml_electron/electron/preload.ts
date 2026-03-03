import { contextBridge, ipcRenderer } from "electron";

type Route = "dashboard" | "task-list" | "contacts" | "emergency";
type TextScaleAction = "up" | "down" | "reset";

const isRoute = (value: unknown): value is Route => {
  return value === "dashboard" || value === "task-list" || value === "contacts" || value === "emergency";
};

const isTextScaleAction = (value: unknown): value is TextScaleAction => {
  return value === "up" || value === "down" || value === "reset";
};

type IpcRendererRefLike = {
  invoke: (channel: string) => Promise<unknown>;
  on: (channel: string, listener: (...args: unknown[]) => void) => void;
  removeListener: (channel: string, listener: (...args: unknown[]) => void) => void;
};

type ContextBridgeRefLike = {
  exposeInMainWorld: (apiKey: string, api: unknown) => void;
};

export function createCareconnectApi(ipcRendererRef: IpcRendererRefLike = ipcRenderer) {
  return {
    getSystemStatus: () => ipcRendererRef.invoke("system:getStatus"),
    onNavigate: (cb: (route: Route) => void) => {
      const handler = (_: unknown, route: unknown) => {
        if (isRoute(route)) {
          cb(route);
        }
      };
      ipcRendererRef.on("nav:go", handler);
      return () => ipcRendererRef.removeListener("nav:go", handler);
    },
    onTextScale: (cb: (action: TextScaleAction) => void) => {
      const handler = (_: unknown, action: unknown) => {
        if (isTextScaleAction(action)) {
          cb(action);
        }
      };
      ipcRendererRef.on("a11y:textScale", handler);
      return () => ipcRendererRef.removeListener("a11y:textScale", handler);
    },
  };
}

export function exposeCareconnect(
  contextBridgeRef: ContextBridgeRefLike = contextBridge,
  ipcRendererRef: IpcRendererRefLike = ipcRenderer
) {
  const api = createCareconnectApi(ipcRendererRef);
  contextBridgeRef.exposeInMainWorld("careconnect", api);
  return api;
}

if (!process.env.JEST_WORKER_ID) {
  exposeCareconnect();
}