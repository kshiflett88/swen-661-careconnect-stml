jest.mock('electron', () => ({
  app: { isPackaged: false, getVersion: () => '0.0.0', whenReady: () => Promise.resolve(), on: jest.fn(), quit: jest.fn() },
  BrowserWindow: jest.fn(),
  Menu: { buildFromTemplate: jest.fn(), setApplicationMenu: jest.fn() },
  ipcMain: { handle: jest.fn() },
}));

const { getDevServerUrl, shouldQuitOnAllWindowsClosed } = require('../../electron/main');

describe('business logic (Jest)', () => {
  test('returns configured dev server url when present', () => {
    expect(getDevServerUrl({ VITE_DEV_SERVER_URL: 'http://localhost:9999' })).toBe('http://localhost:9999');
  });

  test('falls back to default dev server url', () => {
    expect(getDevServerUrl({})).toBe('http://localhost:4173');
  });

  test('quits app on non-mac when all windows close', () => {
    expect(shouldQuitOnAllWindowsClosed('win32')).toBe(true);
    expect(shouldQuitOnAllWindowsClosed('linux')).toBe(true);
  });

  test('does not quit app on mac when all windows close', () => {
    expect(shouldQuitOnAllWindowsClosed('darwin')).toBe(false);
  });
});
