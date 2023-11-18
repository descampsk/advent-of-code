import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _, { add, max } from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

const computeDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

const manhattanDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

type Beacon = {
  x: number;
  y: number;
};

type Sensor = {
  x: number;
  y: number;
  beacon: Beacon;
  distance: number;
};

const getSensors = (lines: string[]) => {
  const sensors: Sensor[] = [];
  const beacons: Record<string, Beacon> = {};
  lines.forEach((line) => {
    const match = line.match(/(-|)[0-9]+/gm);
    if (match && match.length === 4) {
      const [x, y, beaconX, beaconY] = match.map((value) =>
        parseInt(value, 10),
      );
      const distance = manhattanDistance(x, y, beaconX, beaconY);
      const beacon = { x: beaconX, y: beaconY };
      beacons[`${beaconX},${beaconY}`] = beacon;
      sensors.push({
        x,
        y,
        beacon: {
          x: beaconX,
          y: beaconY,
        },
        distance,
      });
    } else {
      throw new Error(`Unable to decode ${line}`);
    }
  });
  return { sensors, beacons };
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const { sensors, beacons } = getSensors(lines);

  const y = 2000000;
  const possibleSensors = sensors.filter(
    (sensor) => Math.abs(sensor.y - y) <= sensor.distance,
  );

  let minX = 10000000000;
  let maxX = -100000000000;
  possibleSensors.forEach(({ x, distance }) => {
    if (x + distance > maxX) maxX = x + distance;
    if (x - distance < minX) minX = x - distance;
  });
  let total = 0;
  for (let i = minX; i <= maxX; i++) {
    for (let j = 0; j < possibleSensors.length; j++) {
      const sensor = possibleSensors[j];
      if (beacons[`${i},${y}`]) break;
      if (manhattanDistance(sensor.x, sensor.y, i, y) <= sensor.distance) {
        total += 1;
        break;
      }
    }
  }

  return total;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const { sensors, beacons } = getSensors(lines);
  const minX = 0;
  const maxX = 4000000;
  const minY = 0;
  const maxY = 4000000;
  // sensors.forEach(({ x, y, distance }) => {
  //   if (x + distance > maxX) maxX = x + distance;
  //   if (x - distance < minX) minX = x - distance;
  //   if (y + distance > maxY) maxY = y + distance;
  //   if (y - distance < minY) minY = y - distance;
  // });
  console.log(minX, maxX, minY, maxY);
  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      const index = x * maxY + y;
      if (index % 100000000 === 0)
        console.log(
          `${index}/${maxX * maxY} => ${(index * 100) / (maxX * maxY)}%`,
        );
      let found = false;
      let maxAddY = 0;
      for (let j = 0; j < sensors.length; j++) {
        const sensor = sensors[j];
        if (manhattanDistance(sensor.x, sensor.y, x, y) <= sensor.distance) {
          if (sensor.y > y) {
            const addY = 2 * Math.abs(sensor.y - y);
            if (addY > maxAddY) {
              maxAddY = addY;
            }
            // console.log(y, addY, x, y, sensor);
          }
          found = true;
        }
      }
      y += maxAddY;
      if (!found) {
        console.log(x, y);
        return x * 4000000 + y;
      }
    }
  }
  return 0;
};

run({
  // part1: {
  //   tests: [
  //     {
  //       input: inputTest,
  //       expected: "",
  //     },
  //   ],
  //   solution: part1,
  // },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
