import React from "react";

export default function Vernam({ mode, text, key }) {
  key = key.trim();

  // Validate key
  if (!/^[a-zA-Z]+$/.test(key)) {
    return <div>Invalid key! Must contain only alphabetic characters.</div>;
  }

  if (key.length < text.replace(/[^a-zA-Z]/g, "").length) {
    return <div>Invalid key! Key must be at least as long as the alphabetic characters in the plaintext.</div>;
  }

  const vernamCipher = (str, key, encrypt = true) => {
    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (/[a-zA-Z]/.test(char)) {
        const isUpper = char === char.toUpperCase();
        const textCode = char.toUpperCase().charCodeAt(0) - 65;
        const keyCode = key[keyIndex].toUpperCase().charCodeAt(0) - 65;

        let newCode;
        if (encrypt) {
          newCode = (textCode + keyCode) % 26;
        } else {
          newCode = (textCode - keyCode + 26) % 26;
        }

        const base = isUpper ? 65 : 97;
        result += String.fromCharCode(newCode + base);
        keyIndex++;
      } else {
        result += char; // Keep spaces, punctuation etc.
      }
    }

    return result;
  };

  let result;
  if (mode === "encrypt") {
    result = vernamCipher(text, key, true);
  } else if (mode === "decrypt") {
    result = vernamCipher(text, key, false);
  } else {
    result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
  }

  return <div>Result: {result}</div>;
}
