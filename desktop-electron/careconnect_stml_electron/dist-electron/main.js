"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
let win = null;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    const devUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
    win.loadURL(devUrl);
}
function sendNavigate(route) {
    if (win && !win.isDestroyed())
        win.webContents.send("nav:go", route);
}
function buildMenu() {
    const isMac = process.platform === "darwin";
    const template = [
        ...(isMac
            ? [
                {
                    label: electron_1.app.name,
                    submenu: [
                        { role: "about" },
                        { type: "separator" },
                        { role: "quit" },
                    ],
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
                    click: () => sendNavigate("tasks"),
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
    electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(template));
}
electron_1.app.whenReady().then(() => {
    createWindow();
    buildMenu();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// IPC requirement (main ↔ renderer)
electron_1.ipcMain.handle("system:getStatus", () => {
    const now = new Date();
    return { version: electron_1.app.getVersion(), localTime: now.toLocaleString() };
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
