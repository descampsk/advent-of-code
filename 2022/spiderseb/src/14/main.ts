import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

type Position = [x: number, y: number];

const findLimits = (lines: string[]): [min: Position, max: Position] => {
  const limits = lines.reduce(
    (acc: [Position, Position], current) => {
      const positions = current.split(" -> ");
      positions.forEach((position) => {
        const [x, y] = position.split(",").map(Number);
        if (acc[0][0] > x) acc[0][0] = x;
        if (acc[1][0] < x) acc[1][0] = x;
        if (acc[0][1] > y) acc[0][1] = y;
        if (acc[1][1] < y) acc[1][1] = y;
      });
      return acc;
    },
    [
      [Infinity, Infinity],
      [0, 0],
    ]
  );
  return limits;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const [min, max] = findLimits(lines);

  const offset = min[0];
  const grid: string[][] = Array(max[1] + 1)
    .fill(undefined)
    .map(() => Array(max[0] - min[0] + 1).fill("."));

  lines.forEach((line) => {
    const positions = line.split(" -> ");
    for (let i = 1; i < positions.length; i++) {
      const [fromX, fromY] = positions[i - 1].split(",").map(Number);
      const [toX, toY] = positions[i].split(",").map(Number);

      if (fromX === toX) {
        for (let y = Math.min(fromY, toY); y <= Math.max(fromY, toY); y++) {
          grid[y][fromX - offset] = "#";
        }
      } else if (fromY === toY) {
        for (
          let x = Math.min(fromX, toX) - offset;
          x <= Math.max(fromX, toX) - offset;
          x++
        ) {
          grid[fromY][x] = "#";
        }
      }
    }
  });

  // console.log(grid.map((line) => line.join("")).join("\n"));

  let sandCount = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const sandPosition = [500 - offset, 0];
    let fail = true;
    while (fail) {
      if (
        sandPosition[1] + 1 in grid &&
        grid[sandPosition[1] + 1][sandPosition[0]] === "."
      ) {
        sandPosition[1]++;
      } else if (
        sandPosition[1] + 1 in grid &&
        grid[sandPosition[1] + 1][sandPosition[0] - 1] === "."
      ) {
        sandPosition[1]++;
        sandPosition[0]--;
      } else if (
        sandPosition[1] + 1 in grid &&
        grid[sandPosition[1] + 1][sandPosition[0] + 1] === "."
      ) {
        sandPosition[1]++;
        sandPosition[0]++;
      } else {
        fail = false;
      }
    }

    if (
      sandPosition[0] === 0 ||
      sandPosition[0] === grid[0].length - 1 ||
      !(sandPosition[1] + 1 in grid)
    ) {
      return sandCount;
    }
    grid[sandPosition[1]][sandPosition[0]] = "o";
    // console.log(grid.map((line) => line.join("")).join("\n"));
    if (sandPosition[1] === 0) {
      return sandCount;
    }

    sandCount++;
  }
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const [, max] = findLimits(lines);

  const grid: string[][] = Array(max[1] + 2)
    .fill(undefined)
    .map(() => Array(max[0] + 401).fill("."));

  lines.forEach((line) => {
    const positions = line.split(" -> ");
    for (let i = 1; i < positions.length; i++) {
      const [fromX, fromY] = positions[i - 1].split(",").map(Number);
      const [toX, toY] = positions[i].split(",").map(Number);

      if (fromX === toX) {
        for (let y = Math.min(fromY, toY); y <= Math.max(fromY, toY); y++) {
          grid[y][fromX] = "#";
        }
      } else if (fromY === toY) {
        for (let x = Math.min(fromX, toX); x <= Math.max(fromX, toX); x++) {
          grid[fromY][x] = "#";
        }
      }
    }
  });

  // console.log(grid.map((line) => line.join("").substring(450, 550)).join("\n"));

  let sandCount = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const sandPosition = [500, 0];
    let fail = true;
    while (fail) {
      if (
        sandPosition[1] + 1 in grid &&
        grid[sandPosition[1] + 1][sandPosition[0]] === "."
      ) {
        sandPosition[1]++;
      } else if (
        sandPosition[1] + 1 in grid &&
        grid[sandPosition[1] + 1][sandPosition[0] - 1] === "."
      ) {
        sandPosition[1]++;
        sandPosition[0]--;
      } else if (
        sandPosition[1] + 1 in grid &&
        grid[sandPosition[1] + 1][sandPosition[0] + 1] === "."
      ) {
        sandPosition[1]++;
        sandPosition[0]++;
      } else {
        fail = false;
      }
    }

    grid[sandPosition[1]][sandPosition[0]] = "o";
    sandCount++;
    if (sandPosition[1] === 0) {
      return sandCount;
    }
  }
};

const main = async () => {
  const result1Test = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 1  ##", result1Test);
  const result1 = await resolveFirstPuzzle(INPUT_PATH);
  console.log("## RESULT 1 ##", result1);

  const result2Test = await resolveSecondPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 2  ##", result2Test);
  const result2 = await resolveSecondPuzzle(INPUT_PATH);
  console.log("## RESULT 2 ##", result2);
};

main().catch((error) => console.error(error));
