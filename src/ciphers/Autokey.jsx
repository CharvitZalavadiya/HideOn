import React from "react";

export default function Autokey({ mode, text, key }) {
  key = key.trim().toUpperCase();
  const isAlpha = /^[A-Z]+$/;

  if (!isAlpha.test(key)) {
    return <div>Invalid key! Must contain only alphabetic characters.</div>;
  }

  const generateKey = (text, key, encrypt = true) => {
    let cleanText = text.replace(/[^A-Za-z]/g, "").toUpperCase();
    return encrypt
      ? (key + cleanText).slice(0, cleanText.length)
      : key; // For decryption, the key is built dynamically
  };

  const autokeyCipher = (str, key, encrypt = true) => {
    let result = "";
    let keyStream = encrypt ? generateKey(str, key, true) : key;
    let keyIndex = 0;

    for (let i = 0; i < str.length; i++) {
      let char = str[i];
      if (/[a-z]/i.test(char)) {
        const isUpper = char === char.toUpperCase();
        const base = isUpper ? 65 : 97;
        const charCode = char.toUpperCase().charCodeAt(0) - 65;
        const keyCharCode = keyStream[keyIndex].charCodeAt(0) - 65;

        let shifted;
        if (encrypt) {
          shifted = (charCode + keyCharCode) % 26;
        } else {
          shifted = (charCode - keyCharCode + 26) % 26;
        }

        const newChar = String.fromCharCode(base + shifted);
        result += newChar;
        keyIndex++;

        if (!encrypt && keyIndex < str.replace(/[^A-Za-z]/g, "").length) {
          keyStream += newChar.toUpperCase(); // build the key dynamically
        }
      } else {
        result += char;
      }
    }

    return result;
  };

  let result;
  if (mode === "encrypt") {
    result = autokeyCipher(text, key, true);
  } else if (mode === "decrypt") {
    result = autokeyCipher(text, key, false);
  } else {
    result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
  }

  return <div>Result : {result}</div>;
}
