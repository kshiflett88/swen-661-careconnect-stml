jest.mock('electron', () => ({
  app: { isPackaged: false, getVersion: () => '0.0.0', whenReady: () => Promise.resolve(), on: jest.fn(), quit: jest.fn() },
  BrowserWindow: jest.fn(),
  Menu: { buildFromTemplate: jest.fn(), setApplicationMenu: jest.fn() },
  ipcMain: { handle: jest.fn() },
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn(), on: jest.fn(), removeListener: jest.fn() },
}));

import { registerIpcHandlers } from '../../electron/main';
import { createCareconnectApi, exposeCareconnect } from '../../electron/preload';

describe('IPC communication (Jest)', () => {
  test('registers system:getStatus handler in main process', () => {
    const ipcMainRef = { handle: jest.fn() };
    const appRef = { getVersion: () => '1.2.3' };
    const fixedDate = new Date('2026-02-26T10:00:00.000Z');

    registerIpcHandlers(ipcMainRef, appRef, () => fixedDate);

    expect(ipcMainRef.handle).toHaveBeenCalledWith('system:getStatus', expect.any(Function));
    const handler = ipcMainRef.handle.mock.calls[0][1];
    const payload = handler();

    expect(payload.version).toBe('1.2.3');
    expect(typeof payload.localTime).toBe('string');
  });

  test('preload API invokes and subscribes to IPC channels', async () => {
    const invoke = jest.fn().mockResolvedValue({ version: '1.0.0' });
    const on = jest.fn();
    const removeListener = jest.fn();
    const api = createCareconnectApi({ invoke, on, removeListener });

    await api.getSystemStatus();
    expect(invoke).toHaveBeenCalledWith('system:getStatus');

    const navCb = jest.fn();
    const unsubscribeNav = api.onNavigate(navCb);
    const navHandler = on.mock.calls[0][1];
    navHandler({}, 'dashboard');
    expect(navCb).toHaveBeenCalledWith('dashboard');
    unsubscribeNav();
    expect(removeListener).toHaveBeenCalledWith('nav:go', navHandler);

    const scaleCb = jest.fn();
    const unsubscribeScale = api.onTextScale(scaleCb);
    const scaleHandler = on.mock.calls[1][1];
    scaleHandler({}, 'up');
    expect(scaleCb).toHaveBeenCalledWith('up');
    unsubscribeScale();
    expect(removeListener).toHaveBeenCalledWith('a11y:textScale', scaleHandler);
  });

  test('exposes careconnect API on window via contextBridge', () => {
    const contextBridgeRef = { exposeInMainWorld: jest.fn() };
    const ipcRendererRef = { invoke: jest.fn(), on: jest.fn(), removeListener: jest.fn() };

    exposeCareconnect(contextBridgeRef, ipcRendererRef);

    expect(contextBridgeRef.exposeInMainWorld).toHaveBeenCalledWith('careconnect', expect.any(Object));
  });
});
