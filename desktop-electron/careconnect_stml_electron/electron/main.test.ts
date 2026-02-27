describe("main process integration", () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.VITE_DEV_SERVER_URL;
  });

  function setupMain(isPackaged: boolean) {
    const appEvents: Record<string, (...args: unknown[]) => void> = {};
    let resolveReady!: () => void;

    const readyPromise = new Promise<void>((resolve) => {
      resolveReady = resolve;
    });

    const windowInstances: Array<{
      loadURL: jest.Mock;
      loadFile: jest.Mock;
      isDestroyed: jest.Mock;
      webContents: { send: jest.Mock };
    }> = [];

    const BrowserWindow = jest.fn().mockImplementation(() => {
      const instance = {
        loadURL: jest.fn(),
        loadFile: jest.fn(),
        isDestroyed: jest.fn().mockReturnValue(false),
        webContents: { send: jest.fn() },
      };
      windowInstances.push(instance);
      return instance;
    });

    (BrowserWindow as unknown as { getAllWindows: jest.Mock }).getAllWindows = jest.fn().mockReturnValue([{}]);

    const ipcMain = {
      handle: jest.fn(),
    };

    const menuTemplateRef: { template: unknown[] | null } = { template: null };
    const Menu = {
      buildFromTemplate: jest.fn((template) => {
        menuTemplateRef.template = template;
        return { template };
      }),
      setApplicationMenu: jest.fn(),
    };

    const app = {
      isPackaged,
      name: "CareConnect",
      whenReady: jest.fn(() => readyPromise),
      on: jest.fn((event: string, handler: (...args: unknown[]) => void) => {
        appEvents[event] = handler;
      }),
      quit: jest.fn(),
      getVersion: jest.fn(() => "0.0.0-test"),
    };

    jest.doMock(
      "electron",
      () => ({
        app,
        BrowserWindow,
        Menu,
        ipcMain,
      }),
      { virtual: true }
    );

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("./main.ts");

    return {
      app,
      BrowserWindow: BrowserWindow as jest.Mock & { getAllWindows: jest.Mock },
      Menu,
      ipcMain,
      appEvents,
      windowInstances,
      resolveReady,
      menuTemplateRef,
    };
  }

  test("creates window on app ready and loads dev URL", async () => {
    process.env.VITE_DEV_SERVER_URL = "http://localhost:5123";
    const { BrowserWindow, windowInstances, resolveReady } = setupMain(false);

    resolveReady();
    await Promise.resolve();

    expect(BrowserWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 1100,
        height: 750,
        webPreferences: expect.objectContaining({
          contextIsolation: true,
          nodeIntegration: false,
          preload: expect.stringContaining("preload.cjs"),
        }),
      })
    );

    expect(windowInstances[0].loadURL).toHaveBeenCalledWith("http://localhost:5123");
    expect(windowInstances[0].loadFile).not.toHaveBeenCalled();
  });

  test("loads packaged file when app is packaged", async () => {
    const { windowInstances, resolveReady } = setupMain(true);

    resolveReady();
    await Promise.resolve();

    expect(windowInstances[0].loadFile).toHaveBeenCalledWith(expect.stringMatching(/dist[\\/]index\.html$/));
    expect(windowInstances[0].loadURL).not.toHaveBeenCalled();
  });

  test("registers IPC handler and returns system status", () => {
    const { ipcMain, app } = setupMain(false);

    const handleCall = ipcMain.handle.mock.calls.find((call) => call[0] === "system:getStatus");
    expect(handleCall).toBeDefined();

    const handler = handleCall?.[1] as () => { version: string; localTime: string };
    const result = handler();

    expect(app.getVersion).toHaveBeenCalled();
    expect(result.version).toBe("0.0.0-test");
    expect(typeof result.localTime).toBe("string");
  });

  test("window-all-closed quits only on non-mac platforms", () => {
    const { appEvents, app } = setupMain(false);

    appEvents["window-all-closed"]();

    if (process.platform !== "darwin") {
      expect(app.quit).toHaveBeenCalledTimes(1);
    } else {
      expect(app.quit).not.toHaveBeenCalled();
    }
  });

  test("activate creates a window when none exist", async () => {
    const { appEvents, BrowserWindow, resolveReady } = setupMain(false);

    resolveReady();
    await Promise.resolve();

    BrowserWindow.mockClear();
    BrowserWindow.getAllWindows.mockReturnValue([]);

    appEvents.activate();

    expect(BrowserWindow).toHaveBeenCalledTimes(1);
  });

  test("navigate and accessibility menu actions send renderer IPC messages", async () => {
    const { menuTemplateRef, windowInstances, resolveReady } = setupMain(false);

    resolveReady();
    await Promise.resolve();

    const template = menuTemplateRef.template as Array<{ label?: string; submenu?: Array<{ label?: string; click?: () => void }> }>;
    expect(template).toBeTruthy();

    const navigateMenu = template.find((item) => item.label === "Navigate");
    const dashboardItem = navigateMenu?.submenu?.find((item) => item.label === "Dashboard");
    dashboardItem?.click?.();

    expect(windowInstances[0].webContents.send).toHaveBeenCalledWith("nav:go", "dashboard");

    const accessibilityMenu = template.find((item) => item.label === "Accessibility");
    const increaseTextItem = accessibilityMenu?.submenu?.find((item) => item.label === "Increase Text Size (Demo)");
    increaseTextItem?.click?.();

    expect(windowInstances[0].webContents.send).toHaveBeenCalledWith("a11y:textScale", "up");
  });
});
