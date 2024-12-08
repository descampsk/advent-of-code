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
  const matrix = lines.map((line) => line.split(""));

  const antennas: Record<string, [number, number][]> = {};
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== ".") {
        const antenna = matrix[i][j];
        if (antennas[antenna]) {
          antennas[antenna].push([i, j]);
        } else {
          antennas[antenna] = [[i, j]];
        }
      }
    }
  }
  console.log(antennas);
  let total = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      let isAntinode = false;
      for (const antenna in antennas) {
        if (
          antennas[antenna].some(([x, y], index) => {
            const otherAntennas = antennas[antenna]
              .filter((__, index2) => index2 !== index)
              .find(([x2, y2]) => {
                return x2 === 2 * (x - i) + i && y2 === 2 * (y - j) + j;
              });
            // console.log(i, j, x, y, antenna, otherAntennas);
            return !!otherAntennas;
          })
        ) {
          isAntinode = true;
          break;
        }
      }
      if (isAntinode) {
        total++;
        matrix[i][j] = "#";
      }
    }
  }

  console.log(matrix.map((line) => line.join("")).join("\n"));

  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const matrix = lines.map((line) => line.split(""));

  const antennas: Record<string, [number, number][]> = {};
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== ".") {
        const antenna = matrix[i][j];
        if (antennas[antenna]) {
          antennas[antenna].push([i, j]);
        } else {
          antennas[antenna] = [[i, j]];
        }
      }
    }
  }
  console.log(antennas);
  let total = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      let isAntinode = false;
      for (const antenna in antennas) {
        if (
          antennas[antenna].some(([x, y], index) => {
            const otherAntennas = antennas[antenna]
              .filter((__, index2) => index2 !== index)
              .find(([x2, y2]) => {
                const k = (x2 - i) / (x - i);
                return x2 === k * (x - i) + i && y2 === k * (y - j) + j;
              });
            // console.log(i, j, x, y, antenna, otherAntennas);
            return !!otherAntennas;
          })
        ) {
          isAntinode = true;
          break;
        }
      }
      if (isAntinode) {
        total++;
        matrix[i][j] = "#";
      }
    }
  }

  console.log(matrix.map((line) => line.join("")).join("\n"));

  return total;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
