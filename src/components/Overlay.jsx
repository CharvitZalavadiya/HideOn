import React from "react";
import Background from "./styles/Background"; // Background imported
import "./Overlay.css"; // Import CSS for styling
import consoleImg from "../assets/console.png";
import guiImg from "../assets/gui.png";

export default function Overlay({ setActiveTab }) {
  return (
    <div className="overlay-container">
      <div className="top-section">
        <h1>HideOn</h1>
        <Background />
      </div>
      <div className="button-container">
        <button className="btn gui-btn" onClick={() => setActiveTab("console")}>
          <img src={consoleImg} alt="console-logo" />
        </button>
        <button className="btn gui-btn" onClick={() => setActiveTab("gui")}>
          <img src={guiImg} alt="gui-logo" />
        </button>
      </div>
    </div>
  );
}
