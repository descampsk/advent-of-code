/* eslint-disable no-continue */
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

const computeHash = (step: string) => {
  // console.log(step);
  let current = 0;
  for (const c of step) {
    current = ((current + c.charCodeAt(0)) * 17) % 256;
  }
  // console.log(current);
  return current;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const line = lines[0];
  const steps = line.split(",");

  return steps.reduce((total, step) => {
    return total + computeHash(step);
  }, 0);
};

type Lense = {
  label: string;
  focal: number;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const line = lines[0];
  const steps = line.split(",");
  const boxes: Record<number, Lense[]> = {};
  for (const step of steps) {
    // console.log(step);
    if (step.includes("=")) {
      const [label, focal] = step.split("=");
      const boxeNumber = computeHash(label);
      const focalNumber = parseInt(focal, 10);
      if (!boxes[boxeNumber]) {
        boxes[boxeNumber] = [];
      }
      const box = boxes[boxeNumber];

      const labelAlreadyPresent = box.find((b) => b.label === label);
      if (!labelAlreadyPresent) {
        box.push({ label, focal: focalNumber });
      } else {
        box.splice(box.indexOf(labelAlreadyPresent), 1, {
          label,
          focal: focalNumber,
        });
      }
    } else {
      const [label] = step.split("-");
      const boxeNumber = computeHash(label);
      const box = boxes[boxeNumber];
      if (!box) continue;
      const labelAlreadyPresent = box.findIndex((b) => b.label === label);
      if (labelAlreadyPresent !== -1) {
        box.splice(labelAlreadyPresent, 1);
      }
    }
    // console.log(boxes);
  }
  return Object.entries(boxes).reduce((total, [index, box]) => {
    return (
      total +
      (Number.parseInt(index, 10) + 1) *
        box.reduce((power, lense, slot) => {
          return power + lense.focal * (slot + 1);
        }, 0)
    );
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
