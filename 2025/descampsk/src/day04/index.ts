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

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const diagram = lines.map((line) => line.split(""));

  let result = 0;
  for (let i = 0; i < diagram.length; i++) {
    for (let j = 0; j < diagram[i].length; j++) {
      const isPaper = diagram[i][j] === "@";
      if (!isPaper) continue;

      let totalRolls = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          if (i + di < 0 || i + di >= diagram.length) continue;
          if (j + dj < 0 || j + dj >= diagram[i].length) continue;

          if (diagram[i + di][j + dj] === "@") {
            totalRolls++;
          }
        }
      }
      if (totalRolls < 4) result += 1;
    }
  }

  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const diagram = lines.map((line) => line.split(""));

  let result = 0;
  let totalRollsFound = Infinity;

  let currentLoop = 0;

  while (totalRollsFound > 0 && currentLoop < 100) {
    currentLoop++;
    totalRollsFound = 0;

    for (let i = 0; i < diagram.length; i++) {
      for (let j = 0; j < diagram[i].length; j++) {
        const isPaper = diagram[i][j] === "@";
        if (!isPaper) continue;

        let totalRolls = 0;
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue;
            if (i + di < 0 || i + di >= diagram.length) continue;
            if (j + dj < 0 || j + dj >= diagram[i].length) continue;

            if (diagram[i + di][j + dj] === "@") {
              totalRolls++;
            }
          }
        }

        // console.log(i, j, totalRolls, totalRollsFound);
        if (totalRolls < 4) {
          totalRollsFound++;
          result += 1;
          diagram[i][j] = "x";
        }
      }
    }

    console.log(`Loop ${currentLoop}`);
    for (let i = 0; i < diagram.length; i++) {
      console.log(diagram[i].join(""));
    }
  }

  return result;
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
        expected: 43,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
