/* eslint-disable no-continue */
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

const computeDistances = (lines: string[], increase: number) => {
  const univers = lines.map((line) => line.split(""));
  const rowsWithoutGalaxy = [];
  const columnsWithoutGalaxy = [];
  for (let i = 0; i < univers.length; i++) {
    const row = univers[i];
    if (row.every((cell) => cell === ".")) {
      rowsWithoutGalaxy.push(i);
    }
  }
  for (let i = 0; i < univers[0].length; i++) {
    const column = univers.map((row) => row[i]);
    if (column.every((cell) => cell === ".")) {
      columnsWithoutGalaxy.push(i);
    }
  }
  console.log(rowsWithoutGalaxy, columnsWithoutGalaxy);
  const galaxies: [number, number][] = [];
  for (let i = 0; i < univers.length; i++) {
    const row = univers[i];
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      if (cell === "#") {
        galaxies.push([i, j]);
      }
    }
  }
  let total = 0;
  let galaxy = galaxies.pop();
  while (galaxy) {
    for (const otherGalaxy of galaxies) {
      const [row1, column1] = galaxy;
      const [row2, column2] = otherGalaxy;
      // console.log(galaxy, otherGalaxy);
      let distance = Math.abs(row2 - row1) + Math.abs(column2 - column1);
      // console.log("Manathan", distance);
      for (const row of rowsWithoutGalaxy) {
        if (row > Math.min(row1, row2) && row < Math.max(row1, row2)) {
          // console.log("row", row);

          distance += increase - 1;
        }
      }
      for (const column of columnsWithoutGalaxy) {
        if (
          column > Math.min(column1, column2) &&
          column < Math.max(column2, column1)
        ) {
          // console.log("column", column);
          distance += increase - 1;
        }
      }
      // console.log("fullDistance", galaxy, otherGalaxy, distance);
      total += distance;
    }
    galaxy = galaxies.pop();
  }
  return total;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  return computeDistances(lines, 2);
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  return computeDistances(lines, 1000000);
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 8410,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
