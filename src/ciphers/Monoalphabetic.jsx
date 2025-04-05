import React from "react";

export default function Monoalphabetic({ mode, text, key }) {
  key = key.trim()
  // Ensure key is valid (26 unique letters)
  if (!key || key.length !== 26 || new Set(key).size !== 26) {
    return (
      <div>
        Invalid key! The key must be exactly 26 unique letters.
      </div>
    );
  }

  const monoalphabeticCipher = (str, key, encrypt = true) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    // Create a mapping for encryption and decryption
    const keyMap = encrypt
      ? Object.fromEntries(alphabet.split("").map((ch, i) => [ch, key[i]]))
      : Object.fromEntries(key.split("").map((ch, i) => [ch, alphabet[i]]));

    return str
      .split("")
      .map((char) => {
        const lowerChar = char.toLowerCase();
        if (keyMap[lowerChar]) {
          const newChar = keyMap[lowerChar];
          return char === lowerChar ? newChar : newChar.toUpperCase(); // Preserve case
        }
        return char; // Keep spaces and special characters unchanged
      })
      .join("");
  };

  let result = "";
  if (mode === "encrypt") {
    result = monoalphabeticCipher(text, key, true); // Encrypt
  } else if (mode === "decrypt") {
    result = monoalphabeticCipher(text, key, false); // Decrypt
  } else {
    result = "Error: Invalid mode received! Expected '-e' or '-d'.";
  }

  return <div>Result: {result}</div>;
}
