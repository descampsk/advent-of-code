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
const inputTest2 = parseFile("input2.test.txt");
const inputTest3 = parseFile("input3.test.txt");
const inputTest4 = parseFile("input4.test.txt");
const inputTest5 = parseFile("input5.test.txt");

type StatRegion = { perimeter: number; area: number; sides: number };

const computeStatRegion = (map: string[][]) => {
  const regions: number[][] = new Array(map.length)
    .fill(-1)
    .map(() => new Array(map[0].length).fill(-1));
  const statsRegions = new Map<number, StatRegion>();

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (regions[i][j] !== -1) {
        continue;
      }
      regions[i][j] = statsRegions.size;
      statsRegions.set(regions[i][j], { perimeter: 0, area: 0, sides: 0 });

      const visited = new Set<string>();
      const queue: [number, number, number][] = [[i, j, 0]];
      while (queue.length) {
        queue.sort((a, b) => a[2] - b[2]);
        const [x, y, value] = queue.shift() as [number, number, number];
        if (visited.has(`${x},${y}`)) {
          continue;
        }
        visited.add(`${x},${y}`);
        regions[x][y] = regions[i][j];

        [
          [x - 1, y],
          [x, y - 1],
          [x + 1, y],
          [x, y + 1],
        ]
          .filter(
            ([dx, dy]) =>
              dx >= 0 &&
              dy >= 0 &&
              dx < map.length &&
              dy < map[0].length &&
              map[x][y] === map[dx][dy],
          )
          .map(([dx, dy]) => queue.push([dx, dy, value + 1]));
      }
    }
  }

  console.log(
    regions
      .map((line) =>
        line
          .map((region) => {
            const regionStr = region.toString().padStart(2, "0");
            return regionStr;
          })
          .join(" "),
      )
      .join("\n"),
  );

  const visited = new Set<string>();
  for (let i = 0; i < regions.length; i++) {
    for (let j = 0; j < regions[i].length; j++) {
      const region = regions[i][j];
      visited.add(`${i},${j}`);
      statsRegions.get(region)!.area++;
      [
        [i - 1, j],
        [i, j - 1],
        [i + 1, j],
        [i, j + 1],
      ].forEach(([x, y]) => {
        const r = regions[x]?.[y];
        if (r === undefined || r !== region) {
          statsRegions.get(region)!.perimeter++;

          // Top
          if (
            x === i + 1 &&
            (!visited.has(`${i},${j - 1}`) ||
              regions[i]?.[j - 1] !== region ||
              regions[i + 1]?.[j - 1] === region) &&
            (!visited.has(`${i},${j + 1}`) ||
              regions[i]?.[j + 1] !== region ||
              regions[i + 1]?.[j + 1] === region)
          ) {
            console.log("side Top", i, j, x, y);
            statsRegions.get(region)!.sides++;
          }

          // Bot
          if (
            x === i - 1 &&
            (!visited.has(`${i},${j - 1}`) ||
              regions[i]?.[j - 1] !== region ||
              regions[i - 1]?.[j - 1] === region) &&
            (!visited.has(`${i},${j + 1}`) ||
              regions[i]?.[j + 1] !== region ||
              regions[i - 1]?.[j + 1] === region)
          ) {
            console.log("side Bot", i, j, x, y);
            statsRegions.get(region)!.sides++;
          }

          // Left
          if (
            y === j - 1 &&
            (!visited.has(`${i - 1},${j}`) ||
              regions[i - 1]?.[j] !== region ||
              regions[i - 1]?.[j - 1] === region) &&
            (!visited.has(`${i + 1},${j}`) ||
              regions[i + 1]?.[j] !== region ||
              regions[i + 1]?.[j - 1] === region)
          ) {
            console.log("side left", i, j, x, y);
            statsRegions.get(region)!.sides++;
          }

          // Right
          if (
            y === j + 1 &&
            (!visited.has(`${i - 1},${j}`) ||
              regions[i - 1]?.[j] !== region ||
              regions[i - 1]?.[j + 1] === region) &&
            (!visited.has(`${i + 1},${j}`) ||
              regions[i + 1]?.[j] !== region ||
              regions[i + 1]?.[j + 1] === region)
          ) {
            console.log("side right", i, j, x, y);
            statsRegions.get(region)!.sides++;
          }
        }
      });
    }
  }

  return statsRegions;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const map = lines.map((line) => line.split(""));
  const statsRegions = computeStatRegion(map);

  console.log(statsRegions);

  let result = 0;
  for (const value of statsRegions.values()) {
    result += value.area * value.perimeter;
  }
  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const map = lines.map((line) => line.split(""));
  const statsRegions = computeStatRegion(map);

  console.log(statsRegions);

  let result = 0;
  for (const value of statsRegions.values()) {
    result += value.area * value.sides;
  }
  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest2,
        expected: 140,
      },
      {
        input: inputTest3,
        expected: 772,
      },
      {
        input: inputTest,
        expected: 1930,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest2,
        expected: 80,
      },
      {
        input: inputTest3,
        expected: 436,
      },
      {
        input: inputTest4,
        expected: 236,
      },
      {
        input: inputTest5,
        expected: 368,
      },
      {
        input: inputTest,
        expected: 1206,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
