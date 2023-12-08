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

const testFile2 = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input2.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest2 = readFileSync(testFile2, "utf-8");

const testFile3 = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input3.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest3 = readFileSync(testFile3, "utf-8");

type Node = {
  name: string;
  left: string;
  right: string;
  isEnd: boolean;
};

const buildTree = (lines: string[]) => {
  const tree: Record<string, Node> = {};
  for (const line of lines) {
    const [parent, childs] = line.split(" = ");
    const [left, right] = childs.slice(1, childs.length - 1).split(", ");
    tree[parent] = {
      name: parent,
      left,
      right,
      isEnd: parent.endsWith("Z"),
    };
  }
  return tree;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const instructions = [...lines.shift()!];
  lines.shift();
  const tree = buildTree(lines);
  // console.log(tree);
  let current = "AAA";
  let total = 0;
  while (current !== "ZZZ") {
    for (const instruction of instructions) {
      const node = tree[current];
      if (instruction === "L") {
        current = node.left;
      } else {
        current = node.right;
      }
      total += 1;
    }
  }
  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const instructions = [...lines.shift()!];
  lines.shift();
  const tree = buildTree(lines);
  // console.log(tree);
  const currents = Object.keys(tree).filter((k) => k.endsWith("A"));
  // const currents = ["LPA", "XKA", "QGA", "HHA", "LTA"];
  console.log(currents);
  const pathsLength: number[] = [];
  for (let i = 0; i < currents.length; i++) {
    const fullPath = [currents[i]];
    let endFound = 0;
    // eslint-disable-next-line no-constant-condition
    while (endFound < 2) {
      for (const instruction of instructions) {
        // console.log(instruction);

        const node = tree[currents[i]];
        if (instruction === "L") {
          // console.log(currents[i]);
          currents[i] = node.left;
        } else {
          currents[i] = node.right;
        }
        // console.log(currents);
        if (currents[i].endsWith("Z")) {
          endFound += 1;
        }
        fullPath.push(currents[i]);
      }
    }
    console.log(
      fullPath,
      fullPath.length,
      fullPath[0],
      fullPath[1],
      fullPath[(fullPath.length - 1) / 2],
      fullPath[fullPath.length - 1],
    );

    pathsLength.push((fullPath.length - 1) / 2);
  }

  console.log(pathsLength);

  const lcm = [...pathsLength];

  while (!lcm.every((v) => v === lcm[0])) {
    let min = Infinity;
    let minIndex = 0;
    for (let i = 0; i < lcm.length; i++) {
      if (lcm[i] < min) {
        min = lcm[i];
        minIndex = i;
      }
    }
    lcm[minIndex] += pathsLength[minIndex];
    // console.log(lcm);
  }
  console.log(lcm);

  return lcm[0];
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 2,
      },
      {
        input: inputTest2,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest3,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
