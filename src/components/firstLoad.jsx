import React, { useState } from "react";
import "./firstLoad.css";
import Console from "./console";
import Gui from "./gui";
import Overlay from "./Overlay"; // Import the new component

export default function FirstLoad() {
  const [activeTab, setActiveTab] = useState("none");

  return (
    <div className={`main ${activeTab}`}>
      {activeTab === "none" && <Overlay setActiveTab={setActiveTab} />}

      {activeTab === "console" && (
        <div className="full-screen">
          <Console setActiveTab={setActiveTab} />
        </div>
      )}

      {activeTab === "gui" && (
        <div className="full-screen">
          <Gui setActiveTab={setActiveTab} />
        </div>
      )}
    </div>
  );
}

