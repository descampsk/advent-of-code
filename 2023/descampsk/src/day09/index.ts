import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let total = 0;
  for (const line of lines) {
    const fullHistory = [line.split(" ").map((c) => Number.parseInt(c, 10))];
    while (!fullHistory[fullHistory.length - 1].every((c) => c === 0)) {
      const newHistory = [];
      const lastHistory = fullHistory[fullHistory.length - 1];
      for (let i = 0; i < lastHistory.length - 1; i++) {
        newHistory.push(lastHistory[i + 1] - lastHistory[i]);
      }
      fullHistory.push(newHistory);
    }
    // console.log(fullHistory);
    for (let i = fullHistory.length - 2; i >= 0; i--) {
      fullHistory[i].push(
        fullHistory[i][fullHistory[i].length - 1] +
          fullHistory[i + 1][fullHistory[i + 1].length - 1],
      );
    }
    // console.log(fullHistory);
    total += fullHistory[0][fullHistory[0].length - 1];
  }
  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let total = 0;
  for (const line of lines) {
    const fullHistory = [line.split(" ").map((c) => Number.parseInt(c, 10))];
    while (!fullHistory[fullHistory.length - 1].every((c) => c === 0)) {
      const newHistory = [];
      const lastHistory = fullHistory[fullHistory.length - 1];
      for (let i = 0; i < lastHistory.length - 1; i++) {
        newHistory.push(lastHistory[i + 1] - lastHistory[i]);
      }
      fullHistory.push(newHistory);
    }
    // console.log(fullHistory);
    for (let i = fullHistory.length - 2; i >= 0; i--) {
      fullHistory[i].unshift(fullHistory[i][0] - fullHistory[i + 1][0]);
    }
    // console.log(fullHistory);
    total += fullHistory[0][0];
  }
  return total;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
