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
  lines.pop();
  let max = 0;
  let currentSum = 0;
  lines.forEach((line) => {
    const calory = Number.parseInt(line, 10);
    if (Number.isNaN(calory)) {
      if (currentSum > max) {
        max = currentSum;
        currentSum = 0;
      } else {
        currentSum = 0;
      }
    } else {
      currentSum += calory;
    }
  });
  return max;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let top1 = 0;
  let top2 = 0;
  let top3 = 0;
  let currentSum = 0;
  lines.forEach((line, index) => {
    const calory = Number.parseInt(line, 10);
    if (!Number.isNaN(calory) || index === lines.length - 1) {
      currentSum += calory;
    }
    if (Number.isNaN(calory) || index === lines.length - 1) {
      if (currentSum > top1) {
        top3 = top2;
        top2 = top1;
        top1 = currentSum;
        currentSum = 0;
      } else if (currentSum > top2) {
        top3 = top2;
        top2 = currentSum;
        currentSum = 0;
      } else if (currentSum > top3) {
        top3 = currentSum;
        currentSum = 0;
      } else {
        currentSum = 0;
      }
    }
  });
  return top1 + top2 + top3;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
