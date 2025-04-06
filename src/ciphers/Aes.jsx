import React from "react";
import CryptoJS from "crypto-js";

export default function AES({ mode, text, key }) {
  key = key.trim();

  let result;

  try {
    if (!key) throw new Error("Key is required for AES encryption/decryption.");

    if (mode === "encrypt") {
      const encrypted = CryptoJS.AES.encrypt(text, key).toString();
      result = encrypted;
    } else if (mode === "decrypt") {
      const decryptedBytes = CryptoJS.AES.decrypt(text, key);
      const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) throw new Error("Decryption failed. Check your key or ciphertext.");
      result = decrypted;
    } else {
      result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
    }
  } catch (error) {
    result = `Error: ${error.message}`;
  }

  return <div>Result: {result}</div>;
}
