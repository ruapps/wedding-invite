import React, { useEffect, useRef } from "react";
import ReactPlayer from "react-player";

function relationToHonorific(relation, isOlder) {
  const rel = (relation || "").toLowerCase();
  if (rel.includes("uncle") || rel.includes("chacha")) return "Chacha ji";
  if (rel.includes("aunt") || rel.includes("mausi") || rel.includes("chachi")) return "Chachi ji";
  if (rel.includes("nephew")) return isOlder ? "Bhaiya ji" : "Beta";
  if (rel.includes("niece")) return "Beti";
  if (rel.includes("father")) return "Pitaji";
  if (rel.includes("mother")) return "Maa ji";
  if (rel.includes("friend")) return "";
  return "ji";
}

export default function GroomVideo({ guest }) {
  const playerRef = useRef();

  useEffect(() => {
    // Build invitation text (Hindi mixed)
    const groomName = "Rahul Upadhyay";
    const honorific = relationToHonorific(guest.relation, guest.older);
    const toName = honorific ? `${guest.name} ${honorific}` : guest.name;
    const text = `Namaste ${toName}, main ${groomName} aapko meri shaadi ka invitation deta hoon. Aasha karta hoon aap aayenge aur shaadi ki shobha badhayenge. Dhanyavaad.`;

    // Use browser speechSynthesis (hi-IN)
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "hi-IN";
    utter.rate = 0.95;
    // Some browsers may block autoplay of speech; user interaction (form submit) should allow it.
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [guest]);

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ width: 360 }}>
        <ReactPlayer
          ref={playerRef}
          url="/groom_base.mp4"
          playing
          controls
          width="100%"
          height="100%"
        />
        <p style={{ fontSize: 13, color: "#555", marginTop: 8 }}>
          Video plays and browser TTS speaks the personalized invitation (Hindi).
        </p>
      </div>

      <div style={{ flex: 1 }}>
        <h3>Preview invitation text</h3>
        <div style={{ background: "#fff7ed", padding: 12, borderRadius: 8, border: "1px solid #fde68a" }}>
          <InvitationPreview guest={guest} />
        </div>
      </div>
    </div>
  );
}

function InvitationPreview({ guest }) {
  const groomName = "Rahul Upadhyay";
  const honorific = relationToHonorific(guest.relation, guest.older);
  const toName = honorific ? `${guest.name} ${honorific}` : guest.name;
  const text = `Namaste ${toName}, main ${groomName} aapko meri shaadi ka invitation deta hoon. Aasha karta hoon aap aayenge aur shaadi ki shobha badhayenge. Dhanyavaad.`;
  return <div style={{ whiteSpace: "pre-wrap", fontSize: 15 }}>{text}</div>;
}
