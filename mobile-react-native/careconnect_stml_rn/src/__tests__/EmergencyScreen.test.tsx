import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import EmergencyScreen from "../screens/Emergency/EmergencyScreen";

// Make dimensions stable
jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: () => ({ width: 360, height: 800, scale: 2, fontScale: 1 }),
}));

// Expo vector icons can be noisy in Jest; this makes them render safely
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  return {
    Ionicons: (props: any) => React.createElement("Icon", props, null),
  };
});

describe("EmergencyScreen", () => {
  const navigation = { navigate: jest.fn(), goBack: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Freeze time so today label is deterministic
    jest.setSystemTime(new Date("2026-02-08T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the core UI (today label, context, warning, buttons)", () => {
    const { getByText, getByTestId } = render(
      <EmergencyScreen navigation={navigation as any} />
    );

    // Today label text from todayLabel() with exact format "Today: <weekday>,\n<month> <day>, <year>"
    // Feb 8, 2026 is Sunday (in UTC, still Sunday)
    expect(getByText(/Today:\sSunday,/)).toBeTruthy();
    expect(getByText(/February 8, 2026/)).toBeTruthy();

    expect(getByText(/You are on:\s*Emergency Help/)).toBeTruthy();

    expect(
      getByText("This will send an alert to\nyour caregiver and start\na call")
    ).toBeTruthy();

    expect(getByTestId("sos_button")).toBeTruthy();
    expect(getByTestId("cancel_button")).toBeTruthy();
  });

  it("opens confirm popup when SOS is pressed, then closes on Cancel", () => {
    const { getByTestId, getByText, queryByText } = render(
      <EmergencyScreen navigation={navigation as any} />
    );

    // open
    fireEvent.press(getByTestId("sos_button"));
    expect(getByText("Send Emergency Alert?")).toBeTruthy();

    // cancel confirm
    fireEvent.press(getByTestId("confirm_cancel"));
    expect(queryByText("Send Emergency Alert?")).toBeNull();
  });

  it("opens confirm popup, sends alert, shows sent popup, and OK returns to Dashboard", () => {
    const { getByTestId, getByText, queryByText } = render(
      <EmergencyScreen navigation={navigation as any} />
    );

    // open confirm
    fireEvent.press(getByTestId("sos_button"));
    expect(getByText("Send Emergency Alert?")).toBeTruthy();

    // send alert -> show sent popup
    fireEvent.press(getByTestId("confirm_send_alert"));
    expect(queryByText("Send Emergency Alert?")).toBeNull();
    expect(getByText("Alert Sent!")).toBeTruthy();
    expect(getByText("Your caregiver has been notified.")).toBeTruthy();

    // OK -> navigate dashboard
    fireEvent.press(getByTestId("alert_sent_ok"));
    expect(navigation.navigate).toHaveBeenCalledWith("Dashboard");
  });

  it("Cancel button navigates to Dashboard", () => {
    const { getByTestId } = render(<EmergencyScreen navigation={navigation as any} />);
    fireEvent.press(getByTestId("cancel_button"));
    expect(navigation.navigate).toHaveBeenCalledWith("Dashboard");
  });
});
