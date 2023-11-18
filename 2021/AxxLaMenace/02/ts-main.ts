import { readFileSync } from "fs";

function solvePuzzle(lines: string[], puzzle = 1) {
  let hori = 0,
    depth = 0,
    aim = 0;
  lines.forEach((line) => {
    const split: string[] = line.split(" ");
    const dir: string = split[0];
    const value: number = parseInt(split[1], 10);
    if (puzzle == 1) {
      if (dir === "forward") hori += value;
      else if (dir === "down") depth += value;
      else if (dir === "up") depth -= value;
    } else {
      if (dir === "forward") (hori += value), (depth += aim * value);
      else if (dir === "down") aim += value;
      else if (dir === "up") aim -= value;
    }
  });
  return hori * depth;
}

const file = readFileSync("./02/data.txt", "utf-8");
const lines = file.split("\n");
console.log("result first puzzle:", solvePuzzle(lines));
console.log("result second puzzle:", solvePuzzle(lines, 2));
