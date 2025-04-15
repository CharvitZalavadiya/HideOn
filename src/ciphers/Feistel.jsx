import React from "react";

const ROUNDS = 8;
const BLOCKSIZE = 8;

export default function Feistel({ mode, text, key }) {
  key = key.trim();
  if (!key) {
    return <div>Invalid key! Key must be a non-empty string.</div>;
  }

  // 🔐 Base64 utilities
  const base64Encode = (str) => btoa(str);
  const base64Decode = (str) => atob(str);

  const chunkString = (str, size) => {
    const chunks = [];
    for (let i = 0; i < str.length; i += size) {
      chunks.push(str.slice(i, i + size));
    }
    return chunks;
  };

  const xorStrings = (a, b) => {
    let result = "";
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      result += String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i));
    }
    return result;
  };

  const generateRoundKey = (key, round) => {
    // Simple round key generation using a hash-like approach
    let roundKey = "";
    for (let i = 0; i < key.length; i++) {
      roundKey += String.fromCharCode((key.charCodeAt(i) + round) % 256);
    }
    return roundKey.slice(0, BLOCKSIZE / 2);
  };

  const scramble = (x, roundKey) => {
    // Simple scrambling function using XOR
    return xorStrings(x, roundKey);
  };

  const encryptMessage = (key, message) => {
    let ciphertext = "";
    let blocks = chunkString(message, BLOCKSIZE);

    // Pad the last block with spaces (PKCS#7 padding can also be used)
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock.length < BLOCKSIZE) {
      blocks[blocks.length - 1] = lastBlock.padEnd(BLOCKSIZE, " ");
    }

    for (let block of blocks) {
      let L = Array(ROUNDS + 1).fill("");
      let R = Array(ROUNDS + 1).fill("");

      L[0] = block.slice(0, BLOCKSIZE / 2);
      R[0] = block.slice(BLOCKSIZE / 2);

      for (let i = 1; i <= ROUNDS; i++) {
        const roundKey = generateRoundKey(key, i);
        L[i] = R[i - 1];
        R[i] = xorStrings(L[i - 1], scramble(R[i - 1], roundKey));
      }

      ciphertext += L[ROUNDS] + R[ROUNDS];
    }

    return ciphertext;
  };

  const decryptMessage = (key, ciphertext) => {
    let message = "";
    let blocks = chunkString(ciphertext, BLOCKSIZE);

    for (let block of blocks) {
      let L = Array(ROUNDS + 1).fill("");
      let R = Array(ROUNDS + 1).fill("");

      L[ROUNDS] = block.slice(0, BLOCKSIZE / 2);
      R[ROUNDS] = block.slice(BLOCKSIZE / 2);

      for (let i = ROUNDS; i > 0; i--) {
        const roundKey = generateRoundKey(key, i);
        R[i - 1] = L[i];
        L[i - 1] = xorStrings(R[i], scramble(L[i], roundKey));
      }

      message += L[0] + R[0];
    }

    return message.trim(); // Remove padding
  };

  let result;
  try {
    if (mode === "encrypt") {
      const rawCipher = encryptMessage(key, text);
      result = base64Encode(rawCipher); // Return base64-encoded string
    } else if (mode === "decrypt") {
      const decoded = base64Decode(text);
      result = decryptMessage(key, decoded);
    } else {
      result = "Invalid mode! Use 'encrypt' or 'decrypt'.";
    }
  } catch (e) {
    result = "Error: " + e.message;
  }

  return <div>Result: {result}</div>;
}