import React, { useState } from "react";
import InviteForm from "./components/InviteForm";
import GroomVideo from "./components/GroomVideo";
import CongratsSection from "./components/CongratsSection";
import MagicText from "./components/MagicText";

export default function App() {
  const [guest, setGuest] = useState(null);

  // This callback will be triggered when video + voice finish
  function handleInvitationEnd() {
    // Small delay before returning to image view
    setTimeout(() => setGuest(null), 500);
  }

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 24,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <div>
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Parisienne, sans-serif",
            fontWeight: "400",
            fontSize: "48px",
            lineHeight: "70px",
          }}
        >
          <span
            style={{
              fontSize: "90px",
              fontFamily: "Parisienne",
              fontWeight: "600",
              display: "inline-block",
              position: "relative",
              left: "-30px",
            }}
          >
            Jaswant
          </span>
          <div
            style={{
              fontSize: "55px",
              fontFamily: "Parisienne",
            }}
          >
            weds
          </div>
          <span
            style={{
              fontSize: "90px",
              fontFamily: "Parisienne",
              fontWeight: "600",
              display: "block",
              position: "relative",
              right: "-85px",
              lineHeight: "100px",
            }}
          >
            Kirti
          </span>
          Wedding Invitation
        </h1>
      </div>

      <video width="100%" height="500" loop playsInline autoPlay controls>
        <source
          src={`${import.meta.env.BASE_URL}weddinginvitation2.mp4`}
          type="video/mp4"
        />
      </video>

      <MagicText />

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
              src={`${import.meta.env.BASE_URL}assets/groom.jpeg`}
              alt="Groom"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 12,
                boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              }}
            />
            {/* <p style={{ fontSize: 13, color: "#555", marginTop: 8 }}>
              Groom photo — will be replaced by a personalized video when a
              guest submits the form.
            </p> */}
          </div>

          <InviteForm onSubmit={setGuest} />
        </div>
      ) : (
        <GroomVideo guest={guest} onEnd={handleInvitationEnd} />
      )}

      <hr style={{ margin: "28px 0" }} />

      {/* <CongratsSection /> */}
    </div>
  );
}
