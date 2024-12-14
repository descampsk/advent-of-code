/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Terminal } from "command-line-draw";

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

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Robot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const robots: Robot[] = [];
  lines.forEach((line) => {
    const [p, v] = line.split(" ");
    const [x, y] = p.slice(2).split(",").map(Number);
    const [vx, vy] = v.slice(2).split(",").map(Number);
    robots.push({ x, y, vx, vy });
  });
  // console.log(robots);

  const maxX = robots.length === 12 ? 11 : 101;
  const maxY = robots.length === 12 ? 7 : 103;

  const seconds = 100;
  const positions = robots
    .map(({ x, y, vx, vy }) => ({
      x: (x + vx * seconds) % maxX,
      y: (y + vy * seconds) % maxY,
    }))
    .map(({ x, y }) => ({
      x: x < 0 ? x + maxX : x,
      y: y < 0 ? y + maxY : y,
    }));
  // console.log(positions);
  let result = 1;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const xMin = i + Math.floor((i * maxX) / 2);
      const xMax = Math.floor(((i + 1) * maxX) / 2);

      const yMin = j + Math.floor((j * maxY) / 2);
      const yMax = Math.floor(((j + 1) * maxY) / 2);

      const count = positions.filter(
        ({ x, y }) => x >= xMin && x < xMax && y >= yMin && y < yMax,
      ).length;
      // console.log(i, j, xMin, xMax, yMin, yMax, count);
      result *= count;
    }
  }
  return result;
};

const part2 = async (rawInput: string) => {
  const maxX = 101;
  const maxY = 103;

  const lines = parseInput(rawInput);
  const robots: Robot[] = [];
  lines.forEach((line) => {
    const [p, v] = line.split(" ");
    const [x, y] = p.slice(2).split(",").map(Number);
    const [vx, vy] = v.slice(2).split(",").map(Number);
    robots.push({ x: x < 0 ? x + maxX : x, y: y < 0 ? y + maxY : y, vx, vy });
  });
  console.log(robots);
  console.log(
    robots.filter(
      (robot) =>
        robot.x < 0 || robot.y < 0 || robot.x >= maxX || robot.y >= maxY,
    ),
  );

  const terminal = new Terminal({
    width: maxX + 3,
    height: maxY + 3,
  });

  const seconds = 100000;
  let secondToEasterEgg = 0;
  for (let i = 1; i <= seconds; i++) {
    let maxAligned = 0;

    terminal.clear();

    for (const robot of robots) {
      robot.x = (robot.x + robot.vx) % maxX;
      robot.y = (robot.y + robot.vy) % maxY;
      robot.x = robot.x < 0 ? robot.x + maxX : robot.x;
      robot.y = robot.y < 0 ? robot.y + maxY : robot.y;
      terminal.write("X", robot.x, robot.y, "red");
    }

    const robotsGrouped = _.groupBy(robots, ({ y }) => y);
    // eslint-disable-next-line guard-for-in
    for (const y in robotsGrouped) {
      const robotsSorted = robotsGrouped[y].sort((a, b) => a.x - b.x);
      let aligned = 0;
      for (let j = 1; j < robotsSorted.length; j++) {
        if (robotsSorted[j].x - robotsSorted[j - 1].x === 1) {
          aligned++;
        } else {
          aligned = 0;
        }
      }
      if (aligned > maxAligned) {
        maxAligned = aligned;
      }
    }

    if (maxAligned > 10) {
      secondToEasterEgg = i;
      break;
    }

    // await sleep(10);
  }
  // console.log(robots);

  for (const robot of robots) {
    terminal.write("X", robot.x, robot.y, "red");
  }

  return secondToEasterEgg;
};

run({
  // part1: {
  //   tests: [
  //     {
  //       input: inputTest,
  //       expected: 12,
  //     },
  //   ],
  //   solution: part1,
  // },
  part2: {
    tests: [
      // {
      //   input: inputTest,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
