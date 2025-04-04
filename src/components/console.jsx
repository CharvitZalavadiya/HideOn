import React, { useState, useRef, useEffect } from "react";
import "./console.css";
import consoleImg from "../assets/console.png";
import guiImg from "../assets/gui.png";

export default function Console({ setActiveTab }) {
  const PROMPT = "user@hideon:~# ";
  const [maximize, setMaximize] = useState(false);
  const [lines, setLines] = useState([
    "Welcome to HideOn console!",
    "To see all commands : man ciphers",
    "How to use cipher : <ciphername> --help\n\n",
  ]);
  const [inputValue, setInputValue] = useState(PROMPT);
  const inputRef = useRef(null);
  const consoleEndRef = useRef(null);

  // List of known ciphers
  const CIPHERS = [
    "caeser",
    "monoalphabetic",
    "railfence",
    "columnar",
    "doublecolumnar",
    "hill",
    "vigenere",
    "vernam",
    "autokey",
    "playfair",
    "feistel",
    "aes",
    "des",
  ];

  // Help response
  const HELP_RESPONSE = [
    "\nAvailable Ciphers:",
    "01. caeser",
    "02. monoalphabetic",
    "03. railfence",
    "04. columnar",
    "05. doublecolumnar",
    "06. hill",
    "07. vigenere",
    "08. vernam",
    "09. autokey",
    "10. playfair",
    "11. feistel",
    "12. aes (Advanced Encryption Standard)",
    "13. des (Data Encryption Standard)\n\n",
    "To use any cipher, type :\t<ciphername> --help\n",
    "To clear console, type :\tcls / clear\n\n",
  ];

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
        "4526",
        "4312567",
        "31452\n\n",
      ],
    },
    {
      name: "doublecolumnar",
      examples: ["1234 4321", "3142 2143", "1423 4123\n\n"], // Two-layer columnar keys
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

  // Auto resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      inputRef.current.style.width = "100%";
      inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
    }
  }, [inputValue]);

  const handleChange = (event) => {
    if (!event.target.value.startsWith(PROMPT)) return;
    setInputValue(event.target.value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const trimmedInput = inputValue.slice(PROMPT.length).trim().toLowerCase();
      let response = [];

      if (!trimmedInput) {
        setLines((prevLines) => [...prevLines, inputValue]);
        setInputValue(PROMPT);
        return;
      }

      const parts = trimmedInput.split(" ");
      const cipherName = parts[0];

      if (trimmedInput === "man ciphers") {
        response = HELP_RESPONSE;
      } else if (trimmedInput === "cls" || trimmedInput === "clear") {
        setLines([""]); // Clear console
        setInputValue(PROMPT);
        return;
      }
      // Check if user asked for help but misspelled the cipher name
      else if (
        parts.length === 2 &&
        parts[1] === "--help" &&
        !CIPHERS.includes(cipherName)
      ) {
        response = ["\nCipher not found!\n\n"];
      }
      // Check if the user asked for cipher help
      else if (
        parts.length === 2 &&
        CIPHERS.includes(cipherName) &&
        parts[1] === "--help"
      ) {
        // Find the cipher in the CIPHER_KEYS array
        const cipherInfo = CIPHER_KEYS.find(
          (cipher) => cipher.name === cipherName
        );

        // Get key examples or fallback to a default message
        const keyExamples = cipherInfo
          ? cipherInfo.examples
              .map((ex, index) => `<${index + 1}> : ${ex}`)
              .join("\n")
          : "No key examples available.";

        response = [
          `\nFor encryption: ${cipherName} -e <plainText> -k <key>`,
          `For decryption: ${cipherName} -d <encryptedText> -k <key>`,
          "\nExample keys:",
          keyExamples,
        ];
      }
      // Check for encryption/decryption command format
      else if (CIPHERS.includes(cipherName)) {
        try {
          // Properly format the cipher name with capitalized first letter for import file
          const formattedCipherName =
            cipherName.charAt(0).toUpperCase() + cipherName.slice(1);

          // Parse the command arguments
          const mode = parts.includes("-e")
            ? "-e"
            : parts.includes("-d")
            ? "-d"
            : null;

          if (!mode) {
            response = [
              "\nMissing mode! Use -e for encryption or -d for decryption.",
              `Example: ${cipherName} -e <plaintext> -k <key>\n\n`,
            ];
          } else {
            const modeIndex = parts.indexOf(mode);
            const keyIndex = parts.indexOf("-k");

            if (
              keyIndex === -1 ||
              modeIndex === -1 ||
              modeIndex + 1 >= parts.length
            ) {
              response = [
                "\nInvalid command format!",
                `Example: ${cipherName} -e <plaintext> -k <key>\n\n`,
              ];
            } else {
              // Extract text and key
              let text = "";
              let key = "";

              // Get the text (everything between mode and -k)
              if (keyIndex > modeIndex + 1) {
                text = parts.slice(modeIndex + 1, keyIndex).join(" ");
              }

              // Get the key (everything after -k)
              if (keyIndex + 1 < parts.length) {
                key = parts.slice(keyIndex + 1).join(" ");
              }

              if (!text) {
                response = ["\nMissing text to process!\n\n"];
              } else {
                // Dynamically import the cipher module
                response = [`\nProcessing ${cipherName} cipher...`];

                try {
                  // Import the cipher file component
                  const CipherModule = await import(
                    `../ciphers/${formattedCipherName}.jsx`
                  );

                  if (CipherModule && CipherModule.default) {
                    // Create cipher options object
                    const cipherOptions = {
                      mode: mode === "-e" ? "encrypt" : "decrypt",
                      text: text,
                      key: key,
                    };

                    // Execute the cipher operation
                    const result = await CipherModule.default(cipherOptions);

                    // Add the result to response
                    if (result) {
                      response.push(result, "\n");
                    } else {
                      response.push(
                        "\nOperation completed but returned no result.\n\n"
                      );
                    }
                  } else {
                    response.push(
                      `\nError: The ${cipherName} cipher module is not properly exported.\n\n`
                    );
                  }
                } catch (error) {
                  console.error("\nCipher execution error:", error, "\n");
                  response.push(
                    `\nError executing ${cipherName} cipher: \n\n`,
                    error.message || "Unknown error"
                  );
                }
              }
            }
          }
        } catch (error) {
          console.error("\nImport error:", error, "\n");
          response = [
            `\nError loading ${cipherName} cipher module: ${error.message}\n\n`,
          ];
        }
      } else {
        response = ["\nCommand not recognized!\n\n"];
      }

      setLines((prevLines) => [...prevLines, inputValue, ...response]);
      setInputValue(PROMPT);
    }

    // Prevent deleting the prompt
    if (event.key === "Backspace" && inputValue.length <= PROMPT.length) {
      event.preventDefault();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div>
      {/* <Background /> */}
      <section className="console">
        <div className="console-mainSection" style={{ maxHeight: !maximize ? "90dvh" : "", padding: maximize ? "10px" : "" }}>
          <div className="console-titleBar">
            <div className="titleBar-actionButtons">
              <span
                className="closeButton"
                style={{ backgroundColor: "#e01834" }}
                onClick={() => setActiveTab("none")}
              ></span>
              <span
                className="minimizeButton"
                style={{ backgroundColor: "#e0e113" }}
                onClick={() => setActiveTab("gui")}
              ></span>
              <span
                className="maximizeButton"
                style={{ backgroundColor: "#00f025" }}
                onClick={() => setMaximize(!maximize)}
              ></span>
            </div>
            <p>Console</p>
          </div>
          <div className="console-container">
            {lines.map((line, index) => (
              <div key={index} className="console-line">
                {line}
              </div>
            ))}

            <div className="console-input-container">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                className="console-input"
                rows={1}
              />
            </div>

            <div ref={consoleEndRef} />
          </div>
        </div>
        {!maximize && (
          <div className="button-container">
            <button
              className="btn gui-btn"
              style={{ backgroundColor: "#2d2d2d" }}
              onClick={() => setActiveTab("none")}
            >
              <img src={consoleImg} alt="console-logo" />
              <span
                style={{
                  width: "20px",
                  height: "3px",
                  backgroundColor: "white",
                  position: "absolute",
                  top: "53px",
                  left: "25px",
                  borderRadius: "2px",
                }}
              ></span>
            </button>
            <button className="btn gui-btn" onClick={() => setActiveTab("gui")}>
              <img src={guiImg} alt="gui-logo" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
