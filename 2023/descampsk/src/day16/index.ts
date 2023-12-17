/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { Terminal } from "command-line-draw";
import { fileURLToPath } from "url";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

const drawVisual = true;

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const showLight = async (
  grid: string[][],
  energizedGrid: string[][],
  pathSet: Set<string>,
  [startI, startJ]: [number, number],
  [startDirectionI, startDirectionJ]: [number, number],
  terminal: Terminal,
) => {
  const nexts: [number, number, number, number][] = [
    [startI, startJ, startDirectionI, startDirectionJ],
  ];
  while (nexts.length) {
    const [i, j, directionI, directionJ] = nexts.shift()!;
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[i].length) continue;

    // while (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
    energizedGrid[i][j] = "#";
    const pathWithDirection = `${i},${j}-${directionI},${directionJ}`;

    if (drawVisual) {
      terminal.write("#", j, i, "yellow");
      await sleep(50 / (nexts.length + 1));
    }

    if (pathSet.has(pathWithDirection)) {
      continue;
    }
    pathSet.add(pathWithDirection);

    const char = grid[i][j];
    // console.log(char, i, j, directionI, directionJ);
    // console.log("Energized grid:");
    // console.log(energizedGrid.map((line) => line.join("")).join("\n"));
    if (char === "|" && !directionI) {
      nexts.push([i + 1, j, 1, 0]);
      nexts.push([i - 1, j, -1, 0]);

      continue;
    }

    if (char === "-" && !directionJ) {
      nexts.push([i, j + 1, 0, 1]);
      nexts.push([i, j - 1, 0, -1]);
      continue;
    }

    let newDirectionI = directionI;
    let newDirectionJ = directionJ;
    if (char === "/") {
      if (directionI === 1) {
        newDirectionI = 0;
        newDirectionJ = -1;
      } else if (directionI === -1) {
        newDirectionI = 0;
        newDirectionJ = 1;
      } else if (directionJ === 1) {
        newDirectionI = -1;
        newDirectionJ = 0;
      } else if (directionJ === -1) {
        newDirectionI = 1;
        newDirectionJ = 0;
      }
    }

    if (char === "\\") {
      if (directionI === 1) {
        newDirectionI = 0;
        newDirectionJ = 1;
      } else if (directionI === -1) {
        newDirectionI = 0;
        newDirectionJ = -1;
      } else if (directionJ === 1) {
        newDirectionI = 1;
        newDirectionJ = 0;
      } else if (directionJ === -1) {
        newDirectionI = -1;
        newDirectionJ = 0;
      }
    }

    nexts.push([
      i + newDirectionI,
      j + newDirectionJ,
      newDirectionI,
      newDirectionJ,
    ]);
  }
};

const computeTotalEnergy = (grid: string[][]) => {
  return grid.reduce((total, line) => {
    return total + line.filter((c) => c === "#").length;
  }, 0);
};

const drawMirror = async (grid: string[][], terminal: Terminal) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      // console.log(grid[i][j], i, j);
      terminal.write(grid[i][j], j, i, "white");
      // eslint-disable-next-line no-await-in-loop
      // await sleep(1);
    }
  }
};

const part1 = async (rawInput: string) => {
  const lines = parseInput(rawInput);
  const grid = lines.map((line) => line.split(""));
  const energizedGrid = lines.map((line) => line.split("").map(() => "."));

  if (drawVisual) console.clear();
  const terminal = (
    drawVisual
      ? new Terminal({
          width: grid[0].length,
          height: grid.length,
        })
      : null
  ) as Terminal;

  if (drawVisual) await drawMirror(grid, terminal);

  await showLight(
    grid,
    energizedGrid,
    new Set<string>(),
    [0, 0],
    [0, 1],
    terminal,
  );
  // console.log("Energized grid:");
  // console.log(energizedGrid.map((line) => line.join("")).join("\n"));
  // console.log("");
  // console.log("Grid:");
  // console.log(grid.map((line) => line.join("")).join("\n"));

  console.log("");

  return computeTotalEnergy(energizedGrid);
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const grid = lines.map((line) => line.split(""));
  let maxTotalEnergy = 0;
  let bestStartPosition = [0, 0];
  for (let i = 0; i < grid.length; i++) {
    for (const j of [0, grid[i].length - 1]) {
      const energizedGrid = lines.map((line) => line.split("").map(() => "."));
      showLight(
        grid,
        energizedGrid,
        new Set<string>(),
        [i, j],
        [0, j ? -1 : 1],
      );
      const totalEnergy = computeTotalEnergy(energizedGrid);
      // console.log("Total energy:", totalEnergy, i, j);
      if (totalEnergy > maxTotalEnergy) {
        maxTotalEnergy = totalEnergy;
        bestStartPosition = [i, j];
      }
    }
  }
  for (const i of [0, grid.length - 1]) {
    for (let j = 1; j < grid[i].length - 1; j++) {
      const energizedGrid = lines.map((line) => line.split("").map(() => "."));
      showLight(
        grid,
        energizedGrid,
        new Set<string>(),
        [i, j],
        [i ? -1 : 1, 0],
      );

      const totalEnergy = computeTotalEnergy(energizedGrid);
      // console.log("Total energy:", totalEnergy, i, j);
      // console.log(energizedGrid.map((line) => line.join("")).join("\n"));

      if (totalEnergy > maxTotalEnergy) {
        maxTotalEnergy = totalEnergy;
        bestStartPosition = [i, j];
      }
    }
  }
  // console.log("Best start position:", bestStartPosition);
  return maxTotalEnergy;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 46,
      },
    ],
    solution: part1,
  },
  // part2: {
  //   tests: [
  //     {
  //       input: inputTest,
  //       expected: 51,
  //     },
  //   ],
  //   solution: part2,
  // },
  trimTestInputs: true,
  onlyTests: false,
});
