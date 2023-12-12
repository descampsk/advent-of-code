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
    let totalWinningCard = 0;
    const cardAndNumbers = line.split(": ");
    const numbers = cardAndNumbers[1];
    const winingAndMyNumbers = numbers.split(" | ");
    const winningNumbers = winingAndMyNumbers[0]
      .split(" ")
      .filter((n) => n !== "");
    const myNumbers = winingAndMyNumbers[1].split(" ").filter((n) => n !== "");
    for (const myNumber of myNumbers) {
      if (winningNumbers.includes(myNumber)) {
        totalWinningCard++;
      }
    }
    if (totalWinningCard > 0) total += 2 ** (totalWinningCard - 1);
  }
  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const totalGames: Record<number, number> = {};
  lines.forEach((line, index) => {
    totalGames[index + 1] = 1;
  });
  for (const line of lines) {
    let totalWinningCard = 0;
    const cardAndNumbers = line.split(": ");
    const gameStr = cardAndNumbers[0].split(" ");
    const game = Number.parseInt(gameStr[gameStr.length - 1], 10);
    const numbers = cardAndNumbers[1];
    const winingAndMyNumbers = numbers.split(" | ");
    const winningNumbers = winingAndMyNumbers[0]
      .split(" ")
      .filter((n) => n !== "");
    const myNumbers = winingAndMyNumbers[1].split(" ").filter((n) => n !== "");
    for (const myNumber of myNumbers) {
      if (winningNumbers.includes(myNumber)) {
        totalWinningCard++;
      }
    }
    if (totalWinningCard > 0) {
      for (let i = 1; i <= totalWinningCard; i++) {
        totalGames[game + i] = totalGames[game + i] + totalGames[game];
      }
    }
  }

  return Object.values(totalGames).reduce((a, b) => a + b, 0);
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
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
