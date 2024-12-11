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
  const stones = lines[0].split(" ").map(Number);
  const totalBlinks = 25;
  for (let i = 0; i < totalBlinks; i++) {
    for (let j = 0; j < stones.length; j++) {
      if (stones[j] === 0) {
        stones[j] = 1;
      } else if (String(stones[j]).length % 2 === 0) {
        const stroneStr = String(stones[j]);
        const half = stroneStr.length / 2;
        const firstHalf = Number(stroneStr.slice(0, half));
        const secondHalf = Number(stroneStr.slice(half));
        stones.splice(j, 1, firstHalf, secondHalf);
        j++;
      } else {
        stones[j] *= 2024;
      }
    }
    // console.log(stones);
  }
  return stones.length;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const stones = lines[0].split(" ").map(Number);
  let stonesMap = new Map<number, number>();

  for (let i = 0; i < stones.length; i++) {
    stonesMap.set(stones[i], 1);
  }

  const totalBlinks = 75;
  for (let i = 0; i < totalBlinks; i++) {
    const newStoneMap = new Map<number, number>();
    const keys = Array.from(stonesMap.keys());
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      const numberOfStones = stonesMap.get(key)!;
      if (key === 0) {
        newStoneMap.set(1, numberOfStones + (newStoneMap.get(1) ?? 0));
      } else if (String(key).length % 2 === 0) {
        const stroneStr = String(key);
        const half = stroneStr.length / 2;
        const firstHalf = Number(stroneStr.slice(0, half));
        const secondHalf = Number(stroneStr.slice(half));
        newStoneMap.set(
          firstHalf,
          numberOfStones + (newStoneMap.get(firstHalf) ?? 0),
        );
        newStoneMap.set(
          secondHalf,
          numberOfStones + (newStoneMap.get(secondHalf) ?? 0),
        );
      } else {
        newStoneMap.set(
          key * 2024,
          numberOfStones + (newStoneMap.get(key * 2024) ?? 0),
        );
      }
    }
    stonesMap = newStoneMap;
    // console.log(stones);
  }

  let result = 0;
  for (const [_key, value] of stonesMap) {
    result += value;
  }
  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 55312,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 65601038650482,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
