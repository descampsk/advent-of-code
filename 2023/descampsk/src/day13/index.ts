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
  "./input.2.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest2 = readFileSync(testFile2, "utf-8");

const getPatterns = (lines: string[]) => {
  const patterns: string[][][] = [];
  while (lines.length) {
    const pattern: string[][] = [];
    let line = "";
    do {
      line = lines[0]!;
      pattern.push([...line!]);
      lines.shift()!;
    } while (lines[0] && lines[0] !== "");
    patterns.push(pattern);
    lines.shift();
  }
  return patterns;
};

const findReflexion = (pattern: string[][]) => {
  const reflexions: { horizontal: number[]; vertical: number[] } = {
    horizontal: [],
    vertical: [],
  };
  // Check for horizontal reflection at index i
  for (let i = 0; i < pattern.length - 1; i++) {
    let isReflexion = true;
    for (let j = 0; j <= i; j++) {
      // console.log(
      //   i,
      //   j,
      //   JSON.stringify(pattern[i - j]),
      //   JSON.stringify(pattern[1 + i + j]),
      // );
      if (
        i - j >= 0 &&
        1 + i + j < pattern.length &&
        JSON.stringify(pattern[i - j]) !== JSON.stringify(pattern[1 + i + j])
      ) {
        isReflexion = false;
        break;
      }
    }
    if (isReflexion) {
      reflexions.horizontal.push(1 + i);
    }
  }

  // Check for vertical reflection at column j
  for (let j = 0; j < pattern[0].length - 1; j++) {
    let isReflexion = true;
    for (let i = 0; i <= j; i++) {
      // console.log(
      //   j,
      //   i,
      //   JSON.stringify(pattern.map((row) => row[j - i])),
      //   JSON.stringify(pattern.map((row) => row[1 + i + j])),
      // );
      if (
        j - i >= 0 &&
        1 + i + j < pattern[0].length &&
        JSON.stringify(pattern.map((row) => row[j - i])) !==
          JSON.stringify(pattern.map((row) => row[1 + i + j]))
      ) {
        isReflexion = false;
        break;
      }
    }
    if (isReflexion) {
      reflexions.vertical.push(1 + j);
    }
  }
  return reflexions;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const patterns = getPatterns(lines);
  let totalRowsHorizontal = 0;
  let totalColumnsVertical = 0;
  for (let p = 0; p < patterns.length; p++) {
    console.log("pattern", p);
    const pattern = patterns[p];
    // console.log(pattern);
    const { horizontal, vertical } = findReflexion(pattern);
    console.log(horizontal, vertical);
    totalRowsHorizontal += horizontal[0] ?? 0;
    totalColumnsVertical += vertical[0] ?? 0;
  }
  return totalColumnsVertical + 100 * totalRowsHorizontal;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let totalRowsHorizontal = 0;
  let totalColumnsVertical = 0;
  const patterns = getPatterns(lines);
  for (let p = 0; p < patterns.length; p++) {
    console.log("pattern", p);
    const pattern = patterns[p];
    // console.log(pattern);
    const { horizontal, vertical } = findReflexion(pattern);
    console.log(horizontal, vertical);

    let smudgeFound = false;
    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[0].length; j++) {
        const newPattern = pattern.map((row) => [...row]);
        if (newPattern[i][j] === "#") {
          newPattern[i][j] = ".";
        } else {
          newPattern[i][j] = "#";
        }
        const newReflexions = findReflexion(newPattern);
        // console.log(i, j, newReflexions);
        if (
          newReflexions.horizontal.length &&
          JSON.stringify(newReflexions.horizontal) !==
            JSON.stringify(horizontal)
        ) {
          console.log("horizontal found", i, j, newReflexions);
          smudgeFound = true;
          totalRowsHorizontal +=
            newReflexions.horizontal.find((n) => n !== horizontal[0]) ?? 0;
        }
        if (
          newReflexions.vertical.length &&
          JSON.stringify(newReflexions.vertical) !== JSON.stringify(vertical)
        ) {
          console.log("vertical found", i, j, newReflexions);
          smudgeFound = true;
          totalColumnsVertical +=
            newReflexions.vertical.find((n) => n !== vertical[0]) ?? 0;
        }
        if (smudgeFound) {
          console.log(newPattern.map((row) => row.join("")).join("\n"));

          break;
        }
      }
      if (smudgeFound) {
        break;
      }
    }
    if (!smudgeFound) {
      console.error("no smudge found for pattern", p);
      console.log(pattern.map((row) => row.join("")).join("\n"));
      process.exit(1);
    }
  }
  console.log(totalRowsHorizontal, totalColumnsVertical);
  return totalColumnsVertical + 100 * totalRowsHorizontal;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 405,
      },
      {
        input: inputTest2,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 400,
      },
      {
        input: inputTest2,
        expected: 3,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
