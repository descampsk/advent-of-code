import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { L } from "../day17/Rock";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

const buildCubesAndMap = (lines: string[]) => {
  const cubes: number[][] = [];
  let max = 0;
  lines.forEach((line) => {
    const cube = line.split(",").map((value) => parseInt(value, 10));
    cubes.push(cube);
    const maxCube = _.max(cube)!;
    if (maxCube > max) max = maxCube;
  });
  // To avoid borders issues
  max += 1;
  const map: number[][][] = new Array(max)
    .fill(0)
    .map(() => new Array(max).fill(0).map(() => new Array(max).fill(0)));

  cubes.forEach((cube) => {
    map[cube[0]][cube[1]][cube[2]] = 1;
  });
  return { cubes, map, max };
};

const isCubeTrapped = (
  direction: number[],
  map: number[][][],
  deepth: number,
): boolean => {
  const [x, y, z] = direction;
  const size = map.length;
  if (
    x === 0 ||
    y === 0 ||
    z === 0 ||
    x === size - 1 ||
    y === size - 1 ||
    z === size - 1
  )
    return false;

  if (deepth > 5) return true;

  const directions: number[][] = [];
  if (!map[x][y][z + 1]) directions.push([x, y, z + 1]);
  if (!map[x][y][z - 1]) directions.push([x, y, z - 1]);
  if (!map[x][y + 1][z]) directions.push([x, y + 1, z]);
  if (!map[x][y - 1][z]) directions.push([x, y - 1, z]);
  if (!map[x + 1][y][z]) directions.push([x + 1, y, z]);
  if (!map[x - 1][y][z]) directions.push([x - 1, y, z]);

  if (directions.length <= 1 && deepth > 1) return true;

  return directions.reduce(
    (isTrapped, nextDirection) =>
      isTrapped && isCubeTrapped(nextDirection, map, deepth + 1),
    true,
  );
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const { cubes, map, max } = buildCubesAndMap(lines);

  let total = 0;
  cubes.forEach(([x, y, z]) => {
    if (z >= max - 1 || !map[x][y][z + 1]) total += 1;
    if (z === 0 || !map[x][y][z - 1]) total += 1;
    if (y >= max - 1 || !map[x][y + 1][z]) total += 1;
    if (y === 0 || !map[x][y - 1][z]) total += 1;
    if (x >= max - 1 || !map[x + 1][y][z]) total += 1;
    if (x === 0 || !map[x - 1][y][z]) total += 1;
  });

  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const { cubes, map, max } = buildCubesAndMap(lines);
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      for (let z = 0; z < map[x][y].length; z++) {
        console.log(x, y, z);
        if (isCubeTrapped([x, y, z], map, 0)) {
          map[x][y][z] = 2;
        }
      }
    }
  }

  let total = 0;
  cubes.forEach(([x, y, z]) => {
    if (z >= max - 1 || !map[x][y][z + 1]) total += 1;
    if (z === 0 || !map[x][y][z - 1]) total += 1;
    if (y >= max - 1 || !map[x][y + 1][z]) total += 1;
    if (y === 0 || !map[x][y - 1][z]) total += 1;
    if (x >= max - 1 || !map[x + 1][y][z]) total += 1;
    if (x === 0 || !map[x - 1][y][z]) total += 1;
  });

  return total;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 58,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
