import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { Dijkstra, DijkstraNode } from "../helpers/Dijkstra.js";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const parseFile = (filename: string) =>
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), filename).replace(
      /\/dist\//g,
      "/src/",
    ),
    "utf-8",
  );

const inputTest = parseFile("input.test.txt");

interface Cell extends DijkstraNode {
  i: number;
  j: number;
}

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const bytes: [number, number][] = [];
  for (const line of lines) {
    const [i, j] = line.split(",").map(Number);
    bytes.push([i, j]);
  }

  const maxBytes = bytes.length < 30 ? 12 : 1024;
  const width = bytes.length < 30 ? 7 : 71;

  const grid = Array.from({ length: width }, () =>
    Array.from({ length: width }, () => "."),
  );
  for (let i = 0; i < maxBytes; i++) {
    const [x, y] = bytes[i];
    grid[y][x] = "#";
  }

  console.log(grid.map((line) => line.join("")).join("\n"));

  const start: Cell = {
    i: 0,
    j: 0,
    cost: 0,
    getKey() {
      return `${this.i},${this.j}`;
    },
  };
  const isDestination = (node: Cell) => {
    return node.i === width - 1 && node.j === width - 1;
  };
  const getNextNodes = (node: Cell) => {
    const nextNodes: Cell[] = [];
    for (const [di, dj] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      const nextNode = {
        i: node.i + di,
        j: node.j + dj,
        cost: node.cost + 1,
        getKey() {
          return `${this.i},${this.j}`;
        },
      };
      if (
        nextNode.i >= 0 &&
        nextNode.i < width &&
        nextNode.j >= 0 &&
        nextNode.j < width &&
        grid[nextNode.j][nextNode.i] !== "#"
      ) {
        nextNodes.push(nextNode);
      }
    }
    return nextNodes;
  };

  const dikstra = new Dijkstra<Cell>();
  const result = dikstra.findShortestPath([start], isDestination, getNextNodes);
  // console.log(result);

  const { path } = result;
  for (const node of path) {
    grid[node.j][node.i] = chalk.red("O");
  }

  console.log(" ");

  console.log(grid.map((line) => line.join("")).join("\n"));

  return result.node?.cost;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const bytes: [number, number][] = [];
  for (const line of lines) {
    const [i, j] = line.split(",").map(Number);
    bytes.push([i, j]);
  }

  const maxBytes = bytes.length < 30 ? 12 : 1024;
  const width = bytes.length < 30 ? 7 : 71;

  const grid = Array.from({ length: width }, () =>
    Array.from({ length: width }, () => "."),
  );
  for (let i = 0; i < maxBytes; i++) {
    const [x, y] = bytes[i];
    grid[y][x] = "#";
  }

  console.log(grid.map((line) => line.join("")).join("\n"));

  const start: Cell = {
    i: 0,
    j: 0,
    cost: 0,
    getKey() {
      return `${this.i},${this.j}`;
    },
  };
  const isDestination = (node: Cell) => {
    return node.i === width - 1 && node.j === width - 1;
  };
  const getNextNodes = (node: Cell) => {
    const nextNodes: Cell[] = [];
    for (const [di, dj] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      const nextNode = {
        i: node.i + di,
        j: node.j + dj,
        cost: node.cost + 1,
        getKey() {
          return `${this.i},${this.j}`;
        },
      };
      if (
        nextNode.i >= 0 &&
        nextNode.i < width &&
        nextNode.j >= 0 &&
        nextNode.j < width &&
        grid[nextNode.j][nextNode.i] !== "#"
      ) {
        nextNodes.push(nextNode);
      }
    }
    return nextNodes;
  };

  const dikstra = new Dijkstra<Cell>();
  let result = dikstra.findShortestPath([start], isDestination, getNextNodes);
  let index = maxBytes - 1;
  while (result.node) {
    index++;
    const [i, j] = bytes[index];
    grid[j][i] = "#";
    result = dikstra.findShortestPath([start], isDestination, getNextNodes);
  }
  // console.log(result);

  const [i, j] = bytes[index];

  const { distances } = result;
  for (const key of distances.keys()) {
    const [i, j] = (key as string).split(",").map(Number);
    grid[i][j] = chalk.red("O");
  }

  console.log(" ");

  console.log(grid.map((line) => line.join("")).join("\n"));

  return `${i},${j}`;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 22,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: "6,1",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
