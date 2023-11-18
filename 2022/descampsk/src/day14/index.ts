/* eslint-disable no-param-reassign */
import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _, { has, min } from "lodash";
import { dirname, join } from "path";
import logUpdate from "log-update";
import { fileURLToPath } from "url";

import { execSync } from "child_process";

import { Terminal } from "command-line-draw";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

const displayCave = (cave: string[][], terminal: Terminal) => {
  for (let i = 0; i < cave.length; i++) {
    for (let j = 0; j < cave[i].length; j++) {
      const block = cave[i][j];
      if (block === "#") terminal.write(cave[i][j], j, i, "green");
      else terminal.write(cave[i][j], j, i, "white");
    }
  }
};

const buildCaveMap = (lines: string[]) => {
  let maxX = 0;
  let minX = 10000;
  let maxY = 0;
  const paths: number[][][] = [];
  lines.forEach((line) => {
    const coordinates = line.split(" -> ");
    // console.log(coordinates);
    const path = coordinates.map((coordinate) =>
      coordinate.split(",").map((value) => parseInt(value, 10)),
    );
    paths.push(path);
  });
  paths.forEach((path) => {
    path.forEach((coordinate) => {
      const [x, y] = coordinate;
      if (x > maxX) maxX = x;
      if (x < minX) minX = x;
      if (y > maxY) maxY = y;
    });
  });
  const cave: string[][] = new Array(maxY + 3)
    .fill(".")
    .map(() => new Array(2 * (maxY + 1) + 1).fill("."));
  paths.forEach((path) => {
    for (let i = 0; i < path.length - 1; i++) {
      const [x1, y1] = path[i];
      const [x2, y2] = path[i + 1];
      const directionX = (x2 - x1) / Math.abs(x2 - x1);
      const directionY = (y2 - y1) / Math.abs(y2 - y1);
      if (x2 !== x1) {
        for (let x = 0; x < Math.abs(x2 - x1) + 1; x++) {
          cave[y1][x1 + x * directionX - 500 + maxY + 1] = "#";
        }
      }
      if (y2 !== y1) {
        for (let y = 0; y < Math.abs(y2 - y1) + 1; y++) {
          cave[y1 + y * directionY][x1 - 500 + maxY + 1] = "#";
        }
      }
    }
  });
  return { cave, minX, maxX, maxY };
};

const putSand = (cave: string[][], maxY: number) => {
  const showSand = true;
  if (showSand) console.clear();

  const terminal = (
    showSand
      ? new Terminal({
          width: cave[0].length,
          height: cave.length,
        })
      : null
  ) as Terminal;

  if (showSand) displayCave(cave, terminal);
  let keepSand = true;
  const sourceX = maxY + 1;
  while (keepSand) {
    // execSync("sleep 0.005");
    let x = sourceX;
    let y = 0;
    cave[y][x] = "+";
    if (showSand) terminal.write("+", x, y, "yellow");
    while (y >= 0 && y < cave.length - 1 && x >= 0 && x < cave[0].length) {
      //   if (showSand) terminal.write(".", x, y, "white");
      if (cave[y + 1][x] !== ".") {
        if (cave[y + 1][x - 1] === ".") {
          cave[y][x] = ".";
          x -= 1;
          y += 1;
          cave[y][x] = "+";
        } else if (cave[y + 1][x + 1] === ".") {
          cave[y][x] = ".";
          x += 1;
          y += 1;
          cave[y][x] = "+";
        } else {
          //   if (showSand) terminal.write(".", x, y, "yellow");
          break;
        }
      } else {
        cave[y][x] = ".";
        y += 1;
        cave[y][x] = "+";
        // if (showSand) terminal.write("+", x, y, "yellow");
      }
    }
    if (showSand) terminal.write("+", x, y, "yellow");
    if (y === cave.length - 1 || (y === 0 && x === sourceX)) {
      keepSand = false;
    }
  }
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const { cave, maxY } = buildCaveMap(lines);
  putSand(cave, maxY);

  let total = 0;
  for (let i = 0; i < cave.length; i++) {
    for (let j = 0; j < cave[i].length; j++) {
      if (cave[i][j] === "+") total += 1;
    }
  }
  return total - 1;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const { cave, maxY } = buildCaveMap(lines);
  const lastLine = cave.length - 1;
  for (let i = 0; i < cave[lastLine].length; i++) {
    cave[lastLine][i] = "#";
  }
  putSand(cave, maxY);

  let total = 0;
  for (let i = 0; i < cave.length; i++) {
    for (let j = 0; j < cave[i].length; j++) {
      if (cave[i][j] === "+") total += 1;
    }
  }
  return total;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
