import React from "react";
import "./firstLoad.css";
import console from "../assets/console.png";
import gui from "../assets/gui.png";
import Console from "./console";

export default function FirstLoad() {
  return (
    <div className="main">
      <div className="tabs">
        <span className="console">
          <img src={console} alt="console" className="consoleImg" />
          <p className="consoleText">Console</p>
        </span>
        <span className="gui">
          <img src={gui} alt="gui" className="guiImg" />
          <p className="guiText">GUI</p>
        </span>
      </div>
      <div className="mainDisplay">
        <div className="hr"></div>
        <div className="mainScreen">
            <Console />
        </div>
      </div>
    </div>
  );
}
