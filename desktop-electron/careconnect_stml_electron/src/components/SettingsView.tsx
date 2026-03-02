import { useState } from 'react';
import { ContactActionModal } from './ContactActionModal';

type TextSize = 'small' | 'medium' | 'large';

type ToggleProps = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const styles = `
  .settingsRoot {
    --font-scale: 1;
    --page-bg: #ffffff;
    --surface-bg: #ffffff;
    --muted-text: #666666;
    --body-text: #1a1a1a;
    --line-color: #e0e0e0;
    --line-soft: #d0d0d0;
    --primary: #0066cc;
    --danger: #cc0000;
    flex: 1;
    background: var(--page-bg);
    overflow: auto;
    color: var(--body-text);
    font-size: calc(16px * var(--font-scale));
  }

  .settingsRoot.size-small {
    --font-scale: 0.92;
  }

  .settingsRoot.size-medium {
    --font-scale: 1;
  }

  .settingsRoot.size-large {
    --font-scale: 1.5;
  }

  .settingsRoot.highContrast {
    --page-bg: #ffffff;
    --surface-bg: #ffffff;
    --muted-text: #222222;
    --body-text: #000000;
    --line-color: #000000;
    --line-soft: #000000;
    --primary: #003e9b;
    --danger: #8b0000;
  }

  .settingsContainer {
    max-width: 64rem;
    margin: 0 auto;
    padding: 2rem;
  }

  .pageHeader {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid var(--line-color);
  }

  .pageHeader h1 {
    margin: 0 0 0.5rem;
    font-size: calc(28px * var(--font-scale));
    color: var(--body-text);
    font-weight: 600;
  }

  .pageHeader p {
    margin: 0;
    font-size: calc(15px * var(--font-scale));
    color: var(--muted-text);
  }

  .section {
    margin-bottom: 3rem;
  }

  .sectionTitleWrap {
    background: #f5f5f5;
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
    border-left: 4px solid var(--primary);
    border-radius: 0.25rem;
  }

  .sectionTitleWrap h2 {
    margin: 0;
    font-size: calc(22px * var(--font-scale));
    color: var(--body-text);
    font-weight: 600;
  }

  .card {
    background: var(--surface-bg);
    border: 2px solid var(--line-color);
    border-radius: 0.5rem;
    padding: 2rem;
  }

  .block {
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--line-color);
    margin-bottom: 1.5rem;
  }

  .block:last-child {
    padding-bottom: 0;
    border-bottom: none;
    margin-bottom: 0;
  }

  .fieldLabel {
    display: block;
    font-size: calc(16px * var(--font-scale));
    color: var(--body-text);
    margin-bottom: 0.75rem;
    font-weight: 500;
  }

  .fieldHelp {
    font-size: calc(14px * var(--font-scale));
    color: var(--muted-text);
    margin: 0 0 1rem;
    line-height: 1.5;
  }

  .sizeRow {
    display: flex;
    gap: 0.75rem;
  }

  .sizeButton {
    flex: 1;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    border: 2px solid var(--line-soft);
    background: #ffffff;
    color: var(--body-text);
    font-size: calc(15px * var(--font-scale));
    font-weight: 500;
    cursor: pointer;
  }

  .sizeButton:hover {
    background: #f5f5f5;
  }

  .sizeButton[data-active='true'] {
    background: var(--primary);
    color: #ffffff;
    border-color: var(--primary);
  }

  .toggleRow {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 0.25rem 0;
  }

  .toggleText {
    flex: 1;
  }

  .toggleLabel {
    display: block;
    font-size: calc(16px * var(--font-scale));
    color: var(--body-text);
    margin-bottom: 0.5rem;
    cursor: pointer;
    font-weight: 500;
  }

  .toggleDescription {
    margin: 0;
    font-size: calc(14px * var(--font-scale));
    color: var(--muted-text);
    line-height: 1.6;
  }

  .toggleButton {
    position: relative;
    width: 56px;
    height: 32px;
    border-radius: 999px;
    border: 2px solid var(--line-soft);
    background: var(--line-soft);
    transition: background-color 0.15s ease, border-color 0.15s ease;
    flex-shrink: 0;
    cursor: pointer;
  }

  .toggleButton[data-checked='true'] {
    background: var(--primary);
    border-color: var(--primary);
  }

  .toggleThumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: #ffffff;
    transition: transform 0.15s ease;
  }

  .toggleButton[data-checked='true'] .toggleThumb {
    transform: translateX(24px);
  }

  .selectField,
  .inputField {
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem 1rem;
    border: 2px solid var(--line-soft);
    border-radius: 0.5rem;
    font-size: calc(15px * var(--font-scale));
    background: #ffffff;
    color: var(--body-text);
  }

  .topRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .secondaryButton {
    padding: 0.5rem 1rem;
    background: #ffffff;
    border: 2px solid var(--line-soft);
    color: var(--body-text);
    border-radius: 0.25rem;
    font-size: calc(14px * var(--font-scale));
    cursor: pointer;
  }

  .secondaryButton:hover {
    background: #f0f0f0;
  }

  .caregiverBox {
    background: #f9f9f9;
    border: 1px solid var(--line-soft);
    border-radius: 0.5rem;
    padding: 1.25rem;
  }

  .caregiverRow {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: var(--primary);
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    flex-shrink: 0;
  }

  .caregiverName {
    margin: 0;
    font-size: calc(16px * var(--font-scale));
    color: var(--body-text);
    font-weight: 500;
  }

  .phoneRow {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .phoneText {
    margin: 0;
    font-size: calc(15px * var(--font-scale));
    color: var(--muted-text);
  }

  .editGrid {
    display: grid;
    gap: 1rem;
  }

  .actionButton {
    padding: 0.75rem 1.5rem;
    background: #ffffff;
    border: 2px solid var(--line-soft);
    color: var(--body-text);
    border-radius: 0.5rem;
    font-size: calc(15px * var(--font-scale));
    cursor: pointer;
  }

  .actionButton:hover {
    background: #f0f0f0;
  }

  .dangerButton {
    color: var(--danger);
  }

  .dangerButton:hover {
    background: #ffe6e6;
  }

  .infoBox {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1.25rem;
    background: #e6f2ff;
    border: 2px solid #b3d9ff;
    border-radius: 0.5rem;
  }

  .infoText {
    margin: 0;
    font-size: calc(14px * var(--font-scale));
    color: var(--body-text);
    line-height: 1.6;
  }

  .settingsRoot.simplified .settingsContainer {
    max-width: 56rem;
  }

  .settingsRoot.simplified .section {
    margin-bottom: 2rem;
  }

  .settingsRoot.simplified .sectionTitleWrap {
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
  }

  .settingsRoot.simplified .sectionTitleWrap h2 {
    font-size: calc(18px * var(--font-scale));
  }

  .settingsRoot.simplified .card {
    padding: 1.25rem;
  }

  .settingsRoot.simplified .fieldHelp,
  .settingsRoot.simplified .toggleDescription,
  .settingsRoot.simplified .infoBox {
    display: none;
  }

  .settingsRoot.simplified .block {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  .infoText strong {
    font-weight: 700;
  }

  button:focus-visible,
  select:focus-visible,
  input:focus-visible {
    outline: 4px solid var(--primary);
    outline-offset: 2px;
  }

  @media (max-width: 720px) {
    .settingsContainer {
      padding: 1rem;
    }

    .card {
      padding: 1rem;
    }

    .sizeRow {
      flex-direction: column;
    }

    .toggleRow {
      flex-direction: column;
      align-items: stretch;
    }
  }
`;

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2c-8.6-.8-15.5-7.7-16.3-16.3A2 2 0 0 1 5.5 3h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.6 2.4a2 2 0 0 1-.5 2.1L9.4 10.4a14.5 14.5 0 0 0 4.2 4.2l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.4.6a2 2 0 0 1 1.7 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function Toggle({ id, label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="toggleRow">
      <div className="toggleText">
        <label htmlFor={id} className="toggleLabel">
          {label}
        </label>
        <p className="toggleDescription">{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="toggleButton"
        data-checked={checked}
      >
        <span className="toggleThumb" />
      </button>
    </div>
  );
}

export default function SettingsView() {
  const [textSize, setTextSize] = useState<TextSize>('medium');
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [simplifiedLayout, setSimplifiedLayout] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState('twice');
  const [defaultReminderTime, setDefaultReminderTime] = useState('09:00');
  const [confirmComplete, setConfirmComplete] = useState(true);
  const [caregiverName, setCaregiverName] = useState('Sarah Miller');
  const [caregiverPhone, setCaregiverPhone] = useState('(555) 123-4567');
  const [isEditingCaregiver, setIsEditingCaregiver] = useState(false);
  const [showResetDefaultsModal, setShowResetDefaultsModal] = useState(false);

  const handleResetFilters = () => {
    setShowResetDefaultsModal(true);
  };

  const handleConfirmResetDefaults = () => {
    setTextSize('medium');
    setHighContrastMode(false);
    setSimplifiedLayout(false);
    setConfirmComplete(false);
    setShowResetDefaultsModal(false);
  };

  const rootClassName = [
    'settingsRoot',
    `size-${textSize}`,
    highContrastMode ? 'highContrast' : '',
    simplifiedLayout ? 'simplified' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      <style>{styles}</style>
      <div className="settingsContainer">
        <div className="pageHeader">
          <h1>Settings</h1>
          <p>Adjust settings to make CareConnect work best for you</p>
        </div>

        <section className="section" aria-labelledby="display-section-heading">
          <div className="sectionTitleWrap">
            <h2 id="display-section-heading">Display &amp; Simplicity</h2>
          </div>

          <div className="card">
            <div className="block">
              <label className="fieldLabel">Text Size</label>
              <p className="fieldHelp">Choose how large text appears throughout the application</p>
              <div className="sizeRow" role="radiogroup" aria-label="Text size options">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    role="radio"
                    aria-checked={textSize === size}
                    data-active={textSize === size}
                    onClick={() => setTextSize(size)}
                    className="sizeButton"
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="block">
              <Toggle
                id="high-contrast-mode"
                label="High Contrast Mode"
                description="Makes text and buttons easier to see by increasing contrast"
                checked={highContrastMode}
                onChange={setHighContrastMode}
              />
            </div>

            <div className="block">
              <Toggle
                id="simplified-layout"
                label="Simplified Layout Mode"
                description="Shows only the most important information on each page"
                checked={simplifiedLayout}
                onChange={setSimplifiedLayout}
              />
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="reminder-section-heading">
          <div className="sectionTitleWrap">
            <h2 id="reminder-section-heading">Reminder Support</h2>
          </div>

          <div className="card">
            <div className="block">
              <label htmlFor="reminder-frequency" className="fieldLabel">
                Reminder Frequency
              </label>
              <p className="fieldHelp">How many times should reminders appear for each task?</p>
              <select
                id="reminder-frequency"
                value={reminderFrequency}
                onChange={(e) => setReminderFrequency(e.target.value)}
                className="selectField"
              >
                <option value="once">Once - Single reminder only</option>
                <option value="twice">Twice - Reminder appears twice</option>
                <option value="until-completed">Until Completed - Keep reminding until task is done</option>
              </select>
            </div>

            <div className="block">
              <label htmlFor="default-reminder-time" className="fieldLabel">
                Default Reminder Time
              </label>
              <p className="fieldHelp">What time should reminders appear by default?</p>
              <select
                id="default-reminder-time"
                value={defaultReminderTime}
                onChange={(e) => setDefaultReminderTime(e.target.value)}
                className="selectField"
              >
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="12:00">12:00 PM (Noon)</option>
                <option value="14:00">2:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="18:00">6:00 PM</option>
              </select>
            </div>

            <div className="block">
              <Toggle
                id="confirm-complete"
                label="Show Confirmation After Completing Task"
                description="Ask for confirmation before marking tasks as complete to prevent mistakes"
                checked={confirmComplete}
                onChange={setConfirmComplete}
              />
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="support-section-heading">
          <div className="sectionTitleWrap">
            <h2 id="support-section-heading">Support</h2>
          </div>

          <div className="card">
            <div className="block">
              <div className="topRow">
                <label className="fieldLabel" style={{ marginBottom: 0 }}>
                  Caregiver Contact
                </label>
                <button
                  type="button"
                  onClick={() => setIsEditingCaregiver((prev) => !prev)}
                  className="secondaryButton"
                >
                  {isEditingCaregiver ? 'Save' : 'Edit'}
                </button>
              </div>

              <p className="fieldHelp">Contact information for your primary caregiver or family member</p>

              {!isEditingCaregiver ? (
                <div className="caregiverBox">
                  <div className="caregiverRow">
                    <div className="avatar">{caregiverName.charAt(0)}</div>
                    <div>
                      <p className="caregiverName">{caregiverName}</p>
                      <div className="phoneRow">
                        <PhoneIcon />
                        <p className="phoneText">{caregiverPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="editGrid">
                  <div>
                    <label htmlFor="caregiver-name" className="fieldLabel" style={{ fontSize: 14 }}>
                      Name
                    </label>
                    <input
                      id="caregiver-name"
                      type="text"
                      value={caregiverName}
                      onChange={(e) => setCaregiverName(e.target.value)}
                      className="inputField"
                    />
                  </div>
                  <div>
                    <label htmlFor="caregiver-phone" className="fieldLabel" style={{ fontSize: 14 }}>
                      Phone Number
                    </label>
                    <input
                      id="caregiver-phone"
                      type="tel"
                      value={caregiverPhone}
                      onChange={(e) => setCaregiverPhone(e.target.value)}
                      className="inputField"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="block">
              <label className="fieldLabel">Reset to Defaults</label>
              <p className="fieldHelp">Clear any active search or filter settings on the Tasks page</p>
              <button type="button" onClick={handleResetFilters} className="actionButton">
                Reset to Defaults
              </button>
            </div>

          </div>
        </section>

        <div className="infoBox" role="note" aria-label="Settings autosave information">
          <div style={{ color: 'var(--primary)', marginTop: 2 }}>
            <InfoIcon />
          </div>
          <p className="infoText">
            <strong>Settings are saved automatically.</strong> Changes take effect immediately and are saved as you
            make them.
          </p>
        </div>
      </div>

      <ContactActionModal
        isOpen={showResetDefaultsModal}
        title="Reset to Defaults"
        description="This will reset all settings to their default values. Continue?"
        contextText="Display, contrast, and simplified layout settings will be reset."
        confirmLabel="Reset to Defaults"
        variant="danger"
        icon="alert"
        onCancel={() => setShowResetDefaultsModal(false)}
        onConfirm={handleConfirmResetDefaults}
      />
    </div>
  );
}
