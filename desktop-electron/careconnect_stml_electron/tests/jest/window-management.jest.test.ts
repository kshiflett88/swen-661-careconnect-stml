jest.mock('electron', () => ({
  app: { isPackaged: false, getVersion: () => '0.0.0', whenReady: () => Promise.resolve(), on: jest.fn(), quit: jest.fn(), name: 'CareConnect' },
  BrowserWindow: jest.fn(),
  Menu: { buildFromTemplate: jest.fn((template) => template), setApplicationMenu: jest.fn() },
  ipcMain: { handle: jest.fn() },
}));

import { buildMenu, createWindow, sendNavigate, saveWindowState } from '../../electron/main';

describe('window management (Jest)', () => {
  test('loads dev URL when app is not packaged', () => {
    const loadURL = jest.fn();
    const loadFile = jest.fn();
    const on = jest.fn();
    const windowInstance = {
      loadURL,
      loadFile,
      on,
      maximize: jest.fn(),
      isDestroyed: () => false,
      isMaximized: () => false,
      getBounds: () => ({ x: 10, y: 20, width: 1100, height: 750 }),
      webContents: { send: jest.fn() },
    };
    const BrowserWindowRef = jest.fn(() => windowInstance);
    const fsRef = {
      existsSync: jest.fn(() => false),
      readFileSync: jest.fn(),
      writeFileSync: jest.fn(),
    };

    createWindow({
      appRef: { isPackaged: false, getPath: () => '/tmp/userData' },
      BrowserWindowRef,
      fsRef,
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
    const on = jest.fn();
    const maximize = jest.fn();
    const windowInstance = {
      loadURL,
      loadFile,
      on,
      maximize,
      isDestroyed: () => false,
      isMaximized: () => false,
      getBounds: () => ({ x: 50, y: 80, width: 1200, height: 800 }),
      webContents: { send: jest.fn() },
    };
    const BrowserWindowRef = jest.fn(() => windowInstance);
    const fsRef = {
      existsSync: jest.fn(() => true),
      readFileSync: jest.fn(() => JSON.stringify({ x: 50, y: 80, width: 1200, height: 800, isMaximized: true })),
      writeFileSync: jest.fn(),
    };

    createWindow({
      appRef: { isPackaged: true, getPath: () => '/tmp/userData' },
      BrowserWindowRef,
      fsRef,
      pathRef: { join: (...parts: string[]) => parts.join('/') },
      dirname: '/tmp/electron',
      env: {},
    });

    expect(BrowserWindowRef).toHaveBeenCalledWith(
      expect.objectContaining({ x: 50, y: 80, width: 1200, height: 800 })
    );
    expect(maximize).toHaveBeenCalledTimes(1);
    expect(loadFile).toHaveBeenCalledWith('/tmp/electron/../dist/index.html');
    expect(loadURL).not.toHaveBeenCalled();
  });

  test('falls back to default bounds when saved state is invalid', () => {
    const loadURL = jest.fn();
    const loadFile = jest.fn();
    const windowInstance = {
      loadURL,
      loadFile,
      on: jest.fn(),
      maximize: jest.fn(),
      isDestroyed: () => false,
      isMaximized: () => false,
      getBounds: () => ({ x: 0, y: 0, width: 1100, height: 750 }),
      webContents: { send: jest.fn() },
    };
    const BrowserWindowRef = jest.fn(() => windowInstance);
    const fsRef = {
      existsSync: jest.fn(() => true),
      readFileSync: jest.fn(() => '{"bad":"state"}'),
      writeFileSync: jest.fn(),
    };

    createWindow({
      appRef: { isPackaged: false, getPath: () => '/tmp/userData' },
      BrowserWindowRef,
      fsRef,
      pathRef: { join: (...parts: string[]) => parts.join('/') },
      dirname: '/tmp/electron',
      env: { VITE_DEV_SERVER_URL: 'http://localhost:5000' },
    });

    expect(BrowserWindowRef).toHaveBeenCalledWith(
      expect.objectContaining({ width: 1100, height: 750 })
    );
  });

  test('sends navigation event only when target window is valid', () => {
    const send = jest.fn();
    const liveWindow = { isDestroyed: () => false, webContents: { send } };
    const deadWindow = { isDestroyed: () => true, webContents: { send } };

    sendNavigate('dashboard', liveWindow);
    sendNavigate('contacts', deadWindow);

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
    const labels = template.map((item) => item?.label).filter(Boolean);
    expect(labels).toEqual(expect.arrayContaining(['File', 'Edit', 'View', 'Help']));
    expect(buildFromTemplate).toHaveBeenCalledTimes(1);
    expect(setApplicationMenu).toHaveBeenCalledTimes(1);
  });

  test('persists window state to userData file', () => {
    const fsRef = {
      writeFileSync: jest.fn(),
    };
    const targetWindow = {
      isDestroyed: () => false,
      isMaximized: () => true,
      getBounds: () => ({ x: 10, y: 20, width: 1300, height: 900 }),
    };

    saveWindowState(targetWindow, {
      appRef: { getPath: () => '/tmp/userData' },
      pathRef: { join: (...parts: string[]) => parts.join('/') },
      fsRef,
    });

    expect(fsRef.writeFileSync).toHaveBeenCalledWith(
      '/tmp/userData/window-state.json',
      expect.stringContaining('"width": 1300'),
      'utf-8'
    );
  });
});
