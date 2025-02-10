// import React, { useState, useRef } from "react";
// import "./console.css";

// export default function Console() {
//   const [lines, setLines] = useState([
//     "Welcome to HideOn console!",
//     "Use command man ciphers to see all commands.",
//     "",
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const inputRef = useRef(null);

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
//     "------------------------------------------------------------",
//     "Available Ciphers:",
//     "1. Caeser Cipher",
//     "2. Monoalphabetic Cipher",
//     "3. RailFence Cipher",
//     "4. Columnar Cipher",
//     "5. DoubleColumnar Cipher",
//     "6. Hill Cipher",
//     "7. Vigenere Cipher",
//     "8. Vernam Cipher",
//     "9. Autokey Cipher",
//     "10. Playfair Cipher",
//     "11. Feistel Cipher",
//     "12. AES (Advanced Encryption Standard)",
//     "13. DES (Data Encryption Standard)",
//     "------------------------------------------------------------",
//     "For information to use any of the given ciphers use the following command : ",
//     "<ciphername> --help",
//     "------------------------------------------------------------",
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
//         if (parts.length === 2 && CIPHERS.includes(parts[0]) && parts[1] === "--help") {
//           const cipherName = parts[0];
//           response = [
//             "------------------------------------------------------------",
//             `For encryption : ${cipherName} -e <plainText> <key>`,
//             `For decryption : ${cipherName} -d <encryptedText> <key>`,
//             "------------------------------------------------------------",
//           ];
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

//   return (
//     <div className="console" onClick={handleClick}>
//       {lines.map((line, index) => (
//         <div key={index}>{line}</div>
//       ))}

//       <div>
//         <span>user@hideon:~# </span>
//         <input
//           type="text"
//           value={inputValue}
//           onChange={handleChange}
//           onKeyDown={handleKeyDown}
//           autoFocus
//           ref={inputRef}
//           className="console-input"
//           spellCheck="false"
//           autoCorrect="off"
//           autoCapitalize="off"
//         />
//       </div>
//     </div>
//   );
// }







import React, { useState, useRef, useEffect } from "react";
import "./console.css";

export default function Console() {
  const [lines, setLines] = useState([
    "Welcome to HideOn console!",
    "Use command man ciphers to see all commands.",
    "",
  ]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const consoleEndRef = useRef(null); // Ref for auto-scrolling

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

  // General help response for ciphers
  const HELP_RESPONSE = [
    "------------------------------------------------------------",
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
    "------------------------------------------------------------",
    "For information to use any of the given ciphers use the following command :",
    "<ciphername> --help",
    "------------------------------------------------------------",
    "To clear the console enter the command :",
    "cls / clear",
    "------------------------------------------------------------",
  ];

  // Handle user input change
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const trimmedInput = inputValue.trim().toLowerCase();
      let response = [];

      if (trimmedInput === "man ciphers") {
        response = HELP_RESPONSE;
      } else if (trimmedInput === "cls" || trimmedInput === "clear") {
        setLines([""]); // Clear console
        setInputValue("");
        return;
      } else {
        // Check if input is "<ciphername> --help"
        const parts = trimmedInput.split(" ");
        if (parts.length === 2 && CIPHERS.includes(parts[0]) && parts[1] === "--help") {
          const cipherName = parts[0];
          response = [
            "------------------------------------------------------------",
            `For encryption : ${cipherName} -e <plainText> <key>`,
            `For decryption : ${cipherName} -d <encryptedText> <key>`,
            "------------------------------------------------------------",
          ];
        } else if (parts.length === 2 && CIPHERS.includes(parts[0]) || parts[1] === "--help") {
          response = ["Invalid cipher name entered !"]; // Default response
        } else {
          response = ["123"]; // Default response
        }
      }

      setLines((prevLines) => [
        ...prevLines,
        `user@hideon:~# ${inputValue}`,
        ...response,
      ]);

      setInputValue("");
    }
  };

  // Auto focus input field when clicking anywhere
  // const handleClick = () => {
  //   inputRef.current.focus();
  // };

  // Auto-scroll to the bottom whenever lines update
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div className="console" style={{ overflowY: "auto" }}>
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}

      <div>
        <span>user@hideon:~# </span>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
          ref={inputRef}
          className="console-input"
          spellCheck="false"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Invisible div to ensure auto-scrolling */}
      <div ref={consoleEndRef} />
    </div>
  );
}
