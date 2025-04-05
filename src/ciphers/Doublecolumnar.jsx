import React from "react";

export default function DoubleColumnar({ mode, text, key }) {
  let result = "";

  try {
    // === Step 1: Preprocess and Validate Keys ===
    const [key1, key2] = key.trim().split(/\s+/); // Split by whitespace
    if (!key1 || !key2) throw new Error("Please provide two valid keys separated by a space.");

    const validateKey = (k) => {
      if (!/^\d+$/.test(k)) throw new Error("Keys must contain only numbers.");
      const arr = k.split("").map(Number);
      const len = arr.length;
      const isValid =
        new Set(arr).size === len &&
        arr.every((val) => val >= 1 && val <= len);
      if (!isValid) throw new Error(`Key ${k} must be a permutation of digits from 1 to ${len}`);
      return arr;
    };

    const keyArr1 = validateKey(key1);
    const keyArr2 = validateKey(key2);

    const getColumnOrder = (arr) => {
      const sorted = [...arr].sort((a, b) => a - b);
      return arr.map((val) => sorted.indexOf(val));
    };

    const colOrder1 = getColumnOrder(keyArr1);
    const colOrder2 = getColumnOrder(keyArr2);

    // === Step 2: Columnar Matrix Builder ===
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

    // === Step 3: Encryption Function ===
    const columnarEncrypt = (plainText, keyArr, colOrder) => {
      const matrix = buildMatrix(plainText, keyArr.length);
      let encrypted = "";
      for (let c = 0; c < keyArr.length; c++) {
        const actualCol = colOrder.indexOf(c);
        for (let r = 0; r < matrix.length; r++) {
          encrypted += matrix[r][actualCol];
        }
      }
      return encrypted;
    };

    // === Step 4: Decryption Function ===
    const columnarDecrypt = (cipherText, keyArr, colOrder) => {
      const totalChars = cipherText.length;
      const rows = Math.ceil(totalChars / keyArr.length);
      const matrix = Array.from({ length: rows }, () => new Array(keyArr.length).fill(""));

      const colHeights = Array(keyArr.length).fill(Math.floor(totalChars / keyArr.length));
      const extra = totalChars % keyArr.length;

      for (let i = 0; i < extra; i++) {
        const idx = colOrder.indexOf(i);
        colHeights[idx]++;
      }

      let idx = 0;
      for (let c = 0; c < keyArr.length; c++) {
        const actualCol = colOrder.indexOf(c);
        for (let r = 0; r < colHeights[c]; r++) {
          matrix[r][actualCol] = cipherText[idx++];
        }
      }

      return matrix.flat().join("");
    };

    // === Step 5: Double Encryption or Decryption ===
    if (mode === "encrypt") {
      const first = columnarEncrypt(text, keyArr1, colOrder1);
      const second = columnarEncrypt(first, keyArr2, colOrder2);
      result = second;
    } else if (mode === "decrypt") {
      const first = columnarDecrypt(text, keyArr2, colOrder2);
      const second = columnarDecrypt(first, keyArr1, colOrder1);
      result = second;
    } else {
      result = "Invalid mode! Use 'encrypt' or 'decrypt'.";
    }

  } catch (error) {
    result = `${error.message}`;
  }

  return (
    <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
      Result: {result}
    </div>
  );
}
