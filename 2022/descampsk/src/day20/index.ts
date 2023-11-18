/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { extendedNumber, moveNumber } from "./moveNumber.js";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const initialNumbers = lines.map((line, initialIndex) => ({
    value: parseInt(line, 10),
    hasMoved: false,
    initialIndex,
  }));
  const oldNumbers = Array.from(initialNumbers);

  // console.log(oldNumbers);
  const { length } = initialNumbers;
  let newNumbers = oldNumbers;
  for (const number of oldNumbers) {
    newNumbers = moveNumber(newNumbers, number.value) as extendedNumber[];
  }

  // console.log(newNumbers);

  const zeroIndex = newNumbers.findIndex((value) => value.value === 0);
  let firstIndexMove = 1000 % length;
  if (zeroIndex + firstIndexMove >= length) firstIndexMove -= length;
  const first = newNumbers[zeroIndex + firstIndexMove].value;

  let secondIndexMove = 2000 % length;
  if (zeroIndex + secondIndexMove >= length) secondIndexMove -= length;
  const second = newNumbers[zeroIndex + secondIndexMove].value;

  let thirdIndexMove = 3000 % length;
  if (zeroIndex + thirdIndexMove >= length) thirdIndexMove -= length;
  const third = newNumbers[zeroIndex + thirdIndexMove].value;

  console.log(first, second, third);

  return first + second + third;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const decryptionKey = 811589153;
  const initialNumbers = lines.map((line, initialIndex) => ({
    value: parseInt(line, 10) * decryptionKey,
    hasMoved: false,
    initialIndex,
  }));
  const oldNumbers = Array.from(initialNumbers);

  // console.log(oldNumbers);
  const { length } = initialNumbers;
  let newNumbers = oldNumbers;
  for (let i = 0; i < 10; i++) {
    for (const number of oldNumbers) {
      newNumbers = moveNumber(newNumbers, number.value) as extendedNumber[];
    }
    // console.log(newNumbers);
    newNumbers.forEach((newNumber) => (newNumber.hasMoved = false));
  }

  // console.log(newNumbers);

  const zeroIndex = newNumbers.findIndex((value) => value.value === 0);
  let firstIndexMove = 1000 % length;
  if (zeroIndex + firstIndexMove >= length) firstIndexMove -= length;
  const first = newNumbers[zeroIndex + firstIndexMove].value;

  let secondIndexMove = 2000 % length;
  if (zeroIndex + secondIndexMove >= length) secondIndexMove -= length;
  const second = newNumbers[zeroIndex + secondIndexMove].value;

  let thirdIndexMove = 3000 % length;
  if (zeroIndex + thirdIndexMove >= length) thirdIndexMove -= length;
  const third = newNumbers[zeroIndex + thirdIndexMove].value;

  console.log(first, second, third);

  return first + second + third;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 1623178306,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
