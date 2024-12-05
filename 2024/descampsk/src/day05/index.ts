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
  const rules: [number, number][] = [];
  while (lines[0] !== "") {
    const rule = lines.shift()!.split("|");
    rules.push([Number(rule[0]), Number(rule[1])]);
  }
  lines.shift();
  console.log(rules);
  console.log(lines);
  let result = 0;
  for (const line of lines) {
    const numbers = line.split(",").map(Number);
    const numbersMap = new Map<number, number>();
    for (let i = 0; i < numbers.length; i++) {
      numbersMap.set(numbers[i], i);
    }
    let isValid = true;
    for (const rule of rules) {
      if (
        numbersMap.has(rule[0]) &&
        numbersMap.has(rule[1]) &&
        numbersMap.get(rule[0])! > numbersMap.get(rule[1])!
      ) {
        isValid = false;
        break;
      }
    }
    console.log(numbers, isValid);
    if (isValid) {
      result += numbers[(numbers.length - 1) / 2];
    }
  }

  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const rules: [number, number][] = [];
  const rulesMap = new Map<number, number[]>();
  while (lines[0] !== "") {
    const rule = lines.shift()!.split("|");
    rules.push([Number(rule[0]), Number(rule[1])]);
    if (!rulesMap.has(Number(rule[0]))) {
      rulesMap.set(Number(rule[0]), [Number(rule[1])]);
    } else {
      rulesMap.get(Number(rule[0]))!.push(Number(rule[1]));
    }
  }
  lines.shift();
  console.log(rules, rulesMap);
  console.log(lines);
  let result = 0;
  for (const line of lines) {
    const numbers = line.split(",").map(Number);
    const numbersMap = new Map<number, number>();
    for (let i = 0; i < numbers.length; i++) {
      numbersMap.set(numbers[i], i);
    }
    let isValid = true;
    for (const rule of rules) {
      if (
        numbersMap.has(rule[0]) &&
        numbersMap.has(rule[1]) &&
        numbersMap.get(rule[0])! > numbersMap.get(rule[1])!
      ) {
        isValid = false;
        break;
      }
    }
    console.log(numbers, isValid);
    if (!isValid) {
      const numbersCopy = [...numbers];
      numbersCopy.sort((a, b) => {
        if (rulesMap.has(a) && rulesMap.get(a)!.includes(b)) {
          return -1;
        }
        if (rulesMap.has(b) && rulesMap.get(b)!.includes(a)) {
          return 1;
        }
        return 0;
      });
      console.log(numbersCopy);
      result += numbersCopy[(numbersCopy.length - 1) / 2];
    }
    console.log(result);
  }

  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 143,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
