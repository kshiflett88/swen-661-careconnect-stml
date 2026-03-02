import { useMemo, useState } from "react";
import { ContactActionModal } from "./ContactActionModal";
import "./ContactsView.css";

function PhoneIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M4 5.2C4 4.54 4.54 4 5.2 4H8.5C9.06 4 9.55 4.39 9.69 4.93L10.35 7.58C10.47 8.04 10.32 8.53 9.96 8.86L8.38 10.31C9.19 11.99 10.52 13.34 12.2 14.16L13.64 12.58C13.98 12.22 14.46 12.08 14.93 12.19L17.57 12.85C18.12 12.99 18.5 13.48 18.5 14.04V17.3C18.5 17.96 17.96 18.5 17.3 18.5H16C9.37 18.5 4 13.13 4 6.5V5.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 6.5C4 5.67 4.67 5 5.5 5H18.5C19.33 5 20 5.67 20 6.5V14.5C20 15.33 19.33 16 18.5 16H10L6.5 19V16H5.5C4.67 16 4 15.33 4 14.5V6.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 20.5L10.52 19.17C5.26 14.46 2 11.54 2 8C2 5.24 4.24 3 7 3C8.56 3 10.06 3.72 11 4.85C11.94 3.72 13.44 3 15 3C17.76 3 20 5.24 20 8C20 11.54 16.74 14.46 11.48 19.17L10 20.5H12Z" fill="currentColor" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7.5V12.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.4" r="1.2" fill="currentColor" />
    </svg>
  );
}

function StethoscopeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 3V8C6 10.76 8.24 13 11 13C13.76 13 16 10.76 16 8V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6H4M16 6H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 13V15.2C11 17.85 13.15 20 15.8 20H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18.3" cy="20" r="1.7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ContactsView() {
  const [modalAction, setModalAction] = useState<
    | { kind: "call"; name: string; detail: string }
    | { kind: "message"; name: string; detail: string }
    | { kind: "emergency"; name: string; detail: string }
    | null
  >(null);

  const modalConfig = useMemo(() => {
    if (!modalAction) {
      return null;
    }

    if (modalAction.kind === "message") {
      return {
        title: "Send Message",
        description: "Do you want to open messaging for this contact?",
        contextText: `${modalAction.name}`,
        confirmLabel: "Send Message",
        variant: "primary" as const,
        icon: "message" as const,
      };
    }

    if (modalAction.kind === "emergency") {
      return {
        title: "Call Emergency Services",
        description: "This will call 911 Emergency Services. Continue?",
        contextText: "Emergency Number: 911",
        confirmLabel: "Call 911",
        variant: "danger" as const,
        icon: "alert" as const,
      };
    }

    return {
      title: "Confirm Call",
      description: "Do you want to place this call now?",
      contextText: `${modalAction.name} • ${modalAction.detail}`,
      confirmLabel: "Call Now",
      variant: "primary" as const,
      icon: "phone" as const,
    };
  }, [modalAction]);

  const handleConfirmModalAction = () => {
    setModalAction(null);
  };

  const handleCall = (name: string, phone: string) => {
    setModalAction({ kind: "call", name, detail: phone });
  };

  const handleMessage = (name: string) => {
    setModalAction({ kind: "message", name, detail: "" });
  };

  const handleEmergencyCall = () => {
    setModalAction({ kind: "emergency", name: "Emergency Services", detail: "911" });
  };

  return (
    <div className="contacts-view">
      <div className="contacts-content">
        <article className="contact-card contact-card-primary">
          <header className="contact-card-header caregiver-header">
            <div className="contact-header-icon caregiver-icon">
              <HeartIcon />
            </div>
            <div>
              <h2>Primary Caregiver</h2>
              <p>Your main contact for support</p>
            </div>
          </header>

          <div className="contact-card-body">
            <div className="contact-info-block">
              <div>
                <p className="contact-field-label">Name</p>
                <p className="contact-field-value lg">Sarah Miller</p>
              </div>
              <div>
                <p className="contact-field-label">Phone Number</p>
                <p className="contact-field-value lg">(555) 123-4567</p>
              </div>
              <div>
                <p className="contact-field-label">Relationship</p>
                <p className="contact-field-value">Daughter</p>
              </div>
            </div>

            <div className="contact-actions two-col">
              <button type="button" className="contact-btn btn-primary" onClick={() => handleCall("Sarah Miller", "(555) 123-4567")}>
                <PhoneIcon />
                <span>Call</span>
              </button>
              <button type="button" className="contact-btn btn-secondary" onClick={() => handleMessage("Sarah Miller")}>
                <MessageIcon />
                <span>Message</span>
              </button>
            </div>
          </div>
        </article>

        <article className="contact-card emergency-card">
          <header className="contact-card-header emergency-header">
            <div className="contact-header-icon emergency-icon">
              <AlertIcon />
            </div>
            <div>
              <h2>Emergency Services</h2>
              <p>For immediate medical help</p>
            </div>
          </header>

          <div className="contact-card-body">
            <div className="contact-info-block emergency-number-block">
              <p className="contact-field-label">Emergency Number</p>
              <p className="contact-field-value emergency-number">911</p>
            </div>

            <button type="button" className="contact-btn btn-emergency full" onClick={handleEmergencyCall}>
              <PhoneIcon size={24} />
              <span>Call Emergency Services</span>
            </button>

            <p className="emergency-note">
              Use this for medical emergencies, injuries, or when you feel unsafe
            </p>
          </div>
        </article>

        <article className="contact-card">
          <header className="contact-card-header neutral-header">
            <h2>Family Contact</h2>
          </header>

          <div className="contact-card-body">
            <div className="contact-info-block">
              <div>
                <p className="contact-field-label">Name</p>
                <p className="contact-field-value">Michael Miller</p>
              </div>
              <div>
                <p className="contact-field-label">Phone Number</p>
                <p className="contact-field-value">(555) 234-5678</p>
              </div>
              <div>
                <p className="contact-field-label">Relationship</p>
                <p className="contact-field-value">Son</p>
              </div>
            </div>

            <div className="contact-actions two-col">
              <button type="button" className="contact-btn btn-primary" onClick={() => handleCall("Michael Miller", "(555) 234-5678")}>
                <PhoneIcon size={20} />
                <span>Call</span>
              </button>
              <button type="button" className="contact-btn btn-secondary" onClick={() => handleMessage("Michael Miller")}>
                <MessageIcon size={20} />
                <span>Message</span>
              </button>
            </div>
          </div>
        </article>

        <article className="contact-card">
          <header className="contact-card-header neutral-header with-icon">
            <StethoscopeIcon />
            <h2>Primary Doctor</h2>
          </header>

          <div className="contact-card-body">
            <div className="contact-info-block">
              <div>
                <p className="contact-field-label">Name</p>
                <p className="contact-field-value">Dr. Jennifer Park</p>
              </div>
              <div>
                <p className="contact-field-label">Phone Number</p>
                <p className="contact-field-value">(555) 345-6789</p>
              </div>
              <div>
                <p className="contact-field-label">Practice</p>
                <p className="contact-field-value">Riverside Medical Center</p>
              </div>
            </div>

            <button type="button" className="contact-btn btn-primary full" onClick={() => handleCall("Dr. Jennifer Park", "(555) 345-6789")}>
              <PhoneIcon size={20} />
              <span>Call Doctor&apos;s Office</span>
            </button>
          </div>
        </article>

        <aside className="contacts-info-note">
          <p>
            <strong>Note:</strong> To update contact information, ask your caregiver to help you in the Settings page.
          </p>
        </aside>
      </div>

      {modalConfig && (
        <ContactActionModal
          isOpen={true}
          title={modalConfig.title}
          description={modalConfig.description}
          contextText={modalConfig.contextText}
          confirmLabel={modalConfig.confirmLabel}
          variant={modalConfig.variant}
          icon={modalConfig.icon}
          onCancel={() => setModalAction(null)}
          onConfirm={handleConfirmModalAction}
        />
      )}
    </div>
  );
}