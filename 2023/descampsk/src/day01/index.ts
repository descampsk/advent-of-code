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

const testFile2 = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input2.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest2 = readFileSync(testFile2, "utf-8");

const computeTotal = (
  lines: string[],
  allowedDigits: Record<string, number>,
) => {
  let total = 0;
  for (const line of lines) {
    let firstNumber: number = 0;
    let firstNumberPosition: number = Infinity;
    let lastNumber = 0;
    let lastNumberPosition = -1;
    for (const [key, value] of Object.entries(allowedDigits)) {
      const firstPosition = line.indexOf(key);
      const lastPosition = line.lastIndexOf(key);
      if (firstPosition !== -1 && firstPosition < firstNumberPosition) {
        firstNumber = value;
        firstNumberPosition = firstPosition;
      }
      if (lastPosition !== -1 && lastPosition > lastNumberPosition) {
        lastNumber = value;
        lastNumberPosition = lastPosition;
      }
    }
    total += Number.parseInt(`${firstNumber}${lastNumber}`, 10);
  }
  return total;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  return computeTotal(lines, {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
  });
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  return computeTotal(lines, {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
  });
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest2,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
