import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TextSize = "small" | "medium" | "large";
type ReminderFrequency = "once" | "twice" | "three";
type ReminderTime = "08:00" | "09:00" | "10:00" | "12:00" | "15:00";

function isMacPlatform() {
  // ✅ SSR-safe
  if (typeof navigator === "undefined") return false;
  return navigator.platform.toLowerCase().includes("mac");
}

const styles = `/* ... keep your existing styles string exactly as-is ... */`;

function IconPlus() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3v3M17 3v3M4 9h16M6 6h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconSOS() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 9v4M12 17h.01M10.3 3.6 2.7 17.1A2 2 0 0 0 4.4 20h15.2a2 2 0 0 0 1.7-2.9L13.7 3.6a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Switch({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="row">
      <div>
        <h3 id={`${id}-label`}>{label}</h3>
        {description ? (
          <div id={`${id}-desc`} className="help">
            {description}
          </div>
        ) : null}
      </div>

      <div className="controls">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={`${id}-label`}
          aria-describedby={description ? `${id}-desc` : undefined}
          className="switch"
          onClick={() => onChange(!checked)}
        >
          <span className="sr-only">{checked ? "On" : "Off"}</span>
          <span className="switchTrack" data-on={checked}>
            <span className="switchThumb" />
          </span>
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [textSize, setTextSize] = useState<TextSize>("medium");
  const [highContrast, setHighContrast] = useState<boolean>(true);
  const [simplifiedLayout, setSimplifiedLayout] = useState<boolean>(false);

  const [reminderFrequency, setReminderFrequency] = useState<ReminderFrequency>("twice");
  const [defaultReminderTime, setDefaultReminderTime] = useState<ReminderTime>("09:00");
  const [confirmComplete, setConfirmComplete] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState<string>("medication");
  const [toast, setToast] = useState<string>("");

  const toastRef = useRef<HTMLDivElement | null>(null);
  const appClass = useMemo(() => (highContrast ? "app highContrast" : "app"), [highContrast]);

  const keyHint = isMacPlatform() ? "⌘" : "Ctrl";

  // ✅ useCallback avoids lint warnings and stale closures
  const handleSOS = useCallback(() => {
    setToast("SOS sent to caregiver (demo).");
  }, []);

  const restoreDefaults = useCallback(() => {
    setTextSize("medium");
    setHighContrast(false);
    setSimplifiedLayout(false);
    setReminderFrequency("twice");
    setDefaultReminderTime("09:00");
    setConfirmComplete(true);
    setToast("Defaults restored. Settings saved automatically.");
  }, []);

  const resetTaskFilters = useCallback(() => {
    setSearchTerm("");
    setToast("Task filters cleared (demo).");
  }, []);

  // ✅ SSR-safe event listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onKeyDown = (e: KeyboardEvent) => {
      const metaOrCtrl = isMacPlatform() ? e.metaKey : e.ctrlKey;

      if (metaOrCtrl && (e.key === "e" || e.key === "E")) {
        e.preventDefault();
        handleSOS();
      }

      if (metaOrCtrl && ["1", "2", "3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        const map: Record<string, string> = {
          "1": "Dashboard",
          "2": "Tasks",
          "3": "Health Log",
          "4": "Contacts",
          "5": "Profile",
        };
        setToast(`Shortcut: ${map[e.key]} (demo)`);
      }

      if (e.key === "Escape") {
        setToast("");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSOS]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 4500);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <>
      <style>{styles}</style>

      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {toast}
      </div>

      <div className={appClass}>
        <header>
          <div className="demoBar" role="region" aria-label="Demo view controls">
            <span style={{ opacity: 0.85, fontWeight: 800 }}>DEMO VIEW:</span>
            <button className="demoPill" type="button">
              Show Sign-In Screen
            </button>
            <button className="demoPill" type="button" aria-current="page">
              Tasks – Search Active
            </button>
            <button className="demoPill" type="button">
              Tasks – Today Filter Active
            </button>
            <button className="demoPill" type="button">
              Tasks – All (No Filter)
            </button>
          </div>

          <nav className="menuBar" aria-label="Application menu" role="menubar">
            <button className="menuItem" type="button" role="menuitem">
              File
            </button>
            <button className="menuItem" type="button" role="menuitem">
              Edit
            </button>
            <button className="menuItem" type="button" role="menuitem">
              View
            </button>
            <button className="menuItem" type="button" role="menuitem">
              Help
            </button>
          </nav>

          <div className="toolbar" role="region" aria-label="Toolbar">
            <button type="button" className="btn btnPrimary iconBtn" aria-label="Add a new task">
              <IconPlus />
              Add Task
            </button>

            <div className="searchWrap">
              <div className="search" role="search">
                <IconSearch />
                <label className="sr-only" htmlFor="taskSearch">
                  Search tasks
                </label>
                <input
                  id="taskSearch"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks"
                  aria-describedby="taskSearchHelp"
                />
              </div>
              <span id="taskSearchHelp" className="badgeKey">
                {keyHint}+F (optional)
              </span>
            </div>

            <button type="button" className="btn iconBtn" aria-label="Show tasks due today">
              <IconCalendar />
              Today
            </button>

            <button
              type="button"
              className="btn btnDanger iconBtn"
              onClick={handleSOS}
              aria-label="Emergency SOS"
              aria-keyshortcuts="Control+E Meta+E"
              title={`Emergency SOS (${keyHint}+E)`}
            >
              <IconSOS />
              SOS
            </button>
          </div>
        </header>

        <div className="content">
          <aside aria-label="Primary navigation">
            <div className="brand">CareConnect</div>
            <nav className="nav">
              <a href="#dashboard" aria-label="Go to Dashboard">
                Dashboard
              </a>
              <a href="#tasks" aria-label="Go to Tasks">
                Tasks
              </a>
              <a href="#contacts" aria-label="Go to Contacts">
                Contacts
              </a>
              <a href="#settings" aria-current="page" aria-label="Go to Settings">
                Settings
              </a>
            </nav>
          </aside>

          <main id="main" tabIndex={-1}>
            <div className="where" aria-label="Location indicator">
              You are on: <span style={{ fontWeight: 900 }}>Settings</span>
            </div>

            <h1>Settings</h1>
            <div className="subtitle">Adjust settings to make CareConnect work best for you</div>

            <section className="section" aria-labelledby="displayHeading">
              <div className="sectionHeader" id="displayHeading">
                <span className="accentBar" aria-hidden="true" />
                Display &amp; Simplicity
              </div>

              <div className="sectionBody">
                <div className="row" role="group" aria-labelledby="textSizeLabel" aria-describedby="textSizeHelp">
                  <div>
                    <h3 id="textSizeLabel">Text Size</h3>
                    <div id="textSizeHelp" className="help">
                      Choose how large text appears throughout the application
                    </div>
                  </div>

                  <div className="controls">
                    <div className="radioGroup" role="radiogroup" aria-label="Text size options">
                      {([
                        ["small", "Small"],
                        ["medium", "Medium"],
                        ["large", "Large"],
                      ] as const).map(([value, label]) => {
                        const checked = textSize === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={checked}
                            className="radioBtn"
                            data-checked={checked}
                            onClick={() => {
                              setTextSize(value);
                              setToast("Text size updated. Settings saved automatically.");
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <Switch
                  id="highContrast"
                  label="High Contrast Mode"
                  description="Makes text and buttons easier to see by increasing contrast"
                  checked={highContrast}
                  onChange={(next) => {
                    setHighContrast(next);
                    setToast("Contrast updated. Settings saved automatically.");
                  }}
                />

                <Switch
                  id="simpleLayout"
                  label="Simplified Layout Mode"
                  description="Shows only the most important information on each page"
                  checked={simplifiedLayout}
                  onChange={(next) => {
                    setSimplifiedLayout(next);
                    setToast("Layout mode updated. Settings saved automatically.");
                  }}
                />
              </div>
            </section>

            <section className="section" aria-labelledby="reminderHeading">
              <div className="sectionHeader" id="reminderHeading">
                <span className="accentBar" aria-hidden="true" />
                Reminder Support
              </div>

              <div className="sectionBody">
                <div className="row">
                  <div>
                    <h3>Reminder Frequency</h3>
                    <div className="help">How many times should reminders appear for each task?</div>
                  </div>
                  <div className="controls">
                    <label className="sr-only" htmlFor="reminderFrequency">
                      Reminder frequency
                    </label>
                    <select
                      id="reminderFrequency"
                      className="select"
                      value={reminderFrequency}
                      onChange={(e) => {
                        setReminderFrequency(e.target.value as ReminderFrequency);
                        setToast("Reminder frequency updated. Settings saved automatically.");
                      }}
                    >
                      <option value="once">Once – Reminder appears once</option>
                      <option value="twice">Twice – Reminder appears twice</option>
                      <option value="three">Three times – Reminder appears three times</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div>
                    <h3>Default Reminder Time</h3>
                    <div className="help">What time should reminders appear by default?</div>
                  </div>
                  <div className="controls">
                    <label className="sr-only" htmlFor="defaultReminderTime">
                      Default reminder time
                    </label>
                    <select
                      id="defaultReminderTime"
                      className="select"
                      value={defaultReminderTime}
                      onChange={(e) => {
                        setDefaultReminderTime(e.target.value as ReminderTime);
                        setToast("Default reminder time updated. Settings saved automatically.");
                      }}
                    >
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                    </select>
                  </div>
                </div>

                <Switch
                  id="confirmComplete"
                  label="Show Confirmation After Completing Task"
                  description="Ask for confirmation before marking tasks as complete to prevent mistakes"
                  checked={confirmComplete}
                  onChange={(next) => {
                    setConfirmComplete(next);
                    setToast("Confirmation setting updated. Settings saved automatically.");
                  }}
                />
              </div>
            </section>

            <section className="section" aria-labelledby="supportHeading">
              <div className="sectionHeader" id="supportHeading">
                <span className="accentBar" aria-hidden="true" />
                Support
              </div>

              <div className="sectionBody">
                <div className="row">
                  <div>
                    <h3>Caregiver Contact</h3>
                    <div className="help">Contact information for your primary caregiver or family member</div>
                  </div>
                  <div className="controls">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setToast("Edit caregiver contact (demo).")}
                      aria-label="Edit caregiver contact"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <div style={{ padding: "0 0 14px" }}>
                  <div className="card" role="group" aria-label="Caregiver contact card">
                    <div className="contactInfo">
                      <div className="avatar" aria-hidden="true">
                        S
                      </div>
                      <div className="contactText">
                        <div style={{ fontWeight: 900 }}>Sarah Miller</div>
                        <div style={{ color: "var(--muted)", fontWeight: 700 }}>(555) 123-4567</div>
                      </div>
                    </div>
                    <span className="badgeKey" aria-label="Primary caregiver">
                      Primary
                    </span>
                  </div>
                </div>

                <div className="row">
                  <div>
                    <h3>Reset All Filters</h3>
                    <div className="help">Clear any active search or filter settings on the Tasks page</div>
                  </div>
                  <div className="controls">
                    <button type="button" className="btn" onClick={resetTaskFilters}>
                      Reset All Filters
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div>
                    <h3>Restore Default Settings</h3>
                    <div className="help">Reset all settings on this page back to their original values</div>
                  </div>
                  <div className="controls">
                    <button type="button" className="btn" onClick={restoreDefaults} style={{ color: "var(--red)" }}>
                      Restore Default Settings
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div className="callout" role="note" aria-label="Autosave note">
              <div aria-hidden="true" style={{ fontWeight: 900 }}>
                i
              </div>
              <div>
                <div style={{ fontWeight: 900 }}>Settings are saved automatically.</div>
                <div style={{ color: "var(--muted)", marginTop: 2 }}>
                  Changes take effect immediately and are saved as you make them.
                </div>
              </div>
            </div>

            {toast ? (
              <div
                ref={toastRef}
                style={{
                  marginTop: 14,
                  maxWidth: 860,
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  padding: "12px 14px",
                  background: "#fff",
                }}
                role="status"
                aria-live="polite"
              >
                <strong>Status:</strong> {toast}{" "}
                <span style={{ color: "var(--muted)" }}>(Press Esc to dismiss)</span>
              </div>
            ) : null}
          </main>
        </div>

        <footer aria-label="Footer status bar">
          <div>
            <strong>Current Date:</strong> Thursday, February 19, 2026
          </div>
          <div>
            <strong>Active Tasks:</strong> 5
          </div>
          <div>
            <strong>Next Task Due:</strong> Tomorrow at 2:00 PM
          </div>
          <div>Help is always available in the Help menu</div>
        </footer>
      </div>
    </>
  );
}