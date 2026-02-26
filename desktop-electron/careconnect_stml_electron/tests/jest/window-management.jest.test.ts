jest.mock('electron', () => ({
  app: { isPackaged: false, getVersion: () => '0.0.0', whenReady: () => Promise.resolve(), on: jest.fn(), quit: jest.fn(), name: 'CareConnect' },
  BrowserWindow: jest.fn(),
  Menu: { buildFromTemplate: jest.fn((template) => template), setApplicationMenu: jest.fn() },
  ipcMain: { handle: jest.fn() },
}));

import { buildMenu, createWindow, sendNavigate } from '../../electron/main';

describe('window management (Jest)', () => {
  test('loads dev URL when app is not packaged', () => {
    const loadURL = jest.fn();
    const loadFile = jest.fn();
    const windowInstance = { loadURL, loadFile, isDestroyed: () => false, webContents: { send: jest.fn() } };
    const BrowserWindowRef = jest.fn(() => windowInstance);

    createWindow({
      appRef: { isPackaged: false },
      BrowserWindowRef,
      pathRef: { join: (...parts: string[]) => parts.join('/') },
      dirname: '/tmp/electron',
      env: { VITE_DEV_SERVER_URL: 'http://localhost:5000' },
    });

    expect(loadURL).toHaveBeenCalledWith('http://localhost:5000');
    expect(loadFile).not.toHaveBeenCalled();
  });

  test('loads index file when app is packaged', () => {
    const loadURL = jest.fn();
    const loadFile = jest.fn();
    const windowInstance = { loadURL, loadFile, isDestroyed: () => false, webContents: { send: jest.fn() } };
    const BrowserWindowRef = jest.fn(() => windowInstance);

    createWindow({
      appRef: { isPackaged: true },
      BrowserWindowRef,
      pathRef: { join: (...parts: string[]) => parts.join('/') },
      dirname: '/tmp/electron',
      env: {},
    });

    expect(loadFile).toHaveBeenCalledWith('/tmp/electron/../dist/index.html');
    expect(loadURL).not.toHaveBeenCalled();
  });

  test('sends navigation event only when target window is valid', () => {
    const send = jest.fn();
    const liveWindow = { isDestroyed: () => false, webContents: { send } };
    const deadWindow = { isDestroyed: () => true, webContents: { send } };

    sendNavigate('dashboard', liveWindow);
    sendNavigate('contacts', deadWindow);
    sendNavigate('profile', null);

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith('nav:go', 'dashboard');
  });

  test('builds menu and wires application menu', () => {
    const buildFromTemplate = jest.fn((template) => template);
    const setApplicationMenu = jest.fn();

    const template = buildMenu({
      appRef: { name: 'CareConnect' },
      MenuRef: { buildFromTemplate, setApplicationMenu },
      platform: 'win32',
      targetWindow: { webContents: { send: jest.fn() } },
    });

    expect(Array.isArray(template)).toBe(true);
    expect(buildFromTemplate).toHaveBeenCalledTimes(1);
    expect(setApplicationMenu).toHaveBeenCalledTimes(1);
  });
});
