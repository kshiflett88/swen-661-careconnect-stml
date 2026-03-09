import fs from "fs";
import path from "path";
import {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  type BrowserWindowConstructorOptions,
  type MenuItemConstructorOptions,
} from "electron";

type NavMessageRoute = "dashboard" | "task-list" | "contacts" | "emergency";
type TextScaleAction = "up" | "down" | "reset";

type WebContentsLike = {
  send: (channel: string, ...args: unknown[]) => void;
};

type WindowWithLoadLike = {
  loadURL: (url: string) => void;
  loadFile: (filePath: string) => void;
};

type WindowWithMessagingLike = {
  isDestroyed: () => boolean;
  webContents: WebContentsLike;
};

type WindowWithStateLike = {
  isDestroyed: () => boolean;
  on?: (event: "resize" | "move" | "close", listener: () => void) => void;
  maximize?: () => void;
  isMaximized?: () => boolean;
  getBounds?: () => { x: number; y: number; width: number; height: number };
};

type WindowLike = WindowWithLoadLike & WindowWithMessagingLike & WindowWithStateLike;

type BrowserWindowRefLike = {
  new (options: BrowserWindowConstructorOptions): WindowLike;
};

type BrowserWindowLifecycleRefLike = BrowserWindowRefLike & {
  getAllWindows: () => WindowLike[];
};

type MenuRefLike = {
  buildFromTemplate: (template: MenuItemConstructorOptions[]) => unknown;
  setApplicationMenu: (menu: unknown) => void;
};

type AppRefLike = {
  isPackaged: boolean;
  name: string;
  whenReady: () => Promise<unknown>;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
  quit: () => void;
  getVersion: () => string;
  getPath?: (name: "userData") => string;
};

type AppForWindowLike = Pick<AppRefLike, "isPackaged"> & Pick<Partial<AppRefLike>, "getPath">;
type AppForMenuLike = Pick<AppRefLike, "name">;
type AppForIpcLike = Pick<AppRefLike, "getVersion">;
type AppForStatePathLike = Pick<Partial<AppRefLike>, "getPath">;

type WindowNavTargetLike = {
  webContents: WebContentsLike;
  isDestroyed?: () => boolean;
};

type IpcMainRefLike = {
  handle: (channel: string, listener: () => unknown) => void;
};

type PathRefLike = Pick<typeof path, "join">;
type FsRefLike = {
  existsSync: (filePath: string) => boolean;
  readFileSync: (filePath: string, encoding: "utf-8") => string;
  writeFileSync: (filePath: string, data: string, encoding: "utf-8") => void;
};
type FsWriteRefLike = Pick<FsRefLike, "writeFileSync">;

type ElectronRefs = {
  app: AppRefLike;
  BrowserWindow: BrowserWindowLifecycleRefLike;
  Menu: MenuRefLike;
  ipcMain: IpcMainRefLike;
};

function getElectronRefs(): ElectronRefs {
  return {
    app: app as unknown as AppRefLike,
    BrowserWindow: BrowserWindow as unknown as BrowserWindowLifecycleRefLike,
    Menu: Menu as unknown as MenuRefLike,
    ipcMain: ipcMain as unknown as IpcMainRefLike,
  };
}

let win: WindowLike | null = null;

export type Route = NavMessageRoute;

type WindowBounds = {
  x?: number;
  y?: number;
  width: number;
  height: number;
  isMaximized?: boolean;
};

const DEFAULT_WINDOW_BOUNDS: WindowBounds = {
  width: 1100,
  height: 750,
};

export function getWindowStatePath(appRef: AppForStatePathLike = getElectronRefs().app, pathRef: PathRefLike = path): string {
  const baseDir = appRef.getPath ? appRef.getPath("userData") : process.cwd();
  return pathRef.join(baseDir, "window-state.json");
}

export function loadWindowState(
  options: {
    appRef?: AppForWindowLike;
    pathRef?: PathRefLike;
    fsRef?: FsRefLike;
  } = {}
): WindowBounds {
  const electronRefs = getElectronRefs();
  const appRef = options.appRef ?? electronRefs.app;
  const pathRef = options.pathRef ?? path;
  const fsRef = options.fsRef ?? fs;
  const statePath = getWindowStatePath(appRef, pathRef);

  try {
    if (!fsRef.existsSync(statePath)) {
      return { ...DEFAULT_WINDOW_BOUNDS };
    }

    const raw = fsRef.readFileSync(statePath, "utf-8");
    const parsed = JSON.parse(raw as string) as Partial<WindowBounds>;

    if (typeof parsed.width !== "number" || typeof parsed.height !== "number") {
      return { ...DEFAULT_WINDOW_BOUNDS };
    }

    return {
      x: typeof parsed.x === "number" ? parsed.x : undefined,
      y: typeof parsed.y === "number" ? parsed.y : undefined,
      width: parsed.width,
      height: parsed.height,
      isMaximized: Boolean(parsed.isMaximized),
    };
  } catch {
    return { ...DEFAULT_WINDOW_BOUNDS };
  }
}

export function saveWindowState(
  targetWindow: WindowWithStateLike,
  options: {
    appRef?: AppForStatePathLike;
    pathRef?: PathRefLike;
    fsRef?: FsWriteRefLike;
  } = {}
): void {
  const electronRefs = getElectronRefs();
  const appRef = options.appRef ?? electronRefs.app;
  const pathRef = options.pathRef ?? path;
  const fsRef = options.fsRef ?? fs;

  if (!targetWindow || targetWindow.isDestroyed()) {
    return;
  }

  const bounds = targetWindow.getBounds?.();
  if (!bounds) {
    return;
  }

  const statePath = getWindowStatePath(appRef, pathRef);
  const nextState: WindowBounds = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    isMaximized: Boolean(targetWindow.isMaximized?.()),
  };

  try {
    fsRef.writeFileSync(statePath, JSON.stringify(nextState, null, 2), "utf-8");
  } catch {
    // ignore persistence errors to avoid crashing app startup/close
  }
}

export function getDevServerUrl(env: NodeJS.ProcessEnv = process.env): string {
  return env.VITE_DEV_SERVER_URL || "http://localhost:4173";
}

export function shouldQuitOnAllWindowsClosed(platform: string = process.platform): boolean {
  return platform !== "darwin";
}

export function createWindow(
  options: {
    appRef?: AppForWindowLike;
    BrowserWindowRef?: BrowserWindowRefLike;
    pathRef?: PathRefLike;
    fsRef?: FsRefLike;
    dirname?: string;
    env?: NodeJS.ProcessEnv;
  } = {}
): WindowLike {
  const electronRefs = getElectronRefs();
  const appRef = options.appRef ?? electronRefs.app;
  const BrowserWindowRef = options.BrowserWindowRef ?? electronRefs.BrowserWindow;
  const pathRef = options.pathRef ?? path;
  const fsRef = options.fsRef ?? fs;
  const dirname = options.dirname ?? __dirname;
  const env = options.env ?? process.env;
  const windowState = loadWindowState({ appRef, pathRef, fsRef });

  win = new BrowserWindowRef({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: pathRef.join(dirname, "preload.cjs"),
    },
  });

  if (windowState.isMaximized) {
    win.maximize?.();
  }

  win.on?.("resize", () => {
    if (win) saveWindowState(win, { appRef, pathRef, fsRef });
  });
  win.on?.("move", () => {
    if (win) saveWindowState(win, { appRef, pathRef, fsRef });
  });
  win.on?.("close", () => {
    if (win) saveWindowState(win, { appRef, pathRef, fsRef });
  });

  const devUrl = getDevServerUrl(env);
  if (!appRef.isPackaged) {
    win.loadURL(devUrl);
  } else {
    win.loadFile(pathRef.join(dirname, "../dist/index.html"));
  }

  return win;
}

export function sendNavigate(route: Route, targetWindow: WindowNavTargetLike | null = win): void {
  if (targetWindow && !targetWindow.isDestroyed?.()) {
    targetWindow.webContents.send("nav:go", route);
  }
}

export function buildMenu(
  options: {
    appRef?: AppForMenuLike;
    MenuRef?: MenuRefLike;
    platform?: string;
    targetWindow?: WindowNavTargetLike | null;
  } = {}
): MenuItemConstructorOptions[] {
  const electronRefs = getElectronRefs();
  const appRef = options.appRef ?? electronRefs.app;
  const MenuRef = options.MenuRef ?? electronRefs.Menu;
  const platform = options.platform ?? process.platform;
  const targetWindow = options.targetWindow ?? win;
  const isMac = platform === "darwin";

  const macAppSubmenu: MenuItemConstructorOptions[] = [
    { role: "about" },
    { type: "separator" },
    { role: "quit" },
  ];

  const navigateSubmenu: MenuItemConstructorOptions[] = [
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
      label: "Contacts",
      accelerator: isMac ? "Cmd+3" : "Ctrl+3",
      click: () => sendNavigate("contacts", targetWindow),
    },
    { type: "separator" },
    {
      label: "Emergency SOS",
      accelerator: isMac ? "Cmd+E" : "Ctrl+E",
      click: () => sendNavigate("emergency", targetWindow),
    },
  ];

  const accessibilitySubmenu: MenuItemConstructorOptions[] = [
    {
      label: "Increase Text Size (Demo)",
      accelerator: isMac ? "Cmd+Plus" : "Ctrl+Plus",
      click: () => targetWindow?.webContents.send("a11y:textScale", "up" satisfies TextScaleAction),
    },
    {
      label: "Decrease Text Size (Demo)",
      accelerator: isMac ? "Cmd+-" : "Ctrl+-",
      click: () => targetWindow?.webContents.send("a11y:textScale", "down" satisfies TextScaleAction),
    },
    {
      label: "Reset Text Size (Demo)",
      accelerator: isMac ? "Cmd+0" : "Ctrl+0",
      click: () => targetWindow?.webContents.send("a11y:textScale", "reset" satisfies TextScaleAction),
    },
  ];

  const viewSubmenu: MenuItemConstructorOptions[] = [
    { role: "reload", accelerator: "F5" },
    { role: "toggleDevTools", accelerator: isMac ? "Alt+Cmd+I" : "Ctrl+Shift+I" },
    { type: "separator" },
    {
      label: "Navigate",
      submenu: navigateSubmenu,
    },
    {
      label: "Accessibility",
      submenu: accessibilitySubmenu,
    },
    { type: "separator" },
    { role: "togglefullscreen" },
  ];

  const fileSubmenu: MenuItemConstructorOptions[] = [
    {
      label: "Emergency SOS",
      accelerator: isMac ? "Cmd+E" : "Ctrl+E",
      click: () => sendNavigate("emergency", targetWindow),
    },
    { type: "separator" },
    ...(isMac
      ? [{ role: "close" as const }]
      : [
          {
            role: "quit" as const,
            ...(process.platform === "win32" ? { accelerator: "Alt+F4" } : {}),
          },
        ]),
  ];

  const editSubmenu: MenuItemConstructorOptions[] = [
    { role: "undo" },
    { role: "redo" },
    { type: "separator" },
    { role: "cut" },
    { role: "copy" },
    { role: "paste" },
    { role: "selectAll" },
  ];

  const helpSubmenu: MenuItemConstructorOptions[] = [
    {
      label: "About CareConnect",
      click: () => targetWindow?.webContents.send("nav:go", "dashboard"),
    },
  ];

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: appRef.name,
            submenu: macAppSubmenu,
          },
        ]
      : []),
    {
      label: "File",
      submenu: fileSubmenu,
    },
    {
      label: "Edit",
      submenu: editSubmenu,
    },
    {
      label: "View",
      submenu: viewSubmenu,
    },
    {
      label: "Help",
      submenu: helpSubmenu,
    },
  ];

  MenuRef.setApplicationMenu(MenuRef.buildFromTemplate(template));
  return template;
}

export function registerIpcHandlers(
  ipcMainRef: IpcMainRefLike = getElectronRefs().ipcMain,
  appRef: AppForIpcLike = getElectronRefs().app,
  nowProvider: () => Date = () => new Date()
): void {
  ipcMainRef.handle("system:getStatus", () => {
    const now = nowProvider();
    return { version: appRef.getVersion(), localTime: now.toLocaleString() };
  });
}

export function registerAppLifecycle(
  options: {
    appRef?: AppRefLike;
    BrowserWindowRef?: BrowserWindowLifecycleRefLike;
    pathRef?: PathRefLike;
    fsRef?: FsRefLike;
    platform?: string;
    env?: NodeJS.ProcessEnv;
    dirname?: string;
  } = {}
): void {
  const electronRefs = getElectronRefs();
  const appRef = options.appRef ?? electronRefs.app;
  const BrowserWindowRef = options.BrowserWindowRef ?? electronRefs.BrowserWindow;
  const platform = options.platform ?? process.platform;

  appRef.whenReady().then(() => {
    createWindow(options);
    buildMenu({ appRef, platform });

    appRef.on("activate", () => {
      if (BrowserWindowRef.getAllWindows().length === 0) {
        createWindow(options);
      }
    });
  });

  appRef.on("window-all-closed", () => {
    if (shouldQuitOnAllWindowsClosed(platform)) {
      appRef.quit();
    }
  });
}

export function initializeMainProcess(): void {
  registerIpcHandlers();
  registerAppLifecycle();
}

if (!process.env.JEST_WORKER_ID) {
  initializeMainProcess();
}
