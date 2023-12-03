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

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let total = 0;

  const engine: string[][] = [];
  for (const line of lines) {
    const row = line.split("");
    engine.push(row);
  }
  for (let i = 0; i < engine.length; i++) {
    const numbers = lines[i].matchAll(/(\d+)/g);
    for (const numberFound of numbers) {
      const index = numberFound.index!;
      const number = numberFound[0];
      const { length } = number;
      let isPartEngine;
      for (let j = -1; j < 2; j++) {
        for (let k = -1; k < length + 1; k++) {
          if (
            i + j >= 0 &&
            i + j < engine.length &&
            index + k < engine[i + j].length &&
            index + k >= 0
          ) {
            const char = engine[i + j][index + k];
            if (char !== "." && Number.isNaN(Number.parseInt(char, 10))) {
              isPartEngine = true;
            }
          }
        }
      }
      if (isPartEngine) {
        total += Number.parseInt(number, 10);
      }
    }
  }
  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let total = 0;

  const engine: string[][] = [];
  const partNumbers: string[][] = [];
  for (const line of lines) {
    const row = line.split("");
    engine.push(row);
    partNumbers.push([...row]);
  }

  // Construction of PartEngine table
  for (let i = 0; i < engine.length; i++) {
    const numbers = lines[i].matchAll(/(\d+)/g);
    for (const numberFound of numbers) {
      const index = numberFound.index!;
      const number = numberFound[0];
      const { length } = number;
      let isPartEngine;
      for (let j = -1; j < 2; j++) {
        for (let k = -1; k < length + 1; k++) {
          if (
            i + j >= 0 &&
            i + j < engine.length &&
            index + k < engine[i + j].length &&
            index + k >= 0
          ) {
            const char = engine[i + j][index + k];
            if (
              char !== "." &&
              char !== "P" &&
              Number.isNaN(Number.parseInt(char, 10))
            ) {
              isPartEngine = true;
            }
          }
        }
      }
      if (isPartEngine) {
        for (let j = 0; j < length; j++) {
          engine[i][index + j] = "P";
          partNumbers[i][index + j] = number;
        }
      }
    }
  }

  // Find the gear ratios
  for (let i = 0; i < engine.length; i++) {
    for (let j = 0; j < engine[i].length; j++) {
      if (engine[i][j] === "*") {
        // console.log(i, j);
        let partNumberCount = 0;
        let gearRatio = 1;
        const usedGearRatios = new Set<string>();
        for (let k = -1; k < 2; k++) {
          for (let l = -1; l < 2; l++) {
            if (
              i + k >= 0 &&
              i + k < engine.length &&
              j + l >= 0 &&
              j + l < engine[i + k].length
            ) {
              // console.log(i + k, j + l, engine[i + k][j + l], usedGearRatios);
              const gearRatioPart = partNumbers[i + k][j + l];
              if (
                engine[i + k][j + l] === "P" &&
                !usedGearRatios.has(gearRatioPart)
              ) {
                partNumberCount++;
                usedGearRatios.add(gearRatioPart);
                gearRatio *= Number.parseInt(gearRatioPart, 10);
              }
            }
          }
        }
        if (partNumberCount === 2) {
          total += gearRatio;
        }
      }
    }
  }
  return total;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
