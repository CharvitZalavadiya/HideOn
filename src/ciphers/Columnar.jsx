import React from "react";

export default function Columnar({ mode, text, key }) {
  let result = "";

  try {
    // Trim and validate key
    key = key.trim();
    if (!/^\d+$/.test(key)) throw new Error("Key must contain only numbers.");

    const keyArr = key.split("").map(Number);
    const keyLength = keyArr.length;

    // Check if key contains all digits from 1 to keyLength exactly once
    const isValidKey =
      new Set(keyArr).size === keyLength &&
      keyArr.every((val) => val >= 1 && val <= keyLength);
    if (!isValidKey) throw new Error(`Invalid key! It must be a permutation of digits from 1 to ${keyLength}`);

    // Map key digits to column indices
    const sortedKey = [...keyArr].slice().sort((a, b) => a - b);
    const columnOrder = keyArr.map((k) => sortedKey.indexOf(k));

    const buildMatrix = (input, cols) => {
      const chars = input.split("");
      const rows = Math.ceil(chars.length / cols);
      const matrix = Array.from({ length: rows }, () => new Array(cols).fill(" "));
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (idx < chars.length) matrix[r][c] = chars[idx++];
        }
      }
      return matrix;
    };

    const encrypt = (plaintext) => {
      const matrix = buildMatrix(plaintext, keyLength);
      let encrypted = "";
      for (let c = 0; c < keyLength; c++) {
        const actualCol = columnOrder.indexOf(c);
        for (let r = 0; r < matrix.length; r++) {
          encrypted += matrix[r][actualCol];
        }
      }
      return encrypted;
    };

    const decrypt = (cipherText) => {
      const totalChars = cipherText.length;
      const rows = Math.ceil(totalChars / keyLength);
      const matrix = Array.from({ length: rows }, () => new Array(keyLength).fill(""));

      const colHeights = Array(keyLength).fill(Math.floor(totalChars / keyLength));
      const extra = totalChars % keyLength;

      for (let i = 0; i < extra; i++) {
        const idx = columnOrder.indexOf(i);
        colHeights[idx]++;
      }

      let idx = 0;
      for (let c = 0; c < keyLength; c++) {
        const actualCol = columnOrder.indexOf(c);
        for (let r = 0; r < colHeights[c]; r++) {
          matrix[r][actualCol] = cipherText[idx++];
        }
      }

      return matrix.flat().join("");
    };

    result = mode === "encrypt" ? encrypt(text) : decrypt(text);
  } catch (error) {
    result = `${error.message}`;
  }

  return (
    <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
      Result: {result}
    </div>
  );
}
