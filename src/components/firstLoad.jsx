// import React from "react";
// import "./firstLoad.css";
// import console from "../assets/console.png";
// import gui from "../assets/gui.png";
// import Console from "./console";
// import Gui from "./gui";

// export default function FirstLoad() {
//   return (
//     <div className="main">
//       <div className="tabs">
//         <span className="console">
//           <img src={console} alt="console" className="consoleImg" />
//           <p className="consoleText">Console</p>
//         </span>
//         <span className="gui">
//           <img src={gui} alt="gui" className="guiImg" />
//           <p className="guiText">GUI</p>
//         </span>
//       </div>
//       <div className="mainDisplay">
//         <div className="hr"></div>
//         <div className="mainScreen">
//             <Console />
//             <Gui />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import "./firstLoad.css";
import consoleImg from "../assets/console.png";
import guiImg from "../assets/gui.png";
import Console from "./console";
import Gui from "./gui";

export default function FirstLoad() {
  const [activeTab, setActiveTab] = useState("console"); // Default Console tab active

  // Function to handle tab switching with Ctrl + Tab
  const handleKeyDown = (event) => {
    if (event.ctrlKey) {
      if (event.key === "ArrowLeft") {
        setActiveTab("console");
      } else if (event.key === "ArrowRight") {
        setActiveTab("gui");
      }
    }
  };

  // Add event listener on mount & remove on unmount
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="main">
      {/* Main Display Section */}
      <div className="mainDisplay">
        {/* Tabs Section */}
        <div className="tabs">
          <span
            className={`console ${activeTab === "console" ? "active" : ""}`}
            onClick={() => setActiveTab("console")}
          >
            <img src={consoleImg} alt="console" className="consoleImg" />
            <p className="consoleText">
              <strong>Console</strong>
            </p>
          </span>

          <span
            className={`gui ${activeTab === "gui" ? "active" : ""}`}
            onClick={() => setActiveTab("gui")}
          >
            <img src={guiImg} alt="gui" className="guiImg" />
            <p className="guiText">
              <strong>GUI</strong>
            </p>
          </span>
        </div>

        <div className="hr"></div>

        <div className="mainScreen">
          {activeTab === "console" ? <Console /> : <Gui />}
        </div>
      </div>
    </div>
  );
}
