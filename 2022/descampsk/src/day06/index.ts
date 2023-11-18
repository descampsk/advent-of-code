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

const checkUniqLetters = (line: string, size: number) => {
  for (let i = 0; i < line.length; i++) {
    const letters: Record<string, boolean> = {};
    for (let j = 0; j < size; j++) {
      letters[line.charAt(i + j)] = true;
    }
    if (Object.keys(letters).length === size) {
      return i + size;
    }
  }
  return 0;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const line = lines[0];

  return checkUniqLetters(line, 4);
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  return checkUniqLetters(lines[0], 14);
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 7,
      },
      {
        input: "bvwbjplbgvbhsrlpgdmjqwftvncz",
        expected: 5,
      },
      {
        input: "nppdvjthqldpwncqszvftbrmjlhg",
        expected: 6,
      },
      {
        input: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg",
        expected: 10,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 19,
      },
      {
        input: "bvwbjplbgvbhsrlpgdmjqwftvncz",
        expected: 23,
      },
      {
        input: "nppdvjthqldpwncqszvftbrmjlhg",
        expected: 23,
      },
      {
        input: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg",
        expected: 29,
      },
      {
        input: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw",
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
