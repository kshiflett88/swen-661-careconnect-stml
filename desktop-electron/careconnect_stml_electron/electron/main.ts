const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

let win: any = null;

export type Route = "dashboard" | "task-list" | "health-log" | "contacts" | "profile" | "emergency";

export function getDevServerUrl(env: NodeJS.ProcessEnv = process.env): string {
  return env.VITE_DEV_SERVER_URL || "http://localhost:4173";
}

export function shouldQuitOnAllWindowsClosed(platform: string = process.platform): boolean {
  return platform !== "darwin";
}

export function createWindow(
  options: {
    appRef?: any;
    BrowserWindowRef?: any;
    pathRef?: any;
    dirname?: string;
    env?: NodeJS.ProcessEnv;
  } = {}
) {
  const appRef = options.appRef ?? app;
  const BrowserWindowRef = options.BrowserWindowRef ?? BrowserWindow;
  const pathRef = options.pathRef ?? path;
  const dirname = options.dirname ?? __dirname;
  const env = options.env ?? process.env;

  win = new BrowserWindowRef({
    width: 1100,
    height: 750,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: pathRef.join(dirname, "preload.cjs"),
    },
  });

  const devUrl = getDevServerUrl(env);
  if (!appRef.isPackaged) {
    win.loadURL(devUrl);
  } else {
    win.loadFile(pathRef.join(dirname, "../dist/index.html"));
  }

  return win;
}

export function sendNavigate(route: Route, targetWindow: any = win) {
  if (targetWindow && !targetWindow.isDestroyed()) {
    targetWindow.webContents.send("nav:go", route);
  }
}

export function buildMenu(
  options: {
    appRef?: any;
    MenuRef?: any;
    platform?: string;
    targetWindow?: any;
  } = {}
) {
  const appRef = options.appRef ?? app;
  const MenuRef = options.MenuRef ?? Menu;
  const platform = options.platform ?? process.platform;
  const targetWindow = options.targetWindow ?? win;
  const isMac = platform === "darwin";

const template: any[] = [
  ...(isMac
    ? [
        {
          label: appRef.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "quit" },
            ] as any[],
        },
      ]
    : []),

    // 2) Navigate menu (shortcuts wired)
    {
      label: "Navigate",
      submenu: [
        {
          label: "Dashboard",
          accelerator: isMac ? "Cmd+1" : "Ctrl+1",
          click: () => sendNavigate("dashboard", targetWindow),
        },
        {
          label: "Tasks",
          accelerator: isMac ? "Cmd+2" : "Ctrl+2",
          click: () => sendNavigate("task-list", targetWindow),
        },
        {
          label: "Health Log",
          accelerator: isMac ? "Cmd+3" : "Ctrl+3",
          click: () => sendNavigate("health-log", targetWindow),
        },
        {
          label: "Contacts",
          accelerator: isMac ? "Cmd+4" : "Ctrl+4",
          click: () => sendNavigate("contacts", targetWindow),
        },
        {
          label: "Profile",
          accelerator: isMac ? "Cmd+5" : "Ctrl+5",
          click: () => sendNavigate("profile", targetWindow),
        },
        { type: "separator" },
        {
          label: "Emergency SOS",
          accelerator: isMac ? "Cmd+E" : "Ctrl+E",
          click: () => sendNavigate("emergency", targetWindow),
        },
      ],
    },

    // 3) Accessibility menu (STML-friendly quick actions)
    {
      label: "Accessibility",
      submenu: [
        {
          label: "Increase Text Size (Demo)",
          accelerator: isMac ? "Cmd+Plus" : "Ctrl+Plus",
          click: () => targetWindow?.webContents.send("a11y:textScale", "up"),
        },
        {
          label: "Decrease Text Size (Demo)",
          accelerator: isMac ? "Cmd+-" : "Ctrl+-",
          click: () => targetWindow?.webContents.send("a11y:textScale", "down"),
        },
        {
          label: "Reset Text Size (Demo)",
          accelerator: isMac ? "Cmd+0" : "Ctrl+0",
          click: () => targetWindow?.webContents.send("a11y:textScale", "reset"),
        },
      ],
    },

    // View menu (handy in dev)
    {
      label: "View",
      submenu: [
        { role: "reload", accelerator: "F5" },
        { role: "toggleDevTools", accelerator: isMac ? "Alt+Cmd+I" : "Ctrl+Shift+I" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
  ];

  MenuRef.setApplicationMenu(MenuRef.buildFromTemplate(template));
  return template;
}

export function registerIpcHandlers(
  ipcMainRef: any = ipcMain,
  appRef: any = app,
  nowProvider: () => Date = () => new Date()
) {
  ipcMainRef.handle("system:getStatus", () => {
    const now = nowProvider();
    return { version: appRef.getVersion(), localTime: now.toLocaleString() };
  });
}

export function registerAppLifecycle(
  options: {
    appRef?: any;
    BrowserWindowRef?: any;
    pathRef?: any;
    platform?: string;
    env?: NodeJS.ProcessEnv;
    dirname?: string;
  } = {}
) {
  const appRef = options.appRef ?? app;
  const BrowserWindowRef = options.BrowserWindowRef ?? BrowserWindow;
  const platform = options.platform ?? process.platform;

  appRef.whenReady().then(() => {
    createWindow(options);
    buildMenu({ appRef, platform });

    appRef.on("activate", () => {
      if (BrowserWindowRef.getAllWindows().length === 0) createWindow(options);
    });
  });

  appRef.on("window-all-closed", () => {
    if (shouldQuitOnAllWindowsClosed(platform)) appRef.quit();
  });
}

export function initializeMainProcess() {
  registerIpcHandlers();
  registerAppLifecycle();
}

if (!process.env.JEST_WORKER_ID) {
  initializeMainProcess();
}