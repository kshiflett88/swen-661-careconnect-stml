"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path_1 = require("path");
var win = null;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path_1.default.join(__dirname, "preload.js"),
        },
    });
    var devUrl = process.env.VITE_DEV_SERVER_URL || "http://127.0.0.1:5173";
    win.loadURL(devUrl);
}
function sendNavigate(route) {
    if (win && !win.isDestroyed())
        win.webContents.send("nav:go", route);
}
function buildMenu() {
    var isMac = process.platform === "darwin";
    var template = __spreadArray(__spreadArray([], (isMac
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
        : []), true), [
        // 2) Navigate menu (shortcuts wired)
        {
            label: "Navigate",
            submenu: [
                {
                    label: "Dashboard",
                    accelerator: isMac ? "Cmd+1" : "Ctrl+1",
                    click: function () { return sendNavigate("dashboard"); },
                },
                {
                    label: "Tasks",
                    accelerator: isMac ? "Cmd+2" : "Ctrl+2",
                    click: function () { return sendNavigate("tasks"); },
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
                    click: function () { return win === null || win === void 0 ? void 0 : win.webContents.send("a11y:textScale", "up"); },
                },
                {
                    label: "Decrease Text Size (Demo)",
                    accelerator: isMac ? "Cmd+-" : "Ctrl+-",
                    click: function () { return win === null || win === void 0 ? void 0 : win.webContents.send("a11y:textScale", "down"); },
                },
                {
                    label: "Reset Text Size (Demo)",
                    accelerator: isMac ? "Cmd+0" : "Ctrl+0",
                    click: function () { return win === null || win === void 0 ? void 0 : win.webContents.send("a11y:textScale", "reset"); },
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
    ], false);
    electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(template));
}
electron_1.app.whenReady().then(function () {
    createWindow();
    buildMenu();
    electron_1.app.on("activate", function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// IPC requirement (main ↔ renderer)
electron_1.ipcMain.handle("system:getStatus", function () {
    var now = new Date();
    return { version: electron_1.app.getVersion(), localTime: now.toLocaleString() };
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
