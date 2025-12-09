import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

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

type Point = { x: number; y: number };

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const redTiles: { x: number; y: number }[] = lines.map((line) => {
    const [xStr, yStr] = line.split(",");
    return { x: parseInt(xStr, 10), y: parseInt(yStr, 10) };
  });

  // const maxX = Math.max(...redTiles.map(({ x }) => x));
  // const maxY = Math.max(...redTiles.map(({ y }) => y));

  // const matrix: string[][] = Array.from({ length: maxY + 2 }, () =>
  //   Array.from({ length: maxX + 2 }, () => "."),
  // );

  // for (const { x, y } of redTiles) {
  //   matrix[y][x] = "#";
  // }

  // console.log(matrix.map((row) => row.join("")).join("\n"));

  const pairs: [Point, Point][] = [];
  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      pairs.push([redTiles[i], redTiles[j]]);
    }
  }

  console.log(pairs);

  let maxArea = 0;
  for (const [p1, p2] of pairs) {
    const area = Math.abs(p1.x - p2.x + 1) * Math.abs(p1.y - p2.y + 1);
    if (area > maxArea) {
      maxArea = area;
    }
  }

  console.log("Max Area:", maxArea);

  return maxArea;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  return 0;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 50,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
