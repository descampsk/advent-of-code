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

  let result = 0;

  for (const line of lines) {
    let maxIndex = -1;
    let max = -1;
    for (let i = 0; i < line.length - 1; i++) {
      const num = parseInt(line[i], 10);
      if (num > max) {
        max = num;
        maxIndex = i;
      }
    }
    if (maxIndex === -1) {
      throw new Error("No max found");
    }
    let secondMax = -1;
    for (let i = maxIndex + 1; i < line.length; i++) {
      const num = parseInt(line[i], 10);
      if (num > secondMax) {
        secondMax = num;
      }
    }
    result += parseInt(`${max}${secondMax}`, 10);
  }
  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let result = 0;

  for (const line of lines) {
    let lastDigitIndex = 0;
    let voltage = "";
    for (let totalVoltage = 0; totalVoltage < 12; totalVoltage++) {
      let maxIndex = -1;
      let max = -1;
      for (
        let i = lastDigitIndex;
        i < lines[0].length - 11 + totalVoltage;
        i++
      ) {
        const num = parseInt(line[i], 10);
        if (num > max) {
          max = num;
          maxIndex = i;
        }
      }
      if (maxIndex === -1) {
        throw new Error("No max found");
      }

      voltage += `${max}`;
      lastDigitIndex = maxIndex + 1;
    }
    // console.log(voltage);
    result += parseInt(voltage, 10);
  }
  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 357,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 3121910778619,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
