export {};

declare global {
  interface Window {
    careconnect: {
      getSystemStatus: () => Promise<{ version: string; localTime: string }>;
      onNavigate: (cb: (route: "dashboard" | "tasks") => void) => () => void;
      onTextScale: (cb: (action: "up" | "down" | "reset") => void) => () => void;
    };
  }
}