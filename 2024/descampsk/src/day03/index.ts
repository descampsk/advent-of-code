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
  const program = lines.join("");
  const multipliers = program.matchAll(/mul\((\d{1,3},\d{1,3})\)/gm);
  let result = 0;
  for (const match of multipliers) {
    // console.log(match);
    const [a, b] = match[1].split(",").map(Number);
    console.log(a, b);
    result += a * b;
  }
  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const program = lines.join("\n");
  const multipliers = program.matchAll(
    /(?:(?<=do\(\).*?)|(?<!don't\(\).*?))mul\((\d{1,3},\d{1,3})\)/gm,
  );
  let result = 0;
  for (const match of multipliers) {
    // console.log(match);
    // const { index } = match;
    // const subProgram = program.slice(0, index);
    // const lastDo = subProgram.lastIndexOf("do()");
    // const lastDont = subProgram.lastIndexOf("don't()");
    const [a, b] = match[1].split(",").map(Number);
    result += a * b;
    // console.log(a, b, index, lastDo, lastDont);
    // if (lastDo > lastDont || lastDont === -1) {
    //   result += a * b;
    // }
  }
  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 48,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
