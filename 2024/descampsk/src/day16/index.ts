/* eslint-disable no-bitwise */
import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import chalk from "chalk";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { first } from "lodash";
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
const inputTest2 = parseFile("input2.test.txt");
const inputTest3 = parseFile("input3.test.txt");

interface Cell extends DijkstraNode {
  i: number;
  j: number;
  di: number;
  dj: number;
  cost: number;
}

const solveDijkstra = (map: string[][]) => {
  const dikstra = new Dijkstra<Cell>();
  const startNodes: Cell[] = [
    {
      i: map.length - 2,
      j: 1,
      di: 0,
      dj: 1,
      cost: 0,
      getKey() {
        return (this.di << 24) | (this.dj << 16) | (this.j << 8) | this.i;
      },
    },
  ];
  const isDestination = (node: Cell) => {
    return node.i === 1 && node.j === map[0].length - 2;
  };
  const getNextNodes = (node: Cell) => {
    const nextNodes: Cell[] = [];
    for (const [di, dj] of [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ]) {
      const i = node.i + di;
      const j = node.j + dj;
      if (
        [".", "E"].includes(map[i][j]) &&
        (node.di !== -1 * di || node.dj !== -1 * dj)
      ) {
        const cost =
          di === node.di && dj === node.dj ? node.cost + 1 : node.cost + 1001;
        nextNodes.push({
          i,
          j,
          di,
          dj,
          cost,
          getKey() {
            return (this.di << 24) | (this.dj << 16) | (this.j << 8) | this.i;
          },
        });
      }
    }
    // console.log(nextNodes.map((n) => `${n.i},${n.j},${n.cost}`));
    return nextNodes;
  };
  return dikstra.findShortestPath(startNodes, () => false, getNextNodes);
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const map = lines.map((line) => line.split(""));
  console.log(map.map((line) => line.join("")).join("\n"));

  const { previous, distances } = solveDijkstra(map);

  const endKey = (-1 << 24) | ((map[0].length - 2) << 8) | 1;

  // console.log(result?.previous);

  const end = previous.get(endKey)!;
  console.log(end);

  let previousCell: Cell | undefined = end;
  while (previousCell) {
    map[previousCell.i][previousCell.j] = chalk.red("O");
    previousCell = previous.get(previousCell.getKey());
  }

  // for (const node of result?.path ?? []) {
  //   map[node.i][node.j] = chalk.red("O");
  // }
  console.log(map.map((line) => line.join("")).join("\n"));

  return distances.get(endKey)!.cost;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const map = lines.map((line) => line.split(""));
  console.log(map.map((line) => line.join("")).join("\n"));
  console.log(" ");

  const { previous, distances } = solveDijkstra(map);

  const endKey = (-1 << 24) | ((map[0].length - 2) << 8) | 1;
  const end = distances.get(endKey)!;

  let previousCell: Cell | undefined = end;
  while (previousCell) {
    map[previousCell.i][previousCell.j] = chalk.red("O");
    previousCell = previous.get(previousCell.getKey());
  }
  console.log(map.map((line) => line.join("")).join("\n"));

  const queue: Cell[] = [end];
  while (queue.length > 0) {
    // console.log(queue.map((cell) => `${cell.i},${cell.j},${cell.cost}`));
    const cell = queue.shift()!;
    map[cell.i][cell.j] = chalk.red("O");

    const { parent } = cell as { parent: Cell | undefined };
    if (parent) {
      queue.push(parent);
      const neighbors = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ]
        .map(([di, dj]) => [cell.i + di, cell.j + dj, di, dj])
        .filter(([i, j]) => i !== parent.i || j !== parent.j)
        .filter(([i, j]) => i !== 1 || j !== map[0].length - 3)
        .filter(([i, j, di, dj]) => {
          const neighborKey = (-di << 24) | (-dj << 16) | (j << 8) | i;
          const neighborCost = distances.get(neighborKey)?.cost;
          if (!neighborCost) return false;

          const previousNeighbor = previous.get(neighborKey);

          console.log(
            cell.i,
            cell.j,
            parent.i,
            parent.j,
            i,
            j,
            previousNeighbor?.i,
            previousNeighbor?.j,
            cell.cost,
            neighborCost,
            parent.cost,
          );

          return (
            [1, 1001].includes(Math.abs(neighborCost - cell.cost)) &&
            (previousNeighbor?.i !== cell.i || previousNeighbor?.j !== cell.j)
          );
        });

      console.log(neighbors);
      neighbors
        .map(([i, j, di, dj]) =>
          distances.get((-di << 24) | (-dj << 16) | (j << 8) | i),
        )
        .forEach((c) => {
          if (c) {
            queue.push(c);
          }
        });
    }
  }

  console.log(map.map((line) => line.join("")).join("\n"));
  console.log(" ");

  let result = 0;
  for (const line of map) {
    for (const cell of line) {
      if (cell === chalk.red("O")) {
        result++;
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
        expected: 7036,
      },
      {
        input: inputTest2,
        expected: 11048,
      },
      // {
      //   input: inputTest3,
      //   expected: 109516,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 45,
      },
      {
        input: inputTest2,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
