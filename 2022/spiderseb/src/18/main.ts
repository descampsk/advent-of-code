/* eslint-disable no-loop-func */
/* eslint-disable prefer-destructuring */
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;
const ROCK = "#";
const FREE = "~";

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const positions = lines.map((line) => line.split(",").map(Number));
  let exposedSides = 0;
  positions.forEach(([x, y, z]) => {
    const keys = [
      [x, y, z + 1],
      [x, y, z - 1],
      [x, y + 1, z],
      [x, y - 1, z],
      [x + 1, y, z],
      [x - 1, y, z],
    ];
    keys.forEach((adj) => {
      if (
        !positions.find(
          (pos) => pos[0] === adj[0] && pos[1] === adj[1] && pos[2] === adj[2]
        )
      )
        exposedSides++;
    });
  });
  return exposedSides;
};

const getKey = (x: number, y: number, z: number): string => `${x}-${y}-${z}`;

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const positions = lines.map((line) => line.split(",").map(Number));
  const [maxX, maxY, maxZ] = positions.reduce((acc, current) => {
    const max = [...acc];
    if (current[0] > max[0]) max[0] = current[0];
    if (current[1] > max[1]) max[1] = current[1];
    if (current[2] > max[2]) max[2] = current[2];
    return max;
  });

  // build flatMap
  const flatMap: Record<string, string> = {};
  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      for (let z = 0; z <= maxZ; z++) {
        const key = getKey(x, y, z);
        flatMap[key] = "";
      }
    }
  }

  // Fill map with lava rock (#)
  positions.forEach(([x, y, z]) => {
    const key = getKey(x, y, z);
    flatMap[key] = ROCK;
  });

  // Each empty exterior is free air (~)
  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      const key0 = getKey(x, y, 0);
      const key1 = getKey(x, y, maxZ);
      if (!flatMap[key0]) flatMap[key0] = FREE;
      if (!flatMap[key1]) flatMap[key1] = FREE;
    }
  }
  for (let x = 0; x <= maxX; x++) {
    for (let z = 0; z <= maxZ; z++) {
      const key0 = getKey(x, 0, z);
      const key1 = getKey(x, maxY, z);
      if (!flatMap[key0]) flatMap[key0] = FREE;
      if (!flatMap[key1]) flatMap[key1] = FREE;
    }
  }
  for (let y = 0; y <= maxY; y++) {
    for (let z = 0; z <= maxZ; z++) {
      const key0 = getKey(0, y, z);
      const key1 = getKey(maxX, y, z);
      if (!flatMap[key0]) flatMap[key0] = FREE;
      if (!flatMap[key1]) flatMap[key1] = FREE;
    }
  }

  // Propagate air from exterior to interior
  let canPropagate = true;
  while (canPropagate) {
    canPropagate = false;
    Object.entries(flatMap)
      .filter((point) => point[1] === FREE)
      .forEach((point) => {
        const [x, y, z] = point[0].split("-").map(Number);
        const keys = [
          getKey(x, y, z + 1),
          getKey(x, y, z - 1),
          getKey(x, y + 1, z),
          getKey(x, y - 1, z),
          getKey(x + 1, y, z),
          getKey(x - 1, y, z),
        ];
        keys.forEach((key) => {
          if (key in flatMap && !flatMap[key]) {
            canPropagate = true;
            flatMap[key] = FREE;
          }
        });
      });
  }

  // Count faces exposed to exterior air
  let exposedSides = 0;
  positions.forEach(([x, y, z]) => {
    const keys = [
      getKey(x, y, z + 1),
      getKey(x, y, z - 1),
      getKey(x, y + 1, z),
      getKey(x, y - 1, z),
      getKey(x + 1, y, z),
      getKey(x - 1, y, z),
    ];
    keys.forEach((key) => {
      if (!(key in flatMap) || flatMap[key] === FREE) exposedSides++;
    });
  });
  return exposedSides;
};

const main = async () => {
  const result1Test = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 1  ##", result1Test); // 64
  const result1 = await resolveFirstPuzzle(INPUT_PATH);
  console.log("## RESULT 1 ##", result1); // 3432

  const result2Test = await resolveSecondPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 2  ##", result2Test); // 58
  const result2 = await resolveSecondPuzzle(INPUT_PATH);
  console.log("## RESULT 2 ##", result2); // 2042
};

main().catch((error) => console.error(error));
