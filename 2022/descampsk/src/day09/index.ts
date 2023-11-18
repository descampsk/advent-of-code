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

type Position = {
  x: number;
  y: number;
};
type Rope = Record<string, Position>;

const tailTooFar = (head: Position, tail: Position) => {
  if (Math.abs(head.x - tail.x) > 1 || Math.abs(head.y - tail.y) > 1) {
    return true;
  }
  return false;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const visitedPosition: Record<string, boolean> = {};
  const visitedHeadPosition: Record<string, boolean> = {};
  const headPosition: string[] = [];
  const tailPosition: string[] = [];
  const rope: Rope = {
    head: {
      x: 0,
      y: 0,
    },
    tail: {
      x: 0,
      y: 0,
    },
  };
  lines.forEach((line) => {
    const [direction, totalMoveStr] = line.split(" ");
    const totalMove = Number.parseInt(totalMoveStr, 10);
    for (let i = 0; i < totalMove; i++) {
      if (direction === "U") {
        rope.head.y += 1;
      }
      if (direction === "D") {
        rope.head.y -= 1;
      }
      if (direction === "R") {
        rope.head.x += 1;
      }
      if (direction === "L") {
        rope.head.x -= 1;
      }
      if (tailTooFar(rope.head, rope.tail)) {
        rope.tail.x +=
          rope.tail.x === rope.head.x
            ? 0
            : (rope.head.x - rope.tail.x) / Math.abs(rope.tail.x - rope.head.x);
        rope.tail.y +=
          rope.tail.y === rope.head.y
            ? 0
            : (rope.head.y - rope.tail.y) / Math.abs(rope.head.y - rope.tail.y);
      }
      headPosition.push(`${rope.head.x},${rope.head.y}`);
      tailPosition.push(`${rope.tail.x},${rope.tail.y}`);
      visitedHeadPosition[`${rope.head.x},${rope.head.y}`] = true;
      visitedPosition[`${rope.tail.x}-,${rope.tail.y}`] = true;
    }
  });
  return Object.keys(visitedPosition).length;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const visitedPosition: Record<number, Record<string, boolean>> = {};
  const positions: Record<number, string[]> = {};
  const rope: Rope = {};
  for (let i = 0; i < 10; i++) {
    rope[i] = {
      x: 0,
      y: 0,
    };
    positions[i] = [];
    visitedPosition[i] = {};
  }
  lines.forEach((line) => {
    const [direction, totalMoveStr] = line.split(" ");
    const totalMove = Number.parseInt(totalMoveStr, 10);
    for (let i = 0; i < totalMove; i++) {
      if (direction === "U") {
        rope[0].y += 1;
      }
      if (direction === "D") {
        rope[0].y -= 1;
      }
      if (direction === "R") {
        rope[0].x += 1;
      }
      if (direction === "L") {
        rope[0].x -= 1;
      }
      positions[0].push(`${rope[0].x},${rope[0].y}`);
      visitedPosition[0][`${rope[0].x},${rope[0].y}`] = true;
      for (let j = 1; j < 10; j++) {
        if (tailTooFar(rope[j], rope[j - 1])) {
          rope[j].x +=
            rope[j - 1].x === rope[j].x
              ? 0
              : (rope[j - 1].x - rope[j].x) /
                Math.abs(rope[j - 1].x - rope[j].x);
          rope[j].y +=
            rope[j - 1].y === rope[j].y
              ? 0
              : (rope[j - 1].y - rope[j].y) /
                Math.abs(rope[j].y - rope[j - 1].y);
        }
        positions[j].push(`${rope[j].x},${rope[j].y}`);
        visitedPosition[j][`${rope[j].x},${rope[j].y}`] = true;
      }
    }
  });
  return Object.keys(visitedPosition[9]).length;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 1,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
