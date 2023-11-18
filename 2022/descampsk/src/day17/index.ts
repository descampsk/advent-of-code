/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-param-reassign */
import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _, { has, size } from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { findMotif } from "./motif.js";
import { createRock, Rock, rockOrder } from "./Rock.js";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

const checkIfRockIsBlocked = (
  rock: Rock,
  blocked: Map<number, Set<number>>,
) => {
  for (const { x, y } of rock.blocks) {
    if (y === 1 || blocked.get(y - 1)?.has(x)) rock.isBlocked = true;
  }
  if (rock.isBlocked) {
    for (const { x, y } of rock.blocks) {
      const blockedY = blocked.get(y);
      if (blockedY) blockedY.add(x);
      else blocked.set(y, new Set([x]));
      if (blockedY?.size === 7) {
        // for (let i = y - blocked.size; i < y; i++) {
        //   blocked.delete(i);
        // }
      }
    }
  }
  return rock.isBlocked;
};

const display = (blocked: Map<number, Set<number>>, rock?: Rock) => {
  const shouldDisplay = true;
  if (!shouldDisplay) return;
  const widght = 7;
  const height = _.max(Array.from(blocked.keys()))! + 10;
  for (let y = height; y >= 1; y--) {
    const line = [];
    for (let x = 0; x < widght; x++) {
      if (blocked.get(y)?.has(x)) line.push("#");
      else {
        let displayed = false;
        if (rock) {
          const { blocks } = rock;
          for (const block of blocks) {
            if (block.x === x && block.y === y) {
              line.push("#");
              displayed = true;
              break;
            }
          }
        }

        if (!displayed) line.push(".");
      }
    }
    console.log(line.join(""));
  }
  console.log("-------");
};

const computeTetris = (gas: string, maxRocks: number, motifSize: number) => {
  const widght = 7;
  let gasIndex = 0;
  const blocked: Map<number, Set<number>> = new Map();
  let y = 4;
  let currentRock: Rock = createRock("line", y);
  let nextRockIndex = 1;
  let totalRocks = 1;
  let totalRockCreatedBetweenTwoMotif = 0;
  let newRockMotif = 0;
  while (totalRocks < maxRocks || !currentRock?.isBlocked) {
    if (currentRock.isBlocked) {
      const maxBlockY = _.max(currentRock.blocks.map((block) => block.y))!;
      const newRockType = rockOrder[nextRockIndex];
      nextRockIndex = (nextRockIndex + 1) % rockOrder.length;
      if (maxBlockY > y - 4) y = maxBlockY + 4;
      currentRock = createRock(newRockType, y);
      totalRocks += 1;
      newRockMotif += 1;

      // For an unkown reason it is the only way I found to get the number of blocks created between two motifs
      if (
        (motifSize < 100 && maxBlockY % motifSize === 0) ||
        (motifSize > 100 && maxBlockY % motifSize < 5)
      ) {
        if (totalRockCreatedBetweenTwoMotif === newRockMotif) {
          newRockMotif = 0;
        } else {
          totalRockCreatedBetweenTwoMotif = newRockMotif;
          newRockMotif = 0;
        }
      }
    } else {
      const currentGas = gas[gasIndex];
      gasIndex = (gasIndex + 1) % gas.length;
      if (currentGas === ">" && !currentRock.isBlockedRight(widght, blocked))
        currentRock.moveRight();
      if (currentGas === "<" && !currentRock.isBlockedLeft(blocked))
        currentRock.moveLeft();
      const isBlocked = checkIfRockIsBlocked(currentRock, blocked);
      if (!isBlocked) currentRock.moveDown();
    }
  }

  //   const motif = findMotif(blocked, motifSize);
  //   console.log("motif", motif.motif);
  //   console.log("motifMax", motif.max);
  //   console.log("motifY", motif.y);

  return {
    y: _.max(Array.from(blocked.keys()))!,
    totalRockCreatedBetweenTwoMotif,
  };
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  //   return 0;
  const firstTotal = 1000;
  const totalToFind = 2022;
  const motifSize = 53;
  const { y, totalRockCreatedBetweenTwoMotif } = computeTetris(
    lines[0],
    firstTotal,
    motifSize,
  );
  const differenceToCompute = totalToFind - firstTotal;
  const multiplier = Math.floor(
    differenceToCompute / totalRockCreatedBetweenTwoMotif,
  );
  const reste =
    totalToFind - (firstTotal + multiplier * totalRockCreatedBetweenTwoMotif);
  const { y: newY } = computeTetris(lines[0], firstTotal + reste, motifSize);
  console.log(
    y,
    totalRockCreatedBetweenTwoMotif,
    differenceToCompute,
    multiplier,
    reste,
    newY,
  );

  //   console.log(y + motifSize * multiplier);

  return motifSize * multiplier + newY;
};

// Motif sizes are found in an empiric way
const motifSizes = [53, 2778];
let indexSize = 0;

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const totalToFind = 1000000000000;
  const motifSize = motifSizes[indexSize];
  const firstTotal = 10000;
  const { y, totalRockCreatedBetweenTwoMotif } = computeTetris(
    lines[0],
    firstTotal,
    motifSize,
  );
  const differenceToCompute = totalToFind - firstTotal;
  const multiplier = Math.floor(
    differenceToCompute / totalRockCreatedBetweenTwoMotif,
  );
  const reste =
    totalToFind - (firstTotal + multiplier * totalRockCreatedBetweenTwoMotif);
  const { y: newY } = computeTetris(lines[0], firstTotal + reste, motifSize);
  console.log(
    y,
    totalRockCreatedBetweenTwoMotif,
    differenceToCompute,
    multiplier,
    reste,
    newY,
  );

  indexSize += 1;
  return motifSize * multiplier + newY;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 3068,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 1514285714288,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
