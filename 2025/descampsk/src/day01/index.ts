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
const inputTest2 = parseFile("input.test2.txt");
const inputTest3 = parseFile("input.test3.txt");
const inputTest4 = parseFile("input.test4.txt");
const inputTest5 = parseFile("input.test5.txt");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const rotations = lines.map((line) => {
    const direction = line[0];
    const value = parseInt(line.slice(1), 10);
    return direction === "L" ? -value : value;
  });

  let dial = 50;
  let result = 0;

  for (const rotation of rotations) {
    dial += rotation;
    dial %= 100;
    if (dial === 0) result += 1;
  }

  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const rotations = lines.map((line) => {
    const direction = line[0];
    const value = parseInt(line.slice(1), 10);
    return direction === "L" ? -value : value;
  });

  let dial = 50;
  let result = 0;

  for (const rotation of rotations) {
    const turns = Math.floor(Math.abs(rotation) / 100);
    const remainder = Math.abs(rotation) % 100;
    console.log({ rotation, turns, remainder });
    result += turns;

    let newDial = (dial + rotation) % 100;
    if (newDial < 0) newDial += 100;
    console.log({ dial, newDial });

    // Si on passe par 0 vers la gauche
    if (
      rotation < 0 &&
      newDial !== 0 &&
      dial !== 0 &&
      Math.abs(remainder) > dial
    ) {
      result += 1;
    }
    // Si on passe par 0 vers la droite
    if (
      rotation > 0 &&
      newDial !== 0 &&
      dial !== 0 &&
      remainder >= 100 - dial
    ) {
      result += 1;
    }
    if (newDial === 0) {
      result += 1;
    }

    dial = newDial;
    console.log(result);
  }

  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 6,
      },
      {
        input: inputTest2,
        expected: 10,
      },
      {
        input: inputTest3,
        expected: 3,
      },
      {
        input: inputTest4,
        expected: 7,
      },
      {
        input: inputTest5,
        expected: 7,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
