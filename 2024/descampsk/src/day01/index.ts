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
  const firstLine: number[] = [];
  const secondLine: number[] = [];
  lines.forEach((line) => {
    const [firstNumber, secondNumber] = line.split("   ").map(Number);
    firstLine.push(firstNumber);
    secondLine.push(secondNumber);
  });
  firstLine.sort((a, b) => a - b);
  secondLine.sort((a, b) => a - b);

  let result = 0;
  for (let i = 0; i < firstLine.length; i++) {
    result += Math.abs(firstLine[i] - secondLine[i]);
  }

  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const firstLine: number[] = [];
  const secondLine: Map<number, number> = new Map();
  lines.forEach((line) => {
    const [firstNumber, secondNumber] = line.split("   ").map(Number);
    firstLine.push(firstNumber);
    if (secondLine.has(secondNumber)) {
      secondLine.set(secondNumber, secondLine.get(secondNumber)! + 1);
    } else {
      secondLine.set(secondNumber, 1);
    }
  });

  let result = 0;
  firstLine.forEach((number) => {
    result += number * (secondLine.get(number) ?? 0);
  });

  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
