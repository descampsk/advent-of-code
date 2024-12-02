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

const checkIfSafe = (
  levels: number[],
): { isSafe: boolean; unSafeLevelIndex: number | null } => {
  let isSafe = true;
  let i = 0;
  let direction: "increasing" | "decreasing" | null = null;
  // console.log(levels);
  while (isSafe && i < levels.length - 1) {
    const level = levels[i];
    const nextLevel = levels[i + 1];
    const diff = nextLevel - level;
    if (direction === null) {
      direction = diff > 0 ? "increasing" : "decreasing";
    } else if (direction === "increasing" && diff < 0) {
      isSafe = false;
    } else if (direction === "decreasing" && diff > 0) {
      isSafe = false;
    }

    if (Math.abs(diff) > 3 || diff === 0) {
      isSafe = false;
    }

    // console.log({ level, nextLevel, diff, direction, isSafe });

    i++;
  }

  return {
    isSafe,
    unSafeLevelIndex: isSafe ? null : i,
  };
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let totalSafe = 0;
  lines.forEach((line) => {
    const levels = line.split(" ").map(Number);
    const { isSafe } = checkIfSafe(levels);

    if (isSafe) {
      totalSafe++;
    }
  });
  return totalSafe;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let totalSafe = 0;
  lines.forEach((line) => {
    const levels = line.split(" ").map(Number);
    const { isSafe, unSafeLevelIndex } = checkIfSafe(levels);

    if (isSafe && unSafeLevelIndex !== null) {
      totalSafe++;
    } else {
      for (let i = 0; i < levels.length; i++) {
        const newLevels = [...levels];
        newLevels.splice(i, 1);
        const { isSafe: newIsSafe } = checkIfSafe(newLevels);
        if (newIsSafe) {
          totalSafe++;
          break;
        }
      }
    }
  });
  return totalSafe;
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
