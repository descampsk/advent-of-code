/* eslint-disable no-param-reassign */
import run from "aocrunner";
import assert from "node:assert/strict";
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
// const inputTest2 = parseFile("input2.test.txt");

type Direction = "^" | "v" | "<" | ">";

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const map: string[][] = [];
  let line = lines.shift();
  while (line !== "") {
    map.push(line!.split(""));
    line = lines.shift();
  }
  line = lines.shift();

  const directions: Direction[] = [];
  while (line && line !== "") {
    directions.push(...(line!.split("") as Direction[]));
    line = lines.shift();
  }

  console.log(map.map((l) => l.join("")).join("\n"));
  console.log(directions.join(""));

  let robotI = 0;
  let robotJ = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "@") {
        robotI = i;
        robotJ = j;
        break;
      }
    }
  }

  for (const direction of directions) {
    let nextI = robotI;
    let nextJ = robotJ;
    let directionI = 0;
    let directionJ = 0;
    switch (direction) {
      case "^":
        nextI -= 1;
        directionI = -1;
        break;
      case "v":
        nextI += 1;
        directionI = 1;
        break;
      case "<":
        nextJ -= 1;
        directionJ = -1;
        break;
      case ">":
        nextJ += 1;
        directionJ = 1;
        break;
      default:
        break;
    }

    const cell = map[nextI][nextJ];
    if (cell === "#") {
      continue;
    }
    if (cell === ".") {
      map[robotI][robotJ] = ".";
      map[nextI][nextJ] = "@";
      robotI = nextI;
      robotJ = nextJ;
    }

    if (cell === "O") {
      let totalMoved = 0;
      while (
        map[nextI + totalMoved * directionI][
          nextJ + totalMoved * directionJ
        ] === "O"
      ) {
        totalMoved++;
      }
      const finalCell =
        map[nextI + totalMoved * directionI][nextJ + totalMoved * directionJ];
      if (finalCell === "#") {
        continue;
      }
      if (finalCell === ".") {
        map[robotI][robotJ] = ".";
        map[nextI][nextJ] = "@";
        robotI = nextI;
        robotJ = nextJ;
        map[nextI + totalMoved * directionI][nextJ + totalMoved * directionJ] =
          "O";
      }
    }
  }

  console.log(map.map((l) => l.join("")).join("\n"));

  let result = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "O") {
        result += 100 * i + j;
      }
    }
  }

  return result;
};

const canMoveVertically = (
  map: string[][],
  i: number,
  j: number,
  directionI: number,
): boolean => {
  assert(map[i][j] === "[");
  assert(map[i][j + 1] === "]");
  const nextCellLeft = map[i + directionI][j];
  const nextCellRight = map[i + directionI][j + 1];
  if (nextCellLeft === "#" || nextCellRight === "#") {
    return false;
  }
  if (nextCellLeft === "." && nextCellRight === ".") {
    return true;
  }

  if (nextCellLeft === "[") {
    return canMoveVertically(map, i + directionI, j, directionI);
  }
  if (nextCellLeft === "]" && nextCellRight === ".") {
    return canMoveVertically(map, i + directionI, j - 1, directionI);
  }
  if (nextCellLeft === "." && nextCellRight === "[") {
    return canMoveVertically(map, i + directionI, j + 1, directionI);
  }
  if (nextCellLeft === "]" && nextCellRight === "[") {
    return (
      canMoveVertically(map, i + directionI, j - 1, directionI) &&
      canMoveVertically(map, i + directionI, j + 1, directionI)
    );
  }

  return false;
};

const moveVertically = (
  map: string[][],
  i: number,
  j: number,
  directionI: number,
): void => {
  assert(map[i][j] === "[");
  assert(map[i][j + 1] === "]");
  const nextCellLeft = map[i + directionI][j];
  const nextCellRight = map[i + directionI][j + 1];

  if (nextCellLeft === "#" || nextCellRight === "#") {
    return;
  }
  if (nextCellLeft === "." && nextCellRight === ".") {
    map[i][j] = ".";
    map[i][j + 1] = ".";
    map[i + directionI][j] = "[";
    map[i + directionI][j + 1] = "]";
    return;
  }

  if (nextCellLeft === "[") {
    moveVertically(map, i + directionI, j, directionI);
  } else if (nextCellLeft === "]" && nextCellRight === ".") {
    moveVertically(map, i + directionI, j - 1, directionI);
  } else if (nextCellLeft === "." && nextCellRight === "[") {
    moveVertically(map, i + directionI, j + 1, directionI);
  } else if (nextCellLeft === "]" && nextCellRight === "[") {
    moveVertically(map, i + directionI, j - 1, directionI);
    moveVertically(map, i + directionI, j + 1, directionI);
  }

  map[i][j] = ".";
  map[i][j + 1] = ".";
  map[i + directionI][j] = "[";
  map[i + directionI][j + 1] = "]";
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const smallMap: string[][] = [];
  let line = lines.shift();
  while (line !== "") {
    smallMap.push(line!.split(""));
    line = lines.shift();
  }
  line = lines.shift();

  const map: string[][] = [];
  for (let i = 0; i < smallMap.length; i++) {
    const row = [];
    for (let j = 0; j < smallMap[i].length; j++) {
      if (smallMap[i][j] === "#") {
        row.push(smallMap[i][j], smallMap[i][j]);
      } else if (smallMap[i][j] === "O") {
        row.push("[", "]");
      } else {
        row.push(smallMap[i][j], ".");
      }
    }
    map.push(row);
  }

  const directions: Direction[] = [];
  while (line && line !== "") {
    directions.push(...(line!.split("") as Direction[]));
    line = lines.shift();
  }

  console.log(map.map((l) => l.join("")).join("\n"));
  console.log(directions.join(""));

  let robotI = 0;
  let robotJ = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "@") {
        robotI = i;
        robotJ = j;
        break;
      }
    }
  }

  for (const direction of directions) {
    let nextI = robotI;
    let nextJ = robotJ;
    let directionI = 0;
    let directionJ = 0;
    switch (direction) {
      case "^":
        nextI -= 1;
        directionI = -1;
        break;
      case "v":
        nextI += 1;
        directionI = 1;
        break;
      case "<":
        nextJ -= 1;
        directionJ = -1;
        break;
      case ">":
        nextJ += 1;
        directionJ = 1;
        break;
      default:
        break;
    }

    const cell = map[nextI][nextJ];
    if (cell === "#") {
      continue;
    }
    if (cell === ".") {
      map[robotI][robotJ] = ".";
      map[nextI][nextJ] = "@";
      robotI = nextI;
      robotJ = nextJ;
    }

    // Move horizontally
    if ((cell === "]" || cell === "[") && directionI === 0) {
      let totalMoved = 0;
      while (["]", "["].includes(map[nextI][nextJ + totalMoved * directionJ])) {
        totalMoved++;
      }
      const finalCell = map[nextI][nextJ + totalMoved * directionJ];
      if (finalCell === "#") {
        continue;
      }
      if (finalCell === ".") {
        if (directionJ === 1) {
          map[nextI].splice(
            nextJ,
            totalMoved + 1,
            ...map[nextI].slice(robotJ, robotJ + totalMoved + 1),
          );
        } else {
          map[nextI].splice(
            nextJ - totalMoved,
            totalMoved + 1,
            ...map[nextI].slice(nextJ - totalMoved + 1, nextJ + 2),
          );
        }
        map[robotI][robotJ] = ".";
        robotI = nextI;
        robotJ = nextJ;
      }
    } else if (cell === "]" && directionJ === 0) {
      const canMove = canMoveVertically(
        map,
        robotI + directionI,
        robotJ - 1,
        directionI,
      );
      if (canMove) {
        moveVertically(map, robotI + directionI, robotJ - 1, directionI);
        map[robotI][robotJ] = ".";
        robotI += directionI;
        map[robotI][robotJ] = "@";
      }
    } else if (cell === "[" && directionJ === 0) {
      const canMove = canMoveVertically(
        map,
        robotI + directionI,
        robotJ,
        directionI,
      );
      if (canMove) {
        moveVertically(map, robotI + directionI, robotJ, directionI);
        map[robotI][robotJ] = ".";
        robotI += directionI;
        map[robotI][robotJ] = "@";
      }
    }
  }

  console.log(map.map((l) => l.join("")).join("\n"));
  console.log("");

  let result = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "[") {
        result += 100 * i + j;
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
        expected: 10092,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 9021,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
