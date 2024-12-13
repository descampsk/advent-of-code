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

type ClawMachine = {
  AX: number;
  AY: number;
  BX: number;
  BY: number;
  X: number;
  Y: number;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const clawMachines: ClawMachine[] = [];
  while (lines.length && lines[0] !== "") {
    const buttonA = lines
      .shift()!
      .matchAll(/X\+(\d+), Y\+(\d+)/g)
      .next();
    const AX = Number(buttonA.value![1]);
    const AY = Number(buttonA.value![2]);
    const buttonB = lines
      .shift()!
      .matchAll(/X\+(\d+), Y\+(\d+)/g)
      .next();
    const BX = Number(buttonB.value![1]);
    const BY = Number(buttonB.value![2]);
    const price = lines
      .shift()!
      .matchAll(/X=(\d+), Y=(\d+)/g)
      .next();
    const X = Number(price.value![1]);
    const Y = Number(price.value![2]);
    clawMachines.push({ AX, AY, BX, BY, X, Y });
    lines.shift();
  }
  console.log(clawMachines);

  let result = 0;
  for (const clawMachine of clawMachines) {
    const { AX, AY, BX, BY, X, Y } = clawMachine;
    const a = Math.round(
      X / AX - ((BX / AX) * (Y * AX - X * AY)) / (BY * AX - BX * AY),
    );
    const b = Math.round((Y * AX - X * AY) / (BY * AX - BX * AY));

    const resultX = a * AX + b * BX;
    const resultY = a * AY + b * BY;
    if (resultX === X && resultY === Y) {
      result += 3 * a + b;
      console.log("ClawMachine OK", clawMachine, a, b, 3 * a + b);
    } else {
      console.log("ClawMachine KO", clawMachine, a, b);
    }
  }

  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const clawMachines: ClawMachine[] = [];
  while (lines.length && lines[0] !== "") {
    const buttonA = lines
      .shift()!
      .matchAll(/X\+(\d+), Y\+(\d+)/g)
      .next();
    const AX = Number(buttonA.value![1]);
    const AY = Number(buttonA.value![2]);
    const buttonB = lines
      .shift()!
      .matchAll(/X\+(\d+), Y\+(\d+)/g)
      .next();
    const BX = Number(buttonB.value![1]);
    const BY = Number(buttonB.value![2]);
    const price = lines
      .shift()!
      .matchAll(/X=(\d+), Y=(\d+)/g)
      .next();
    const X = Number(price.value![1]) + 10000000000000;
    const Y = Number(price.value![2]) + 10000000000000;
    clawMachines.push({ AX, AY, BX, BY, X, Y });
    lines.shift();
  }
  let result = 0;
  for (const clawMachine of clawMachines) {
    const { AX, AY, BX, BY, X, Y } = clawMachine;
    const a = Math.round(
      X / AX - ((BX / AX) * (Y * AX - X * AY)) / (BY * AX - BX * AY),
    );
    const b = Math.round((Y * AX - X * AY) / (BY * AX - BX * AY));

    const resultX = a * AX + b * BX;
    const resultY = a * AY + b * BY;
    if (resultX === X && resultY === Y) {
      result += 3 * a + b;
      console.log("ClawMachine OK", clawMachine, a, b, 3 * a + b);
    } else {
      console.log("ClawMachine KO", clawMachine, a, b);
    }
  }

  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 480,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 0,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
