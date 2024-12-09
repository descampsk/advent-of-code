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
  const diskMap = lines[0].split("").map(Number);

  const disk = diskMap.flatMap((value, index) => {
    if (index % 2 === 0) {
      const id = index / 2;
      return new Array(value).fill(id);
    }
    return new Array(value).fill(-1);
  });

  // console.log(disk.map((value) => (value === -1 ? "." : value)).join(""));

  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === -1) {
      let block = disk.pop();
      while (block === -1) {
        block = disk.pop();
      }
      disk[i] = block;
    }
  }

  // console.log(disk.map((value) => (value === -1 ? "." : value)).join(""));

  return disk.reduce((acc, value, index) => {
    return acc + value * index;
  }, 0);
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const diskMap = lines[0].split("").map(Number);

  const disk = diskMap.flatMap((value, index) => {
    if (index % 2 === 0) {
      const id = index / 2;
      return new Array(value).fill(id);
    }
    return new Array(value).fill(-1);
  });

  console.log(disk.map((value) => (value === -1 ? "." : value)).join(""));

  const freeSpaces: { start: number; length: number }[] = [];
  let lastFreeSpace: { start: number; length: number } | null = null;
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === -1) {
      if (lastFreeSpace) {
        lastFreeSpace.length++;
      } else {
        lastFreeSpace = { start: i, length: 1 };
      }
    } else if (lastFreeSpace) {
      freeSpaces.push(lastFreeSpace);
      lastFreeSpace = null;
    }
  }

  console.log(freeSpaces);

  const fileBlocks: { start: number; length: number; value: number }[] = [];
  let lastBlockFile: { start: number; length: number; value: number } | null =
    null;
  for (let i = 0; i < disk.length; i++) {
    console.log(i, disk[i], lastBlockFile);
    if (!lastBlockFile && disk[i] !== -1) {
      lastBlockFile = { start: i, length: 1, value: disk[i] };
    } else if (lastBlockFile && disk[i] === lastBlockFile.value) {
      lastBlockFile.length++;
    } else if (lastBlockFile) {
      fileBlocks.push(lastBlockFile);
      if (disk[i] !== -1) {
        lastBlockFile = { start: i, length: 1, value: disk[i] };
      } else {
        lastBlockFile = null;
      }
    }
  }
  if (lastBlockFile) {
    fileBlocks.push(lastBlockFile);
  }
  console.log(fileBlocks);

  for (const fileBlock of fileBlocks.reverse()) {
    const freeSpace = freeSpaces.find(
      (space) =>
        space.length >= 0 &&
        space.length >= fileBlock.length &&
        space.start < fileBlock.start,
    );
    if (freeSpace) {
      console.log(freeSpace, fileBlock);
      disk.fill(
        fileBlock.value,
        freeSpace.start,
        freeSpace.start + fileBlock.length,
      );
      disk.fill(-1, fileBlock.start, fileBlock.start + fileBlock.length);
      freeSpace.length -= fileBlock.length;
      freeSpace.start += fileBlock.length;
    }
  }

  console.log(disk.map((value) => (value === -1 ? "." : value)).join(""));

  return disk.reduce((acc, value, index) => {
    return acc + (value !== -1 ? value : 0) * index;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 1928,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
