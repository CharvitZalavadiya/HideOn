import React, { useState } from "react";
import "./gui.css";
import consoleImg from "../assets/console.png";
import guiImg from "../assets/gui.png";
import ModeSelect from "./ui/ModeSelect";
import CipherSelect from "./ui/CipherSelect";

export default function Gui({ setActiveTab }) {
  const [maximize, setMaximize] = useState(false);
  const [selectedCipher, setSelectedCipher] = useState("caeser");
  const [mode, setMode] = useState('encrypt');

  const CIPHER_KEYS = [
    {
      name: "caeser",
      examples: ["3", "7", "15\n\n"], // Shift values for the Caesar cipher
    },
    {
      name: "monoalphabetic",
      examples: [
        "phqgiumeaylnofdxjkrcvstzwb \t// Mixed random key", // Random substitution
        "zyxwvutsrqponmlkjihgfedcba", // Reverse alphabet
        "qazwsxedcrfvtgbyhnujmikolp\n\n", // Mixed random key
      ],
    },
    {
      name: "railfence",
      examples: ["2", "3", "5\n\n"], // Number of rails
    },
    {
      name: "columnar",
      examples: [
        "keyword \t // Keyword based key",
        "4312567 \t // Numeric based key",
        "31452 \t // Numeric based key\n\n",
      ], // Numeric & keyword-based keys
    },
    {
      name: "doublecolumnar",
      examples: ["secret", "3142", "password\n\n"], // Two-layer columnar keys
    },
    {
      name: "hill",
      examples: [
        "[[1, 0, 0], [0, 1, 0], [0, 0, 1]]  \t // 3x3 matrix key", // 3x3 matrix
        "[[1, 2], [3, 4]] \t // 2x2 matrix key", // 2x2 matrix key
        "[[2, 3], [1, 2]]\n\n", // Another 2x2 example
      ],
    },
    {
      name: "vigenere",
      examples: ["LEMON", "HIDE", "CIPHER\n\n"], // Keyword-based
    },
    {
      name: "vernam",
      examples: ["XMCKL", "HELLO", "SECRET\n\n"], // One-time pad examples
    },
    {
      name: "autokey",
      examples: ["KING", "QUEEN", "CIPHER\n\n"], // Initial key examples
    },
    {
      name: "playfair",
      examples: ["MONARCHY", "KEYWORD", "SECRET\n\n"], // Playfair key squares
    },
    {
      name: "feistel",
      examples: ["11001100", "10101010", "00110011\n\n"], // Example binary keys
    },
    {
      name: "aes",
      examples: [
        "2b7e151628aed2a6abf7158809cf4f3c \t // 128-bit hex key", // 128-bit hex key
        "603deb1015ca71be2b73aef0857d7781 \t // 192-bit hex key", // 192-bit hex key
        "000102030405060708090a0b0c0d0e0f \t // 256-bit hex key\n\n", // 256-bit hex key
      ],
    },
    {
      name: "des",
      examples: [
        "133457799BBCDFF1 \t // Standard", // Standard DES key
        "A1B2C3D4E5F60708", // Another valid DES key
        "0123456789ABCDEF \t // 64-bit key\n\n", // 64-bit key
      ],
    },
  ];

  const selectedCipherKeys = CIPHER_KEYS.find(
    (item) => item.name === selectedCipher
  );

  const handleCipherChange = (cipher) => {
    setSelectedCipher(cipher);
  };

  const handleModeChange = (mode) => {
    setMode(mode);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page reload

    const formData = new FormData(event.target);
    const data = {
      text: formData.get("textbox"),
      key: formData.get("key"),
      cipher: selectedCipher,
      mode: mode,
    };

    console.log("Form Data:", data);
  };

  return (
    <section className="gui">
      <div
        className="gui-mainSection"
        style={{
          maxHeight: !maximize ? "90dvh" : "",
          padding: maximize ? "10px" : "",
        }}
      >
        <div className="gui-titleBar">
          <div className="titleBar-actionButtons">
            <span
              className="closeButton"
              style={{ backgroundColor: "#e01834" }}
              onClick={() => setActiveTab("none")}
            ></span>
            <span
              className="minimizeButton"
              style={{ backgroundColor: "#e0e113" }}
              onClick={() => setActiveTab("console")}
            ></span>
            <span
              className="maximizeButton"
              style={{ backgroundColor: "#00f025" }}
              onClick={() => setMaximize(!maximize)}
            ></span>
          </div>
          <p>GUI</p>
        </div>
        <div className="gui-container">
          <form onSubmit={handleSubmit}>
            <div className="modeCipher">
              <CipherSelect name="cipher" onCipherChange={handleCipherChange} />
              <span style={{ marginLeft: "4px" }}>
                Key Examples :
                <ul style={{ marginBottom: "calc(-1em + 12px)" }}>
                  {selectedCipherKeys?.examples.map((example, idx) => (
                    <li
                      key={idx}
                      style={{ marginLeft: "4px", listStyle: "none" }}
                    >
                      {example.replace("//", "→")}
                    </li>
                  )) || <li>No examples available.</li>}
                </ul>
              </span>
              <ModeSelect mode={mode} onModeChange={handleModeChange} />
            </div>
            <div className="gui-inputs">
              <textarea
                name="textbox"
                className="gui-textarea"
                placeholder="Enter text here..."
                required
              />
              <span className="keySubmit">
                <input
                  type="text"
                  name="key"
                  className="gui-key"
                  placeholder="Enter key here..."
                  required
                />
                <button type="submit">Submit</button>
              </span>
            </div>
          </form>
        </div>
      </div>
      {!maximize && (
        <div className="button-container">
          <button
            className="btn gui-btn"
            // style={{ backgroundColor: "#2d2d2d" }}
            onClick={() => setActiveTab("console")}
          >
            <img src={consoleImg} alt="console-logo" />
          </button>
          <button
            className="btn gui-btn"
            style={{ backgroundColor: "#2d2d2d" }}
            onClick={() => setActiveTab("none")}
          >
            <img src={guiImg} alt="gui-logo" />
            <span
              style={{
                width: "20px",
                height: "3px",
                backgroundColor: "white",
                position: "absolute",
                top: "53px",
                left: "85px",
                borderRadius: "2px",
              }}
            ></span>
          </button>
        </div>
      )}
    </section>
  );
}
