import { readFileSync } from "fs";

function solvePuzzle(data: number[], slide = 1) {
  let count = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i] > data[i - slide]) count++;
  }
  return count;
}

const lines = readFileSync("./01/data.txt", "utf-8");
const data = lines.split("\n").map((item) => parseInt(item, 10));
console.log("result first puzzle:", solvePuzzle(data));
console.log("result second puzzle:", solvePuzzle(data, 3));
