import { readFileSync } from "fs";

function createCount(line: string): Record<string, number> {
  const counter: Record<number, number> = {};
  for (const num of line.split(",").map((item) => parseInt(item, 10))) {
    counter[num] = counter[num] ? counter[num] + 1 : 1;
  }
  return counter;
}

function fishesSpawn(counter: Record<number, number>): Record<number, number> {
  const spawns: number = counter[0] || 0;
  counter[0] = 0;
  counter[7] = 7 in counter ? counter[7] + spawns : spawns;
  counter[9] = 9 in counter ? counter[9] + spawns : spawns;
  const newCounter: Record<number, number> = {};
  for (const key in counter) {
    const intKey = parseInt(key, 10);
    if (intKey > 0 && counter[intKey] > 0) {
      newCounter[intKey - 1] = counter[intKey];
    }
  }
  return newCounter;
}

function solvePuzzle(line: string, day: number) {
  let counter: Record<number, number>;
  for (counter = createCount(line); day; counter = fishesSpawn(counter), day--);
  return Object.values(counter).reduce((a, b) => a + b);
}

const line = readFileSync("./06/data.txt", "utf-8");
console.log("result first puzzle:", solvePuzzle(line, 80));
console.log("result second puzzle:", solvePuzzle(line, 256));
