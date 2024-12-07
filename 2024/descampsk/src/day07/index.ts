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

const computePossibilitiesList = (size: number) => {
  const possibilitiesList: ("+" | "*")[][] = [["+"], ["*"]];
  const finalPossibilitiesList: ("+" | "*")[][] = [];
  while (possibilitiesList.length > 0) {
    const possibility = possibilitiesList.pop()!;
    if (possibility.length === size) {
      finalPossibilitiesList.push(possibility);
    } else {
      possibilitiesList.push([...possibility, "+"]);
      possibilitiesList.push([...possibility, "*"]);
    }
  }
  return finalPossibilitiesList;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let finalResult = 0;
  for (const line of lines) {
    const [resultStr, numbersStr] = line.split(": ");
    const numbers = numbersStr.split(" ").map(Number);
    const result = Number(resultStr);
    const possibilitiesList = computePossibilitiesList(numbers.length - 1);
    // console.log(result, numbers, possibilitiesList);
    let found = false;
    for (const possibility of possibilitiesList) {
      let currentResult = numbers[0];
      for (let i = 0; i < possibility.length; i++) {
        if (possibility[i] === "+") {
          currentResult += numbers[i + 1];
        } else {
          currentResult *= numbers[i + 1];
        }
      }
      if (currentResult === result) {
        found = true;
        break;
      }
    }
    if (found) {
      finalResult += result;
    }
  }
  return finalResult;
};

const computePossibilitiesListPart2 = (size: number) => {
  const possibilitiesList: ("+" | "*" | "||")[][] = [["+"], ["*"], ["||"]];
  const finalPossibilitiesList: ("+" | "*" | "||")[][] = [];
  while (possibilitiesList.length > 0) {
    const possibility = possibilitiesList.pop()!;
    if (possibility.length === size) {
      finalPossibilitiesList.push(possibility);
    } else {
      possibilitiesList.push([...possibility, "+"]);
      possibilitiesList.push([...possibility, "*"]);
      possibilitiesList.push([...possibility, "||"]);
    }
  }
  return finalPossibilitiesList;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let finalResult = 0;
  for (const line of lines) {
    const [resultStr, numbersStr] = line.split(": ");
    const numbers = numbersStr.split(" ").map(Number);
    const result = Number(resultStr);
    const possibilitiesList = computePossibilitiesListPart2(numbers.length - 1);
    // console.log(result, numbers, possibilitiesList);
    let found = false;
    for (const possibility of possibilitiesList) {
      let currentResult = numbers[0];
      for (let i = 0; i < possibility.length; i++) {
        if (possibility[i] === "+") {
          currentResult += numbers[i + 1];
        } else if (possibility[i] === "*") {
          currentResult *= numbers[i + 1];
        } else {
          currentResult = Number(
            String(currentResult) + String(numbers[i + 1]),
          );
        }
      }
      if (currentResult === result) {
        found = true;
        break;
      }
    }
    if (found) {
      finalResult += result;
    }
  }
  return finalResult;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 3749,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 11387,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
