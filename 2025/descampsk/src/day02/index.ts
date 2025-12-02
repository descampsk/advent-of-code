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
  const line = lines[0];
  const ranges = line.split(",").map((r) => r.split("-"));

  let result = 0;
  for (const range of ranges) {
    const [start, end] = range;
    for (let i = Number(start); i <= Number(end); i++) {
      const iStr = i.toString();
      if (iStr.length % 2 !== 0) {
        continue;
      }
      const half = iStr.length / 2;
      const firstHalf = iStr.slice(0, half);
      const secondHalf = iStr.slice(half);
      if (firstHalf === secondHalf) {
        // console.log("invalid", i);
        result += i;
        // console.log("result", result);
      }
    }
  }

  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const line = lines[0];
  const ranges = line.split(",").map((r) => r.split("-"));

  let result = 0;
  for (const range of ranges) {
    const [start, end] = range;
    for (let i = Number(start); i <= Number(end); i++) {
      const iStr = i.toString();
      for (let len = 1; len <= iStr.length; len++) {
        const sequence = iStr.slice(0, len);
        let isValid = true;
        let repeteadSeq = sequence;
        while (repeteadSeq.length < iStr.length) {
          repeteadSeq += sequence;
          if (repeteadSeq === iStr) {
            isValid = false;
            break;
          }
        }
        if (!isValid) {
          // console.log("invalid", i);
          result += i;
          // console.log("result", result);
          break;
        }
      }
    }
  }

  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 1227775554,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 4174379265,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
