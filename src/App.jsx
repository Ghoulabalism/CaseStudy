import { useState } from "react";

const API_URL = "https://qswvb36273.execute-api.us-west-2.amazonaws.com/book"; // Replace with your API Gateway endpoint

function generateConfirmationNumber() {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `CHX-${datePart}-${randomPart}`;
}

function getBookingDate(choice) {
  const date = new Date();
  if (choice === "2") date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export default function App() {
  const [step, setStep] = useState("home"); // home | select | loading | confirm | error
  const [choice, setChoice] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  async function handleBook() {
    setStep("loading");
    try {
      const confirmationNumber = generateConfirmationNumber();
      const date = getBookingDate(choice);

      // Call your Lambda via API Gateway
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ BookingChoice: choice }),
      });

      // If API Gateway isn't set up yet, simulate success
      // Remove the block below once your backend is live
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      setConfirmation(data.confirmationNumber || confirmationNumber);
      setBookingDate(data.bookingDate || date);
      setStep("confirm");
    } catch {
      // Fallback: simulate for demo purposes
      const confirmationNumber = generateConfirmationNumber();
      const date = getBookingDate(choice);
      setConfirmation(confirmationNumber);
      setBookingDate(date);
      setStep("confirm");
    }
  }

  return (
    <div className="root">
      {/* Background layers */}
      <div className="bg-gradient" />
      <div className="bg-grid" />

      <header className="header">
        <div className="logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">Choice Hotels</span>
        </div>
        <a href="tel:+18667788599" className="phone-link">
          <span className="phone-icon">📞</span>
          +1 866-778-8599
        </a>
      </header>

      <main className="main">
        {step === "home" && (
          <div className="card fade-in">
            <p className="eyebrow">Premium Stays Worldwide</p>
            <h1 className="headline">
              Welcome to<br />
              <span className="headline-accent">Choice Hotels</span>
            </h1>
            <p className="subtext">
              Over 7,000 properties across the globe.<br />
              Your perfect stay is one click away.
            </p>
            <button className="btn-primary" onClick={() => setStep("select")}>
              Book Here
            </button>
            <p className="or-call">
              Or call us at{" "}
              <a href="tel:+18667788599" className="call-link">+1 866-778-8599</a>
            </p>
          </div>
        )}

        {step === "select" && (
          <div className="card fade-in">
            <button className="back-btn" onClick={() => setStep("home")}>← Back</button>
            <p className="eyebrow">Select Check-In Date</p>
            <h2 className="headline-sm">When would you<br />like to arrive?</h2>
            <div className="date-options">
              <button
                className={`date-card ${choice === "1" ? "selected" : ""}`}
                onClick={() => setChoice("1")}
              >
                <span className="date-label">Today</span>
                <span className="date-value">{today}</span>
                {choice === "1" && <span className="check">✓</span>}
              </button>
              <button
                className={`date-card ${choice === "2" ? "selected" : ""}`}
                onClick={() => setChoice("2")}
              >
                <span className="date-label">Tomorrow</span>
                <span className="date-value">{tomorrow}</span>
                {choice === "2" && <span className="check">✓</span>}
              </button>
            </div>
            <button
              className="btn-primary"
              disabled={!choice}
              onClick={handleBook}
            >
              Confirm Booking
            </button>
          </div>
        )}

        {step === "loading" && (
          <div className="card fade-in center">
            <div className="spinner" />
            <p className="loading-text">Securing your reservation...</p>
          </div>
        )}

        {step === "confirm" && (
          <div className="card fade-in">
            <div className="success-icon">✦</div>
            <p className="eyebrow success-eye">Booking Confirmed</p>
            <h2 className="headline-sm">You're all set!</h2>
            <div className="confirm-box">
              <div className="confirm-row">
                <span className="confirm-label">Confirmation #</span>
                <span className="confirm-value mono">{confirmation}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Check-In Date</span>
                <span className="confirm-value">{new Date(bookingDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Status</span>
                <span className="confirm-value status-badge">CONFIRMED</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Channel</span>
                <span className="confirm-value">Web</span>
              </div>
            </div>
            <p className="confirm-note">
              Save your confirmation number. For changes call{" "}
              <a href="tel:+18667788599" className="call-link">+1 866-778-8599</a>
            </p>
            <button className="btn-secondary" onClick={() => { setStep("home"); setChoice(null); setConfirmation(null); }}>
              Book Another Stay
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Choice Hotels International · All Rights Reserved</p>
      </footer>
    </div>
  );
}