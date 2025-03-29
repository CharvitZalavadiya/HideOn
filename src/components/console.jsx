// import React, { useState, useRef, useEffect } from "react";
// import "./console.css";

// export default function Console() {
//   const [lines, setLines] = useState([
//     "Welcome to HideOn console!",
//     "Use command man ciphers to see all commands.",
//     "",
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const inputRef = useRef(null);
//   const consoleEndRef = useRef(null); // Ref for auto-scrolling

//   // List of known ciphers
//   const CIPHERS = [
//     "caeser",
//     "monoalphabetic",
//     "railfence",
//     "columnar",
//     "doublecolumnar",
//     "hill",
//     "vigenere",
//     "vernam",
//     "autokey",
//     "playfair",
//     "feistel",
//     "aes",
//     "des",
//   ];

//   // General help response for ciphers
//   const HELP_RESPONSE = [
//     "---",
//     "Available Ciphers:",
//     "01. caeser",
//     "02. monoalphabetic",
//     "03. railfence",
//     "04. columnar",
//     "05. doublecolumnar",
//     "06. hill",
//     "07. vigenere",
//     "08. vernam",
//     "09. autokey",
//     "10. playfair",
//     "11. feistel",
//     "12. aes (Advanced Encryption Standard)",
//     "13. des (Data Encryption Standard)",
//     "---",
//     "For information to use any of the given ciphers use the following command :",
//     "<ciphername> --help",
//     "---",
//     "To clear the console enter the command :",
//     "cls / clear",
//     "---",
//   ];

//   // Handle user input change
//   const handleChange = (event) => {
//     setInputValue(event.target.value);
//   };

//   // Handle Enter key press
//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault();

//       const trimmedInput = inputValue.trim().toLowerCase();
//       let response = [];

//       if (trimmedInput === "man ciphers") {
//         response = HELP_RESPONSE;
//       } else if (trimmedInput === "cls" || trimmedInput === "clear") {
//         setLines([""]); // Clear console
//         setInputValue("");
//         return;
//       } else {
//         // Check if input is "<ciphername> --help"
//         const parts = trimmedInput.split(" ");
//         if (
//           parts.length === 2 &&
//           CIPHERS.includes(parts[0]) &&
//           parts[1] === "--help"
//         ) {
//           const cipherName = parts[0];
//           response = [
//             "------------------------------------------------------------",
//             `For encryption : ${cipherName} -e <plainText> -k <key>`,
//             `For decryption : ${cipherName} -d <encryptedText> -k <key>`,
//             "------------------------------------------------------------",
//           ];
//         } else if (
//           (parts.length === 2 && CIPHERS.includes(parts[0])) ||
//           parts[1] === "--help"
//         ) {
//           response = ["Invalid cipher name entered !"]; // Default response
//         } else {
//           response = ["123"]; // Default response
//         }
//       }

//       setLines((prevLines) => [
//         ...prevLines,
//         `user@hideon:~# ${inputValue}`,
//         ...response,
//       ]);

//       setInputValue("");
//     }
//   };

//   // Auto focus input field when clicking anywhere
//   const handleClick = () => {
//     inputRef.current.focus();
//   };

//   // Auto-scroll to the bottom whenever lines update
//   useEffect(() => {
//     consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [lines]);

//   return (
//     <div
//       className="console-container"
//       style={{ overflowY: "auto" }}
//       onClick={handleClick}
//     >
//       {lines.map((line, index) => (
//         <div key={index} className="console-line">
//           {line}
//         </div>
//       ))}

//       <div className="console-input-container">
//         {/* <span>user@hideon:~# </span> */}
//         <textarea
//           value={inputValue}
//           onChange={handleChange}
//           onKeyDown={handleKeyDown}
//           autoFocus
//           ref={inputRef}
//           className="console-input"
//           spellCheck="false"
//           autoCorrect="off"
//           autoCapitalize="off"
//           rows={3}
//         />
//       </div>

//       {/* Invisible div to ensure auto-scrolling */}
//       <div ref={consoleEndRef} />
//     </div>
//   );
// }







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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const trimmedInput = inputValue.slice(PROMPT.length).trim().toLowerCase();
      let response = [];

      if (trimmedInput === "man ciphers") {
        response = HELP_RESPONSE;
      } else if (trimmedInput === "cls" || trimmedInput === "clear") {
        setLines([""]); // Clear console
        setInputValue(PROMPT);
        return;
      } else {
        // Check if input is "<ciphername> --help"
        const parts = trimmedInput.split(" ");
        if (
          parts.length === 2 &&
          CIPHERS.includes(parts[0]) &&
          parts[1] === "--help"
        ) {
          const cipherName = parts[0];
          response = [
            "------------------------------------------------------------",
            `For encryption: ${cipherName} -e <plainText> -k <key>`,
            `For decryption: ${cipherName} -d <encryptedText> -k <key>`,
            "------------------------------------------------------------",
          ];
        } else {
          response = ["Command not recognized!"];
        }
      }

      setLines((prevLines) => [...prevLines, inputValue, ...response]);
      setInputValue(PROMPT);
    }

    // Prevent deleting prompt
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
        <div key={index} className="console-line">{line}</div>
      ))}

      <div className="console-input-container">
        {/* <span className="console-prompt">{PROMPT}</span> */}
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
