/* eslint-disable no-loop-func */
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

type Blueprint = {
  id: number;
  oreRobotCost: { ore: number };
  clayRobotCost: { ore: number };
  obsidianRobotCost: { ore: number; clay: number };
  geodeRobotCost: { ore: number; obsidian: number };
};

type State = {
  production: { ore: number; clay: number; obsidian: number; geode: number };
  reserve: { ore: number; clay: number; obsidian: number; geode: number };
  time: number;
};

const parseInputs = (inputs: string[]): Blueprint[] => {
  return inputs.map((input) => {
    const parsedInput = input.match(/([0-9]+)/g)?.map(Number);
    if (!parsedInput) {
      throw new Error(`Invalid input data: ${input}`);
    }
    return {
      id: parsedInput[0],
      oreRobotCost: { ore: parsedInput[1] },
      clayRobotCost: { ore: parsedInput[2] },
      obsidianRobotCost: { ore: parsedInput[3], clay: parsedInput[4] },
      geodeRobotCost: { ore: parsedInput[5], obsidian: parsedInput[6] },
    };
  });
};

const buildRobot = (
  unit: keyof State["production"],
  oreCost: number,
  clayCost: number,
  obsidianCost: number,
  state: State,
  maxTime: number
): State | undefined => {
  if (unit === "ore" && state.production.ore >= 4) return undefined;
  if (unit === "clay" && state.production.clay >= 10) return undefined;
  if (
    unit === "obsidian" &&
    (state.production.obsidian >= 12 || !state.production.clay)
  )
    return undefined;
  if (unit === "geode" && !state.production.obsidian) return undefined;

  const timeToBuild =
    oreCost > state.reserve.ore ||
    clayCost > state.reserve.clay ||
    obsidianCost > state.reserve.obsidian
      ? Math.max(
          Math.ceil((oreCost - state.reserve.ore) / state.production.ore),
          Math.ceil(
            (clayCost - state.reserve.clay) / (state.production.clay || 0.00001)
          ),
          Math.ceil(
            (obsidianCost - state.reserve.obsidian) /
              (state.production.obsidian || 0.00001)
          )
        ) + 1
      : 1;

  const nextTime = state.time + timeToBuild;

  if (nextTime > maxTime) return undefined;

  const newState: State = {
    production: { ...state.production },
    reserve: { ...state.reserve },
    time: nextTime,
  };
  newState.production[unit] += 1;
  newState.reserve.ore += state.production.ore * timeToBuild - oreCost;
  newState.reserve.clay += state.production.clay * timeToBuild - clayCost;
  newState.reserve.obsidian +=
    state.production.obsidian * timeToBuild - obsidianCost;
  newState.reserve.geode += state.production.geode * timeToBuild;

  return newState;
};

const getBuildOptions = (
  blueprint: Blueprint,
  state: State,
  maxTime: number
) => {
  const oreBuild = buildRobot(
    "ore",
    blueprint.oreRobotCost.ore,
    0,
    0,
    state,
    maxTime
  );
  const clayBuild = buildRobot(
    "clay",
    blueprint.clayRobotCost.ore,
    0,
    0,
    state,
    maxTime
  );
  const obsidianBuild = buildRobot(
    "obsidian",
    blueprint.obsidianRobotCost.ore,
    blueprint.obsidianRobotCost.clay,
    0,
    state,
    maxTime
  );
  const geodeBuild = buildRobot(
    "geode",
    blueprint.geodeRobotCost.ore,
    0,
    blueprint.geodeRobotCost.obsidian,
    state,
    maxTime
  );

  if (
    geodeBuild?.time ===
    Math.min(
      geodeBuild?.time || 1000,
      obsidianBuild?.time || 1000,
      clayBuild?.time || 1000,
      oreBuild?.time || 1000
    )
  ) {
    return [geodeBuild];
  }

  const builds: State[] = [];
  if (oreBuild) builds.push(oreBuild);
  if (clayBuild) builds.push(clayBuild);
  if (obsidianBuild) builds.push(obsidianBuild);
  if (geodeBuild) builds.push(geodeBuild);

  return builds;
};

const computeBlueprint = (blueprint: Blueprint, maxTime: number): number => {
  let currentBuild: State[] = [
    {
      production: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
      reserve: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
      time: 0,
    },
  ];

  let maxGeodes = 0;
  while (currentBuild.length) {
    const nextBuild: typeof currentBuild = [];
    currentBuild.forEach((build) => {
      const possibleBuilds = getBuildOptions(blueprint, build, maxTime);

      if (!possibleBuilds.length) {
        const endGeodes =
          build.reserve.geode + build.production.geode * (maxTime - build.time);
        if (endGeodes > maxGeodes) {
          maxGeodes = endGeodes;
        }
      }
      possibleBuilds.forEach((possibleBuild) => {
        if (possibleBuild.reserve.geode > maxGeodes) {
          maxGeodes = possibleBuild.reserve.geode;
        }
        nextBuild.push(possibleBuild);
      });
    });
    currentBuild = nextBuild;
  }

  return maxGeodes;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const blueprints = parseInputs(lines);
  const result = blueprints.reduce((max, blueprint) => {
    const score = computeBlueprint(blueprint, 24);
    return max + score * blueprint.id;
  }, 0);
  return result;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const blueprints = parseInputs(lines).filter((line, index) => index < 3);
  const result = blueprints.reduce((max, blueprint) => {
    const score = computeBlueprint(blueprint, 32);
    console.log(`blueprint ID=${blueprint.id} score=${score}`);
    return max * score;
  }, 1);
  return result;
};

const main = async () => {
  const result1Test = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 1  ##", result1Test); // 33
  const result1 = await resolveFirstPuzzle(INPUT_PATH);
  console.log("## RESULT 1 ##", result1); // 1349

  const result2Test = await resolveSecondPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 2  ##", result2Test); // 56*62 = 3472 NEED LOT OF MEMORY
  const result2 = await resolveSecondPuzzle(INPUT_PATH);
  console.log("## RESULT 2 ##", result2); // 12*35*52 = 21840
};

main().catch((error) => console.error(error));
