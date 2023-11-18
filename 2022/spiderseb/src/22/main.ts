/* eslint-disable no-loop-func */
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

type JumpFn = (
  map: string[][],
  x: number,
  y: number,
  direction: string
) => [x: number, y: number, direction: string];

const parseInputs = (
  inputs: string[]
): [map: string[][], commands: string[]] => {
  const map: string[][] = [];
  const commands: string[] = [];
  inputs.forEach((line) => {
    if (!line) return;
    if (line.match(/[^ .#]/)) {
      commands.push(...(line.match(/([0-9]+|[RL])/g) || []));
    } else {
      map.push(line.split(""));
    }
  });
  return [map, commands];
};

const turn = (direction: string, rotation: string): string => {
  const directions = ["R", "B", "L", "T"];
  const directionIndex = directions.findIndex((d) => d === direction);
  const newIndex = directionIndex + (rotation === "L" ? -1 : 1);
  if (newIndex < 0) return directions[directions.length - 1];
  if (newIndex === directions.length) return directions[0];
  return directions[newIndex];
};

const move = (
  map: string[][],
  x: number,
  y: number,
  direction: string,
  steps: number,
  jumpFn: JumpFn
): [x: number, y: number, direction: string] => {
  let moves = steps;
  let currentX = x;
  let currentY = y;
  let currentDirection = direction;
  while (moves) {
    let nextX = currentX;
    let nextY = currentY;
    let nextDirection = currentDirection;
    const from =
      currentDirection === "L" || currentDirection === "R"
        ? map[currentY].findIndex((tile) => tile === "." || tile === "#")
        : map.findIndex(
            (line) => line[currentX] === "." || line[currentX] === "#"
          );
    const to =
      currentDirection === "L" || currentDirection === "R"
        ? map[currentY].length -
          1 -
          [...map[currentY]]
            .reverse()
            .findIndex((tile) => tile === "." || tile === "#")
        : map.length -
          1 -
          [...map]
            .reverse()
            .findIndex(
              (line) => line[currentX] === "." || line[currentX] === "#"
            );

    if (currentDirection === "L") {
      nextX--;
      if (nextX < from) {
        [nextX, nextY, nextDirection] = jumpFn(
          map,
          currentX,
          currentY,
          currentDirection
        );
      }
    }
    if (currentDirection === "R") {
      nextX++;
      if (nextX > to) {
        [nextX, nextY, nextDirection] = jumpFn(
          map,
          currentX,
          currentY,
          currentDirection
        );
      }
    }
    if (currentDirection === "T") {
      nextY--;
      if (nextY < from) {
        [nextX, nextY, nextDirection] = jumpFn(
          map,
          currentX,
          currentY,
          currentDirection
        );
      }
    }
    if (currentDirection === "B") {
      nextY++;
      if (nextY > to) {
        [nextX, nextY, nextDirection] = jumpFn(
          map,
          currentX,
          currentY,
          currentDirection
        );
      }
    }

    if (map[nextY][nextX] === ".") {
      moves--;
      currentX = nextX;
      currentY = nextY;
      currentDirection = nextDirection;
    } else if (map[nextY][nextX] === "#") {
      moves = 0;
    } else {
      throw new Error(
        `cannot append ${map[nextY][nextX]} ${direction} ${from} ${to} / ${nextY}`
      );
    }
  }
  return [currentX, currentY, currentDirection];
};

const linearJump: JumpFn = (map, x, y, direction) => {
  if (direction === "L") {
    const newX =
      map[y].length -
      1 -
      [...map[y]].reverse().findIndex((tile) => tile === "." || tile === "#");
    return [newX, y, direction];
  }
  if (direction === "R") {
    const newX = map[y].findIndex((tile) => tile === "." || tile === "#");
    return [newX, y, direction];
  }
  if (direction === "T") {
    const newY =
      map.length -
      1 -
      [...map]
        .reverse()
        .findIndex((line) => line[x] === "." || line[x] === "#");
    return [x, newY, direction];
  }
  if (direction === "B") {
    const newY = map.findIndex((line) => line[x] === "." || line[x] === "#");
    return [x, newY, direction];
  }
  return [x, y, direction];
};

const cubeJump: JumpFn = (map, x, y, direction) => {
  if (direction === "R") {
    if (y <= 49) return [x - 50, 149 - y, "L"];
    if (y <= 99) return [y + 50, 49, "T"];
    if (y <= 149) return [x + 50, 149 - y, "L"];
    return [y - 100, 149, "T"];
  }
  if (direction === "L") {
    if (y <= 49) return [x - 50, 149 - y, "R"];
    if (y <= 99) return [y - 50, 100, "B"];
    if (y <= 149) return [x + 50, 149 - y, "R"];
    return [y - 100, 0, "B"];
  }
  if (direction === "B") {
    if (x <= 49) return [x + 100, 0, "B"];
    if (x <= 99) return [49, x + 100, "L"];
    return [99, x - 50, "L"];
  }
  if (x <= 49) return [50, 50 + x, "R"];
  if (x <= 99) return [0, x + 100, "R"];
  return [x - 100, 199, "T"];
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const [map, commands] = parseInputs(lines);
  let x = map[0].findIndex((tile) => tile === ".");
  let y = 0;
  let direction = "R";
  commands.forEach((command) => {
    if (command === "R" || command === "L") {
      direction = turn(direction, command);
    } else {
      [x, y, direction] = move(
        map,
        x,
        y,
        direction,
        Number(command),
        linearJump
      );
    }
  });
  const scoreDirection: Record<string, number> = { R: 0, D: 1, L: 2, U: 3 };
  return 1000 * (y + 1) + 4 * (x + 1) + scoreDirection[direction];
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const [map, commands] = parseInputs(lines);
  let x = map[0].findIndex((tile) => tile === ".");
  let y = 0;
  let direction = "R";
  commands.forEach((command) => {
    if (command === "R" || command === "L") {
      direction = turn(direction, command);
    } else {
      [x, y, direction] = move(map, x, y, direction, Number(command), cubeJump);
    }
  });
  const scoreDirection: Record<string, number> = { R: 0, B: 1, L: 2, T: 3 };
  return 1000 * (y + 1) + 4 * (x + 1) + scoreDirection[direction];
};

const main = async () => {
  const result1Test = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 1  ##", result1Test); // 6032
  const result1 = await resolveFirstPuzzle(INPUT_PATH);
  console.log("## RESULT 1 ##", result1); // 196134

  // Part 2 is done with hardcoded cube translation. TODO : create generic
  // const result2Test = await resolveSecondPuzzle(TEST_INPUT_PATH);
  // console.log("##  TEST 2  ##", result2Test);
  const result2 = await resolveSecondPuzzle(INPUT_PATH);
  console.log("## RESULT 2 ##", result2); // 146011
};

main().catch((error) => console.error(error));
