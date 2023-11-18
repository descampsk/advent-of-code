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

const compare = (
  a: Array<unknown> | number,
  b: Array<unknown> | number,
): number => {
  if (typeof a === "number" && typeof b === "number") {
    if (a < b) return 1;
    if (a === b) return 0;
    return -1;
  }
  if (Array.isArray(a) && typeof b === "number") {
    return compare(a, [b]);
  }
  if (typeof a === "number" && Array.isArray(b)) {
    return compare([a], b);
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < a.length; i++) {
      if (i >= b.length) {
        return -1;
      }
      const comparaison = compare(a[i], b[i]);
      if (comparaison === -1) return -1;
      if (comparaison === 1) return 1;
    }
    if (a.length === b.length) return 0;
    if (a.length > b.length) return -1;
    if (a.length < b.length) return 1;
  }
  throw new Error("should not be there");
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let total = 0;
  for (let i = 0; i < lines.length; i += 3) {
    const pair1 = JSON.parse(lines[i]);
    const pair2 = JSON.parse(lines[i + 1]);
    const comparaison = compare(pair1, pair2);
    if (comparaison !== -1) {
      total += i / 3 + 1;
    }
  }

  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const packets: any[] = [];
  lines.forEach((line) => {
    if (line !== "") packets.push(JSON.parse(line));
  });
  packets.push(JSON.parse("[[2]]"));
  packets.push(JSON.parse("[[6]]"));
  const sortedPacket = packets.sort((a, b) => -1 * compare(a, b));
  return (
    (sortedPacket.findIndex((packet) => JSON.stringify(packet) === "[[2]]") +
      1) *
    (sortedPacket.findIndex((packet) => JSON.stringify(packet) === "[[6]]") + 1)
  );
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
