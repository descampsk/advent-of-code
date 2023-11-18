import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

type Position = [
  sensorX: number,
  sensorY: number,
  beaconX: number,
  beaconY: number
];
type Range = [from: number, to: number];

const getPositions = (lines: string[]): Position[] => {
  return lines.map((line) => {
    const result = line.match(
      /([0-9-]+)[^0-9-]+([0-9-]+)[^0-9-]+([0-9-]+)[^0-9-]+([0-9-]+)/
    );
    if (result?.length !== 5) {
      throw new Error(`invalid input data: ${line}`);
    }
    return [
      Number(result[1]),
      Number(result[2]),
      Number(result[3]),
      Number(result[4]),
    ];
  });
};

const resolveFirstPuzzle = async (inputPath: string, lineToResolve: number) => {
  const lines = await readInputs<string>(inputPath);
  const positions = getPositions(lines);
  const checkedPositions = new Set<number>();
  const beaconOnCheckedLine = new Set<number>();

  positions.forEach(([sensorX, sensorY, beaconX, beaconY]) => {
    const distance = Math.abs(beaconY - sensorY) + Math.abs(beaconX - sensorX);

    if (
      (sensorY >= lineToResolve && sensorY - distance <= lineToResolve) ||
      (sensorY <= lineToResolve && sensorY + distance >= lineToResolve)
    ) {
      const distanceToLine = Math.abs(sensorY - lineToResolve);
      checkedPositions.add(sensorX);

      for (let i = 1; i <= distance - distanceToLine; i++) {
        checkedPositions.add(sensorX + i);
        checkedPositions.add(sensorX - i);
      }
    }
    if (beaconY === lineToResolve) beaconOnCheckedLine.add(beaconX);
  });
  return checkedPositions.size - beaconOnCheckedLine.size;
};

const addToRange = (
  ranges: Range[][],
  index: number,
  from: number,
  to: number,
  maxValue: number
) => {
  if (index < 0 || index > maxValue) return;
  if (from > maxValue) return;
  if (to < 0) return;
  const currentRanges = ranges[index];
  const fromX = from < 0 ? 0 : from;
  const toX = to > maxValue ? maxValue : to;

  const overlap = currentRanges.filter(
    ([rangeFrom, rangeTo]) => fromX <= rangeTo + 1 && toX >= rangeFrom - 1
  );
  if (overlap.length === 0) {
    currentRanges.push([fromX, toX]);
  } else if (overlap.length === 1) {
    if (overlap[0][0] > fromX) overlap[0][0] = fromX;
    if (overlap[0][1] < toX) overlap[0][1] = toX;
  } else {
    // Many ranges to merge. Consolidate on first
    if (overlap[0][0] > fromX) overlap[0][0] = fromX;
    overlap[0][1] =
      overlap[overlap.length - 1][1] < toX
        ? toX
        : overlap[overlap.length - 1][1];
    // Then delete other useless ranges
    for (let i = 1; i < overlap.length; i++) {
      currentRanges.splice(
        currentRanges.findIndex((r) => r === overlap[i]),
        1
      );
    }
  }
  // Keep ranges sorted (required by overlap process & finaly find missingX).
  currentRanges.sort((a, b) => a[0] - b[0]);
};

const resolveSecondPuzzle = async (inputPath: string, maxValue: number) => {
  const lines = await readInputs<string>(inputPath);
  const positions = getPositions(lines);

  const range = Array(maxValue + 1)
    .fill("")
    .map((): Range[] => []);

  positions.forEach(([sensorX, sensorY, beaconX, beaconY]) => {
    const distance = Math.abs(beaconY - sensorY) + Math.abs(beaconX - sensorX);

    for (let i = 0; i <= distance; i++) {
      addToRange(
        range,
        sensorY + i,
        sensorX - (distance - i),
        sensorX + (distance - i),
        maxValue
      );
      addToRange(
        range,
        sensorY - i,
        sensorX - (distance - i),
        sensorX + (distance - i),
        maxValue
      );
    }
  });

  const missingY = range.findIndex((currentRange) => currentRange.length > 1);
  const missingX = range[missingY][0][1] + 1;
  return missingX * 4000000 + missingY;
};

const main = async () => {
  const result1Test = await resolveFirstPuzzle(TEST_INPUT_PATH, 10);
  console.log("##  TEST 1  ##", result1Test);
  const result1 = await resolveFirstPuzzle(INPUT_PATH, 2000000);
  console.log("## RESULT 1 ##", result1);

  const result2Test = await resolveSecondPuzzle(TEST_INPUT_PATH, 20);
  console.log("##  TEST 2  ##", result2Test);
  const result2 = await resolveSecondPuzzle(INPUT_PATH, 4000000);
  console.log("## RESULT 2 ##", result2);
};

main().catch((error) => console.error(error));
