type Listener = (...args: unknown[]) => void;

describe("preload IPC integration", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("exposes careconnect API and wires invoke/on/removeListener", () => {
    const invoke = jest.fn().mockResolvedValue({ version: "1.0.0", localTime: "now" });
    const on = jest.fn();
    const removeListener = jest.fn();
    const exposeInMainWorld = jest.fn();

    jest.doMock(
      "electron",
      () => ({
        contextBridge: { exposeInMainWorld },
        ipcRenderer: { invoke, on, removeListener },
      }),
      { virtual: true }
    );

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("./preload.ts");

    expect(exposeInMainWorld).toHaveBeenCalledTimes(1);
    const [key, api] = exposeInMainWorld.mock.calls[0] as [string, {
      getSystemStatus: () => Promise<{ version: string; localTime: string }>;
      onNavigate: (cb: (route: string) => void) => () => void;
      onTextScale: (cb: (action: string) => void) => () => void;
    }];

    expect(key).toBe("careconnect");

    api.getSystemStatus();
    expect(invoke).toHaveBeenCalledWith("system:getStatus");

    const onNavigateCallback = jest.fn();
    const unsubscribeNavigate = api.onNavigate(onNavigateCallback);
    expect(on).toHaveBeenCalledWith("nav:go", expect.any(Function));

    const navHandler = on.mock.calls.find((call) => call[0] === "nav:go")?.[1] as Listener;
    navHandler({}, "dashboard");
    expect(onNavigateCallback).toHaveBeenCalledWith("dashboard");

    unsubscribeNavigate();
    expect(removeListener).toHaveBeenCalledWith("nav:go", navHandler);

    const onTextScaleCallback = jest.fn();
    const unsubscribeTextScale = api.onTextScale(onTextScaleCallback);
    expect(on).toHaveBeenCalledWith("a11y:textScale", expect.any(Function));

    const scaleHandler = on.mock.calls.find((call) => call[0] === "a11y:textScale")?.[1] as Listener;
    scaleHandler({}, "up");
    expect(onTextScaleCallback).toHaveBeenCalledWith("up");

    unsubscribeTextScale();
    expect(removeListener).toHaveBeenCalledWith("a11y:textScale", scaleHandler);
  });
});
