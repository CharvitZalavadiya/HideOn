import React from "react";

export default function Vernam({ mode, text, key }) {
  // Verify the key is valid (same length as text and contains only alphabetic characters)
  if (!/^[a-zA-Z]+$/.test(key)) {
    return (
      <div>
        Invalid key! Must contain only alphabetic characters.
        <br />
        <br />
        Type `vernam --help` to get examples of key
      </div>
    );
  }

  if (key.length < text.length) {
    return (
      <div>
        Invalid key! Key must be at least as long as the plaintext.
        <br />
        <br />
        Type `vernam --help` to get examples of key
      </div>
    );
  }

  const vernamCipher = (str, key, encrypt = true) => {
    // Convert to uppercase for consistency
    str = str.toUpperCase();
    key = key.toUpperCase();

    let result = "";

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      
      // Skip non-alphabetic characters
      if (!/[A-Z]/.test(char)) {
        result += char;
        continue;
      }

      const charCode = char.charCodeAt(0) - 65; // A=0, B=1, etc.
      const keyCode = key[i].charCodeAt(0) - 65;

      let newCharCode;
      if (encrypt) {
        // Encryption: (plaintext + key) mod 26
        newCharCode = (charCode + keyCode) % 26;
      } else {
        // Decryption: (ciphertext - key + 26) mod 26
        newCharCode = (charCode - keyCode + 26) % 26;
      }

      result += String.fromCharCode(newCharCode + 65);
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

  return <div>Result : {result}</div>;
}