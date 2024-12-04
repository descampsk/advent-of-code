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
  const grid = lines.map((line) => line.split(""));
  const words: string[] = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      for (const k of [-1, 0, 1]) {
        for (const l of [-1, 0, 1]) {
          if (k === 0 && l === 0) {
            // eslint-disable-next-line no-continue
            continue;
          }
          let x = i + k;
          let y = j + l;
          let word = grid[i][j];
          while (
            word.length < 4 &&
            x >= 0 &&
            x < grid.length &&
            y >= 0 &&
            y < grid[x].length
          ) {
            word += grid[x][y];
            x += k;
            y += l;
          }
          words.push(word);
        }
      }
    }
  }

  return words.filter((word) => word === "XMAS").length;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const grid = lines.map((line) => line.split(""));
  let count = 0;
  for (let i = 1; i < grid.length - 1; i++) {
    for (let j = 1; j < grid[i].length - 1; j++) {
      if (grid[i][j] !== "A") {
        continue;
      }
      const word1 = grid[i - 1][j - 1] + grid[i][j] + grid[i + 1][j + 1];
      const word2 = grid[i - 1][j + 1] + grid[i][j] + grid[i + 1][j - 1];
      // console.log(i, j, word1, word2);
      const isWord1 = word1 === "MAS" || word1 === "SAM";
      const isWord2 = word2 === "MAS" || word2 === "SAM";
      if (isWord1 && isWord2) {
        // console.log("found", i, j);
        count++;
      }
    }
  }
  return count;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 9,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
