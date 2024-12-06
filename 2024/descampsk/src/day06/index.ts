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

const getInitialMap = (lines: string[]) => {
  const initialMap = lines.map((line) => line.split(""));
  let initialPosI = 0;
  let initialPosJ = 0;
  let found = false;
  for (let i = 0; i < initialMap.length; i++) {
    for (let j = 0; j < initialMap[i].length; j++) {
      if (["^", "v", "<", ">"].includes(initialMap[i][j])) {
        initialPosI = i;
        initialPosJ = j;
        found = true;
        break;
      }
    }
    if (found) {
      break;
    }
  }
  return { initialMap, initialPosI, initialPosJ };
};

const moveGuard = (
  initialMap: string[][],
  initialPosI: number,
  initialPosJ: number,
) => {
  let posI = initialPosI;
  let posJ = initialPosJ;

  let steps = 0;

  const map = initialMap.map((line) => [...line]);

  let isLoopStucked = false;

  let isOut = false;
  let isOutI = 0;
  let isOutJ = 0;

  while (
    posI >= 0 &&
    posI < map.length &&
    posJ >= 0 &&
    posJ < map[0].length &&
    steps < 10000000
  ) {
    let iDirection = 0;
    let jDirection = 0;
    const currentPos = map[posI][posJ] as "^" | "v" | "<" | ">";
    if (currentPos === "^") {
      iDirection = -1;
    } else if (currentPos === "v") {
      iDirection = 1;
    } else if (currentPos === "<") {
      jDirection = -1;
    } else if (currentPos === ">") {
      jDirection = 1;
    }
    const nextI = posI + iDirection;
    const nextJ = posJ + jDirection;
    if (
      nextI < 0 ||
      nextI >= map.length ||
      nextJ < 0 ||
      nextJ >= map[0].length
    ) {
      map[posI][posJ] = currentPos;
      isOut = true;
      isOutI = posI;
      isOutJ = posJ;

      break;
    }

    const nextBlock = map[nextI][nextJ];
    if (nextBlock === currentPos) {
      isLoopStucked = true;
      break;
    }

    if (nextBlock === "#") {
      const nextDirection = {
        "^": ">",
        ">": "v",
        v: "<",
        "<": "^",
      };
      map[posI][posJ] = nextDirection[currentPos];
    } else {
      map[nextI][nextJ] = currentPos;
      posI = nextI;
      posJ = nextJ;
    }
    steps++;
  }

  return { map, isLoopStucked, isOut, isOutI, isOutJ, steps };
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const { initialMap, initialPosI, initialPosJ } = getInitialMap(lines);

  const { map } = moveGuard(initialMap, initialPosI, initialPosJ);

  let result = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (["^", "v", "<", ">"].includes(map[i][j])) {
        result++;
      }
    }
  }

  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const { initialMap, initialPosI, initialPosJ } = getInitialMap(lines);

  let result = 0;
  for (let i = 0; i < initialMap.length; i++) {
    for (let j = 0; j < initialMap[i].length; j++) {
      const block = initialMap[i][j];
      if (![">", "<", "^", "v", "#"].includes(block)) {
        console.log("Adding block at", i, j);
        const newMap = initialMap.map((line) => [...line]);
        newMap[i][j] = "#";
        const { isLoopStucked, map, isOut, isOutI, isOutJ, steps } = moveGuard(
          newMap,
          initialPosI,
          initialPosJ,
        );
        if (isLoopStucked) {
          result++;
          console.log("Stucked whith block at", i, j);
          console.log(map.map((line) => line.join("")).join("\n"));
          console.log(" ");
        } else if (isOut) {
          console.log("Out whith block at", isOutI, isOutJ);
          // console.log(map.map((line) => line.join("")).join("\n"));
          // console.log(" ");
        } else {
          result++;
          console.log(
            "Not stucked whith block at",
            i,
            j,
            "nor is out",
            "steps",
            steps,
          );
          // console.log(map.map((line) => line.join("")).join("\n"));
          // console.log(" ");
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
        expected: 41,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
