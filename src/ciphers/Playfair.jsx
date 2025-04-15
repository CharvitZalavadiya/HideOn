import React from "react";

export default function Playfair({ mode, text, key }) {
  const originalText = text;

  key = key.trim().toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");

  const originalChars = [];
  text
    .split("")
    .forEach((char) => {
      originalChars.push({ char, isLower: char === char.toLowerCase() });
    });

  if (!key) {
    return <div>Invalid key! Only letters A–Z are allowed.</div>;
  }

  if (!text || !/[A-Za-z]/.test(text)) {
    return <div>Invalid plaintext! Only alphabetic characters allowed.</div>;
  }

  const generateMatrix = (key) => {
    const seen = new Set();
    const matrix = [];

    key.split("").forEach((char) => {
      if (!seen.has(char)) {
        seen.add(char);
        matrix.push(char);
      }
    });

    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode(65 + i);
      if (char !== "J" && !seen.has(char)) {
        seen.add(char);
        matrix.push(char);
      }
    }

    return matrix;
  };

  const getPosition = (matrix, char) => {
    const index = matrix.indexOf(char);
    return [Math.floor(index / 5), index % 5];
  };

  const prepareDigraphs = (text) => {
    let processed = text
      .replace(/[^A-Za-z]/g, "")
      .replace(/j/g, "i")
      .toUpperCase();

    let digraphs = [];
    let i = 0;

    while (i < processed.length) {
      let first = processed[i++];
      let second = processed[i] || "X";

      if (first === second) {
        digraphs.push([first, "X"]);
        // Don't increment i to process the second char again
      } else {
        digraphs.push([first, second]);
        i++;
      }
    }

    return digraphs;
  };

  const playfairCipher = (text, key, encrypt = true) => {
    const matrix = generateMatrix(key);
    const digraphs = prepareDigraphs(text);

    let result = "";

    digraphs.forEach(([a, b]) => {
      const [row1, col1] = getPosition(matrix, a);
      const [row2, col2] = getPosition(matrix, b);

      if (row1 === row2) {
        result += matrix[row1 * 5 + ((col1 + (encrypt ? 1 : 4)) % 5)];
        result += matrix[row2 * 5 + ((col2 + (encrypt ? 1 : 4)) % 5)];
      } else if (col1 === col2) {
        result += matrix[((row1 + (encrypt ? 1 : 4)) % 5) * 5 + col1];
        result += matrix[((row2 + (encrypt ? 1 : 4)) % 5) * 5 + col2];
      } else {
        result += matrix[row1 * 5 + col2];
        result += matrix[row2 * 5 + col1];
      }
    });

    return result;
  };

  const applyCasingAndSpacing = (rawOutput, originalText) => {
    let finalResult = "";
    let rawIndex = 0;

    for (let i = 0; i < originalText.length; i++) {
      const char = originalText[i];
      if (!/[A-Za-z]/.test(char)) {
        finalResult += char;
      } else {
        const isLower = char === char.toLowerCase();
        const outputChar = rawOutput[rawIndex++] || "";
        finalResult += isLower ? outputChar.toLowerCase() : outputChar;
      }
    }

    // Add remaining characters (like padding 'X') in original casing (default to uppercase)
    while (rawIndex < rawOutput.length) {
      finalResult += rawOutput[rawIndex++];
    }

    return finalResult;
  };

  let result;

  if (mode === "encrypt") {
    const encrypted = playfairCipher(text, key, true);
    result = applyCasingAndSpacing(encrypted, originalText);
  } else if (mode === "decrypt") {
    const decrypted = playfairCipher(text, key, false);
    result = applyCasingAndSpacing(decrypted, originalText);
  } else {
    result = "Invalid mode! Use 'encrypt' or 'decrypt'.";
  }

  return <div>Result: {result}</div>;
}
