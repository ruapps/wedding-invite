import React, { useState } from "react";
import InviteForm from "./components/InviteForm";
import GroomVideo from "./components/GroomVideo";
import CongratsSection from "./components/CongratsSection";

export default function App() {
  const [guest, setGuest] = useState(null);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 24,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Wedding Invitation</h1>

      {!guest ? (
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <div style={{}}>
            <img
              src="/wedding-invite/groom.png"
              alt="Groom"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 12,
                boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              }}
            />
            <p style={{ fontSize: 13, color: "#555", marginTop: 8 }}>
              Groom photo — will be replaced by a personalized video when a
              guest submits the form.
            </p>
          </div>

          <InviteForm onSubmit={setGuest} />
        </div>
      ) : (
        <GroomVideo guest={guest} />
      )}

      <hr style={{ margin: "28px 0" }} />

      <CongratsSection />
    </div>
  );
}
