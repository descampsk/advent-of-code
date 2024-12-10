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

const findTrails = (matrix: number[][], i: number, j: number) => {
  const queue: { i: number; j: number; value: number }[] = [{ i, j, value: 0 }];
  const visited = new Set<string>();

  let total = 0;
  while (queue.length > 0) {
    const current = queue.pop()!;
    const key = `${current.i}-${current.j}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const value = matrix[current.i][current.j];
    if (value === 9) {
      total++;
      continue;
    }

    const next = [
      { i: current.i + 1, j: current.j },
      { i: current.i - 1, j: current.j },
      { i: current.i, j: current.j + 1 },
      { i: current.i, j: current.j - 1 },
    ];
    for (const n of next) {
      if (
        n.i >= 0 &&
        n.i < matrix.length &&
        n.j >= 0 &&
        n.j < matrix[n.i].length
      ) {
        const nextValue = matrix[n.i][n.j];
        if (nextValue === value + 1) {
          queue.push({ ...n, value: current.value + 1 });
        }
      }
    }
  }
  return total;
};

const findTrailsV2 = (matrix: number[][], i: number, j: number) => {
  const queue: {
    i: number;
    j: number;
    value: number;
    path: [number, number][];
  }[] = [{ i, j, value: 0, path: [[i, j]] }];
  const visited = new Set<string>();

  let total = 0;
  while (queue.length > 0) {
    const current = queue.pop()!;
    const key = `${current.i}-${current.j}-${current.path.join(",")}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const value = matrix[current.i][current.j];
    if (value === 9) {
      total++;
      continue;
    }

    const next = [
      { i: current.i + 1, j: current.j },
      { i: current.i - 1, j: current.j },
      { i: current.i, j: current.j + 1 },
      { i: current.i, j: current.j - 1 },
    ];
    for (const n of next) {
      if (
        n.i >= 0 &&
        n.i < matrix.length &&
        n.j >= 0 &&
        n.j < matrix[n.i].length
      ) {
        const nextValue = matrix[n.i][n.j];
        if (nextValue === value + 1) {
          queue.push({
            ...n,
            value: current.value + 1,
            path: [...current.path, [n.i, n.j]],
          });
        }
      }
    }
  }
  return total;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const matrix = lines.map((line) => line.split("").map(Number));

  let result = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 0) {
        result += findTrails(matrix, i, j);
      }
    }
  }

  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const matrix = lines.map((line) => line.split("").map(Number));
  let result = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 0) {
        result += findTrailsV2(matrix, i, j);
      }
    }
  }

  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 36,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 81,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
