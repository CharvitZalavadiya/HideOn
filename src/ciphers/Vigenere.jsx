import React from "react";

export default function Vigenere({ mode, text, key }) {
  // Function to process Vigenère Cipher
  const vigenereCipher = (text, key, encrypt = true) => {
    text = text.replace(/[^A-Za-z]/g, "").toUpperCase(); // Convert text to uppercase and remove non-alphabetic characters
    key = key.replace(/[^A-Za-z]/g, "").toUpperCase(); // Convert key to uppercase and remove non-alphabetic characters

    if (key.length === 0) return "Invalid key! Key cannot be empty.";

    let result = "";
    let keyIndex = 0;
    let keyLength = key.length;

    for (let i = 0; i < text.length; i++) {
      let textChar = text.charCodeAt(i) - 65; // Convert character to 0-25 range
      let keyChar = key.charCodeAt(keyIndex % keyLength) - 65; // Get key character (cycling through)

      let newChar;
      if (encrypt) {
        newChar = (textChar + keyChar) % 26; // Encrypt character
      } else {
        newChar = (textChar - keyChar + 26) % 26; // Decrypt character
      }

      result += String.fromCharCode(newChar + 65); // Convert back to letter
      keyIndex++;
    }
    return result;
  };

  let result;
  if (mode === "encrypt") {
    result = vigenereCipher(text, key, true);
  } else if (mode === "decrypt") {
    result = vigenereCipher(text, key, false);
  } else {
    result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
  }

  return <div>Result: {result}</div>;
}
