// import React from "react";

// export default function Hill({ mode, text, key }) {
//   key = key.trim()
//   let result = "";

//   try {
//     // Convert key from string to a 2D array (matrix)
//     const keyMatrix = JSON.parse(key);
//     const matrixSize = keyMatrix.length;

//     if (!Array.isArray(keyMatrix) || keyMatrix.some(row => row.length !== matrixSize)) {
//       throw new Error("Invalid key! Must be a square matrix.");
//     }

//     // Check if the key matrix has an inverse
//     const modInverseMatrix = invertMatrixMod26(keyMatrix);
//     if (!modInverseMatrix) {
//       result = "Warning: This key matrix CANNOT be used for decryption. It has no modular inverse.";
//       return <div>Result: {result}</div>;
//     }

//     // Convert text to numbers (A = 0, B = 1, ..., Z = 25)
//     const charToNum = (char) => char.toUpperCase().charCodeAt(0) - 65;
//     const numToChar = (num) => String.fromCharCode((num % 26 + 26) % 26 + 65);

//     const hillCipher = (str, keyMatrix, encrypt = true) => {
//       let cleanText = text.replace(/[^A-Za-z]/g, "").toUpperCase(); // Remove spaces, numbers, symbols
//       let n = keyMatrix.length;

//       // Padding if text length isn't multiple of matrix size
//       while (cleanText.length % n !== 0) {
//         cleanText += "X";
//       }

//       // Convert text into numerical vectors
//       let textVectors = [];
//       for (let i = 0; i < cleanText.length; i += n) {
//         textVectors.push(cleanText.slice(i, i + n).split("").map(charToNum));
//       }

//       // Matrix multiplication helper function
//       const multiplyMatrix = (matrix, vector) => {
//         return matrix.map(row => row.reduce((sum, val, idx) => sum + val * vector[idx], 0) % 26);
//       };

//       let resultVectors;
//       if (encrypt) {
//         resultVectors = textVectors.map(vector => multiplyMatrix(keyMatrix, vector));
//       } else {
//         resultVectors = textVectors.map(vector => multiplyMatrix(modInverseMatrix, vector));
//       }

//       // Convert numbers back to letters
//       return resultVectors.flat().map(numToChar).join("");
//     };

//     if (mode === "encrypt") {
//       result = hillCipher(text, keyMatrix, true);
//     } else if (mode === "decrypt") {
//       result = hillCipher(text, keyMatrix, false);
//     } else {
//       result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
//     }
//   } catch (error) {
//     result = `Error executing hill cipher: ${error.message}`;
//   }

//   return <div>Result : {result}</div>;
// }

// // Helper function: Compute modular inverse of a matrix mod 26
// function invertMatrixMod26(matrix) {
//   const determinant = getDeterminant(matrix);
//   const detMod26 = ((determinant % 26) + 26) % 26;
//   const detInverse = modInverse(detMod26, 26);
  
//   if (detInverse === null) return null; // If no modular inverse exists

//   const adjugate = getAdjugate(matrix);
//   return adjugate.map(row => row.map(value => ((value * detInverse) % 26 + 26) % 26));
// }

// // Helper function: Compute determinant of a matrix (supports 2x2 and 3x3)
// function getDeterminant(matrix) {
//   const n = matrix.length;
//   if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
//   if (n === 3) {
//     return (
//       matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
//       matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
//       matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
//     );
//   }
//   return null; // Not supporting larger matrices for simplicity
// }

// // Helper function: Compute adjugate (adjoint) matrix
// function getAdjugate(matrix) {
//   if (matrix.length === 2) {
//     return [
//       [matrix[1][1], -matrix[0][1]],
//       [-matrix[1][0], matrix[0][0]]
//     ];
//   }
//   return null; // Adjugate calculation for larger matrices not implemented
// }

// // Helper function: Compute modular inverse
// function modInverse(a, m) {
//   for (let x = 1; x < m; x++) {
//     if ((a * x) % m === 1) return x;
//   }
//   return null;
// }





























import React from "react";

export default function Hill({ mode, text, key }) {
  key = key.trim();
  let result = "";

  try {
    const keyMatrix = JSON.parse(key);
    const matrixSize = keyMatrix.length;

    // Validate matrix is square
    if (!Array.isArray(keyMatrix) || keyMatrix.some(row => row.length !== matrixSize)) {
      throw new Error("Invalid key! Must be a square matrix.");
    }

    // Try computing modular inverse matrix
    const modInverseMatrix = invertMatrixMod26(keyMatrix);
    const inverseExists = modInverseMatrix !== null;

    // If encrypting but key has no inverse, warn early
    if (mode === "encrypt" && !inverseExists) {
      throw new Error("This key matrix can encrypt but NOT decrypt (no modular inverse exists).");
    }

    const charToNum = (char) => char.toUpperCase().charCodeAt(0) - 65;
    const numToChar = (num, isUpper) => {
      const base = isUpper ? 65 : 97;
      return String.fromCharCode(((num % 26 + 26) % 26) + base);
    };

    const hillCipher = (inputText, matrix, encrypt = true) => {
      const originalCases = inputText.split("").map(c => /[A-Z]/.test(c));

      const cleanText = inputText.replace(/[^A-Za-z]/g, "");
      const n = matrix.length;

      let paddedText = cleanText;
      while (paddedText.length % n !== 0) {
        paddedText += "X";
        originalCases.push(true); // Default X is capital
      }

      const vectors = [];
      for (let i = 0; i < paddedText.length; i += n) {
        vectors.push(paddedText.slice(i, i + n).split("").map(charToNum));
      }

      const multiplyMatrix = (mat, vec) =>
        mat.map(row =>
          row.reduce((sum, val, idx) => sum + val * vec[idx], 0) % 26
        );

      const usedMatrix = encrypt ? matrix : modInverseMatrix;
      const resultVectors = vectors.map(vector => multiplyMatrix(usedMatrix, vector));
      const resultNums = resultVectors.flat();

      return resultNums.map((num, i) =>
        numToChar(num, originalCases[i])
      ).join("");
    };

    if (mode === "encrypt") {
      result = hillCipher(text, keyMatrix, true);
    } else if (mode === "decrypt") {
      if (!inverseExists) {
        result = "Warning: This key matrix CANNOT be used for decryption. It has no modular inverse.";
      } else {
        result = hillCipher(text, keyMatrix, false);
      }
    } else {
      result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
    }
  } catch (error) {
    result = `${error.message}`;
  }

  return <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>Result: {result}</div>;
}

// Modular inverse of a number mod m
function modInverse(a, m) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
}

// Determinant of NxN matrix (recursive)
function getDeterminant(matrix) {
  const n = matrix.length;
  if (n === 1) return matrix[0][0];
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  let det = 0;
  for (let col = 0; col < n; col++) {
    const minor = matrix.slice(1).map(row => row.filter((_, i) => i !== col));
    det += (col % 2 === 0 ? 1 : -1) * matrix[0][col] * getDeterminant(minor);
  }
  return det;
}

// Adjugate of matrix
function getAdjugate(matrix) {
  const n = matrix.length;
  const adj = Array.from({ length: n }, () => new Array(n));

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const minor = matrix
        .filter((_, i) => i !== r)
        .map(row => row.filter((_, j) => j !== c));
      const sign = (r + c) % 2 === 0 ? 1 : -1;
      adj[c][r] = sign * getDeterminant(minor); // Transpose
    }
  }

  return adj;
}

// Full matrix inverse mod 26
function invertMatrixMod26(matrix) {
  const det = getDeterminant(matrix);
  const detMod26 = ((det % 26) + 26) % 26;
  const invDet = modInverse(detMod26, 26);

  if (invDet === null) return null;

  const adj = getAdjugate(matrix);
  return adj.map(row => row.map(val => ((val * invDet) % 26 + 26) % 26));
}
