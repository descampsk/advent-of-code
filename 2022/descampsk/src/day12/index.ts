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

const getMap = (lines: string[]) => {
  const map: string[][] = [];
  for (const line of lines) {
    map.push([...line]);
  }
  return map;
};

const dijtstraAlgorithm = (
  matrix: string[][],
  startX: number,
  startY: number,
) => {
  const updatedMatrix: number[][] = new Array(matrix.length)
    .fill(10000)
    .map(() => new Array(matrix[0].length).fill(10000));
  updatedMatrix[startX][startY] = 0;
  const visited: number[][] = new Array(matrix.length)
    .fill(0)
    .map(() => new Array(matrix[0].length).fill(0));
  const nextCases: number[][] = [];
  let currentCase = [startX, startY];
  while (currentCase) {
    const x = currentCase[0];
    const y = currentCase[1];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const xToUpdate = x + i;
        const yToUpdate = y + j;
        if (
          (i !== 0 || j !== 0) &&
          Math.abs(i) !== Math.abs(j) &&
          xToUpdate >= 0 &&
          xToUpdate < matrix.length &&
          yToUpdate >= 0 &&
          yToUpdate < matrix[0].length &&
          !visited[xToUpdate][yToUpdate]
        ) {
          const currentChar = matrix[x][y];
          const nextChar = matrix[xToUpdate][yToUpdate];
          if (
            (nextChar !== "E" &&
              nextChar.charCodeAt(0) <= currentChar.charCodeAt(0) + 1) ||
            (nextChar === "E" &&
              (currentChar === "z" || currentChar === "y")) ||
            (currentChar === "S" && (nextChar === "a" || nextChar === "b"))
          ) {
            const newValue = 1 + updatedMatrix[x][y];
            if (newValue < updatedMatrix[xToUpdate][yToUpdate]) {
              updatedMatrix[xToUpdate][yToUpdate] = newValue;
              nextCases.push([xToUpdate, yToUpdate, newValue]);
              visited[xToUpdate][yToUpdate] = 1;
            }
          }
        }
      }
    }
    nextCases.sort((a, b) => a[2] - b[2]);
    [currentCase] = nextCases;
    nextCases.shift();
  }
  return updatedMatrix;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const map = getMap(lines);
  let startX = 0;
  let startY = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "S") {
        startX = i;
        startY = j;
      }
    }
  }
  const updatedMatrix = dijtstraAlgorithm(map, startX, startY);
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "E") return updatedMatrix[i][j];
    }
  }
  return 0;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const map = getMap(lines);
  let minimum = 10000;
  let endX = 0;
  let endY = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "E") {
        endX = i;
        endY = j;
      }
    }
  }
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "S" || map[i][j] === "a") {
        const updatedMatrix = dijtstraAlgorithm(map, i, j);
        if (updatedMatrix[endX][endY] < minimum) {
          minimum = updatedMatrix[endX][endY];
        }
      }
    }
  }
  return minimum;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
