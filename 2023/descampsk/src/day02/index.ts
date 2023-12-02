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
  for (const line of lines) {
    const gameAndBags = line.split(": ");
    const game = gameAndBags[0].split(" ")[1];
    const picks = gameAndBags[1].split("; ");
    let isGamePossible = true;
    for (const pick of picks) {
      const colorBags = pick.split(", ");
      const bagsWithColorAndNumber: Record<string, number> = {};
      colorBags.forEach((colorBag) => {
        const color = colorBag.split(" ")[1];
        const number = colorBag.split(" ")[0];
        bagsWithColorAndNumber[color] = Number.parseInt(number, 10);
      });
      if (
        bagsWithColorAndNumber.red > 12 ||
        bagsWithColorAndNumber.green > 13 ||
        bagsWithColorAndNumber.blue > 14
      ) {
        isGamePossible = false;
        break;
      }
    }
    if (isGamePossible) total += Number.parseInt(game, 10);
  }

  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let total = 0;
  for (const line of lines) {
    const gameAndBags = line.split(": ");
    const picks = gameAndBags[1].split("; ");
    const minColor = {
      red: 0,
      green: 0,
      blue: 0,
    };
    for (const pick of picks) {
      const colorBags = pick.split(", ");
      colorBags.forEach((colorBag) => {
        const color = colorBag.split(" ")[1] as keyof typeof minColor;
        const number = Number.parseInt(colorBag.split(" ")[0], 10);
        if (minColor[color] < number) minColor[color] = number;
      });
    }
    const power = minColor.red * minColor.green * minColor.blue;
    total += power;
  }

  return total;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
