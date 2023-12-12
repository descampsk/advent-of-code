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

const getRaces = (lines: string[]) => {
  const races: { time: number; distance: number }[] = [];
  const timeLine = lines[0];
  const times = [...timeLine.matchAll(/(\d+)/g)].map((m) =>
    Number.parseInt(m[0], 10),
  );

  const distanceLine = lines[1];
  const distances = [...distanceLine.matchAll(/(\d+)/g)].map((m) =>
    Number.parseInt(m[0], 10),
  );

  for (let i = 0; i < times.length; i++) {
    races.push({
      time: times[i],
      distance: distances[i],
    });
  }
  return races;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const races = getRaces(lines);
  let total = 1;
  for (const race of races) {
    const { time: b, distance: c } = race;
    // Soit x le temps d'accélération
    // Soit c la distance parcourue
    // Soit b le temps de la course
    // On a c = x * (b - x)
    // soit c = x b - x²
    // On veut résoudre x² - bx + c = 0
    // On a x1 = (b - sqrt(b²-4c))/2
    // On a x2 = (b + sqrt(b²-4c))/2
    const sqrtDelta = Math.sqrt(b * b - 4 * c);
    const x1 = (b + sqrtDelta) / 2;
    const x2 = (b - sqrtDelta) / 2;
    const x1Sup = Math.floor(x1) === x1 ? x1 - 1 : Math.floor(x1);
    const x2Sup = Math.ceil(x2) === x2 ? x2 + 1 : Math.ceil(x2);
    // console.log(race, sqrtDelta, x1, x2, x1Sup, x2Sup);
    total *= x1Sup - x2Sup + 1;
  }

  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const b = Number.parseInt(
    [...lines[0].matchAll(/(\d+)/g)]
      .map((m) => Number.parseInt(m[0], 10))
      .join(""),
    10,
  );

  const distanceLine = lines[1];
  const c = Number.parseInt(
    [...distanceLine.matchAll(/(\d+)/g)]
      .map((m) => Number.parseInt(m[0], 10))
      .join(""),
    10,
  );

  console.log("time", b);
  console.log("distance", c);
  const sqrtDelta = Math.sqrt(b * b - 4 * c);
  const x1 = (b + sqrtDelta) / 2;
  const x2 = (b - sqrtDelta) / 2;
  const x1Sup = Math.floor(x1) === x1 ? x1 - 1 : Math.floor(x1);
  const x2Sup = Math.ceil(x2) === x2 ? x2 + 1 : Math.ceil(x2);
  console.log(b, c, sqrtDelta, x1, x2, x1Sup, x2Sup);
  return x1Sup - x2Sup + 1;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
