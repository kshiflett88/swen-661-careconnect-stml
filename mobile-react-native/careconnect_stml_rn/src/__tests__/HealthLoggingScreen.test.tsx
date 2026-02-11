import React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import HowIFeelTodayScreen from "../screens/HealthLogging/HealthLoggingScreen";

// src/__tests__ -> src/navigation/routes
jest.mock("../navigation/routes", () => ({
  Routes: {
    Dashboard: "Dashboard",
    HealthLogging: "HealthLogging",
  },
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

// AsyncStorage mock
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: (...args: any[]) => mockGetItem(...args),
  setItem: (...args: any[]) => mockSetItem(...args),
}));

describe("HealthLoggingScreen (HowIFeelTodayScreen)", () => {
  const navigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-02-08T12:00:00.000Z"));

    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);

    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    (Alert.alert as jest.Mock).mockRestore?.();
  });

  it("restores today's saved mood/note from AsyncStorage and enforces 200-char note max", async () => {
    const saved = {
      dateISO: "2026-02-08",
      mood: "happy",
      note: "hi",
      savedAtISO: "2026-02-08T10:00:00.000Z",
    };
    mockGetItem.mockResolvedValueOnce(JSON.stringify(saved));

    const { getByLabelText, getByText } = render(
      <HowIFeelTodayScreen navigation={navigation} />
    );

    await waitFor(() => {
      const input = getByLabelText("Optional note");
      expect(input.props.value).toBe("hi");
      expect(getByText("2/200 characters")).toBeTruthy();
    });

    const longText = "a".repeat(205);
    fireEvent.changeText(getByLabelText("Optional note"), longText);

    await waitFor(() => {
      const input = getByLabelText("Optional note");
      expect((input.props.value as string).length).toBe(200);
      expect(getByText("200/200 characters")).toBeTruthy();
    });
  });

  it("shows validation error when Save pressed with no mood selected", async () => {
    const { getByLabelText, queryByText, queryByLabelText } = render(
      <HowIFeelTodayScreen navigation={navigation} />
    );

    fireEvent.press(getByLabelText("Save"));

    await waitFor(() => {
      const hasInline =
        !!queryByText(/Select a mood/i) ||
        !!queryByText(/Please choose how you feel/i);

      const hasAlert = (Alert.alert as jest.Mock).mock.calls.length > 0;

      expect(hasInline || hasAlert).toBe(true);
    });

    expect(mockSetItem).not.toHaveBeenCalled();

    // sanity: return home button exists
    expect(queryByLabelText("Return to Home")).toBeTruthy();
  });

  it("saves successfully when mood selected and shows Saved feedback", async () => {
    const { getByText, getByLabelText, queryByText } = render(
      <HowIFeelTodayScreen navigation={navigation} />
    );

    fireEvent.press(getByText("Happy"));
    fireEvent.press(getByLabelText("Save"));

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      // Saved modal content is present
      expect(getByText("Saved!")).toBeTruthy();
      expect(getByLabelText("OK, return to dashboard")).toBeTruthy();
    });
  });

  it("shows save failure feedback when AsyncStorage.setItem throws", async () => {
    mockSetItem.mockRejectedValueOnce(new Error("boom"));

    const { getByText, getByLabelText, queryByText } = render(
      <HowIFeelTodayScreen navigation={navigation} />
    );

    fireEvent.press(getByText("Okay"));
    fireEvent.press(getByLabelText("Save"));

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      const hasInline =
        !!queryByText(/Save failed/i) || !!queryByText(/Could not save/i);
      const hasAlert = (Alert.alert as jest.Mock).mock.calls.length > 0;
      expect(hasInline || hasAlert).toBe(true);
    });
  });

  it("falls back when Intl formatting fails (covers catch branches)", async () => {
    const originalIntl = global.Intl;

    (global as any).Intl = {
      ...originalIntl,
      DateTimeFormat: function () {
        throw new Error("Intl disabled in test");
      },
    };

    try {
      const { getByText } = render(
        <HowIFeelTodayScreen navigation={navigation} />
      );

      expect(getByText(/Today/i)).toBeTruthy();
    } finally {
      global.Intl = originalIntl;
    }
  });

  it("Return to Home navigates to Dashboard", async () => {
    const { getByLabelText } = render(
      <HowIFeelTodayScreen navigation={navigation} />
    );

    fireEvent.press(getByLabelText("Return to Home"));
    expect(navigation.navigate).toHaveBeenCalled();
  });
});
