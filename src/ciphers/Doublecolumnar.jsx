import React from "react";

export default function DoubleColumnar({ mode, text, key }) {
  let result = "";

  try {
    // Split the key into two parts
    const keys = key.split(" ");
    if (keys.length !== 2) {
      throw new Error("Invalid key! You must provide two numeric keys separated by space.");
    }

    const key1 = keys[0].split("").map(Number);
    const key2 = keys[1].split("").map(Number);

    if (key1.some(isNaN) || key2.some(isNaN)) {
      throw new Error("Invalid key! Only numeric keys are allowed.");
    }

    if (key1.length !== key2.length) {
      throw new Error("Invalid key! Both keys must have the same length.");
    }

    const applyColumnarCipher = (str, keyArr, encrypt = true) => {
      const keyLength = keyArr.length;
      const sortedKey = [...keyArr].sort((a, b) => a - b);
      const columnOrder = keyArr.map((num) => sortedKey.indexOf(num));

      str = str.replace(/\s+/g, ""); // Remove spaces
      let textArr = str.split("");

      if (encrypt) {
        // Create grid with key length columns (no padding)
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
      let firstPass = applyColumnarCipher(text, key1, true);
      result = applyColumnarCipher(firstPass, key2, true);
    } else if (mode === "decrypt") {
      let firstPass = applyColumnarCipher(text, key2, false);
      result = applyColumnarCipher(firstPass, key1, false);
    } else {
      result = "Invalid mode! Use '-e' for encryption or '-d' for decryption.";
    }
  } catch (error) {
    result = `Error executing double columnar cipher: ${error.message}`;
  }

  return <div>Result : {result}</div>;
}
