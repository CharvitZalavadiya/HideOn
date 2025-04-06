import React, { useState } from "react";
import Button from "@mui/material/Button";
import "./gui.css";
import consoleImg from "../assets/console.png";
import guiImg from "../assets/gui.png";
import ModeSelect from "./ui/ModeSelect";
import CipherSelect from "./ui/CipherSelect";

export default function Gui({ setActiveTab }) {
  const [maximize, setMaximize] = useState(false);
  const [selectedCipher, setSelectedCipher] = useState("caeser");
  const [selectedMode, setSelectedMode] = useState("encrypt");
  const [result, setResult] = useState("Result : NA");

  const CIPHER_KEYS = [
    {
      name: "caeser",
      examples: ["<1> : 3", "<2> : 7", "<3> : 15\n\n"],
    },
    {
      name: "monoalphabetic",
      examples: [
        "// Key must contain a to z letters",
        "// Letters can be reversed or in random manner\n",
        "<1> : phqgiumeaylnofdxjkrcvstzwb",
        "<2> : zyxwvutsrqponmlkjihgfedcba",
        "<3> : qazwsxedcrfvtgbyhnujmikolp\n\n",
      ],
    },
    {
      name: "railfence",
      examples: ["<1> : 2", "<2> : 3", "<3> : 5\n\n"],
    },
    {
      name: "columnar",
      examples: ["<1> : 4526", "<2> : 4312567", "<3> : 31452\n\n"],
    },
    {
      name: "doublecolumnar",
      examples: [
        "// You must need to provide 2 keys sepated by space",
        "<1> : 1234 4321",
        "<2> : 3142 2143",
        "<3> : 1423 4123\n\n",
      ],
    },
    {
      name: "hill",
      examples: [
        "// Key must be a squared matrix whose inverse matrix is possible",
        "// Identity matrix as a key will not encryt the text\n",
        "<1> : [[1, 0, 0], [0, 1, 0], [0, 0, 1]]",
        "<2> : [[1, 2], [3, 4]]",
        "<3> : [[2, 3], [1, 2]]\n\n",
      ],
    },
    {
      name: "vigenere",
      examples: ["<1> : LEMON", "<2> : HIDE", "<3> : CIPHER\n\n"], // Keyword-based
    },
    {
      name: "vernam",
      examples: [
        "// Key must be as long as plainText\n",
        "<1> : XMCKL",
        "<2> : HELLO",
        "<3> : SECRET\n\n",
      ],
    },
    {
      name: "autokey",
      examples: ["<1> : KING", "<2> : QUEEN", "<3> : CIPHER\n\n"],
    },
    {
      name: "playfair",
      examples: ["<1> : MONARCHY", "<2> : KEYWORD", "<3> : SECRET\n\n"],
    },
    {
      name: "feistel",
      examples: ["<1> : 11001100", "<2> : 10101010", "<3> : 00110011\n\n"],
    },
    {
      name: "aes",
      examples: [
        "// Key must be between 128, 192, 256-bit hex key",
        "// Text-Only key must be exactly 16, 24, 32 characters long",
        "// Hexadecimal key must be exactly 32, 48, 64 characters long\n",
        "<1> : 2b7e151628aed2a6abf7158809cf4f3c",
        "<2> : 603deb1015ca71be2b73aef0857d7781",
        "<3> : 000102030405060708090a0b0c0d0e0f\n\n",
      ],
    },
    {
      name: "des",
      examples: [
        "<1> : qwertyui",
        "<2> : A1B2C3D4E5F60708",
        "<3> : 0123456789ABCDEF\n\n",
      ],
    },
    {
      name: "3des",
      examples: [
        "// Text-Only key must have length between 16 and 24 characters",
        "// Hexadecimal key must have length between 32 and 48 characters\n",
        "<1> : mysecurekey12345",
        "<2> : 0123456789abcdef0123456789abcdef",
        "<3> : 0123456789abcdef0123456789abcdefabcdef1234567890\n\n",
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
    setSelectedMode(mode);
  };
  
  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("textbox");
    const key = formData.get("key");

    const cipher = selectedCipher; // from CipherSelect
    const mode = selectedMode; // from ColorToggleButton


    try {
      const formattedCipherName = capitalize(cipher); // "caeser" → "Caeser"

      const CipherModule = await import(
        `../ciphers/${formattedCipherName}.jsx`
      );

      if (CipherModule && CipherModule.default) {
        const cipherOptions = {
          mode,
          text,
          key,
        };

        const result = await CipherModule.default(cipherOptions);

        if (result) {
          setResult(result);
        } else {
          setResult("Operation completed but returned no result.");
        }
      } else {
        setResult(
          `❌ ${formattedCipherName}.jsx does not export default correctly.`
        );
      }
    } catch (error) {
      setResult(
        `❌ Error executing ${cipher} cipher:`,
        error.message || error
      );
    }
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
              <ModeSelect mode={selectedMode} onModeChange={handleModeChange} />
            </div>
            <div className="gui-inputs">
              <textarea
                name="textbox"
                className="gui-textarea"
                placeholder="Enter text here..."
                required
              />
              <span className="gui-keySubmit">
                <input
                  type="text"
                  name="key"
                  className="gui-key"
                  placeholder="Enter key here..."
                  required
                />
                <Button
                  type="submit"
                  className="gui-submitButton"
                  sx={{
                    fontSize: "14px",
                    borderRadius: "8px",
                    backgroundColor: "#27c127a8", // Custom background color
                    color: "#fff", // Text color (optional)
                    "&:hover": {
                      backgroundColor: "#34a93466", // Custom hover color
                    },
                  }}
                  variant="contained"
                >
                  {selectedMode === "encrypt" ? "Encrypt" : "Decrypt"}
                </Button>
              </span>
            </div>
            <div className="gui-result">{result}</div>
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
