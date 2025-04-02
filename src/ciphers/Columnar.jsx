import React from "react";

export default function Columnar({ mode, text, key }) {
  let result = "";

  try {
    // Convert key into an array of numbers
    const keyArr = key.split("").map(Number);
    const keyLength = keyArr.length;

    if (keyArr.some(isNaN)) {
      throw new Error("Invalid key! Only numeric keys are allowed.");
    }

    // Assign column indices based on key's numerical order
    const sortedKey = [...keyArr].sort((a, b) => a - b);
    const columnOrder = keyArr.map((num) => sortedKey.indexOf(num));

    const columnarCipher = (str, keyArr, encrypt = true) => {
      str = str.replace(/\s+/g, ""); // Remove spaces
      let textArr = str.split("");

      if (encrypt) {
        // Create grid with key length columns (no extra padding)
        let numRows = Math.ceil(textArr.length / keyLength);
        let grid = Array.from({ length: numRows }, () => new Array(keyLength).fill(""));

        // Fill the grid row-wise
        let index = 0;
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < keyLength; col++) {
            if (index < textArr.length) {
              grid[row][col] = textArr[index++];
            }
          }
        }

        // Read columns in key's ascending order
        return columnOrder.map((col) => grid.map((row) => row[col]).join("")).join("");
      } else {
        // Decrypting: Calculate number of full columns
        let numRows = Math.ceil(textArr.length / keyLength);
        let numCols = keyLength;
        let fullCols = textArr.length % keyLength;
        let columnHeights = new Array(numCols).fill(Math.floor(textArr.length / keyLength));

        // Adjust heights for shorter columns
        for (let i = 0; i < fullCols; i++) {
          columnHeights[sortedKey.indexOf(keyArr[i])] += 1;
        }

        // Fill columns based on encryption order
        let grid = Array.from({ length: numRows }, () => new Array(numCols).fill(""));
        let index = 0;
        for (let sortedCol = 0; sortedCol < numCols; sortedCol++) {
          let actualCol = columnOrder.indexOf(sortedCol);
          for (let row = 0; row < columnHeights[sortedCol]; row++) {
            grid[row][actualCol] = textArr[index++];
          }
        }

        // Read row-wise to reconstruct original text
        return grid.flat().join("");
      }
    };

    if (mode === "encrypt") {
      result = columnarCipher(text, keyArr, true);
    } else if (mode === "decrypt") {
      result = columnarCipher(text, keyArr, false);
    } else {
      result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
    }
  } catch (error) {
    result = `Error executing columnar cipher: ${error.message}`;
  }

  return <div>Result : {result}</div>;
}
