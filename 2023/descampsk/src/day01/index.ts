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

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let total = 0;
  for (const line of lines) {
    let firstNumber: number | null = null;
    let lastNumber: number | null = null;
    for (const letter of line) {
      const number = Number.parseInt(letter, 10);
      if (!Number.isNaN(number)) {
        if (firstNumber === null) {
          firstNumber = number;
        }
        lastNumber = number;
      }
    }
    total += Number.parseInt(`${firstNumber}${lastNumber}`, 10);
  }
  return total;
};

const digitsToLetters = {
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
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let total = 0;
  for (const line of lines) {
    let firstNumber: number = 0;
    let firstNumberPosition: number = Infinity;
    let lastNumber = 0;
    let lastNumberPosition = -1;
    for (const [key, value] of Object.entries(digitsToLetters)) {
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
