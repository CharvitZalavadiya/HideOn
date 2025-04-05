import React from "react";

export default function Hill({ mode, text, key }) {
  let result = "";

  try {
    // Convert key from string to a 2D array (matrix)
    const keyMatrix = JSON.parse(key);
    const matrixSize = keyMatrix.length;

    if (!Array.isArray(keyMatrix) || keyMatrix.some(row => row.length !== matrixSize)) {
      throw new Error("Invalid key! Must be a square matrix.");
    }

    // Check if the key matrix has an inverse
    const modInverseMatrix = invertMatrixMod26(keyMatrix);
    if (!modInverseMatrix) {
      result = "Warning: This key matrix CANNOT be used for decryption. It has no modular inverse.";
      return <div>Result: {result}</div>;
    }

    // Convert text to numbers (A = 0, B = 1, ..., Z = 25)
    const charToNum = (char) => char.toUpperCase().charCodeAt(0) - 65;
    const numToChar = (num) => String.fromCharCode((num % 26 + 26) % 26 + 65);

    const hillCipher = (str, keyMatrix, encrypt = true) => {
      let cleanText = text.replace(/[^A-Za-z]/g, "").toUpperCase(); // Remove spaces, numbers, symbols
      let n = keyMatrix.length;

      // Padding if text length isn't multiple of matrix size
      while (cleanText.length % n !== 0) {
        cleanText += "X";
      }

      // Convert text into numerical vectors
      let textVectors = [];
      for (let i = 0; i < cleanText.length; i += n) {
        textVectors.push(cleanText.slice(i, i + n).split("").map(charToNum));
      }

      // Matrix multiplication helper function
      const multiplyMatrix = (matrix, vector) => {
        return matrix.map(row => row.reduce((sum, val, idx) => sum + val * vector[idx], 0) % 26);
      };

      let resultVectors;
      if (encrypt) {
        resultVectors = textVectors.map(vector => multiplyMatrix(keyMatrix, vector));
      } else {
        resultVectors = textVectors.map(vector => multiplyMatrix(modInverseMatrix, vector));
      }

      // Convert numbers back to letters
      return resultVectors.flat().map(numToChar).join("");
    };

    if (mode === "encrypt") {
      result = hillCipher(text, keyMatrix, true);
    } else if (mode === "decrypt") {
      result = hillCipher(text, keyMatrix, false);
    } else {
      result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
    }
  } catch (error) {
    result = `Error executing hill cipher: ${error.message}`;
  }

  return <div>Result : {result}</div>;
}

// Helper function: Compute modular inverse of a matrix mod 26
function invertMatrixMod26(matrix) {
  const determinant = getDeterminant(matrix);
  const detMod26 = ((determinant % 26) + 26) % 26;
  const detInverse = modInverse(detMod26, 26);
  
  if (detInverse === null) return null; // If no modular inverse exists

  const adjugate = getAdjugate(matrix);
  return adjugate.map(row => row.map(value => ((value * detInverse) % 26 + 26) % 26));
}

// Helper function: Compute determinant of a matrix (supports 2x2 and 3x3)
function getDeterminant(matrix) {
  const n = matrix.length;
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  if (n === 3) {
    return (
      matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
      matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
      matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
    );
  }
  return null; // Not supporting larger matrices for simplicity
}

// Helper function: Compute adjugate (adjoint) matrix
function getAdjugate(matrix) {
  if (matrix.length === 2) {
    return [
      [matrix[1][1], -matrix[0][1]],
      [-matrix[1][0], matrix[0][0]]
    ];
  }
  return null; // Adjugate calculation for larger matrices not implemented
}

// Helper function: Compute modular inverse
function modInverse(a, m) {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
}
