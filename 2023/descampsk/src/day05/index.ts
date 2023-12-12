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

const getNextMap = (lines: string[]) => {
  // Remove title
  lines.shift();
  const map: { source: number; destination: number; range: number }[] = [];
  while (lines[0] && lines[0] !== "") {
    const [destination, source, range] = lines
      .shift()!
      .split(" ")
      .map((n) => Number.parseInt(n, 10));
    map.push({
      destination,
      source,
      range,
    });
  }
  lines.shift();
  return map;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const seeds = lines[0]
    .split(": ")[1]
    .split(" ")
    .map((n) => Number.parseInt(n, 10));
  console.log(seeds);
  lines.shift();
  lines.shift();
  const oneToOther: { destination: number; source: number; range: number }[][] =
    [];
  for (let i = 0; i < 7; i++) {
    oneToOther.push(getNextMap(lines));
  }
  let minLocation = Infinity;
  for (const seed of seeds) {
    let next = seed;
    console.log("seed", seed);
    for (const map of oneToOther) {
      let found = false;
      for (const { source, destination, range } of map) {
        if (!found && next >= source && next < source + range) {
          next = destination + next - source;
          found = true;
        }
      }
      console.log(next);
    }
    if (next < minLocation) minLocation = next;
  }
  return minLocation;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const seeds = lines[0]
    .split(": ")[1]
    .split(" ")
    .map((n) => Number.parseInt(n, 10));
  lines.shift();
  lines.shift();
  const oneToOther: { destination: number; source: number; range: number }[][] =
    [];
  for (let i = 0; i < 7; i++) {
    oneToOther.push(getNextMap(lines));
  }
  let minLocation = Infinity;
  console.log(seeds);
  for (let i = 0; i < seeds.length / 2; i++) {
    for (let j = 0; j < seeds[i * 2 + 1]; j++) {
      let next = seeds[i * 2] + j;
      // console.log("seed", next);
      for (const map of oneToOther) {
        let found = false;
        for (const { source, destination, range } of map) {
          if (!found && next >= source && next < source + range) {
            next = destination + next - source;
            found = true;
          }
        }
        // console.log(next);
      }
      if (next < minLocation) minLocation = next;
      // console.log(minLocation);
    }
  }
  return minLocation;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
