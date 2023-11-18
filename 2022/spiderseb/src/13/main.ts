import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

const compare = (
  firstPair: unknown,
  secondPair: unknown
): boolean | undefined => {
  if (typeof firstPair === "number" && typeof secondPair === "number") {
    if (firstPair < secondPair) return true;
    if (firstPair > secondPair) return false;
    return undefined;
  }
  if (typeof firstPair === "number") {
    return compare([firstPair], secondPair);
  }
  if (typeof secondPair === "number") {
    return compare(firstPair, [secondPair]);
  }
  if (Array.isArray(secondPair) && Array.isArray(firstPair)) {
    if (firstPair.length === 0 && secondPair.length === 0) return undefined;
    if (firstPair.length === 0) return true;
    if (secondPair.length === 0) return false;
    for (let i = 0; i < firstPair.length; i++) {
      if (!(i in secondPair)) return false;
      const result = compare(firstPair[i], secondPair[i]);
      if (result !== undefined) return result;
    }
    if (secondPair.length > firstPair.length) return true;
  }
  return undefined;
};
const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  let sum = 0;
  for (let i = 0; i < lines.length; i += 3) {
    const firstPair = JSON.parse(lines[i]);
    const secondPair = JSON.parse(lines[i + 1]);
    const rightOrder = compare(firstPair, secondPair);
    if (rightOrder) sum += Math.round(i / 3) + 1;
  }
  return sum;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const divider1 = [[2]];
  const divider2 = [[6]];
  const packets = lines.reduce(
    (acc: unknown[], current) => {
      if (current) acc.push(JSON.parse(current));
      return acc;
    },
    [divider1, divider2]
  );
  packets.sort((a, b) => {
    if (compare(a, b)) return -1;
    return 1;
  });

  return (
    (1 + packets.findIndex((packet) => packet === divider1)) *
    (1 + packets.findIndex((packet) => packet === divider2))
  );
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
