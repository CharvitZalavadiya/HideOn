import React, { useState, useRef, useEffect } from "react";
import "./console.css";

export default function Console() {
  const PROMPT = "user@hideon:~# ";
  const [lines, setLines] = useState([
    "Welcome to HideOn console!",
    "Use command man ciphers to see all commands.",
    "",
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
    "---",
    "Available Ciphers:",
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
    "13. des (Data Encryption Standard)",
    "---",
    "To use any cipher, type: <ciphername> --help",
    "To clear console, type: cls or clear",
    "---",
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
        CIPHERS.includes(cipherName) &&
        parts[1] === "--help"
      ) {
        response = ["Cipher not found!"];
      }
      // Check if the user asked for cipher help
      else if (
        parts.length === 2 &&
        CIPHERS.includes(cipherName) &&
        parts[1] === "--help"
      ) {
        response = [
          "---",
          `For encryption: ${cipherName} -e <plainText> -k <key>`,
          `For decryption: ${cipherName} -d <encryptedText> -k <key>`,
          "---",
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
              "Missing mode! Use -e for encryption or -d for decryption.",
              `Example: ${cipherName} -e <plaintext> -k <key>`,
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
                "Invalid command format!",
                `Example: ${cipherName} -e <plaintext> -k <key>`,
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
                response = ["Missing text to process!"];
              } else {
                // Dynamically import the cipher module
                response = [`Processing ${cipherName} cipher...`];

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
                      response.push("Result:", result);
                    } else {
                      response.push(
                        "Operation completed but returned no result."
                      );
                    }
                  } else {
                    response.push(
                      `Error: The ${cipherName} cipher module is not properly exported.`
                    );
                  }
                } catch (error) {
                  console.error("Cipher execution error:", error);
                  response.push(
                    `Error executing ${cipherName} cipher:`,
                    error.message || "Unknown error"
                  );
                }
              }
            }
          }
        } catch (error) {
          console.error("Import error:", error);
          response = [
            `Error loading ${cipherName} cipher module: ${error.message}`,
          ];
        }
      } else {
        response = ["Command not recognized!"];
      }

      setLines((prevLines) => [...prevLines, inputValue, ...response]);
      setInputValue(PROMPT);
    }

    // Prevent deleting the prompt
    if (event.key === "Backspace" && inputValue.length <= PROMPT.length) {
      event.preventDefault();
    }
  };

  const handleClick = () => {
    inputRef.current.focus();
  };

  // Auto-scroll to bottom
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div className="console-container" onClick={handleClick}>
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
  );
}
