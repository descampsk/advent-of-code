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
  const forest: number[][] = [];
  const visibles: number[][] = [];
  lines.forEach((line) => {
    const numbers = [...line].map((value) => Number.parseInt(value, 10));
    const hiddens = [...line].map(() => 0);
    forest.push(numbers);
    visibles.push(hiddens);
  });

  const forestLength = forest.length;
  const forestHight = forest[0].length;
  for (let i = 0; i < forestLength; i++) {
    let maxTreeLeft = -1;
    let maxTreeRight = -1;
    const lineLength = forest[i].length;
    for (let j = 0; j < lineLength; j++) {
      if (forest[i][j] > maxTreeLeft) {
        visibles[i][j] = 1;
        maxTreeLeft = forest[i][j];
      }
      if (forest[i][lineLength - 1 - j] > maxTreeRight) {
        visibles[i][lineLength - 1 - j] = 1;
        maxTreeRight = forest[i][lineLength - 1 - j];
      }
    }
  }
  for (let j = 0; j < forestHight; j++) {
    let maxTreeUp = -1;
    let maxTreeDown = -1;
    for (let i = 0; i < forestLength; i++) {
      if (forest[i][j] > maxTreeUp) {
        visibles[i][j] = 1;
        maxTreeUp = forest[i][j];
      }
      if (forest[forestLength - 1 - i][j] > maxTreeDown) {
        visibles[forestLength - 1 - i][j] = 1;
        maxTreeDown = forest[forestLength - 1 - i][j];
      }
    }
  }
  let total = 0;
  for (let i = 0; i < forestLength; i++) {
    for (let j = 0; j < forestHight; j++) {
      total += visibles[i][j];
    }
  }
  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const forest: number[][] = [];
  lines.forEach((line) => {
    const numbers = [...line].map((value) => Number.parseInt(value, 10));
    forest.push(numbers);
  });

  let maxScenicScore = 1;
  for (let i = 0; i < forest.length; i++) {
    for (let j = 0; j < forest[i].length; j++) {
      let scenicScore = 1;
      let viewDistance = 0;
      const high = forest[i][j];
      for (let k = i + 1; k < forest.length; k++) {
        viewDistance += 1;
        if (forest[k][j] >= high) {
          break;
        }
      }
      scenicScore *= viewDistance;
      viewDistance = 0;
      for (let k = i - 1; k >= 0; k--) {
        viewDistance += 1;
        if (forest[k][j] >= high) {
          break;
        }
      }
      scenicScore *= viewDistance;
      viewDistance = 0;
      for (let k = j + 1; k < forest[i].length; k++) {
        viewDistance += 1;
        if (forest[i][k] >= high) {
          break;
        }
      }
      scenicScore *= viewDistance;
      viewDistance = 0;
      for (let k = j - 1; k >= 0; k--) {
        viewDistance += 1;
        if (forest[i][k] >= high) {
          break;
        }
      }
      scenicScore *= viewDistance;
      viewDistance = 0;
      if (maxScenicScore < scenicScore) {
        maxScenicScore = scenicScore;
      }
    }
  }

  return maxScenicScore;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
