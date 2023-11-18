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
  let sum = 0;
  lines.forEach((line) => {
    const [pair1, pair2] = line.split(",");
    const [a, b] = pair1.split("-").map((value) => Number.parseInt(value, 10));
    const [x, y] = pair2.split("-").map((value) => Number.parseInt(value, 10));
    if ((a >= x && b <= y) || (x >= a && y <= b)) {
      sum += 1;
    }
  });
  return sum;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let sum = 0;
  lines.forEach((line) => {
    const [pair1, pair2] = line.split(",");
    const [a, b] = pair1.split("-").map((value) => Number.parseInt(value, 10));
    const [x, y] = pair2.split("-").map((value) => Number.parseInt(value, 10));
    if (
      (a >= x && a <= y) ||
      (b <= y && b >= x) ||
      (x >= a && x <= b) ||
      (y <= b && y >= a)
    ) {
      sum += 1;
    }
  });
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
