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

const preparePiles = (
  lines: string[],
): { piles: Record<string, string[]>; lastIndex: number } => {
  let i = 0;
  const piles: Record<string, string[]> = {};
  while (lines[i].length) {
    const line = lines[i];
    for (let j = 0; j < line.length; j += 4) {
      const letter = line[j + 1];
      if (/^[a-zA-Z]+$/.test(letter)) {
        const pileIndex = Math.floor(j / 4) + 1;
        if (piles[pileIndex]) {
          piles[pileIndex].push(letter);
        } else {
          piles[pileIndex] = [letter];
        }
      }
    }
    i += 1;
  }
  return {
    piles,
    lastIndex: i,
  };
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const { piles, lastIndex } = preparePiles(lines);
  let i = lastIndex + 1;
  while (i < lines.length && lines[i].length) {
    const line = lines[i];
    const numbers = line.match(/\d+/g);
    if (numbers) {
      const [total, pileA, pileB] = numbers.map((number) =>
        Number.parseInt(number, 10),
      );
      for (let j = 0; j < total; j++) {
        const letter = piles[pileA].shift();
        if (letter) {
          piles[pileB].unshift(letter);
        }
      }
    }
    i += 1;
  }
  let result = "";
  for (let j = 1; j <= Object.keys(piles).length; j++) {
    result += piles[j][0];
  }
  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const { piles, lastIndex } = preparePiles(lines);
  let i = lastIndex + 1;
  console.log(piles);
  while (i < lines.length && lines[i].length) {
    const line = lines[i];
    const numbers = line.match(/\d+/g);
    if (numbers) {
      const [total, pileA, pileB] = numbers.map((number) =>
        Number.parseInt(number, 10),
      );
      const letters = [];
      for (let j = 0; j < total; j++) {
        const letter = piles[pileA].shift();
        if (letter) {
          letters.push(letter);
        }
      }
      piles[pileB].unshift(...letters);
    }
    i += 1;
  }
  let result = "";
  for (let j = 1; j <= Object.keys(piles).length; j++) {
    result += piles[j][0];
  }
  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
