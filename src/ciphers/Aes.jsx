import React from "react";
import CryptoJS from "crypto-js";

export default function AES({ mode, text, key }) {
  key = key.trim();
  let result;
  try {
    const isValidHex = /^[0-9a-fA-F]+$/.test(key);
    const validLengths = [32, 48, 64]; // 128/192/256-bit hex

    if (!isValidHex || !validLengths.includes(key.length)) {
      throw new Error("Key must be a 128/192/256-bit hex value.");
    }

    const keyWA = CryptoJS.enc.Hex.parse(key);
    const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

    if (mode === "encrypt") {
      const encrypted = CryptoJS.AES.encrypt(text, keyWA, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Only return Base64 ciphertext (no salt/headers)
      result = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    } else if (mode === "decrypt") {
      // Convert Base64 string to CipherParams format
      const encryptedCP = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(text)
      });

      const decrypted = CryptoJS.AES.decrypt(encryptedCP, keyWA, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);

      if (!decrypted) throw new Error("Decryption failed. Check your key or ciphertext.");

      result = decrypted;
    } else {
      result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
    }
  } catch (err) {
    result = `Error: ${err.message}`;
  }

  return <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>Result: {result}</div>;
}
