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

const scoreTable: Record<string, number> = {
  "0 0": 1 + 3,
  "0 1": 2 + 6,
  "0 2": 3 + 0,
  "1 0": 1 + 0,
  "1 1": 2 + 3,
  "1 2": 3 + 6,
  "2 0": 1 + 6,
  "2 1": 2 + 0,
  "2 2": 3 + 3,
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let score = 0;
  lines.forEach((line) => {
    const [opponent, myChoice] = line.split(" ");
    const opponentNumber = opponent.toLowerCase().charCodeAt(0) - 97;
    const myChoiceNumber = myChoice.toLowerCase().charCodeAt(0) - 97 - 23;
    score += scoreTable[`${opponentNumber} ${myChoiceNumber}`];
  });

  return score;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let score = 0;
  lines.forEach((line) => {
    const [opponent, winLoseDraw] = line.split(" ");
    const opponentNumber = opponent.toLowerCase().charCodeAt(0) - 97;
    let myChoice = 0;
    switch (winLoseDraw) {
      // lose
      case "X":
        myChoice = (opponentNumber - 1 + 3) % 3;
        break;
      // draw
      case "Y":
        myChoice = opponentNumber;
        break;
      // win
      case "Z":
        myChoice = (opponentNumber + 1) % 3;
        break;
      default:
        break;
    }

    score += scoreTable[`${opponentNumber} ${myChoice}`];
  });
  return score;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
