import React from "react";

export default function Caeser({ mode, text, key }) {
  const shift = parseInt(key, 10);
  if (isNaN(shift))
    return (
      <div>
        Invalid key! Must be a number.
        <br />
        <br />
        Type `caeser --help` to get examples of key
      </div>
    );

  const caesarCipher = (str, key, encrypt = true) => {
    // Ensure shift is within valid range (0-25)
    key = (((encrypt ? key : -key) % 26) + 26) % 26;

    return str
      .split("")
      .map((char) => {
        if (/[a-z]/i.test(char)) {
          const code = char.charCodeAt(0);
          const offset = code >= 65 && code <= 90 ? 65 : 97; // Determine uppercase/lowercase
          return String.fromCharCode(((code - offset + key) % 26) + offset);
        }
        return char; // Return unchanged for non-alphabetic characters
      })
      .join("");
  };

  let result;
  if (mode === "encrypt") {
    result = caesarCipher(text, key, true);
  } else if (mode === "decrypt") {
    result = caesarCipher(text, key, false);
  } else {
    result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
  }

  return <div>Result : {result}</div>;
}
