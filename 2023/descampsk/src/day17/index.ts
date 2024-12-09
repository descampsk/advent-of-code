/* eslint-disable no-bitwise */
/* eslint-disable no-constant-condition */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable no-use-before-define */
import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Dijkstra, DijkstraNode } from "../helpers/Dijkstra.js";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

interface CrucibleState extends DijkstraNode {
  x: number;
  y: number;
  cost: number;
  dir: number;
  straight: number;
}

const directions = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
];

const createDijkstra = (
  matrix: number[][],
  departure: [number, number],
  destination: [number, number],
  minStraight: number,
  maxStraight: number,
) => {
  const dijkstra = new Dijkstra<CrucibleState>();

  const startNodes: CrucibleState[] = [
    {
      x: departure[0],
      y: departure[1],
      cost: 0,
      dir: 0,
      straight: 0,
      getKey() {
        return (
          (this.x << 24) | (this.y << 16) | (this.dir << 8) | this.straight
        );
      },
    },
    {
      x: departure[0],
      y: departure[1],
      cost: 0,
      dir: 1,
      straight: 0,
      getKey() {
        return (
          (this.x << 24) | (this.y << 16) | (this.dir << 8) | this.straight
        );
      },
    },
  ];

  const isDestination = (node: CrucibleState) =>
    node.x === destination[0] &&
    node.y === destination[1] &&
    (minStraight === 0 || node.straight >= minStraight);

  const getNextNodes = (current: CrucibleState): CrucibleState[] => {
    const nextNodes: CrucibleState[] = [];

    for (let newDir = 0; newDir < 4; newDir++) {
      // Can't reverse direction
      if (Math.abs(newDir - current.dir) === 2) continue;

      // Handle straight line constraints
      if (newDir === current.dir && current.straight >= maxStraight) continue;
      if (
        newDir !== current.dir &&
        current.straight < minStraight &&
        current.straight !== 0
      )
        continue;

      const straight = newDir === current.dir ? current.straight + 1 : 1;
      const [dx, dy] = directions[newDir];
      const newX = current.x + dx;
      const newY = current.y + dy;

      if (
        newX >= 0 &&
        newX < matrix.length &&
        newY >= 0 &&
        newY < matrix[0].length
      ) {
        nextNodes.push({
          x: newX,
          y: newY,
          cost: current.cost + matrix[newX][newY],
          dir: newDir,
          straight,
          getKey() {
            return (
              (this.x << 24) | (this.y << 16) | (this.dir << 8) | this.straight
            );
          },
        });
      }
    }
    return nextNodes;
  };

  return dijkstra.findShortestPath(startNodes, isDestination, getNextNodes);
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const matrix = lines.map((line) => line.split("").map(Number));
  const result = createDijkstra(
    matrix,
    [0, 0],
    [matrix.length - 1, matrix[0].length - 1],
    0,
    3,
  );
  return result?.cost ?? Infinity;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const matrix = lines.map((line) => line.split("").map(Number));
  const result = createDijkstra(
    matrix,
    [0, 0],
    [matrix.length - 1, matrix[0].length - 1],
    4,
    10,
  );
  return result?.cost ?? Infinity;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 102,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 94,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
