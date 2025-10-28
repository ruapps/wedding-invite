import React from "react";
import "../MagicText.css";

const MagicText = () => {
  return (
    <div className="magic-container">
      <h2 className="magic-text" style={{ textShadow: "2px 2px 3px red" }}>
        A magic for you <span className="hand">👇</span>
      </h2>
    </div>
  );
};

export default MagicText;
