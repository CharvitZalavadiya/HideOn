import React from "react";

export default function Playfair({ mode, text, key }) {
  // Clean key and text for processing
  const originalText = text; // preserve original for case matching
  key = key.trim().toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
  
  // Track original characters and their indices
  const originalChars = [];
  const cleanText = text.replace(/[^A-Za-z]/g, "").replace(/j/g, "i").split("").map((char, index) => {
    originalChars.push({char, isLower: char === char.toLowerCase()});
    return char.toUpperCase();
  }).join("");

  if (!key) {
    return <div>Invalid key! Only letters A–Z are allowed.</div>;
  }

  if (!cleanText) {
    return <div>Invalid plaintext! Only alphabetic characters (A–Z or a–z) allowed.</div>;
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

  const preprocess = (text) => {
    const upperText = text.toUpperCase();
    let digraphs = [];
    let i = 0;
    
    while (i < upperText.length) {
      let first = upperText[i];
      i++;
      
      if (i >= upperText.length) {
        digraphs.push([first, "X"]);
        break;
      }
      
      let second = upperText[i];
      
      if (first === second) {
        digraphs.push([first, "X"]);
      } else {
        digraphs.push([first, second]);
        i++;
      }
    }
    
    return digraphs;
  };

  const playfairCipher = (text, key, encrypt = true) => {
    const matrix = generateMatrix(key);
    const digraphs = encrypt
      ? preprocess(text)
      : text.match(/.{1,2}/g).map((pair) => pair.split(""));
    
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

  const removeFillers = (decryptedText) => {
    // First pass: remove X between repeated letters
    let cleaned = "";
    for (let i = 0; i < decryptedText.length; i++) {
      const char = decryptedText[i];
      if (i % 2 === 1 && char === 'X' && 
          i + 1 < decryptedText.length && 
          decryptedText[i - 1] === decryptedText[i + 1]) {
        continue;
      }
      cleaned += char;
    }
    
    // Second pass: remove trailing X if present
    if (cleaned.length % 2 === 1 && cleaned[cleaned.length - 1] === 'X') {
      cleaned = cleaned.slice(0, -1);
    }
    
    return cleaned;
  };

  const applyCasing = (processedText) => {
    let result = "";
    let j = 0;
    
    for (let i = 0; i < processedText.length && j < originalChars.length; i++) {
      const currentChar = processedText[i];
      if (originalChars[j]) {
        result += originalChars[j].isLower ? currentChar.toLowerCase() : currentChar;
        j++;
      } else {
        // If we run out of original characters, keep uppercase
        result += currentChar;
      }
    }
    
    // If there are remaining characters in the processed text
    if (i < processedText.length) {
      result += processedText.substring(i);
    }
    
    return result;
  };

  let result;
  if (mode === "encrypt") {
    const encrypted = playfairCipher(cleanText, key, true);
    
    // Apply original casing pattern to the encrypted text
    let finalResult = "";
    let origIndex = 0;
    
    for (let i = 0; i < encrypted.length; i++) {
      // Find next alphabetic character in original text
      while (origIndex < originalText.length && !/[A-Za-z]/i.test(originalText[origIndex])) {
        finalResult += originalText[origIndex];
        origIndex++;
      }
      
      // Apply the case of the original character to the encrypted character
      if (origIndex < originalText.length) {
        finalResult += originalText[origIndex].toLowerCase() === originalText[origIndex] 
          ? encrypted[i].toLowerCase() 
          : encrypted[i].toUpperCase();
        origIndex++;
      } else {
        // Default to uppercase if we run out of original characters
        finalResult += encrypted[i];
      }
    }
    
    // Add any remaining non-alphabetic characters from the original text
    while (origIndex < originalText.length) {
      finalResult += originalText[origIndex];
      origIndex++;
    }
    
    result = finalResult;
  } else if (mode === "decrypt") {
    const decrypted = playfairCipher(cleanText, key, false);
    const cleaned = removeFillers(decrypted);
    
    // Apply original casing pattern to the decrypted text
    let finalResult = "";
    let origIndex = 0;
    
    for (let i = 0; i < cleaned.length; i++) {
      // Find next alphabetic character in original text
      while (origIndex < originalText.length && !/[A-Za-z]/i.test(originalText[origIndex])) {
        finalResult += originalText[origIndex];
        origIndex++;
      }
      
      // Apply the case of the original character to the decrypted character
      if (origIndex < originalText.length) {
        finalResult += originalText[origIndex].toLowerCase() === originalText[origIndex] 
          ? cleaned[i].toLowerCase() 
          : cleaned[i].toUpperCase();
        origIndex++;
      } else {
        // Default to uppercase if we run out of original characters
        finalResult += cleaned[i];
      }
    }
    
    // Add any remaining non-alphabetic characters from the original text
    while (origIndex < originalText.length) {
      finalResult += originalText[origIndex];
      origIndex++;
    }
    
    result = finalResult;
  } else {
    result = "Invalid mode! Use 'encrypt' for encryption or 'decrypt' for decryption.";
  }

  return <div>Result: {result}</div>;
}