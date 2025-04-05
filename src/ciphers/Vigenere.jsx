import React from "react";

export default function Vigenere({ mode, text, key }) {
  key = key.trim();

  const vigenereCipher = (text, key, encrypt = true) => {
    // Prepare cleaned uppercase key
    key = key.replace(/[^A-Za-z]/g, "").toUpperCase();
    if (key.length === 0) return "Invalid key! Key cannot be empty.";

    let result = "";
    let keyIndex = 0;
    let keyLength = key.length;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[A-Za-z]/.test(char)) {
        const isUpper = char === char.toUpperCase();
        const textCharCode = char.toUpperCase().charCodeAt(0) - 65;
        const keyCharCode = key.charCodeAt(keyIndex % keyLength) - 65;

        let newCharCode;
        if (encrypt) {
          newCharCode = (textCharCode + keyCharCode) % 26;
        } else {
          newCharCode = (textCharCode - keyCharCode + 26) % 26;
        }

        const base = isUpper ? 65 : 97;
        result += String.fromCharCode(newCharCode + base);
        keyIndex++;
      } else {
        result += char; // Preserve non-alphabetic characters as-is
      }
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
