import React from "react";

export default function Railfence({ mode, text, key }) {
  const rails = parseInt(key, 10);
  if (isNaN(rails) || rails < 2)
    return (
      <div>
        Invalid key! Must be a number greater than or equal to 2.
        <br />
        <br />
        Type `railfence --help` to get examples of key
      </div>
    );

  // Updated function for Rail Fence Cipher
  const railFenceCipher = (str, key, encrypt = true) => {
    if (!encrypt) return railFenceDecrypt(str, key); // Call decryption if mode is decrypt

    let rail = Array.from({ length: key }, () => []);
    let row = 0,
      direction = 1;

    // Arrange text in a zigzag pattern
    for (let char of str) {
      rail[row].push(char);
      if (row === 0) direction = 1;
      if (row === key - 1) direction = -1;
      row += direction;
    }

    // Read row-wise to form ciphertext
    return rail.flat().join("");
  };

  // Function to decrypt Rail Fence Cipher
  const railFenceDecrypt = (ciphertext, key) => {
    let railPattern = Array.from({ length: key }, () => []);
    let row = 0,
      direction = 1;

    // Mark the zigzag pattern
    for (let i = 0; i < ciphertext.length; i++) {
      railPattern[row].push("*");
      if (row === 0) direction = 1;
      if (row === key - 1) direction = -1;
      row += direction;
    }

    // Fill in the ciphertext
    let index = 0;
    for (let i = 0; i < key; i++) {
      for (let j = 0; j < railPattern[i].length; j++) {
        railPattern[i][j] = ciphertext[index++];
      }
    }

    // Read zigzag pattern to reconstruct original text
    let result = "";
    row = 0;
    direction = 1;
    for (let i = 0; i < ciphertext.length; i++) {
      result += railPattern[row].shift();
      if (row === 0) direction = 1;
      if (row === key - 1) direction = -1;
      row += direction;
    }

    return result;
  };

  let result;
  if (mode === "encrypt") {
    result = railFenceCipher(text, rails, true);
  } else if (mode === "decrypt") {
    result = railFenceDecrypt(text, rails, false);
  } else {
    result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
  }

  return <div>Result : {result}</div>;
}
