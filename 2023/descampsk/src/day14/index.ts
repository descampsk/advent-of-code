/* eslint-disable no-param-reassign */
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

const slideRocks = (grid: string[][], [north, west]: [number, number]) => {
  for (
    let i = north === -1 ? grid.length - 1 : 0;
    i < grid.length && i >= 0;
    i += north === -1 ? -1 : 1
  ) {
    for (
      let j = west === -1 ? grid[i].length - 1 : 0;
      j < grid[i].length && j >= 0;
      j += west === -1 ? -1 : 1
    ) {
      // console.log(i, j);
      if (grid[i][j] === "O") {
        let k = 0;
        while (
          i - k * north - 1 * north >= 0 &&
          j - k * west - 1 * west >= 0 &&
          i - k * north - 1 * north < grid.length &&
          j - k * west - 1 * west < grid[i].length &&
          grid[i - k * north - 1 * north][j - k * west - 1 * west] === "."
        ) {
          k++;
        }
        if (grid[i - k * north] && grid[i - k * north][j - k * west] === ".") {
          grid[i - k * north][j - k * west] = "O";
          grid[i][j] = ".";
        }
      }
    }
  }
  return grid;
};

const computeTotalLoad = (grid: string[][]) => {
  let totalLoad = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "O") {
        totalLoad += grid.length - i;
      }
    }
  }
  return totalLoad;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const grid = lines.map((line) => line.split(""));

  console.log(grid.map((line) => line.join("")).join("\n"));
  slideRocks(grid, [1, 0]);

  return computeTotalLoad(grid);
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const grid = lines.map((line) => line.split(""));
  const cycles: [number, number][] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  const map = new Map<string, number>();
  let cycleFound = -1;
  let gridAtCycle: string[][] = [];
  for (let i = 0; i < 1000000000; i++) {
    console.log("Cycle", i + 1);

    for (const cycle of cycles) {
      // const [north, west] = cycle;
      // console.log("Slide", north, west);
      slideRocks(grid, cycle);
    }
    const gridStr = JSON.stringify(grid);
    if (map.has(gridStr)) {
      console.log("Found cycle", i, map.get(gridStr));
      gridAtCycle = grid;
      cycleFound = i;
      break;
    } else {
      map.set(gridStr, i);
    }

    // console.log(grid.map((line) => line.join("")).join("\n"));
  }

  const period = cycleFound - map.get(JSON.stringify(gridAtCycle))!;
  const remaining = (1000000000 - cycleFound) % period;
  console.log(remaining);

  for (let i = 0; i < remaining - 1; i++) {
    for (const cycle of cycles) {
      slideRocks(gridAtCycle, cycle);
    }
  }

  return computeTotalLoad(gridAtCycle);
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
