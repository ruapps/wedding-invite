import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import groomImage from "../assets/groom.jpeg"; // same image you already use
import groomVideo from "../assets/groom_talking.mp4"; // short head-gesture clip

function relationToHonorific(relation, isOlder) {
  const rel = (relation || "").toLowerCase();
  if (rel.includes("uncle") || rel.includes("chacha")) return "Chacha ji";
  if (rel.includes("aunt") || rel.includes("chachi")) return "Chachi ji";
  if (rel.includes("mausi")) return "mausi ji";
  if (rel.includes("mausa")) return "mausa ji";
  if (rel.includes("nephew")) return " ";
  if (rel.includes("brother")) return isOlder ? "Bhaiya ji" : " ";
  if (rel.includes("sister")) return isOlder ? "Didi" : " ";
  if (rel.includes("niece")) return " ";
  if (rel.includes("fufa")) return "fufa ji";
  if (rel.includes("bua")) return "bua ji";
  if (rel.includes("friend")) return "";
  return "ji";
}

export default function GroomVideo({ guest }) {
  const playerRef = useRef();
  const utterRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // whether to show/play video
  const [audioFinishedOnce, setAudioFinishedOnce] = useState(false);

  useEffect(() => {
    if (!guest) {
      // no guest -> make sure video is stopped and image visible
      try {
        const player = playerRef.current?.getInternalPlayer?.();
        if (player && player.pause) player.pause();
      } catch (e) {}
      setIsPlaying(false);
      return;
    }

    // Build invitation text (Hindi mixed)
    const groomName = "Jaswant Upadhyay"; // keep as before or change
    const honorific = relationToHonorific(guest.relation, guest.older);
    const toName = honorific ? `${guest.name} ${honorific}` : guest.name;
    const text = `नमस्ते ${toName}, मैं ${groomName} आपको मेरी शादी का निमंत्रण देता हूँ। आशा करता हूँ आप आयेंगे और शादी की शोभा बढ़ायेंगे। धन्यवाद।`;

    // Cancel any previous speech and stop any video
    window.speechSynthesis.cancel();
    try {
      const player = playerRef.current?.getInternalPlayer?.();
      if (player && player.pause) player.pause();
    } catch (e) {
      // ignore
    }
    setAudioFinishedOnce(false);

    // Prepare utterance
    const utter = new SpeechSynthesisUtterance(text);

    // Attempt to pick a deep male hi-IN voice using heuristics
    const pickMaleVoice = (voicesList) => {
      // preference list of substrings that usually indicate male Hindi voices
      const maleCandidates = [
        "hemant",
        "amit",
        "aakash",
        "male",
        "deep",
        "hemant",
        "raju",
        "suraj",
      ];
      // check exact hi-IN matches first
      let candidate =
        voicesList.find(
          (v) =>
            v.lang === "hi-IN" &&
            maleCandidates.some((k) => v.name.toLowerCase().includes(k))
        ) ||
        voicesList.find(
          (v) => v.lang === "hi-IN" && v.name.toLowerCase().includes("male")
        ) ||
        voicesList.find((v) => v.lang === "hi-IN");
      // fallback to other languages with male hint
      if (!candidate) {
        candidate =
          voicesList.find((v) =>
            maleCandidates.some((k) => v.name.toLowerCase().includes(k))
          ) || voicesList.find((v) => v.name.toLowerCase().includes("male"));
      }
      return candidate || null;
    };

    // set slower & deeper defaults (makes voice sound more male)
    utter.rate = 0.92;
    utter.pitch = 0.55; // lower pitch -> deeper voice
    utter.volume = 1;
    utter.lang = "hi-IN";

    const speakWithVoice = (voicesList) => {
      const maleVoice = pickMaleVoice(voicesList);
      if (maleVoice) {
        try {
          utter.voice = maleVoice;
        } catch (e) {}
      }
      // onstart -> show & play video
      utter.onstart = () => {
        setIsPlaying(true);
        // ensure the video plays (some players require user interaction; the form submit is such an interaction)
        try {
          const player = playerRef.current?.getInternalPlayer?.();
          if (player) {
            if (typeof player.play === "function")
              player.play().catch(() => {});
          }
        } catch (e) {}
      };

      // onend -> stop video and revert to image
      utter.onend = () => {
        try {
          const player = playerRef.current?.getInternalPlayer?.();
          if (player && typeof player.pause === "function") player.pause();
        } catch (e) {}
        setIsPlaying(false);
        setAudioFinishedOnce(true);
      };

      // Speak
      try {
        window.speechSynthesis.speak(utter);
      } catch (e) {
        // fallback: try after slight delay
        setTimeout(() => {
          window.speechSynthesis.speak(utter);
        }, 200);
      }
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // voices may load asynchronously
      const handler = () => {
        const v2 = window.speechSynthesis.getVoices();
        speakWithVoice(v2);
        window.speechSynthesis.onvoiceschanged = null;
      };
      window.speechSynthesis.onvoiceschanged = handler;
    } else {
      speakWithVoice(voices);
    }

    utterRef.current = utter;

    // cleanup on unmount or guest change
    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
      window.speechSynthesis.onvoiceschanged = null;
      try {
        const player = playerRef.current?.getInternalPlayer?.();
        if (player && typeof player.pause === "function") player.pause();
      } catch (e) {}
    };
  }, [guest]); // keep dependency only on guest (don't touch structure elsewhere)

  return (
    <div style={{ display: "flex", gap: 20, flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* Show image when NOT playing, show video when playing */}
        {!isPlaying ? (
          <img
            src={groomImage}
            alt="Groom"
            style={{
              width: 360,
              height: 360,
              borderRadius: 12,
              objectFit: "cover",
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            }}
          />
        ) : (
          <div
            style={{
              width: 360,
              height: 360,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <ReactPlayer
              ref={playerRef}
              url={groomVideo}
              playing={true}
              loop={false}
              controls={false}
              width="100%"
              height="100%"
              muted={true} /* keep video muted: TTS provides voice */
            />
          </div>
        )}
      </div>

      <p
        style={{
          fontSize: 13,
          color: "#555",
          marginTop: 8,
          textAlign: "center",
        }}
      >
        {isPlaying
          ? "वीडियो चल रहा है — आमंत्रण संदेश चल रहा है..."
          : audioFinishedOnce
          ? "आमंत्रण पूर्ण हुआ।"
          : "Video plays and browser TTS speaks the personalized invitation (Hindi)."}
      </p>
    </div>
  );
}
