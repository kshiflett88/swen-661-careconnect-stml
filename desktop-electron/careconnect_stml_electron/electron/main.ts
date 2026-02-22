const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

let win: any = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 750,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:4173";
  if (!app.isPackaged) {
    win.loadURL(devUrl);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

function sendNavigate(route: "dashboard" | "task-list" | "health-log" | "contacts" | "profile" | "emergency") {
  if (win && !win.isDestroyed()) {
    win.webContents.send("nav:go", route);
  }
}

function buildMenu() {
  const isMac = process.platform === "darwin";

const template: any[] = [
  ...(isMac
    ? [
        {
          label: app.name,
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
          click: () => sendNavigate("dashboard"),
        },
        {
          label: "Tasks",
          accelerator: isMac ? "Cmd+2" : "Ctrl+2",
          click: () => sendNavigate("task-list"),
        },
        {
          label: "Health Log",
          accelerator: isMac ? "Cmd+3" : "Ctrl+3",
          click: () => sendNavigate("health-log"),
        },
        {
          label: "Contacts",
          accelerator: isMac ? "Cmd+4" : "Ctrl+4",
          click: () => sendNavigate("contacts"),
        },
        {
          label: "Profile",
          accelerator: isMac ? "Cmd+5" : "Ctrl+5",
          click: () => sendNavigate("profile"),
        },
        { type: "separator" },
        {
          label: "Emergency SOS",
          accelerator: isMac ? "Cmd+E" : "Ctrl+E",
          click: () => sendNavigate("emergency"),
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
          click: () => win?.webContents.send("a11y:textScale", "up"),
        },
        {
          label: "Decrease Text Size (Demo)",
          accelerator: isMac ? "Cmd+-" : "Ctrl+-",
          click: () => win?.webContents.send("a11y:textScale", "down"),
        },
        {
          label: "Reset Text Size (Demo)",
          accelerator: isMac ? "Cmd+0" : "Ctrl+0",
          click: () => win?.webContents.send("a11y:textScale", "reset"),
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

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  createWindow();
  buildMenu();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// IPC requirement (main ↔ renderer)
ipcMain.handle("system:getStatus", () => {
  const now = new Date();
  return { version: app.getVersion(), localTime: now.toLocaleString() };
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});