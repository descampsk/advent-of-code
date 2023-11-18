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
    const appearsInBoth = _.intersection(
      [...line.substring(0, line.length / 2)],
      [...line.substring(line.length / 2)],
    );
    appearsInBoth.forEach((letter) => {
      sum +=
        letter.toLowerCase() === letter
          ? letter.charCodeAt(0) - "a".charCodeAt(0) + 1
          : letter.charCodeAt(0) - "A".charCodeAt(0) + 27;
    });
  });
  return sum;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let sum = 0;
  for (let i = 0; i < lines.length; i += 3) {
    const lettersInAllSack = _.intersection(
      [...lines[i]],
      [...lines[i + 1]],
      [...lines[i + 2]],
    );
    // eslint-disable-next-line no-loop-func
    lettersInAllSack.forEach((letter) => {
      sum +=
        letter.toLowerCase() === letter
          ? letter.charCodeAt(0) - "a".charCodeAt(0) + 1
          : letter.charCodeAt(0) - "A".charCodeAt(0) + 27;
    });
  }
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
